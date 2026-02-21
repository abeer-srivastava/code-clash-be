import type { Request, Response, NextFunction } from "express";
import admin from "../firebaseAdmin.js";
interface AuthedRequest extends Request {
    user?: admin.auth.DecodedIdToken;
}
export declare function verifyFirebaseToken(req: AuthedRequest, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=verifyFirebaseToken.d.ts.map