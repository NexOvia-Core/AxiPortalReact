import { saveUserRecord } from "./db";

export async function handleAuthSubmit(reqBody: any) {
  const { email, full_name, auth_provider, keep_signed_in, use_otp, action_type } = reqBody || {};

  if (!email && !auth_provider) {
    throw new Error("Email or Auth Provider is required");
  }

  const effectiveEmail = email || `${auth_provider || "user"}_${Date.now()}@oauth.axi`;

  const result = await saveUserRecord({
    email: effectiveEmail,
    full_name,
    auth_provider: auth_provider || "email",
    keep_signed_in: Boolean(keep_signed_in),
    use_otp: Boolean(use_otp),
    action_type: action_type || "login",
  });

  return result;
}
