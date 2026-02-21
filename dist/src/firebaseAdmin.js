import admin from "firebase-admin";
import dotenv from "dotenv";
dotenv.config();
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
let privateKey = process.env.FIREBASE_PRIVATE_KEY;
// If privateKey contains escaped newlines (from env), convert them:
if (privateKey)
    privateKey = privateKey.replace(/\\n/g, "\n");
if (!projectId || !clientEmail || !privateKey) {
    throw new Error("Missing Firebase service account environment variables.");
}
admin.initializeApp({
    credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
    }),
});
export default admin;
//# sourceMappingURL=firebaseAdmin.js.map