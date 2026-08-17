import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(express.json());
  app.use(express.static(staticPath));

  // ── Auth: email / social provider submit ──────────────────────
  app.post("/api/auth/submit", async (req, res) => {
    try {
      const { handleAuthSubmit } = await import("./api");
      const result = await handleAuthSubmit(req.body);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message || String(e) });
    }
  });

  // ── OTP: send OTP to phone number ─────────────────────────────
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { handleSendOtp } = await import("./api");
      const result = await handleSendOtp(req.body);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message || String(e) });
    }
  });

  // ── OTP: verify OTP and login ─────────────────────────────────
  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { handleVerifyOtp } = await import("./api");
      const result = await handleVerifyOtp(req.body);
      res.json(result);
    } catch (e: any) {
      res.status(400).json({ success: false, error: e.message || String(e) });
    }
  });

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });

  const port = Number(process.env.PORT) || 8000;
  const host = process.env.HOST || "127.0.0.1";

  server.listen(port, host, () => {
    console.log(`Server running on http://${host}:${port}/`);
  });
}

startServer().catch(console.error);
