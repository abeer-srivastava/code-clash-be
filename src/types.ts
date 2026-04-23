/**
 * WebSocket Message Types and Interfaces
 * Defines all message contracts between frontend and backend
 */

// ============ AUTHENTICATION ============
export interface AuthMessage {
    type: "AUTH";
    payload: {
        userId: string;
        token?: string;
    };
}

// ============ MATCHMAKING ============
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
        timeLimit?: number; // seconds
    };
}

// ============ ROOM & BATTLE ============
export interface JoinRoomMessage {
    type: "JOIN_ROOM";
    payload: {
        roomId: string;
        userId: string;
    };
}

export interface SetVoteMessage {
    type: "SET_VOTE";
    payload: {
        roomId: string;
        userId: string;
        difficulty: "EASY" | "MEDIUM" | "HARD";
    };
}

export interface VoteUpdateMessage {
    type: "VOTE_UPDATE";
    payload: {
        votes: Record<string, "EASY" | "MEDIUM" | "HARD">;
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

// ============ CODE SUBMISSION ============
export interface RunCodeMessage {
    type: "RUN_CODE";
    payload: {
        roomId: string;
        userId: string;
        code: string;
        language: string;
    };
}

export interface RunCodeResultMessage {
    type: "RUN_RESULT";
    payload: {
        userId: string;
        roomId: string;
        success: boolean;
        output?: string;
        error?: string;
        time: number;
        testsPassed?: number;
        totalTests?: number;
    };
}

export interface SubmitCodeMessage {
    type: "SUBMIT_CODE";
    payload: {
        roomId: string;
        userId: string;
        code: string;
        language: string;
        submissionTime: number; // milliseconds
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
        time: number; // execution time in ms
        testsPassed?: number;
        totalTests?: number;
        passedAllTests: boolean;
        submissionTime: number; // time from battle start
    };
}

// ============ BATTLE STATE ============
export type BattleStatus = "WAITING" | "IN_PROGRESS" | "COMPLETED";

export interface BattleState {
    roomId: string;
    status: BattleStatus;
    startTime: number; // timestamp
    endTime?: number;
    winnerId?: string;
    durationSeconds?: number;
}

// ============ PLAYER INFO ============
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

// ============ QUESTION DATA ============
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
    starterCode?: Record<string, string>;
    timeLimit?: number; // seconds
    memoryLimit?: number; // MB
}

export interface CursorMoveMessage {
    type: "CURSOR_MOVE";
    payload: {
        roomId: string;
        userId: string;
        line: number;
        ch: number;
    };
}

export interface OpponentProgressMessage {
    type: "OPPONENT_PROGRESS";
    payload: {
        userId: string;
        roomId: string;
        activity: "RUNNING" | "SUBMITTING" | "IDLE";
        testsPassed?: number;
        totalTests?: number;
        success?: boolean;
    };
}

// ============ CHAT ============
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

// ============ BATTLE END ============
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
    submissionTime: number; // milliseconds from start
    executionTime: number;
    output: string;
    testsPassed: number;
    totalTests: number;
    error?: string;
}

// ============ DISCONNECT ============
export interface DisconnectMessage {
    type: "DISCONNECT";
    payload: {
        roomId: string;
        userId: string;
        reason?: string;
    };
}

// ============ ERROR MESSAGES ============
export interface ErrorMessage {
    type: "ERROR";
    payload: {
        code: string;
        message: string;
        details?: any;
    };
}

// ============ UNION TYPES ============
export type WebSocketMessage =
    | AuthMessage
    | JoinMatchmakingMessage
    | MatchFoundMessage
    | JoinRoomMessage
    | SetVoteMessage
    | RoomStateMessage
    | RunCodeMessage
    | SubmitCodeMessage
    | SubmissionResultMessage
    | ChatMessage
    | BattleEndMessage
    | DisconnectMessage
    | CursorMoveMessage
    | OpponentProgressMessage
    | ErrorMessage;

export type ServerMessage =
    | MatchFoundMessage
    | RoomStateMessage
    | VoteUpdateMessage
    | RunCodeResultMessage
    | SubmissionResultMessage
    | ChatMessageReceived
    | BattleEndMessage
    | CursorMoveMessage
    | OpponentProgressMessage
    | ErrorMessage;

// ============ DATABASE MODELS ============
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
    submissionTime: number; // ms from battle start
    executionTime: number; // ms to run
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
