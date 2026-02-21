import express from "express";
import { verifyFirebaseToken } from "../middleware/verifyFirebaseToken.js";
import prisma from "../ds.js";
const router = express.Router();
import { z } from "zod";
export const RoomSchema = z.object({
    roomName: z.string()
});
router.post("/auth", verifyFirebaseToken, async (req, res) => {
    try {
        const { uid, email, name } = req.user;
        if (!uid || !email) {
            return res.status(400).json({ error: "Missing required user fields" });
        }
        const user = await prisma.user.upsert({
            where: { id: uid },
            update: { email, name },
            create: {
                id: uid,
                email,
                name: name || "",
                password: "", // if not using email/password auth
            },
        });
        res.json(user);
    }
    catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({
            error: "Internal server error",
            message: error?.message || "Unknown error",
            details: process.env.NODE_ENV === "development" ? error?.stack : undefined
        });
    }
});
router.post("/room", verifyFirebaseToken, async (req, res) => {
    const parsedData = RoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log("Room route: validation error", parsedData.error);
        return res.status(400).json({ message: "Provide a valid room name" });
    }
    const userId = req.userId ?? req.user?.uid ?? req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: "User not authenticated by middleware" });
    }
    const slug = String(parsedData.data.roomName).trim();
    if (!slug)
        return res.status(400).json({ message: "Room name cannot be empty" });
    try {
        // check existing first to give a stable response and avoid P2002
        const existing = await prisma.room.findUnique({ where: { slug } });
        if (existing) {
            return res.status(409).json({
                message: "Room already exists with this name",
                roomId: existing.id,
                roomSlug: existing.slug,
            });
        }
        const createdRoom = await prisma.room.create({
            data: {
                slug,
                adminId: userId,
            },
        });
        return res.status(201).json({
            message: "Room created",
            roomId: createdRoom.id,
            roomSlug: createdRoom.slug,
        });
    }
    catch (error) {
        console.error("Error creating room:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    try {
        const room = await prisma.room.findFirst({
            where: { slug },
            // include relations you need here (if you have them)
            // include: { admin: true, chat: true }
        });
        if (!room) {
            return res.status(404).json({ message: "Slug not found" });
        }
        // return the whole room object (200 OK)
        return res.status(200).json(room);
    }
    catch (error) {
        console.error("Error fetching room by slug:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});
router.get("/room/id/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id))
        return res.status(400).json({ message: "Invalid id" });
    try {
        const room = await prisma.room.findUnique({ where: { id } });
        if (!room)
            return res.status(404).json({ message: "Room not found" });
        return res.status(200).json(room);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error" });
    }
});
// TODO: retriving the chats from a db of a particular room is pending to be implemented 
router.get("/chats/:roomId", async (req, res) => {
});
export default router;
//# sourceMappingURL=authRouter.js.map