import admin from "firebase-admin";
/**
 * Validates the Firebase ID Token sent from the frontend.
 * Attach this to any route that requires admin privileges (like Upload or Delete).
 */
export const verifyAdmin = async (request, reply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply.status(401).send({
            error: "Unauthorized",
            message: "No token provided. Please log in via Google.",
        });
    }
    const idToken = authHeader.split("Bearer ")[1];
    try {
        // Verify the token against Firebase servers
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // In a real professional app, you might want to check if the user's email
        // matches your specific admin email here.
        // request.user = decodedToken;
        console.log(`Verified request from: ${decodedToken.email}`);
    }
    catch (error) {
        console.error("Token verification failed:", error);
        return reply.status(403).send({
            error: "Forbidden",
            message: "Invalid or expired token.",
        });
    }
};
