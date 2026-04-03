/**
 * src/config/firebase.ts
 * Firebase Admin SDK initialization for secure backend operations.
 */
import admin from "firebase-admin";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Path to the service account file in the server root
const serviceAccountPath = join(__dirname, "../../service-account.json");
try {
    const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"));
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // You can add databaseURL if you decide to use Realtime Database later
    });
    console.log("Firebase Admin SDK initialized successfully.");
}
catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
    process.exit(1); // Exit if critical config is missing
}
export const auth = admin.auth();
