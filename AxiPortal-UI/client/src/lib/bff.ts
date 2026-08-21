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

function normalizePackageProgress(value: unknown): PackageProgress[] {
  const response =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : undefined;
  const statuses = Array.isArray(value)
    ? value
    : response && Array.isArray(response.statuses)
      ? response.statuses
      : [];

  return statuses.filter((item: unknown): item is PackageProgress => {
    const progress =
      item && typeof item === "object"
        ? (item as Record<string, unknown>)
        : undefined;
    return Boolean(
      progress &&
        typeof progress.packageName === "string" &&
        typeof progress.status === "string"
    );
  });
}

function normalizeRememberedAccounts(value: unknown): string[] {
  const response =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : undefined;
  const profiles = Array.isArray(value)
    ? value
    : response && Array.isArray(response.profiles)
      ? response.profiles
      : [];
  return profiles.filter(
    (profile): profile is string => typeof profile === "string"
  );
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
    request<{ success?: boolean; Success?: boolean }>("auth/check-account", {
      axiAccId,
    }),
  setupAccount: (account: SetupAccount) =>
    request<unknown>("auth/setup-account", account),
  signinInfo: (
    schema: Schema,
    keepMeSignIn: boolean,
    password?: string,
    brId?: string
  ) =>
    request<{ redirectUrl?: string }>("auth/signin-info", {
      schemaName: schema.axiaccid,
      userName: schema.username,
      email: schema.email,
      isPrimary: schema.isprimary,
      keepMeSignIn,
      password,
      brId,
      installedPackages: schema.installedpackages,
    }),
  verifyEmailSchemas: (email: string) =>
    request<{ schemas?: Schema[] }>("auth/verify-email-schemas", { email }),
  rememberedAccounts: (brId: string) =>
    request<unknown>("auth/keepme-signin-list", { brId }).then(
      normalizeRememberedAccounts
    ),
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
  directLogin: (sessionId?: string) =>
    request<{ success: boolean; redirectUrl?: string; error?: string }>(
      "auth/direct-login",
      { sessionId: sessionId || "" }
    ),
  provisioningStatus: () =>
    request<{ success: boolean; error?: string }>("auth/provision-status", {}),
  rememberSignIn: (brId: string, userName: string) =>
    request<{ redirectUrl?: string }>("auth/keepme-signin", { brId, userName }),
  oauthConfig: () => request<OAuthConfig>("oauth/config"),
  packageProgress: (
    schemaName: string,
    username: string,
    packageNames: string[]
  ) =>
    request<unknown>("package/progress", {
      schemaName,
      username,
      packageNames,
    }).then(normalizePackageProgress),
  installPackages: (
    schemaName: string,
    requestedBy: string,
    packages: { packageName: string; packageVersion: string }[]
  ) =>
    request<PackageInstallResult>("package/install-bulk", {
      schemaName,
      requestedBy,
      packages,
    }),
  packageStatus: (schemaName: string, packageName: string) =>
    request<{
      status?: "NEW" | "IN_PROGRESS" | "ALREADY_INSTALLED";
      message?: string;
    }>("package/check-status", { schemaName, packageName }),
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
  logUrl?: string;
};
export type PackageInstallResult = {
  results?: Array<{
    packageName: string;
    success: boolean;
    message?: string;
  }>;
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
