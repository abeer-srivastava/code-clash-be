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

    public async addToQueue(userId: string, elo: number) {
        await this.client.zadd("matchmaking:queue", elo, userId);
    }

    public async removeFromQueue(userId: string) {
        await this.client.zrem("matchmaking:queue", userId);
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
