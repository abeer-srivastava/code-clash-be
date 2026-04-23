import { Redis } from "ioredis";
export declare class RedisManager {
    private static instance;
    private client;
    private constructor();
    static getInstance(): RedisManager;
    getClient(): Redis;
    addToQueue(userId: string, elo: number, language?: string): Promise<void>;
    removeFromQueue(userId: string): Promise<void>;
    getUserLanguage(userId: string): Promise<string>;
    getQueue(): Promise<string[]>;
    getUserElo(userId: string): Promise<number | null>;
    getUserJoinTime(userId: string): Promise<number | null>;
    findMatch(userId: string, elo: number, range?: number): Promise<string | null>;
}
//# sourceMappingURL=redis.d.ts.map