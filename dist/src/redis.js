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
    async addToQueue(userId, elo, language = "javascript") {
        const multi = this.client.multi();
        multi.zadd("matchmaking:queue", elo, userId);
        multi.hset("matchmaking:join_times", userId, Date.now().toString());
        multi.hset("matchmaking:languages", userId, language);
        await multi.exec();
    }
    async removeFromQueue(userId) {
        const multi = this.client.multi();
        multi.zrem("matchmaking:queue", userId);
        multi.hdel("matchmaking:join_times", userId);
        multi.hdel("matchmaking:languages", userId);
        await multi.exec();
    }
    async getUserLanguage(userId) {
        return (await this.client.hget("matchmaking:languages", userId)) || "javascript";
    }
    async getQueue() {
        return await this.client.zrange("matchmaking:queue", 0, -1);
    }
    async getUserElo(userId) {
        const elo = await this.client.zscore("matchmaking:queue", userId);
        return elo ? parseFloat(elo) : null;
    }
    async getUserJoinTime(userId) {
        const time = await this.client.hget("matchmaking:join_times", userId);
        return time ? parseInt(time) : null;
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