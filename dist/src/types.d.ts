/**
 * WebSocket Message Types and Interfaces
 * Defines all message contracts between frontend and backend
 */
export interface AuthMessage {
    type: "AUTH";
    payload: {
        userId: string;
        token?: string;
    };
}
export interface JoinMatchmakingMessage {
    type: "JOIN_MATCHMAKING";
    payload: {
        userId: string;
        elo?: number;
        language?: string;
    };
}
export interface MatchFoundMessage {
    type: "MATCH_FOUND";
    payload: {
        roomId: string;
        opponentId: string;
        questionId: number;
        timeLimit?: number;
    };
}
export interface JoinRoomMessage {
    type: "JOIN_ROOM";
    payload: {
        roomId: string;
        userId: string;
    };
}
export interface RoomStateMessage {
    type: "ROOM_STATE";
    payload: {
        roomId: string;
        battleState: BattleState;
        players: PlayerInfo[];
        question: QuestionData;
    };
}
export interface SubmitCodeMessage {
    type: "SUBMIT_CODE";
    payload: {
        roomId: string;
        userId: string;
        code: string;
        language: string;
        submissionTime: number;
    };
}
export interface SubmissionResultMessage {
    type: "SUBMISSION_RESULT";
    payload: {
        userId: string;
        roomId: string;
        success: boolean;
        output?: string;
        error?: string;
        time: number;
        testsPassed?: number;
        totalTests?: number;
        passedAllTests: boolean;
        submissionTime: number;
    };
}
export type BattleStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";
export interface BattleState {
    roomId: string;
    status: BattleStatus;
    startTime: number;
    endTime?: number;
    winnerId?: string;
    durationSeconds?: number;
}
export interface PlayerInfo {
    userId: string;
    username: string;
    elo: number;
    avatar?: string;
    isReady: boolean;
    hasSubmitted: boolean;
    submissionTime?: number;
    executionTime?: number;
    testsPassed?: number;
    totalTests?: number;
}
export interface QuestionData {
    id: number;
    title: string;
    prompt: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    examples: Array<{
        input: string;
        output: string;
        explanation?: string;
    }>;
    testCases?: Array<{
        id: string;
        input: string;
        expectedOutput: string;
        isHidden?: boolean;
    }>;
    timeLimit?: number;
    memoryLimit?: number;
}
export interface ChatMessage {
    type: "CHAT";
    payload: {
        roomId: string;
        userId: string;
        username: string;
        message: string;
        timestamp: number;
    };
}
export interface ChatMessageReceived {
    type: "CHAT_MESSAGE";
    payload: {
        userId: string;
        username: string;
        message: string;
        timestamp: number;
    };
}
export interface BattleEndMessage {
    type: "BATTLE_END";
    payload: {
        roomId: string;
        winnerId?: string;
        isDraw: boolean;
        player1Stats: SubmissionStats;
        player2Stats: SubmissionStats;
        durationSeconds: number;
    };
}
export interface SubmissionStats {
    userId: string;
    submissionTime: number;
    executionTime: number;
    output: string;
    testsPassed: number;
    totalTests: number;
    error?: string;
}
export interface DisconnectMessage {
    type: "DISCONNECT";
    payload: {
        roomId: string;
        userId: string;
        reason?: string;
    };
}
export interface ErrorMessage {
    type: "ERROR";
    payload: {
        code: string;
        message: string;
        details?: any;
    };
}
export type WebSocketMessage = AuthMessage | JoinMatchmakingMessage | MatchFoundMessage | JoinRoomMessage | RoomStateMessage | SubmitCodeMessage | SubmissionResultMessage | ChatMessage | BattleEndMessage | DisconnectMessage | ErrorMessage;
export type ServerMessage = MatchFoundMessage | RoomStateMessage | SubmissionResultMessage | ChatMessageReceived | BattleEndMessage | ErrorMessage;
export interface Battle {
    id: string;
    roomId: string;
    questionId: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string;
    startedAt: Date;
    endedAt?: Date;
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
    durationSeconds?: number;
}
export interface Submission {
    id: string;
    battleId: string;
    userId: string;
    code: string;
    language: string;
    submissionTime: number;
    executionTime: number;
    output: string;
    error?: string;
    testsPassed: number;
    totalTests: number;
    passed: boolean;
    createdAt: Date;
}
export interface BattleResult {
    battleId: string;
    winnerId?: string;
    isDraw: boolean;
    durationSeconds: number;
    submissions: Submission[];
}
//# sourceMappingURL=types.d.ts.map