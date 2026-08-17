import pg from "pg";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const { Pool } = pg;

// ──────────────────────────────────────────────
// Path helpers (ESM-compatible)
// ──────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single persistent JSON file that accumulates ALL login records
const AUTH_LOG_FILE = path.resolve(__dirname, "..", "auth_logs.json");

// ──────────────────────────────────────────────
// OTP Session Store (in-memory, ephemeral)
// ──────────────────────────────────────────────
interface OtpSession {
  otp: string;
  phone: string;
  expires: number; // Unix ms
}
const otpSessions = new Map<string, OtpSession>(); // key = phone

/** Generate a 6-digit OTP and store it with a 5-minute expiry. Returns the OTP. */
export function createOtpSession(phone: string): string {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  otpSessions.set(phone, { otp, phone, expires: Date.now() + 5 * 60 * 1000 });
  console.log(`[OTP] Generated for ${phone}: ${otp} (expires in 5 min)`);
  return otp;
}

/** Verify the OTP for a phone number. Returns true on match + removes session. */
export function verifyOtpSession(phone: string, otp: string): { valid: boolean; reason?: string } {
  const session = otpSessions.get(phone);
  if (!session) return { valid: false, reason: "No OTP session found for this number. Please request a new OTP." };
  if (Date.now() > session.expires) {
    otpSessions.delete(phone);
    return { valid: false, reason: "OTP has expired. Please request a new one." };
  }
  if (session.otp !== otp.trim()) {
    return { valid: false, reason: "Incorrect OTP. Please try again." };
  }
  otpSessions.delete(phone);
  return { valid: true };
}

// ──────────────────────────────────────────────
// Persistent JSON file helpers
// ──────────────────────────────────────────────

/** Read existing records from the JSON log file (returns [] if file absent). */
function readAuthLogs(): any[] {
  try {
    if (fs.existsSync(AUTH_LOG_FILE)) {
      const raw = fs.readFileSync(AUTH_LOG_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (err: any) {
    console.warn("Could not read auth_logs.json, starting fresh:", err.message);
  }
  return [];
}

/** Append a new record to the JSON log file (creates or updates the file). */
function appendAuthLog(record: object): void {
  try {
    const existing = readAuthLogs();
    existing.push(record);
    fs.writeFileSync(AUTH_LOG_FILE, JSON.stringify(existing, null, 2), "utf-8");
    console.log(`[auth_logs.json] Record appended. Total records: ${existing.length}`);
  } catch (err: any) {
    console.error("Failed to write auth_logs.json:", err.message);
  }
}

// ──────────────────────────────────────────────
// PostgreSQL connection
// ──────────────────────────────────────────────
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER || "postgres"}:${process.env.PGPASSWORD || "postgres"}@${process.env.PGHOST || "axi-global"}:${process.env.PGPORT || "5432"}/${process.env.PGDATABASE || "postgres"}`;

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
});

let isPgConnected = false;

export async function initDb() {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully.");
    isPgConnected = true;

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        auth_provider VARCHAR(50) DEFAULT 'email',
        keep_signed_in BOOLEAN DEFAULT FALSE,
        use_otp BOOLEAN DEFAULT FALSE,
        action_type VARCHAR(50) DEFAULT 'login',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // Add phone column if upgrading existing table
    await client.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
    `).catch(() => { });
    console.log("Users table initialized in PostgreSQL database.");
    client.release();
  } catch (err: any) {
    console.warn(
      "PostgreSQL connection failed or DB not running locally. Using fallback storage mode. Error: ",
      err.message
    );
    isPgConnected = false;
  }
}

export async function saveUserRecord(data: {
  email: string;
  full_name?: string;
  phone?: string;
  auth_provider?: string;
  keep_signed_in?: boolean;
  use_otp?: boolean;
  action_type?: string;
}) {
  // ── Always write to the local JSON backup file ──
  const logEntry = {
    id: readAuthLogs().length + 1,
    email: data.email,
    full_name: data.full_name || null,
    phone: data.phone || null,
    auth_provider: data.auth_provider || "email",
    keep_signed_in: data.keep_signed_in || false,
    use_otp: data.use_otp || false,
    action_type: data.action_type || "login",
    created_at: new Date().toISOString(),
    source: isPgConnected ? "postgres" : "file_fallback",
  };
  appendAuthLog(logEntry);

  // ── If PostgreSQL is available, also persist there ──
  if (isPgConnected) {
    try {
      const res = await pool.query(
        `INSERT INTO users (email, full_name, phone, auth_provider, keep_signed_in, use_otp, action_type)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *;`,
        [
          data.email,
          data.full_name || null,
          data.phone || null,
          data.auth_provider || "email",
          data.keep_signed_in || false,
          data.use_otp || false,
          data.action_type || "login",
        ]
      );
      console.log("User record saved to PostgreSQL:", res.rows[0]);
      return { success: true, user: res.rows[0], source: "postgres" };
    } catch (err: any) {
      console.error("Error inserting into PostgreSQL:", err.message);
      // Fall through to return the file-backed entry
    }
  }

  // ── Fallback: return the JSON-file-backed record ──
  console.log("User record saved to local JSON backup (auth_logs.json):", logEntry);
  return { success: true, user: logEntry, source: "file_fallback" };
}

// Initialise DB on module load
initDb().catch((e) => console.error("DB init error:", e));
