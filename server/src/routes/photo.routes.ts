/**
 * server/src/routes/photo.routes.ts
 * Routes for managing photo uploads and metadata.
 */
import { FastifyInstance } from "fastify";
import { verifyAdmin } from "../middleware/auth.middleware.js";
import { pipeline } from "stream/promises";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function photoRoutes(fastify: FastifyInstance) {
  /**
   * POST /api/photos/upload
   * Protected route to upload a photo to the server's storage.
   */
  fastify.post("/upload", { preHandler: [verifyAdmin] }, async (request, reply) => {
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    // Creating a professional file path (you can add subfolders like /astro later)
    const fileName = `${Date.now()}-${data.filename}`;
    const uploadPath = path.join(__dirname, "../../uploads", fileName);

    try {
      // Stream the file to the local disk on Mikrus
      await pipeline(data.file, fs.createWriteStream(uploadPath));

      return {
        message: "Photo uploaded successfully",
        storagePath: fileName, // This is what we will save in Firestore/SQLite
        url: `/uploads/${fileName}`,
      };
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Failed to save file on server" });
    }
  });

  fastify.delete("/*", { preHandler: [verifyAdmin] }, async (request, reply) => {
    // request.params['*'] grabs everything after /api/photos/
    const storagePath = (request.params as { "*": string })["*"];

    // Resolve absolute path on Mikrus disk
    const filePath = path.join(__dirname, "../../uploads", storagePath);

    try {
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return { message: "File deleted successfully from local storage" };
      } else {
        /**
         * PROFESSIONAL LOGIC: If file is not found on Mikrus,
         * it might be an old Firebase Storage file.
         * We return 200 or 404 based on your preference,
         * but 200 is safer to allow Firestore deletion to proceed.
         */
        fastify.log.warn(`File not found on disk: ${filePath}. Might be legacy Firebase asset.`);
        return reply.status(200).send({
          message: "File not on Mikrus disk, proceeding with cleanup.",
        });
      }
    } catch (err) {
      fastify.log.error(err);
      return reply.status(500).send({ error: "Failed to process file deletion" });
    }
  });
}
