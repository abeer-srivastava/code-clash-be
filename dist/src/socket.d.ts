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
    private constructor();
    static getInstance(server?: Server): SocketManager;
    private init;
    private handleMessage;
    private handleAuth;
    private handleJoinMatchmaking;
    private handleJoinRoom;
    private broadcastRoomState;
    private createManualBattle;
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
}
//# sourceMappingURL=socket.d.ts.map