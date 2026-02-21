declare const router: import("express-serve-static-core").Router;
import { z } from "zod";
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}
export declare const RoomSchema: z.ZodObject<{
    roomName: z.ZodString;
}, z.core.$strip>;
export default router;
//# sourceMappingURL=authRouter.d.ts.map