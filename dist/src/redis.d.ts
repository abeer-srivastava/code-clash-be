import { Redis } from "ioredis";
export declare class RedisManager {
    private static instance;
    private client;
    private constructor();
    static getInstance(): RedisManager;
    getClient(): Redis;
    addToQueue(userId: string, elo: number): Promise<void>;
    removeFromQueue(userId: string): Promise<void>;
    findMatch(userId: string, elo: number, range?: number): Promise<string | null>;
}
//# sourceMappingURL=redis.d.ts.map