/**
 * server/src/app.ts
 * Main entry point for the Mikrus server application.
 * Handles API routes, static file serving, and server configuration.
 * Professional Fastify initialization.
 * Fixed: Corrected static path resolution to prevent 404 errors.
 */
import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyStatic from "@fastify/static";
import multipart from "@fastify/multipart";
import path from "path";
import { fileURLToPath } from "url";
import process from "process";
import fs from "fs";
import "dotenv/config";
import "./config/firebase.js";
import { photoRoutes } from "./routes/photo.routes.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Detect environment
const isProduction = process.env.NODE_ENV === "production";
const server = Fastify({
    logger: true, // Kept active for professional monitoring
});
/**
 * PATH RESOLUTION
 * Points to the 'uploads' folder inside the 'server' directory.
 */
const uploadsPath = path.join(__dirname, "../uploads");
// Self-healing: Ensure uploads directory exists to prevent fastify-static errors
if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
}
/**
 * Plugins registration
 */
await server.register(cors, {
    // Allow all in development, restrict in production if needed
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
 * Static files serving - RESTORED & FIXED
 */
await server.register(fastifyStatic, {
    root: uploadsPath,
    prefix: "/uploads/",
});
// Routes
await server.register(photoRoutes, { prefix: "/api/photos" });
// Health check for Mikrus
server.get("/health", async () => ({
    status: "ok",
    uptime: process.uptime(),
}));
/**
 * Server startup logic
 */
const start = async () => {
    try {
        // Production port is 30604 (Mikrus), Development is 3001
        const port = isProduction ? Number(process.env.PORT) || 30604 : 3001;
        // Mikrus requires 0.0.0.0 host
        const host = isProduction ? "0.0.0.0" : "localhost";
        await server.listen({ port, host });
        console.log(`
      ---
      STATUS: Professional Start
      ENV: ${isProduction ? "PRODUCTION" : "DEVELOPMENT"}
      PORT: ${port}
      HOST: ${host}
      PATH: ${uploadsPath}
      ---
    `);
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
