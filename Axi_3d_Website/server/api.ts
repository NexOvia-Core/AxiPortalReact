import { saveUserRecord, createOtpSession, verifyOtpSession } from "./db";

/**
 * Dispatch real SMS using SMS gateway services if environment keys are configured.
 * Supports Twilio, Fast2SMS, MSG91, and Textlocal.
 */
async function sendRealSms(phone: string, otp: string): Promise<{ sent: boolean; provider?: string; details?: string }> {
  const cleanPhone = phone.replace(/\s+/g, "");
  const digitsOnly = phone.replace(/\D/g, "");

  // 1. Twilio Integration (Global)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    try {
      const accountSid = process.env.TWILIO_ACCOUNT_SID;
      const authToken = process.env.TWILIO_AUTH_TOKEN;
      const fromNumber = process.env.TWILIO_PHONE_NUMBER;
      const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

      const params = new URLSearchParams({
        To: cleanPhone.startsWith("+") ? cleanPhone : `+${cleanPhone}`,
        From: fromNumber,
        Body: `Your Axi Platform verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
      });

      const creds = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${creds}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[Twilio Real SMS Dispatch] Success - Message SID: ${data.sid} to ${cleanPhone}`);
        return { sent: true, provider: "Twilio", details: `Message SID: ${data.sid}` };
      } else {
        console.error(`[Twilio SMS Error]`, data.message || data);
      }
    } catch (err: any) {
      console.error(`[Twilio SMS Exception]`, err.message);
    }
  }

  // 2. Fast2SMS Integration (India / +91 numbers)
  if (process.env.FAST2SMS_API_KEY) {
    try {
      const apiKey = process.env.FAST2SMS_API_KEY;
      const number = digitsOnly.length > 10 ? digitsOnly.slice(-10) : digitsOnly;
      const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
        method: "POST",
        headers: {
          authorization: apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          route: "otp",
          variables_values: otp,
          numbers: number,
        }),
      });
      const data = await res.json();
      if (data.return) {
        console.log(`[Fast2SMS Real SMS Dispatch] Success to ${number}`);
        return { sent: true, provider: "Fast2SMS", details: data.message?.[0] };
      } else {
        console.error(`[Fast2SMS Error]`, data);
      }
    } catch (err: any) {
      console.error(`[Fast2SMS Exception]`, err.message);
    }
  }

  // 3. MSG91 Integration
  if (process.env.MSG91_AUTH_KEY && process.env.MSG91_TEMPLATE_ID) {
    try {
      const authKey = process.env.MSG91_AUTH_KEY;
      const templateId = process.env.MSG91_TEMPLATE_ID;
      const res = await fetch(`https://control.msg91.com/api/v5/otp?template_id=${templateId}&mobile=${digitsOnly}&authkey=${authKey}&otp=${otp}`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.type === "success") {
        console.log(`[MSG91 Real SMS Dispatch] Success to ${digitsOnly}`);
        return { sent: true, provider: "MSG91" };
      }
    } catch (err: any) {
      console.error(`[MSG91 Exception]`, err.message);
    }
  }

  return { sent: false, provider: "Developer Terminal Console" };
}

export async function handleAuthSubmit(reqBody: any) {
  const { email, full_name, phone, auth_provider, keep_signed_in, use_otp, action_type } =
    reqBody || {};

  if (!email && !auth_provider) {
    throw new Error("Email or Auth Provider is required");
  }

  const effectiveEmail = email || `${auth_provider || "user"}_${Date.now()}@oauth.axi`;

  const result = await saveUserRecord({
    email: effectiveEmail,
    full_name,
    phone: phone || null,
    auth_provider: auth_provider || "email",
    keep_signed_in: Boolean(keep_signed_in),
    use_otp: Boolean(use_otp),
    action_type: action_type || "login",
  });

  return result;
}

/**
 * POST /api/auth/send-otp
 * Body: { phone: string }
 * Generates a 6-digit OTP, logs to developer terminal, dispatches real SMS gateway if keys configured.
 */
export async function handleSendOtp(reqBody: any) {
  const { phone } = reqBody || {};
  if (!phone || String(phone).trim().length < 5) {
    throw new Error("A valid phone number is required.");
  }
  const cleanPhone = String(phone).trim();
  const otp = createOtpSession(cleanPhone);

  // ── Always log in server console for developer verification ──
  console.log(
    `\n${"=".repeat(60)}\n[DEVELOPER CONSOLE - SMS TRANSMISSION LOG]\n📱 Mobile Number: ${cleanPhone}\n🔑 6-Digit OTP: ${otp}\n⏳ Status: Active (Valid for 5 minutes)\n${"=".repeat(60)}\n`
  );

  // ── Attempt real SMS dispatch via SMS Gateway if configured ──
  const smsResult = await sendRealSms(cleanPhone, otp);

  return {
    success: true,
    message: smsResult.sent
      ? `OTP sent to ${cleanPhone} via ${smsResult.provider} SMS.`
      : `OTP generated for ${cleanPhone}. (Dispatched & logged in developer terminal console).`,
    provider: smsResult.provider,
  };
}

/**
 * POST /api/auth/verify-otp
 * Body: { phone: string, otp: string, email?: string, full_name?: string, keep_signed_in?: boolean }
 * Verifies the OTP; on success saves the user record to JSON log & Postgres simultaneously and returns { success: true }
 */
export async function handleVerifyOtp(reqBody: any) {
  const { phone, otp, email, full_name, keep_signed_in } = reqBody || {};

  if (!phone || !otp) {
    throw new Error("Phone number and OTP are required.");
  }

  const result = verifyOtpSession(String(phone).trim(), String(otp).trim());
  if (!result.valid) {
    throw new Error(result.reason || "OTP verification failed.");
  }

  // Save a login record to auth_logs.json and PostgreSQL simultaneously
  const effectiveEmail = email || `otp_${String(phone).replace(/\D/g, "")}@otp.axi`;
  const savedRecord = await saveUserRecord({
    email: effectiveEmail,
    full_name: full_name || null,
    phone: String(phone).trim(),
    auth_provider: "otp",
    keep_signed_in: Boolean(keep_signed_in),
    use_otp: true,
    action_type: "login",
  });

  return { success: true, user: savedRecord.user, source: savedRecord.source };
}
