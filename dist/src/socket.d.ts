import { Server } from "http";
export declare class SocketManager {
    private static instance;
    private wss;
    private users;
    private userInfo;
    private rooms;
    private battleRooms;
    private executor;
    private readonly BATTLE_TIMEOUT;
    private readonly BATTLE_CHECK_INTERVAL;
    private readonly MATCHMAKING_INTERVAL;
    private readonly BASE_ELO_RANGE;
    private readonly ELO_EXPANSION_PER_MINUTE;
    private constructor();
    static getInstance(server?: Server): SocketManager;
    private init;
    private handleMessage;
    private handleCursorMove;
    private handleAuth;
    private handleJoinMatchmaking;
    private handleJoinRoom;
    private broadcastRoomState;
    private createManualBattle;
    private handleSetVote;
    private handleRunCode;
    private handleCodeSubmission;
    private handleChat;
    private createBattle;
    private checkBattleCompletion;
    private endBattle;
    private timeoutBattle;
    private handleDisconnect;
    private sendToRoom;
    private sendError;
    broadcastToRoom(roomId: string, message: any): void;
    private runMatchmaking;
}
//# sourceMappingURL=socket.d.ts.map