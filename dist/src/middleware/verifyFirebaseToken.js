import admin from "../firebaseAdmin.js";
export async function verifyFirebaseToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization || "";
        // Expect header: Authorization: Bearer <idToken>
        const match = authHeader.match(/^Bearer (.*)$/);
        if (!match)
            return res.status(401).json({ error: "No token provided" });
        const idToken = match[1] || "";
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        // decodedToken contains uid, email, name, custom claims, etc.
        req.user = decodedToken;
        return next();
    }
    catch (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}
//# sourceMappingURL=verifyFirebaseToken.js.map