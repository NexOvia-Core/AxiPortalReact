export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  errorCode?: string;
  data?: T;
};

export class BffError extends Error {
  constructor(
    message: string,
    public readonly errorCode?: string
  ) {
    super(message);
  }
}

async function request<T>(path: string, body?: unknown): Promise<T> {
  const apiUrl = new URL(
    `api/${path}`,
    new URL(import.meta.env.BASE_URL, window.location.origin)
  );
  const response = await fetch(apiUrl, {
    method: body === undefined ? "GET" : "POST",
    credentials: "include",
    headers:
      body === undefined ? undefined : { "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const payload = (await response.json()) as ApiResponse<T>;
  if (!response.ok || !payload.success) {
    throw new BffError(
      payload.message || "The request could not be completed.",
      payload.errorCode
    );
  }
  return payload.data as T;
}

export const bff = {
  checkAndSendOtp: (email: string, mode: "login" | "signup") =>
    request<{
      challengeId: string;
      expiresInSeconds: number;
      resendInSeconds: number;
    }>("auth/check-send-otp", { email, mode }),
  verifyUser: (
    email: string,
    purpose: "login" | "signup",
    otp: string,
    challengeId: string
  ) =>
    request<{ schemas?: Schema[] }>("auth/verify-user", {
      email,
      purpose,
      otp,
      challengeId,
    }),
  checkAccount: (axiAccId: string) =>
    request<{ success?: boolean }>("auth/check-account", { axiAccId }),
  setupAccount: (account: SetupAccount) =>
    request<unknown>("auth/setup-account", account),
  signinInfo: (schema: Schema, keepMeSignIn: boolean) =>
    request<{ redirectUrl?: string }>("auth/signin-info", {
      schemaName: schema.axiaccid,
      userName: schema.username,
      email: schema.email,
      isPrimary: schema.isprimary,
      keepMeSignIn,
      installedPackages: schema.installedpackages,
    }),
  rememberedAccounts: (brId: string) =>
    request<string[]>("auth/keepme-signin-list", { brId }),
  oauth: (
    provider: "google" | "microsoft" | "supabase",
    accessToken: string,
    isSignup: boolean,
    supabaseProvider?: string
  ) =>
    request<OAuthResult>(
      `oauth/${provider}`,
      provider === "supabase"
        ? { accessToken, isSignup, provider: supabaseProvider }
        : { accessToken, isSignup }
    ),
  authUpdate: (
    email: string,
    axiAccId: string,
    ssoKey: string,
    ssoProvider: string
  ) =>
    request<unknown>("auth/auth-update", {
      email,
      axiAccId,
      ssoKey,
      ssoProvider,
    }),
  directLogin: () =>
    request<{ success: boolean; redirectUrl?: string; error?: string }>(
      "auth/direct-login",
      {}
    ),
  rememberSignIn: (brId: string, userName: string) =>
    request<{ redirectUrl?: string }>("auth/keepme-signin", { brId, userName }),
  oauthConfig: () => request<OAuthConfig>("oauth/config"),
  packageProgress: (
    schemaName: string,
    username: string,
    packageNames: string[]
  ) =>
    request<PackageProgress[]>("package/progress", {
      schemaName,
      username,
      packageNames,
    }),
  installPackages: (
    schemaName: string,
    requestedBy: string,
    packages: { packageName: string; packageVersion: string }[]
  ) =>
    request<unknown>("package/install-bulk", {
      schemaName,
      requestedBy,
      packages,
    }),
};

export type Schema = {
  axiaccid: string;
  username: string;
  email: string;
  isprimary: string;
  isverified: string;
  installedpackages?: string;
  statusmessage?: string;
};
export type PackageProgress = {
  packageName: string;
  status: string;
  message?: string;
};
export type OAuthConfig = Record<string, string | undefined>;
export type OAuthResult = {
  email: string;
  name: string;
  sub: string;
  provider: string;
  isEmailVerified: boolean;
  nextAction: "otp-required" | "schema-ready" | "auth-update";
  challengeId?: string;
  expiresInSeconds?: number;
  schemas?: Schema[];
};
export type SetupAccount = {
  orgName: string;
  email: string;
  axiAccId: string;
  userName: string;
  nickName?: string;
  contactPersonName?: string;
  mobileNo?: string;
  taxNo?: string;
  state?: string;
  country?: string;
  address?: string;
  countryCode?: string;
  region?: string;
  authProvider?: string;
  ssoId?: string;
  isVerified?: string;
};
