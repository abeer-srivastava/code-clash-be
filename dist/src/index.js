import express from "express";
import cors from "cors";
import { createServer } from "http";
import authRouter from "./routes/authRouter.js";
import { SocketManager } from "./socket.js";
const app = express();
const PORT = 3001;
const httpServer = createServer(app);
// Initialize SocketManager
SocketManager.getInstance(httpServer);
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));
app.use(express.json());
app.use("/api/v1", authRouter);
// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
    console.error("Unhandled error:", err);
    res.status(500).json({
        error: "Internal server error",
        message: err?.message || "Unknown error"
    });
});
httpServer.listen(PORT, () => console.log(`server starts at port ${PORT}`));
//# sourceMappingURL=index.js.map