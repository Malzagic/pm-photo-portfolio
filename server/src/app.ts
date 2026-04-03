/**
 * server/src/app.ts
 * Main entry point for the Mikrus server application.
 * Handles API routes, static file serving, and server configuration.
 * Professional Fastify initialization with optional HTTPS support.
 */
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import fs from "fs"; // All imports at the top
import "dotenv/config";

import "./config/firebase.js";
import { photoRoutes } from "./routes/photo.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Detect environment
const isProduction = process.env.NODE_ENV === "production";

/**
 * HTTPS CONFIGURATION
 * In Fastify, SSL/TLS certificates must be provided during instance creation.
 */
let httpsOptions: { key: Buffer; cert: Buffer } | null = null;

if (isProduction) {
  const keyPath = path.join(__dirname, "../certs/privkey.pem");
  const certPath = path.join(__dirname, "../certs/fullchain.pem");

  // Only load certificates if they actually exist to prevent server crash
  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  }
}

// Initialize server with optional HTTPS
const server = Fastify({
  logger: true,
  // If httpsOptions is null, Fastify defaults to HTTP
  https: httpsOptions,
});

/**
 * PATH RESOLUTION
 * Points to the 'uploads' folder inside the 'server' directory.
 */
const uploadsPath = path.join(__dirname, "../uploads");

// Self-healing: Ensure uploads directory exists
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

/**
 * Plugins registration
 */
await server.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
});

await server.register(multipart, {
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

/**
 * Static files serving
 */
await server.register(fastifyStatic, {
  root: uploadsPath,
  prefix: "/uploads/",
});

// API Routes
await server.register(photoRoutes, { prefix: "/api/photos" });

// Health check for Mikrus/Monitoring
server.get("/health", async () => ({
  status: "ok",
  uptime: process.uptime(),
  protocol: httpsOptions ? "https" : "http",
}));

/**
 * Server startup logic
 */
const start = async () => {
  try {
    const port = isProduction ? Number(process.env.PORT) || 30604 : 3001;
    const host = isProduction ? "0.0.0.0" : "localhost";

    await server.listen({ port, host });

    console.log(`
      ---
      STATUS: Professional Start
      ENV: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}
      PORT: ${port}
      PROTOCOL: ${httpsOptions ? "HTTPS" : "HTTP (Unsecured)"}
      ---
    `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
