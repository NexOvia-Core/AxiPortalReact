using AxiPortal.BFF.Configuration;
using AxiPortal.BFF.Exceptions;
using AxiPortal.BFF.Models.Requests;
using AxiPortal.BFF.Models.Responses;
using AxiPortal.BFF.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using StackExchange.Redis;
using System.Collections;
using System.Net;
using System.Net.Sockets;
using System.Runtime.Serialization.Formatters.Binary;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace AxiPortal.BFF.Services;

/// <summary>
/// Implements all AxiClient proxy operations.
/// ARM layer is gone — every upstream call targets AxiClient directly.
///
/// SECURITY GUARANTEES:
///   • JWT token intercepted from every AxiVerifyUser/AxiUserCheck response
///     → stored in Redis via ITokenStore, NEVER returned to the browser.
///   • SharedDatabase name comes from config, not from the client request.
///   • SchemaName derived server-side from AxiAccId.ToLower().
/// </summary>
public sealed class AuthService(
    HttpProxyService proxy,
    ITokenStore tokenStore,
    IOptions<RedisConfig> redisOpts,
    IOptions<AxpertWebRedisConfig> axpertRedisOpts,
    IOptions<AxiOptions> options,
    IHttpContextAccessor accessor,
    ILogger<AuthService> logger) : IAuthService
{
    private static readonly JsonSerializerOptions JsonOpts = new(JsonSerializerDefaults.Web);
    private readonly AxiOptions _opts = options.Value;

    private readonly TimeSpan _ttl =
    TimeSpan.FromMinutes(axpertRedisOpts.Value.AbsoluteTimeoutMinutes);

    // ── 1. Check Email + Send OTP (credential flow – single BFF call) ─────────
    public async Task<CheckAndSendOtpResult> CheckAndSendOtpAsync(
        CheckAndSendOtpRequest req, CancellationToken ct)
    {
        var isSignup = string.Equals(req.Mode, "signup", StringComparison.OrdinalIgnoreCase);

        // Step 1: check email existence via AxiUserCheck (no token required here)
        var checkResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiUserCheck",
            new { UserName = req.Email, Purpose = req.Mode.ToLower() }, ct: ct);

        var emailFound = checkResult.TryGetProperty("Success", out var s) && s.GetBoolean();

        // Validate against the intended mode
        if (isSignup && emailFound)
            return new CheckAndSendOtpResult(false, null, null, null,
                "This email is already registered. Please log in.");

        if (!isSignup && !emailFound)
            return new CheckAndSendOtpResult(false, null, null, null, 
                GetString(checkResult, "Message") ?? "No account found with this email. Please sign up");

        // Step 2: send OTP
        var purpose = isSignup ? "signup" : "login";
        var otpResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiSendOTP",
            new { Identifier = req.Email, IdentifierType = "email", Purpose = purpose },
            ct: ct);

        var otpSuccess = otpResult.TryGetProperty("Success", out var os) && os.GetBoolean();
        var challengeId = GetString(otpResult, "ChallengeId");
        var expiresIn = GetString(otpResult, "ExpiresInSeconds");
        var resendIn = GetString(otpResult, "ResendInSeconds");
        var otpMessage = GetString(otpResult, "Message");

        if (!otpSuccess)
        {
            logger.LogWarning("AxiSendOTP failed for {Email}: {Msg}", Mask(req.Email), otpMessage);
            return new CheckAndSendOtpResult(false, null, null, null,
                otpMessage ?? "Failed to send verification code.");
        }

        logger.LogInformation("OTP sent for {Email} (purpose={Purpose})", Mask(req.Email), purpose);
        return new CheckAndSendOtpResult(true, challengeId, expiresIn, resendIn, null);
    }

    // ── 2. Email Exists (boolean — used by OAuthService internally) ───────────
    public async Task<UserCheckResponse> EmailExistsAsync(EmailExistsRequest req, CancellationToken ct)
    {
        var result = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiUserCheck",
            new { UserName = req.Email, Purpose = req.IsSignUp ? "signup" : "login" }, ct: ct);

        var emailFound = result.TryGetProperty("Success", out var s) && s.GetBoolean();
        var message = GetString(result, "Message");


        return new UserCheckResponse(emailFound, message);
    }

    // ── 3. Verify User (OTP or SSO) ───────────────────────────────────────────
    public async Task<VerifyUserResult> VerifyUserAsync(VerifyUserRequest req, CancellationToken ct)
    {
        var isLogin = string.Equals(req.Purpose, "login", StringComparison.OrdinalIgnoreCase);

        var upstreamResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiVerifyUser",
            new
            {
                userName = req.Email,
                challengeId = string.IsNullOrWhiteSpace(req.ChallengeId) ? string.Empty : req.ChallengeId,
                otp = string.IsNullOrWhiteSpace(req.Otp) ? string.Empty : req.Otp,
                ssoKey = string.IsNullOrWhiteSpace(req.SsoKey) ? string.Empty : req.SsoKey,
                ssoProvider = string.IsNullOrWhiteSpace(req.SsoProvider) ? string.Empty : req.SsoProvider,
                purpose = req.Purpose
            }, ct: ct);

        var success = upstreamResult.TryGetProperty("Success", out var sv) && sv.GetBoolean();
        var message = GetString(upstreamResult, "Message");

        if (!success)
        {
            logger.LogWarning("AxiVerifyUser failed for {Email}: {Msg}", Mask(req.Email), message);
            return new VerifyUserResult(false, message ?? "Verification failed.", null);
        }

        // Intercept token → Redis (never returned to browser)
        //await InterceptAndStoreTokenAsync(upstreamResult, ct);
        var token = GetString(upstreamResult, "Token");
        object? schemas = null;
        if (!string.IsNullOrWhiteSpace(token))
        {
            await tokenStore.SetAsync(new SessionData
            {
                Token = token
            }, ct);
            logger.LogInformation("Token intercepted and stored in Redis.");

            // For login: fetch authoritative schema list from AxiClient
            if (isLogin)
            {
                logger.LogInformation("Fetching schema list post-VerifyUser for {Email}", Mask(req.Email));
                schemas = await GetSchemaListAsync(new GetSchemaListRequest(req.Email, token), ct);
            }
        }


        return new VerifyUserResult(true, null, schemas);
    }

    // ── 4. Get Schema List ────────────────────────────────────────────────────
    public async Task<object> GetSchemaListAsync(GetSchemaListRequest req, CancellationToken ct)
    {
        var token = !string.IsNullOrEmpty(req.DirectToken) ? req.DirectToken : await RequireTokenAsync(ct);
        var result = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/GetAxiSchemaList",
            new { username = req.Email },
            bearerToken: token,
            ct: ct);

        var checkSuccess = result.TryGetProperty("Success", out var cs) && cs.GetBoolean();

        if (!checkSuccess)
            throw new UpstreamApiException(
    GetString(result, "Message") ?? "Something went wrong while getting apps, please try again.", 422);


        var parsed = ParseJsonField(result) ?? (object)result;
        return FilterAndSanitizeSchemas(parsed);
    }

    // ── 5. SSO Flow Orchestration ─────────────────────────────────────────────
    /// <summary>
    /// Called by OAuthService after provider token is validated.
    /// Runs the appropriate AxiClient sequence based on signup vs login.
    /// </summary>
    public async Task<SsoFlowResult> HandleSsoFlowAsync(
        string email, string ssoKey, string ssoProvider,
        bool isSignup, CancellationToken ct)
    {
        if (isSignup)
            return await HandleSsoSignupAsync(email, ct);

        return await HandleSsoLoginAsync(email, ssoKey, ssoProvider, ct);
    }

    // ── 6. Add Account (combined create account + user + queue) ──────────────
    public async Task<object> SetupAccountAsync(SetupAccountRequest req, CancellationToken ct)
    {
        var token = await RequireTokenAsync(ct);
        var sessionId = tokenStore.GetSessionIdAsync(ct);

        // Server-side derivations — client cannot override these
        var schemaName = req.AxiAccId.ToLower();
        var databaseName = _opts.SharedDatabase;

        logger.LogInformation("AddAxiAccount for AxiAccId={AxiAccId}", req.AxiAccId);

        return await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiAccountSetup",
            new
            {
                orgName = req.OrgName,
                email = req.Email,
                axiAccId = req.AxiAccId,
                contactPersonName = string.IsNullOrWhiteSpace(req.ContactPersonName) ? string.Empty : req.ContactPersonName,
                mobileNo = string.IsNullOrWhiteSpace(req.MobileNo) ? string.Empty : req.MobileNo,
                taxNo = string.IsNullOrWhiteSpace(req.TaxNo) ? string.Empty : req.TaxNo,
                state = string.IsNullOrWhiteSpace(req.State) ? string.Empty : req.State,
                country = string.IsNullOrWhiteSpace(req.Country) ? string.Empty : req.Country,
                address = string.IsNullOrWhiteSpace(req.Address) ? string.Empty : req.Address,
                countryCode = string.IsNullOrWhiteSpace(req.CountryCode) ? string.Empty : req.CountryCode,
                userName = req.UserName,
                nickName = string.IsNullOrWhiteSpace(req.NickName) ? string.Empty : req.NickName,
                region = string.IsNullOrWhiteSpace(req.Region) ? string.Empty : req.Region,
                IsVerified = string.IsNullOrWhiteSpace(req.IsVerified) ? "F" : req.IsVerified,
                authProvider = string.IsNullOrWhiteSpace(req.AuthProvider) ? string.Empty : req.AuthProvider,
                ssoId = string.IsNullOrWhiteSpace(req.SsoId) ? string.Empty : req.SsoId,
                schemaName,                             // derived server-side
                databaseName,                            // from config
                axirediskey = sessionId
            },
            bearerToken: token,
            ct: ct);
    }

    // ── 7. Check Account ──────────────────────────────────────────────────────
    public async Task<object> CheckAccountAsync(CheckAccountRequest req, CancellationToken ct) =>
        await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiAccountCheck",
            new { AxiAccId = req.AxiAccId }, ct: ct);

    // ── 8. Auth Update ────────────────────────────────────────────────────────
    public async Task<object> AuthUpdateAsync(AuthUpdateRequest req, CancellationToken ct) =>
        await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiUserAuthUpdate",
            new
            {
                userName = req.Email,
                AxiAccId = req.AxiAccId,
                IsVerified = "T",
                SSOKey = req.SsoKey,
                SSOProvider = req.SsoProvider
            },
            bearerToken: await RequireTokenAsync(ct),
        ct: ct);

    // ── 9. Get Signin Info ────────────────────────────────────────────────────
    public async Task<object> GetSigninInfoAsync(SigninInfoRequest req, CancellationToken ct)
    {
        var token = await RequireTokenAsync(ct);

        var (success, url, error) = await BuildSigninUrlAsync(
            schemaName: req.SchemaName,
            userName: req.UserName,
            email: req.Email,
            isPrimary: string.IsNullOrWhiteSpace(req.IsPrimary) ? "F" : req.IsPrimary,
            password: string.IsNullOrWhiteSpace(req.Password) ? "" : req.Password,
            keepMeSignIn: req.KeepMeSignIn == true ? "true" : "false",
            brId: string.IsNullOrWhiteSpace(req.BrId) ? "" : req.BrId,
            token: token,
            installedPackages: string.IsNullOrWhiteSpace(req.InstalledPackages) ? "" : req.InstalledPackages,
            ct: ct);

        if (!success)
        {
            logger.LogWarning("GetSigninInfoAsync failed for {Email}: {Msg}", Mask(req.Email), error);
            return new EncryptUrlResult(false, null, error);
        }

        logger.LogInformation("GetSigninInfoAsync: redirect URL generated for {Email}", Mask(req.Email));
        return new EncryptUrlResult(true, url, null);
    }
    // ── 10. Direct Login (sessionId or tokenStore → verify → signin info → URL) ──
    public async Task<DirectLoginResult> DirectLoginAsync(DirectLoginRequest req, CancellationToken ct)
    {
        // 1. Resolve token — use provided sessionId or fall back to tokenStore
        SessionData session;
        if (!string.IsNullOrWhiteSpace(req.SessionId))
        {
            // Look up session by provided sessionId
            //var redisKey = redisOpts.Value.RedisPrefix + sessionId; // Note: need RedisPrefix access
            session = await RequireSessionAsync(ct, req.SessionId);
            //if (raw is null)
            //    return new DirectLoginResult(false, null, "Session not found or expired.");

            //session = JsonSerializer.Deserialize<SessionData>(raw, JsonOpts);
        }
        else
        {
            // Use current session from tokenStore
            session = await RequireSessionAsync(ct);
        }

        var result = await BuildSessionRedirectUrlAsync(
            session,
            string.IsNullOrWhiteSpace(req.BrId) ? "" : req.BrId,
            ct);

        return new DirectLoginResult(result.Success, result.RedirectUrl, result.Error);
    }

    public async Task<GetRedirectUrlResult> GetCurrentSessionRedirectUrlAsync(CancellationToken ct)
    {
        var session = await RequireSessionAsync(ct);
        return await BuildSessionRedirectUrlAsync(session, "", ct);
    }

    private async Task<GetRedirectUrlResult> BuildSessionRedirectUrlAsync(
        SessionData session,
        string brId,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(session.Token))
            return new GetRedirectUrlResult(false, null, "UNAUTHORIZED");

        if (!string.IsNullOrWhiteSpace(session.Error))
            return new GetRedirectUrlResult(false, null, "PROVISION_FAILED");

        if (string.IsNullOrWhiteSpace(session.Email))
            return new GetRedirectUrlResult(false, null, "UNDER_PROVISION");

        var (signinSuccess, redirectUrl, signinError) = await BuildSigninUrlAsync(
            schemaName: session.AxiAccId,
            userName: session.UserName,
            email: session.Email,
            isPrimary: session.IsPrimary,
            password: "",
            keepMeSignIn: "",
            brId: brId,
            token: session.Token,
            installedPackages: "",
            ct: ct);

        if (!signinSuccess)
        {
            logger.LogWarning("Session redirect URL build failed for {Email}: {Msg}",
                Mask(session.Email), signinError);
            return new GetRedirectUrlResult(false, null, signinError);
        }

        logger.LogInformation("Redirect URL generated for {Email}", Mask(session.Email));
        return new GetRedirectUrlResult(true, redirectUrl, null);
    }

    public async Task<ProvisioningStatusResult> GetProvisioningStatusAsync(CancellationToken ct)
    {
        var session = await RequireSessionAsync(ct);

        if (!string.IsNullOrWhiteSpace(session.Error))
            return new ProvisioningStatusResult(false, "PROVISION_FAILED");

        if (string.IsNullOrWhiteSpace(session.Email))
            return new ProvisioningStatusResult(false, "UNDER_PROVISION");

        return new ProvisioningStatusResult(true, null);
    }

    // ── 11. Verify User & Send Schemas ───────────────────────────────────────────
    public async Task<VerifyUserResult> VerifyAndSendSchemasAsync(VerifyAndSendSchemasRequest req, CancellationToken ct)
    {
        var checkResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiUserCheck",
            new { UserName = req.Email, Purpose = "login", TokenRequired = "true" }, ct: ct);

        var checkSuccess = checkResult.TryGetProperty("Success", out var cs) && cs.GetBoolean();
        var token = GetString(checkResult, "Token");

        if (!checkSuccess || string.IsNullOrWhiteSpace(token))
            throw new UpstreamApiException(
    GetString(checkResult, "Message") ?? "No account found for this email or the account is inactive.", 422);

        await tokenStore.SetAsync(new SessionData
        {
            Token = token
        }, ct);
        logger.LogInformation("User Login: user token acquired for {Email}", Mask(req.Email));

        var schemas = await GetSchemaListAsync(new GetSchemaListRequest(req.Email, token), ct);
        return new VerifyUserResult(true, null, schemas);
    }

    // ── 12. Verify User & Send Encrypt URL ───────────────────────────────────────────
    public async Task<EncryptUrlResult> KeepMeSignInAsync(KeepMeSignInRequest req, CancellationToken ct)
    {
        // 1. Authenticate user and get token
        var checkResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiUserCheck",
            new { UserName = req.Email, Purpose = "login", TokenRequired = "true" }, ct: ct);

        var checkSuccess = checkResult.TryGetProperty("Success", out var cs) && cs.GetBoolean();
        var token = GetString(checkResult, "Token");

        if (!checkSuccess || string.IsNullOrWhiteSpace(token))
            throw new UpstreamApiException(
    GetString(checkResult, "Message") ?? "No account found for this email or the account is inactive.", 422);

        await tokenStore.SetAsync(new SessionData { Token = token }, ct);
        logger.LogInformation("KeepMeSignIn: token acquired for {Email}", Mask(req.Email));

        var schemas = await GetSchemaListAsync(new GetSchemaListRequest(req.Email, token), ct);

        // Deserialize back to a list of JsonElements for field access
        var schemasJson = JsonSerializer.Serialize(schemas, JsonOpts);
        using var schemasDoc = JsonDocument.Parse(schemasJson);
        var schemasArray = schemasDoc.RootElement;

        if (schemasArray.ValueKind != JsonValueKind.Array || schemasArray.GetArrayLength() == 0)
        {
            logger.LogWarning("KeepMeSignIn: no valid schemas for {Email}", Mask(req.Email));
            throw new UpstreamApiException(
                "No active apps found for this account. Please log in normally.", 403);
        }

        // Match by axiaccid (SchemaName) + username — both must align to prevent cross-account confusion
        JsonElement? matchedSchema = null;
        foreach (var schema in schemasArray.EnumerateArray())
        {
            //var axiaccid = GetString(schema, "axiaccid") ?? "";
            var schemaname = GetString(schema, "schemaname") ?? "";
            var username = GetString(schema, "username") ?? "";

            bool schemaMatch = string.Equals(schemaname, req.SchemaName, StringComparison.OrdinalIgnoreCase);
                            //|| string.Equals(axiaccid, req.SchemaName, StringComparison.OrdinalIgnoreCase);
            bool userMatch = string.Equals(username, req.UserName, StringComparison.OrdinalIgnoreCase);

            if (schemaMatch && userMatch)
            {
                matchedSchema = schema;
                break;
            }
        }

        if (matchedSchema is null)
        {
            logger.LogWarning(
                "KeepMeSignIn: no schema match for Email={Email}, Schema={Schema}, User={User}",
                Mask(req.Email), req.SchemaName, req.UserName);
            throw new UpstreamApiException(
                "The requested app or user was not found on this account. Please log in normally.", 403);
        }

        // 3. Use matched schema's own fields for AxiInfoToSignin (not blindly trusting client payload)
        var matchedAxiAccId = GetString(matchedSchema.Value, "axiaccid") ?? req.SchemaName;
        var matchedSchemaName = GetString(matchedSchema.Value, "schemaname") ?? req.SchemaName.ToLower();
        var matchedUsername = GetString(matchedSchema.Value, "username") ?? req.UserName;
        var matchedEmail = GetString(matchedSchema.Value, "email") ?? req.Email;
        var matchedIsPrimary = GetString(matchedSchema.Value, "isprimary") ?? req.IsPrimary ?? "F";
        var installedpkgs = GetString(matchedSchema.Value, "instaledPackages") ?? "";

        var (signinSuccess, redirectUrl, signinError) = await BuildSigninUrlAsync(
         schemaName: matchedSchemaName,
         userName: matchedUsername,
         email: matchedEmail,
         isPrimary: matchedIsPrimary,
         password: string.IsNullOrWhiteSpace(req.Password) ? "" : req.Password,
         keepMeSignIn: "true",
         brId: string.IsNullOrWhiteSpace(req.BrId) ? "" : req.BrId,
         token: token,
         installedPackages: installedpkgs,
         ct: ct);

        if (!signinSuccess)
        {
            logger.LogWarning("KeepMeSignIn: signin URL build failed for {Email}, schema={Schema}: {Msg}",
                Mask(matchedEmail), matchedAxiAccId, signinError);
            return new EncryptUrlResult(false, null, signinError);
        }

        logger.LogInformation("KeepMeSignIn: redirect URL generated for {Email}, schema={Schema}",
            Mask(matchedEmail), matchedAxiAccId);
        return new EncryptUrlResult(true, redirectUrl, null);
    }


    //public async Task<object> GetKeepMeSignin(string brId, CancellationToken ct)
    //{
    //    try
    //    {
    //        var httpContext = accessor.HttpContext;
    //        var ipAddress = GetClientIp(accessor.HttpContext);
    //        ipAddress = ipAddress.Replace(".", "1");
    //        string domain = $"{httpContext?.Request.Scheme}://{httpContext?.Request.Host}";
    //        string keyPrefix = $"{ipAddress}-{brId}-{domain}";
    //        var redisConfig = axpertRedisOpts.Value;
    //        var connectionString = $"{redisConfig.host}:{redisConfig.port},password={redisConfig.pwd}";
    //        using var redisConnection = await ConnectionMultiplexer.ConnectAsync(connectionString);
    //        var server = redisConnection.GetServer(redisConnection.GetEndPoints().First());
    //        var db = redisConnection.GetDatabase();
    //        string pattern = $"{keyPrefix}-keepaliveweb-*";
    //        var users = new List<string>();
    //        //await foreach (var key in server.KeysAsync(pattern: pattern))
    //        //{
    //        //    RedisValue value = await db.StringGetAsync(key);
    //        //    if (!value.IsNullOrEmpty)
    //        //    {
    //        //        users.Add(value.ToString());
    //        //    }
    //        //}
    //        await foreach (var key in server.KeysAsync(pattern: pattern))
    //        {
    //            byte[] bytes = await db.StringGetAsync(key);
    //            string text = Encoding.UTF8.GetString(bytes);
    //            int start = text.IndexOf('>');
    //            if (start >= 0)
    //            {
    //                string value = text.Substring(start + 1).TrimEnd('\0', '\u000B');
    //                users.Add(value);
    //            }
    //        }

    //        return JsonSerializer.Serialize(new
    //        {
    //            userlist = string.Join(",", users.Distinct())
    //        });
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new InvalidOperationException("Error retrieving KeepMeSignin data.", ex);
    //    }
    //}

    public async Task<object> GetKeepMeSignin(KeepMeSigninListRequest req, CancellationToken ct)
    {
        try
        {
            var httpContext = accessor.HttpContext;
            var ipAddress = GetClientIp(httpContext);
            ipAddress = ipAddress.Replace(".", "1");
            //string domain = $"{httpContext?.Request.Scheme}://{httpContext?.Request.Host}";
            string domain = _opts.AppWebDomain;

            string keyPrefix = $"{ipAddress}-{req.BrId}-{domain}";

            var (db, server) = await GetAxpertRedisAsync();

            string pattern = $"{keyPrefix}-keepaliveweb-*";
            var profiles = new List<string>();

            //await foreach (var key in server.KeysAsync(pattern: "*srirams"))
            //{
            //    logger.LogError("Found key = {Key}", key);
            //}

            await foreach (var key in server.KeysAsync(pattern: pattern))
            {
                //RedisValue value = await db.StringGetAsync(key);
                //if (value.IsNullOrEmpty) continue;

                //string text = value.ToString();
                //int start = text.IndexOf('>');
                //if (start < 0) continue;

                //string[] parts = text[(start + 1)..].Split('~', StringSplitOptions.None);
                //// parts[1] = userName
                //if (parts.Length > 1 && !string.IsNullOrWhiteSpace(parts[1]))
                //{
                //    profiles.Add(parts[1].Trim());
                //}


                profiles.Add(key.ToString().Split(new[] { "keepaliveweb-" }, StringSplitOptions.None)[1]);

            }


            var distinct = profiles
                //.Distinct(StringComparer.OrdinalIgnoreCase)
                .Distinct()
                .ToList();

            logger.LogInformation("GetKeepMeSignin: {Count} profile(s) found for brId={BrId}",
                distinct.Count, req.BrId);

            return new { profiles = distinct };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetKeepMeSignin failed for brId={BrId}", req.BrId);
            throw new InvalidOperationException("Error retrieving keep-me-signed-in data.", ex);
        }
    }

    //public async Task<VerifyUserResult> KeepMeSigninConfirmAsync(
    //string brId, string userName, CancellationToken ct)
    //{
    //    // 1. Re-fetch full entry from Redis (server owns all sensitive fields)
    //    string rawEntry;
    //    string[] parts; 
    //    try
    //    {
    //        var httpContext = accessor.HttpContext;
    //        var ipAddress = GetClientIp(httpContext);
    //        ipAddress = ipAddress.Replace(".", "1");
    //        string domain = $"{httpContext?.Request.Scheme}://{httpContext?.Request.Host}";
    //        string keyPrefix = $"{ipAddress}-{brId}-{domain}";

    //        var (db, server) = await GetAxpertRedisAsync();

    //        // Key is exact: prefix-keepaliveweb-{userName}
    //        string key = $"{keyPrefix}-keepaliveweb-{userName}";
    //        //byte[] bytes = await db.StringGetAsync(key);

    //        //if (bytes is null || bytes.Length == 0)
    //        //{
    //        //    logger.LogWarning("KeepMeSigninConfirm: Redis key not found for User={User}", userName);
    //        //    throw new UpstreamApiException(
    //        //        "Session not found. Please log in normally.", 404);
    //        //}

    //        //string text = Encoding.UTF8.GetString(bytes).TrimEnd('\0', '\u000B');
    //        //int start = text.IndexOf('>');
    //        //if (start < 0)
    //        //    throw new UpstreamApiException("Invalid session data. Please log in normally.", 400);

    //        //rawEntry = text[(start + 1)..];
    //        byte[] bytes = await db.StringGetAsync(key);


    //        int payloadStart = Array.FindIndex(bytes, b => b == (byte)']');

    //        if (payloadStart >= 0)
    //        {
    //            rawEntry = Encoding.UTF8.GetString(
    //                bytes,
    //                payloadStart + 1,
    //                bytes.Length - payloadStart - 1);

    //            parts = rawEntry.Split('~');

    //            //if (_parts.Length > 1)
    //            //{
    //            //    profiles.Add(parts[1].Trim());
    //            //}
    //        }
    //    }
    //    catch (UpstreamApiException) { throw; }
    //    catch (Exception ex)
    //    {
    //        logger.LogError(ex, "KeepMeSigninConfirm: Redis read failed for User={User}", userName);
    //        throw new InvalidOperationException("Error reading session data.", ex);
    //    }

    //    // 2. Parse: schema~userName~password~...~...~...~...~email~isprimary
    //    //var parts = rawEntry.Split('~', StringSplitOptions.None);
    //    //if (parts.Length < 2)
    //    //    throw new UpstreamApiException("Corrupt session data. Please log in normally.", 400);

    //    //var req = new KeepMeSignInRequest(
    //    //    SchemaName: parts.ElementAtOrDefault(0)?.Trim() ?? "",
    //    //    UserName: parts.ElementAtOrDefault(1)?.Trim() ?? "",
    //    //    Password: parts.ElementAtOrDefault(2)?.Trim(),
    //    //    Email: parts.ElementAtOrDefault(7)?.Trim() ?? "",
    //    //    IsPrimary: parts.ElementAtOrDefault(8)?.Trim()
    //    //);
    //    var req = new KeepMeSignInRequest(
    //        SchemaName: parts[0]?.Trim() ?? "",
    //        UserName: parts.ElementAtOrDefault(1)?.Trim() ?? "",
    //        Password: parts.ElementAtOrDefault(2)?.Trim(),
    //        Email: parts.ElementAtOrDefault(7)?.Trim() ?? "",
    //        IsPrimary: parts.ElementAtOrDefault(8)?.Trim()
    //    );

    //    if (string.IsNullOrWhiteSpace(req.SchemaName) || string.IsNullOrWhiteSpace(req.UserName))
    //        throw new UpstreamApiException("Incomplete session data. Please log in normally.", 400);

    //    // Sanity: userName in Redis must match the requested userName
    //    if (!string.Equals(req.UserName, userName, StringComparison.OrdinalIgnoreCase))
    //    {
    //        logger.LogWarning(
    //            "KeepMeSigninConfirm: userName mismatch — request={Req}, redis={Redis}",
    //            userName, req.UserName);
    //        throw new UpstreamApiException("Session mismatch. Please log in normally.", 403);
    //    }

    //    logger.LogInformation(
    //        "KeepMeSigninConfirm: Redis entry resolved for User={User}, Schema={Schema}",
    //        Mask(req.UserName), req.SchemaName);

    //    // 3. Reuse existing KeepMeSignInAsync which validates schema + calls AxiInfoToSignin
    //    return await KeepMeSignInAsync(req, brId, ct);
    //}

    //public async Task<object> GetKeepMeSigninUserInfo(string brId, string UserName, CancellationToken ct)
    //{
    //    try
    //    {
    //        var httpContext = accessor.HttpContext;
    //        var ipAddress = GetClientIp(accessor.HttpContext);
    //        ipAddress = ipAddress.Replace(".", "1");
    //        string domain = $"{httpContext?.Request.Scheme}://{httpContext?.Request.Host}";
    //        string keyPrefix = $"{ipAddress}-{brId}-{domain}";

    //        var (db, server) = await GetAxpertRedisAsync();

    //        string pattern = $"{keyPrefix}-keepaliveweb-" + UserName;
    //        var users = new List<string>();
    //        await foreach (var key in server.KeysAsync(pattern: pattern))
    //        {
    //            byte[] bytes = await db.StringGetAsync(key);
    //            string text = Encoding.UTF8.GetString(bytes);
    //            int start = text.IndexOf('>');
    //            if (start >= 0)
    //            {
    //                string value = text.Substring(start + 1).TrimEnd('\0', '\u000B');
    //                users.Add(value);
    //            }
    //        }

    //        return JsonSerializer.Serialize(new
    //        {
    //            userlist = string.Join(",", users.Distinct())
    //        });
    //    }
    //    catch (Exception ex)
    //    {
    //        throw new InvalidOperationException("Error retrieving KeepMeSignin data.", ex);
    //    }
    //}

    //public async Task<VerifyUserResult> KeepMeSigninConfirmAsync(
    //string brId,
    //string userName,
    //CancellationToken ct)
    //{
    //    try
    //    {
    //        var httpContext = accessor.HttpContext;

    //        var ipAddress = GetClientIp(httpContext);
    //        ipAddress = ipAddress.Replace(".", "1");

    //        string domain = $"{httpContext?.Request.Scheme}://{httpContext?.Request.Host}";

    //        string keyPrefix = $"{ipAddress}-{brId}-{domain}";

    //        var (db, server) = await GetAxpertRedisAsync();

    //        string key = $"{keyPrefix}-keepaliveweb-{userName}";

    //        logger.LogInformation("KeepMeSigninConfirm Redis Key: {Key}", key);

    //        byte[] bytes = await db.StringGetAsync(key);

    //        if (bytes == null || bytes.Length == 0)
    //        {
    //            logger.LogWarning(
    //                "KeepMeSigninConfirm: Redis key not found for User={User}",
    //                userName);

    //            throw new UpstreamApiException(
    //                "Session not found. Please log in normally.",
    //                404);
    //        }

    //        // Locate actual payload start
    //        //int payloadStart = Array.FindIndex(bytes, b => b == (byte)']');

    //        //if (payloadStart < 0)
    //        //{
    //        //    logger.LogWarning(
    //        //        "KeepMeSigninConfirm: Invalid payload format for User={User}",
    //        //        userName);

    //        //    throw new UpstreamApiException(
    //        //        "Invalid session data. Please log in normally.",
    //        //        400);
    //        //}

    //        //string rawEntry = Encoding.UTF8.GetString(
    //        //    bytes,
    //        //    payloadStart + 1,
    //        //    bytes.Length - payloadStart - 1)
    //        //    .TrimEnd('\0', '\u000B');

    //        string rawEntry = Encoding.UTF8.GetString(
    //                bytes,
    //                0,
    //                bytes.Length)
    //                .TrimEnd('\0', '\u000B');

    //        logger.LogInformation(
    //            "KeepMeSigninConfirm RawEntry: {RawEntry}",
    //            rawEntry);

    //        string[] parts = rawEntry.Split(
    //            '~',
    //            StringSplitOptions.None);

    //        if (parts.Length < 3)
    //        {
    //            logger.LogWarning(
    //                "KeepMeSigninConfirm: Corrupt session data for User={User}. Parts={Count}",
    //                userName,
    //                parts.Length);

    //            throw new UpstreamApiException(
    //                "Corrupt session data. Please log in normally.",
    //                400);
    //        }

    //        var req = new KeepMeSignInRequest(
    //            SchemaName: parts.ElementAtOrDefault(0)?.Trim() ?? "",
    //            UserName: parts.ElementAtOrDefault(1)?.Trim() ?? "",
    //            Password: parts.ElementAtOrDefault(2)?.Trim(),
    //            Email: parts.ElementAtOrDefault(8)?.Trim() ?? "",
    //            IsPrimary: parts.ElementAtOrDefault(9)?.Trim()
    //        );

    //        if (string.IsNullOrWhiteSpace(req.SchemaName) ||
    //            string.IsNullOrWhiteSpace(req.UserName))
    //        {
    //            throw new UpstreamApiException(
    //                "Incomplete session data. Please log in normally.",
    //                400);
    //        }

    //        if (!string.Equals(
    //                req.UserName,
    //                userName,
    //                StringComparison.OrdinalIgnoreCase))
    //        {
    //            logger.LogWarning(
    //                "KeepMeSigninConfirm: Username mismatch. Request={RequestUser}, Redis={RedisUser}",
    //                userName,
    //                req.UserName);

    //            throw new UpstreamApiException(
    //                "Session mismatch. Please log in normally.",
    //                403);
    //        }

    //        logger.LogInformation(
    //            "KeepMeSigninConfirm: Redis entry resolved for User={User}, Schema={Schema}",
    //            Mask(req.UserName),
    //            req.SchemaName);

    //        return await KeepMeSignInAsync(req, brId, ct);
    //    }
    //    catch (UpstreamApiException)
    //    {
    //        throw;
    //    }
    //    catch (Exception ex)
    //    {
    //        logger.LogError(
    //            ex,
    //            "KeepMeSigninConfirm failed for User={User}",
    //            userName);

    //        throw new InvalidOperationException(
    //            "Error reading session data.",
    //            ex);
    //    }
    //}

    public async Task<EncryptUrlResult> KeepMeSigninConfirmAsync(KeepMeSigninConfirmRequest data, CancellationToken ct)
    {
        try
        {
            var httpContext = accessor.HttpContext;

            var ipAddress = GetClientIp(httpContext);
            ipAddress = ipAddress.Replace(".", "1");

            //string domain = $"{httpContext?.Request.Scheme}://{httpContext?.Request.Host}";
            string domain = _opts.AppWebDomain;

            string keyPrefix = $"{ipAddress}-{data.BrId}-{domain}";

            var (db, server) = await GetAxpertRedisAsync();

            string key = $"{keyPrefix}-keepaliveweb-{data.UserName}";

            logger.LogInformation("KeepMeSigninConfirm Redis Key: {Key}", key);

            byte[] bytes = await db.StringGetAsync(key);

            if (bytes == null || bytes.Length == 0)
            {
                logger.LogWarning(
                    "KeepMeSigninConfirm: Redis key not found for User={User}",
                    data.UserName);

                throw new UpstreamApiException(
                    "Session not found. Please log in normally.",
                    404);
            }

            // Skip binary header and find first uppercase character
            //int startIndex = Array.FindIndex(bytes, b => b >= (byte)'A' && b <= (byte)'Z');

            //if (startIndex < 0)
            //{
            //    logger.LogWarning(
            //        "KeepMeSigninConfirm: Unable to locate payload for User={User}",
            //        userName);

            //    throw new UpstreamApiException(
            //        "Invalid session data. Please log in normally.",
            //        400);
            //}

            //string rawEntry = Encoding.UTF8.GetString(
            //    bytes,
            //    startIndex,
            //    bytes.Length - startIndex);

            //rawEntry = rawEntry.TrimEnd('\0', '\u000B');

            string rawEntry = DeserializeRedisString(bytes);

            logger.LogInformation(
                "KeepMeSigninConfirm RawEntry: {RawEntry}",
                rawEntry);

            string[] parts = rawEntry.Split('~', StringSplitOptions.None);

            logger.LogInformation(
                "KeepMeSigninConfirm Parts Count: {Count}",
                parts.Length);

            if (parts.Length < 10)
            {
                logger.LogWarning(
                    "KeepMeSigninConfirm: Corrupt session data. Parts={Count}",
                    parts.Length);

                throw new UpstreamApiException(
                    "Corrupt session data. Please log in normally.",
                    400);
            }

            var req = new KeepMeSignInRequest(
                SchemaName: parts.ElementAtOrDefault(0)?.Trim() ?? "",
                UserName: parts.ElementAtOrDefault(1)?.Trim() ?? "",
                Email: parts.ElementAtOrDefault(8)?.Trim() ?? "",
                Password: parts.ElementAtOrDefault(2)?.Trim(),
                IsPrimary: parts.ElementAtOrDefault(9)?.Trim(),
                BrId: data.BrId
            );

            if (string.IsNullOrWhiteSpace(req.SchemaName) ||
                string.IsNullOrWhiteSpace(req.UserName))
            {
                throw new UpstreamApiException(
                    "Incomplete session data. Please log in normally.",
                    400);
            }

            if (!string.Equals(
                    req.UserName,
                    data.UserName,
                    StringComparison.OrdinalIgnoreCase))
            {
                logger.LogWarning(
                    "KeepMeSigninConfirm: Username mismatch. Request={RequestUser}, Redis={RedisUser}",
                    data.UserName,
                    req.UserName);

                throw new UpstreamApiException(
                    "Session mismatch. Please log in normally.",
                    403);
            }

            logger.LogInformation(
                "KeepMeSigninConfirm: Redis entry resolved for User={User}, Schema={Schema}",
                Mask(req.UserName),
                req.SchemaName);

            return await KeepMeSignInAsync(req, ct);
        }
        catch (UpstreamApiException)
        {
            throw;
        }
        catch (Exception ex)
        {
            logger.LogError(
                ex,
                "KeepMeSigninConfirm failed for User={User}",
                data.UserName);

            throw new InvalidOperationException(
                "Error reading session data.",
                ex);
        }
    }

    // ── SSO private helpers ───────────────────────────────────────────────────

    private async Task<SsoFlowResult> HandleSsoSignupAsync(string email, CancellationToken ct)
    {
        logger.LogInformation("SSO Signup: sending OTP to {Email}", Mask(email));

        var otpResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiSendOTP",
            new { Identifier = email, IdentifierType = "email", Purpose = "signup" },
        ct: ct);

        var success = otpResult.TryGetProperty("Success", out var s) && s.GetBoolean();
        if (!success)
            throw new UpstreamApiException(
                GetString(otpResult, "Message") ?? "Failed to send OTP for SSO signup.", 502);

        return new SsoFlowResult(
            NextAction: "otp-required",
            ChallengeId: GetString(otpResult, "ChallengeId"),
            ExpiresInSeconds: GetString(otpResult, "ExpiresInSeconds"),
            ResendInSeconds: GetString(otpResult, "ResendInSeconds"));
    }

    private async Task<SsoFlowResult> HandleSsoLoginAsync(
        string email, string ssoKey, string ssoProvider, CancellationToken ct)
    {
        // Attempt primary SSO verification
        logger.LogInformation("SSO Login: attempting AxiVerifyUser for {Email}", Mask(email));

        var verifyResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiVerifyUser",
            new
            {
                userName = email,
                ssoKey,
                ssoProvider,
                otp = string.Empty,
                challengeId = string.Empty,
                purpose = "login"
            }, ct: ct);

        var success = verifyResult.TryGetProperty("Success", out var sv) && sv.GetBoolean();
        var token = success ? GetString(verifyResult, "Token") : null;
        var message = GetString(verifyResult, "Message") ?? "";

        if (success && !string.IsNullOrWhiteSpace(token))
        {
            // Primary SSO user — store token and fetch schemas
            await tokenStore.SetAsync(new SessionData
            {
                Token = token
            }, ct);
            logger.LogInformation("SSO Login: user authenticated for {Email}", Mask(email));

            var schemas = await GetSchemaListAsync(new GetSchemaListRequest(email, token), ct);
            return new SsoFlowResult(NextAction: "schema-ready", Schemas: schemas);
        }
        else if (message != "Error: Not authorized user.")
        {
            throw new UpstreamApiException(message, 422);
        }

        logger.LogInformation("SSO Login: user authentication failed for {Email}", Mask(email));

        // Secondary SSO user — user exists but not verified with this provider
        logger.LogInformation("SSO Login: falling back to secondary flow (AxiUserCheck with Token required)");

        var checkResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiUserCheck",
            new { UserName = email, Purpose = "login", TokenRequired = "true" }, ct: ct);

        var checkSuccess = checkResult.TryGetProperty("Success", out var cs) && cs.GetBoolean();
        var secondaryToken = GetString(checkResult, "Token");

        if (!checkSuccess || string.IsNullOrWhiteSpace(secondaryToken))
            throw new UpstreamApiException(
                GetString(checkResult, "Message") ?? "No account found for this email or the account is inactive.", 422);

        await tokenStore.SetAsync(new SessionData
        {
            Token = secondaryToken
        }, ct);
        logger.LogInformation("SSO Login: user token acquired for {Email}", Mask(email));

        var secondarySchemas = await GetSchemaListAsync(new GetSchemaListRequest(email, secondaryToken), ct);
        return new SsoFlowResult(NextAction: "auth-update", Schemas: secondarySchemas);
    }

    // ── Token helpers ─────────────────────────────────────────────────────────

    /// <summary>
    /// Reads token from AxiVerifyUser/AxiUserCheck response, stores in Redis,
    /// and removes it from the returned data.
    /// </summary>
    private async Task InterceptAndStoreTokenAsync(JsonElement result, CancellationToken ct)
    {
        var token = GetString(result, "Token");
        if (!string.IsNullOrWhiteSpace(token))
        {
            await tokenStore.SetAsync(new SessionData
            {
                Token = token
            }, ct);
            logger.LogInformation("Token intercepted and stored in Redis.");
        }
    }

    /// <summary>Reads session token; throws 401 if none exists (SECURE endpoints).</summary>
    private async Task<string> RequireTokenAsync(CancellationToken ct, string sessionId = "")
    {
        var session = await tokenStore.GetAsync(ct, sessionId);
        if (session is null || string.IsNullOrEmpty(session.Token))
            throw new UnauthorizedException("No active session. Please log in.");
        return session.Token;
    }
    private async Task<SessionData> RequireSessionAsync(CancellationToken ct, string sessionId = "")
    {
        var session = await tokenStore.GetAsync(ct, sessionId);
        if (session is null || string.IsNullOrEmpty(session.Token))
            throw new UnauthorizedException("No active session. Please log in.");
        return session;
    }

    // ── JSON helpers ──────────────────────────────────────────────────────────

    /// <summary>
    /// Parses the JSON string field from AxiVerifyUser / GetAxiSchemaList responses.
    /// AxiClient returns schema data as an escaped JSON string in a "JSON" property.
    /// </summary>
    private static object? ParseJsonField(JsonElement el)
    {
        if (!el.TryGetProperty("JSON", out var jsonProp)) return null;
        if (jsonProp.ValueKind != JsonValueKind.String) return null;

        var raw = jsonProp.GetString();
        if (string.IsNullOrWhiteSpace(raw)) return null;

        try { return JsonSerializer.Deserialize<object>(raw, JsonOpts); }
        catch { return null; }
    }

    private static string? GetString(JsonElement el, string key)
        => el.TryGetProperty(key, out var p) && p.ValueKind == JsonValueKind.String
            ? p.GetString() : null;

    /// <summary>
    /// Filters schema list to only valid, active, non-expired entries
    /// and strips sensitive/internal fields before sending to the client.
    /// Validation rules:
    ///   • isactiveapp  == "T"
    ///   • isappexpired  == "F"
    ///   • expireon     is a valid future date (dd-MM-yyyy HH:mm:ss)
    /// Removed fields: isuseractive, DatabaseName, expireon, isactiveapp, isappexpired
    /// </summary>
    private static readonly string[] _schemaFieldsToRemove =
        ["isuseractive", "DatabaseName", "expireon", "isactiveapp", "isappexpired"];

    private object FilterAndSanitizeSchemas(object raw)
    {
        try
        {
            // Re-serialize to a JsonElement so we can work with it uniformly
            var json = JsonSerializer.Serialize(raw, JsonOpts);
            using var doc = JsonDocument.Parse(json);
            var root = doc.RootElement;

            if (root.ValueKind != JsonValueKind.Array)
            {
                logger.LogWarning("FilterAndSanitizeSchemas: expected JSON array, got {Kind}", root.ValueKind);
                return Array.Empty<object>();
            }

            var filtered = new List<Dictionary<string, object?>>();

            foreach (var schema in root.EnumerateArray())
            {
                // ── Validation ────────────────────────────────────────────
                //var isActiveApp = GetString(schema, "isactiveapp");
                //var isAppExpired = GetString(schema, "isappexpired");
                //var expireOnStr = GetString(schema, "expireon");

                //if (!string.Equals(isActiveApp, "T", StringComparison.OrdinalIgnoreCase))
                //{
                //    logger.LogDebug("Schema filtered out (isactiveapp={Val}): {Id}",
                //        isActiveApp, GetString(schema, "axiaccid"));
                //    continue;
                //}

                //if (string.Equals(isAppExpired, "T", StringComparison.OrdinalIgnoreCase))
                //{
                //    logger.LogDebug("Schema filtered out (isappexpired=T): {Id}",
                //        GetString(schema, "axiaccid"));
                //    continue;
                //}

                //if (!string.IsNullOrWhiteSpace(expireOnStr) &&
                //    DateTime.TryParseExact(expireOnStr, "dd-MM-yyyy HH:mm:ss",
                //        System.Globalization.CultureInfo.InvariantCulture,
                //        System.Globalization.DateTimeStyles.None, out var expireDate) &&
                //    expireDate < DateTime.UtcNow)
                //{
                //    logger.LogDebug("Schema filtered out (expired on {Date}): {Id}",
                //        expireOnStr, GetString(schema, "axiaccid"));
                //    continue;
                //}

                // ── Sanitize: copy allowed fields only ────────────────────
                var entry = new Dictionary<string, object?>();
                foreach (var prop in schema.EnumerateObject())
                {
                    if (_schemaFieldsToRemove.Contains(prop.Name, StringComparer.OrdinalIgnoreCase))
                        continue;
                    if (prop.Name == "installedpackages" && GetString(schema, "isprimary")?.ToLower() != "t")
                        continue;

                    entry[prop.Name] = prop.Value.ValueKind switch
                    {
                        JsonValueKind.String => prop.Value.GetString(),
                        JsonValueKind.True => (object)true,
                        JsonValueKind.False => false,
                        JsonValueKind.Number => prop.Value.TryGetInt64(out var i) ? i : prop.Value.GetDouble(),
                        JsonValueKind.Null => null,
                        _ => prop.Value.GetRawText()
                    };
                }

                filtered.Add(entry);
            }

            logger.LogInformation("Schema filter: {Total} total → {Valid} valid returned",
                root.GetArrayLength(), filtered.Count);

            return filtered;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "FilterAndSanitizeSchemas failed; returning empty list.");
            return Array.Empty<object>();
        }
    }

    private static string Mask(string value)
    {
        var at = value.IndexOf('@');
        if (at > 1) return value[0] + new string('*', Math.Min(at - 1, 4)) + value[at..];
        return value.Length > 2 ? value[0] + "***" + value[^1] : "***";
    }

    private string GetCurrentBaseUrl()
    {
        var request = accessor.HttpContext?.Request;
        if (request is null)
            throw new InvalidOperationException("No active HTTP context.");

        var scheme = request.Headers["X-Forwarded-Proto"].FirstOrDefault() ?? request.Scheme;
        var host = request.Headers["X-Forwarded-Host"].FirstOrDefault() ?? request.Host.Value;

        return $"{scheme}://{host}";
    }

    public static string GetClientIp(HttpContext httpContext)
    {
        string ipAddress = httpContext.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(ipAddress))
        {
            ipAddress = httpContext.Connection.RemoteIpAddress?.ToString();
        }
        else
        {
            ipAddress = ipAddress.Split(',')[0].Trim();
        }
        if (ipAddress == "::1" || ipAddress == "127.0.0.1")
        {
            string hostName = Dns.GetHostName();
            IPHostEntry ipEntry = Dns.GetHostEntry(hostName);

            foreach (IPAddress ip in ipEntry.AddressList)
            {
                if (ip.AddressFamily == AddressFamily.InterNetwork)
                {
                    ipAddress = ip.ToString();
                    break;
                }
            }
        }
        return ipAddress;
    }

    private static string GenerateUniqueId() =>
    Convert.ToBase64String(RandomNumberGenerator.GetBytes(16))
           .Replace('+', '_').Replace('/', '_').TrimEnd('=');

    // ── AxpertWeb Redis helper ────────────────────────────────────────────────────
    /// <summary>
    /// Opens a short-lived connection to the AxpertWeb Redis instance.
    /// Caller disposes via `await using`.
    /// </summary>
    private async Task<(IDatabase db, IServer server)> GetAxpertRedisAsync()
    {
        var cfg = axpertRedisOpts.Value;
        var conn = await ConnectionMultiplexer.ConnectAsync(
            $"{cfg.Host}:{cfg.Port},password={cfg.Pwd}");
        var server = conn.GetServer(conn.GetEndPoints().First());
        return (conn.GetDatabase(), server);
    }

    // ── Shared AxiInfoToSignin → AxiSigninKey → Redis → URL pipeline ─────────────
    /// <summary>
    /// Calls AxiInfoToSignin, then AxiSigninKey, stores the payload in AxpertWeb Redis,
    /// and returns the redirect URL.
    /// Returns (success: false, error message) on any step failure.
    /// </summary>
    private async Task<(bool Success, string? Url, string? Error)> BuildSigninUrlAsync(
        string schemaName,
        string userName,
        string email,
        string isPrimary,
        string password,
        string keepMeSignIn,
        string brId,
        string token,
        string installedPackages,
        CancellationToken ct)
    {
        logger.LogInformation("KeepMeSignIn = {Value}", keepMeSignIn);
        // 1. AxiInfoToSignin
        var signinResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiInfoToSignin",
            new
            {
                schemaname = schemaName?.ToUpper(),
                username = userName,
                email,
                primary = isPrimary,
                password,
                keepmesignin = keepMeSignIn,
                brid = brId,
                axipackage = 'F'
            },
            bearerToken: token, ct: ct);

        if (!(signinResult.TryGetProperty("Success", out var sv) && sv.GetBoolean()))
        {
            var err = GetString(signinResult, "Message") ?? GetString(signinResult, "Error")
                      ?? "Failed to get signin info.";
            logger.LogWarning("AxiInfoToSignin failed for {Email}, schema={Schema}: {Msg}",
                Mask(email), schemaName, err);
            return (false, null, err);
        }

        var info = GetString(signinResult, "Info") ?? GetString(signinResult, "Data");
        if (string.IsNullOrWhiteSpace(info))
            return (false, null, "Signin info not available in response.");

        // 2. AxiSigninKey — register the one-time key with AxiClient
        var uniqueKey = $"{schemaName.ToUpper()}-{userName}-{GenerateUniqueId()}";
        var keyResult = await proxy.PostJsonAsync("AxiClient", "api/AxiClient/AxiSigninKey",
            uniqueKey, ct: ct);

        if (!(keyResult.TryGetProperty("Success", out var ks) && ks.GetBoolean()))
        {
            var err = GetString(keyResult, "Message") ?? GetString(keyResult, "Error")
                      ?? "Failed to get encrypt info.";
            logger.LogWarning("AxiSigninKey failed for {Email}, schema={Schema}: {Msg}",
                Mask(email), schemaName, err);
            return (false, null, err);
        }

        var keyInfo = GetString(keyResult, "Info") ?? GetString(keyResult, "Data");
        if (string.IsNullOrWhiteSpace(keyInfo))
            return (false, null, "Signin key info not available in response.");

        // 3. Store payload in AxpertWeb Redis so signin.aspx can retrieve it by key
        var (db, _) = await GetAxpertRedisAsync();
        await db.StringSetAsync(uniqueKey, info, _ttl);

        // 4. Store installed packages in redis
        if(!string.IsNullOrWhiteSpace(installedPackages))
        {
            var pkgList = installedPackages
                            .Split(',')
                            .Select(p => p.Trim())
                            .Where(p => !string.IsNullOrEmpty(p));

            foreach (string pkg in pkgList)
            {
                var pkgName = pkg?.Replace(" ", "_");
                var pkgKey = $"{schemaName?.ToUpper()}-installedpkg_{pkgName}-♣";
                await db.StringSetAsync(pkgKey, pkg, TimeSpan.FromMinutes(720));
            }
        }

        // 5. Build redirect URL
        var redirectUrl = $"{_opts.AppLoginUrl.TrimEnd('/')}?axi={Uri.EscapeDataString(keyInfo)}";
        //var redirectUrl = $"{GetCurrentBaseUrl()}/aspx/signin.aspx?axi={Uri.EscapeDataString(keyInfo)}";

        return (true, redirectUrl, null);
    }

    // BinaryFormater Deserializer
    private static string DeserializeRedisString(byte[] bytes)
    {
        using MemoryStream stream = new(bytes);

        #pragma warning disable SYSLIB0011
        return (string)new BinaryFormatter().Deserialize(stream);
        #pragma warning restore SYSLIB0011
    }
}
