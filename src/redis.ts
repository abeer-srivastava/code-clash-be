import { Redis } from "ioredis";

export class RedisManager {
    private static instance: RedisManager;
    private client: Redis;

    private constructor() {
        this.client = new Redis(process.env.REDIS_URL || "redis://localhost:6379");
    }

    public static getInstance(): RedisManager {
        if (!RedisManager.instance) {
            RedisManager.instance = new RedisManager();
        }
        return RedisManager.instance;
    }

    public getClient(): Redis {
        return this.client;
    }

    public async addToQueue(userId: string, elo: number, language: string = "javascript") {
        const multi = this.client.multi();
        multi.zadd("matchmaking:queue", elo, userId);
        multi.hset("matchmaking:join_times", userId, Date.now().toString());
        multi.hset("matchmaking:languages", userId, language);
        await multi.exec();
    }

    public async removeFromQueue(userId: string) {
        const multi = this.client.multi();
        multi.zrem("matchmaking:queue", userId);
        multi.hdel("matchmaking:join_times", userId);
        multi.hdel("matchmaking:languages", userId);
        await multi.exec();
    }

    public async getUserLanguage(userId: string): Promise<string> {
        return (await this.client.hget("matchmaking:languages", userId)) || "javascript";
    }

    public async getQueue(): Promise<string[]> {
        return await this.client.zrange("matchmaking:queue", 0, -1);
    }

    public async getUserElo(userId: string): Promise<number | null> {
        const elo = await this.client.zscore("matchmaking:queue", userId);
        return elo ? parseFloat(elo) : null;
    }

    public async getUserJoinTime(userId: string): Promise<number | null> {
        const time = await this.client.hget("matchmaking:join_times", userId);
        return time ? parseInt(time) : null;
    }

    public async findMatch(userId: string, elo: number, range: number = 100): Promise<string | null> {
        const potentialMatches = await this.client.zrangebyscore("matchmaking:queue", elo - range, elo + range);
        const otherMatches = potentialMatches.filter((id: string) => id !== userId);
        if (otherMatches.length > 0) {
            return otherMatches[0] || null;
        }
        return null;
    }
}
