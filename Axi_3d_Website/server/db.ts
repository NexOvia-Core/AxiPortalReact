import pg from "pg";

const { Pool } = pg;

// PostgreSQL connection string from env or default local postgres url
const connectionString =
  process.env.DATABASE_URL ||
  `postgres://${process.env.PGUSER || "postgres"}:${process.env.PGPASSWORD || "postgres"}@${process.env.PGHOST || "localhost"}:${process.env.PGPORT || "5432"}/${process.env.PGDATABASE || "postgres"}`;

export const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 3000,
  idleTimeoutMillis: 10000,
});

// Fallback in-memory store if postgres is not reachable locally
const fallbackUsers: Array<{
  id: number;
  full_name?: string;
  email: string;
  auth_provider?: string;
  keep_signed_in?: boolean;
  use_otp?: boolean;
  action_type?: string;
  created_at: Date;
}> = [];

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
        auth_provider VARCHAR(50) DEFAULT 'email',
        keep_signed_in BOOLEAN DEFAULT FALSE,
        use_otp BOOLEAN DEFAULT FALSE,
        action_type VARCHAR(50) DEFAULT 'login',
        created_at TIMESTAMP WITH TIMEZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Users table initialized in PostgreSQL database.");
    client.release();
  } catch (err: any) {
    console.warn(
      "PostgreSQL connection failed or DB not running locally. Using fallback storage mode. Error:",
      err.message
    );
    isPgConnected = false;
  }
}

export async function saveUserRecord(data: {
  email: string;
  full_name?: string;
  auth_provider?: string;
  keep_signed_in?: boolean;
  use_otp?: boolean;
  action_type?: string;
}) {
  if (isPgConnected) {
    try {
      const res = await pool.query(
        `INSERT INTO users (email, full_name, auth_provider, keep_signed_in, use_otp, action_type)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *;`,
        [
          data.email,
          data.full_name || null,
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
      // Fallback to in-memory on query error
    }
  }

  // Fallback storage
  const newUser = {
    id: fallbackUsers.length + 1,
    email: data.email,
    full_name: data.full_name,
    auth_provider: data.auth_provider || "email",
    keep_signed_in: data.keep_signed_in || false,
    use_otp: data.use_otp || false,
    action_type: data.action_type || "login",
    created_at: new Date(),
  };
  fallbackUsers.push(newUser);
  console.log("User record saved to fallback store:", newUser);
  return { success: true, user: newUser, source: "memory_fallback" };
}

// Call initDb on module import
initDb().catch((e) => console.error("DB init error:", e));
