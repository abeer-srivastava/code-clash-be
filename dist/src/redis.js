import { Redis } from "ioredis";
export class RedisManager {
    constructor() {
        this.client = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    }
    static getInstance() {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }
    getClient() {
        return this.client;
    }
    async addToQueue(userId, elo) {
        await this.client.zadd("matchmaking:queue", elo, userId);
    }
    async removeFromQueue(userId) {
        await this.client.zrem("matchmaking:queue", userId);
    }
    async findMatch(userId, elo, range = 100) {
        const potentialMatches = await this.client.zrangebyscore("matchmaking:queue", elo - range, elo + range);
        const otherMatches = potentialMatches.filter((id) => id !== userId);
        if (otherMatches.length > 0) {
            return otherMatches[0] || null;
        }
        return null;
    }
}
//# sourceMappingURL=redis.js.map