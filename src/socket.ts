import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { RedisManager } from "./redis.js";
import { CodeExecutor } from "./executor.js";
import { PrismaClient } from "@prisma/client";
import type {
    WebSocketMessage,
    ServerMessage,
    BattleState,
    PlayerInfo,
    SubmissionStats,
    QuestionData,
} from "./types.js";

interface UserConnection {
    userId: string;
    ws: WebSocket;
}

interface BattleRoom {
    roomId: string;
    player1Id: string;
    player2Id: string;
    player1Data: PlayerData;
    player2Data: PlayerData;
    battleState: BattleState;
    startTime: number;
    question?: QuestionData;
    questionId?: number;
    votes?: Record<string, "EASY" | "MEDIUM" | "HARD">;
}

interface PlayerData {
    userId: string;
    username: string;
    elo: number;
    submission?: {
        code: string;
        language: string;
        submissionTime: number;
        executionTime: number;
        output: string;
        error?: string;
        testsPassed: number;
        totalTests: number;
        passed: boolean;
    };
}

export class SocketManager {
    private static instance: SocketManager;
    private wss: WebSocketServer;
    private users: Map<string, WebSocket>; // userId -> ws
    private userInfo: Map<string, { username: string; elo: number }>; // userId -> user info
    private rooms: Map<string, Set<string>>; // roomId -> Set of userIds
    private battleRooms: Map<string, BattleRoom>; // roomId -> BattleRoom
    private executor: CodeExecutor;
    private prisma: PrismaClient;
    private readonly BATTLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
    private readonly BATTLE_CHECK_INTERVAL = 1000; // 1 second

    private constructor(server: Server) {
        this.wss = new WebSocketServer({ server });
        this.users = new Map();
        this.userInfo = new Map();
        this.rooms = new Map();
        this.battleRooms = new Map();
        this.executor = CodeExecutor.getInstance();
        this.prisma = new PrismaClient({
            log: ['error'],
        });
        this.init();
    }

    public static getInstance(server?: Server): SocketManager {
        if (!SocketManager.instance && server) {
            SocketManager.instance = new SocketManager(server);
        }
        return SocketManager.instance;
    }

    private init() {
        this.wss.on("connection", (ws: WebSocket) => {
            console.log("New WebSocket connection");

            ws.on("message", async (data: string) => {
                try {
                    const message = JSON.parse(data.toString()) as WebSocketMessage;
                    await this.handleMessage(ws, message);
                } catch (e) {
                    console.error("Error parsing message", e);
                    this.sendError(ws, "PARSE_ERROR", "Failed to parse message");
                }
            });

            ws.on("close", () => {
                this.handleDisconnect(ws);
            });

            ws.on("error", (error) => {
                console.error("WebSocket error:", error);
            });
        });
    }

    private async handleMessage(ws: WebSocket, message: WebSocketMessage) {
        const { type, payload } = message;

        try {
            switch (type) {
                case "AUTH":
                    await this.handleAuth(ws, payload);
                    break;

                case "JOIN_MATCHMAKING":
                    await this.handleJoinMatchmaking(ws, payload);
                    break;

                case "JOIN_ROOM":
                    await this.handleJoinRoom(ws, payload);
                    break;

                case "SET_VOTE":
                    await this.handleSetVote(ws, payload);
                    break;

                case "RUN_CODE":
                    await this.handleRunCode(ws, payload);
                    break;

                case "SUBMIT_CODE":
                    await this.handleCodeSubmission(ws, payload);
                    break;

                case "CHAT":
                    await this.handleChat(ws, payload);
                    break;

                default:
                    this.sendError(ws, "UNKNOWN_MESSAGE_TYPE", `Unknown message type: ${type}`);
            }
        } catch (error: any) {
            console.error(`Error handling message type ${type}:`, error);
            this.sendError(ws, "MESSAGE_HANDLER_ERROR", error.message);
        }
    }

    private async handleAuth(ws: WebSocket, payload: any) {
        const { userId, username } = payload;
        if (!userId) {
            this.sendError(ws, "INVALID_AUTH", "userId is required");
            return;
        }

        this.users.set(userId, ws);
        (ws as any).userId = userId;

        const info = {
            username: username || `User_${userId.substring(0, 6)}`,
            elo: 1200,
        };
        this.userInfo.set(userId, info);

        // Update name in any active battle rooms
        this.battleRooms.forEach((room, roomId) => {
            if (room.player1Id === userId) room.player1Data.username = info.username;
            if (room.player2Id === userId) room.player2Data.username = info.username;
            this.broadcastRoomState(roomId);
        });

        console.log(`User ${userId} authenticated as ${info.username}`);
    }

    private async handleJoinMatchmaking(ws: WebSocket, payload: any) {
        const userId = (ws as any).userId;
        if (!userId) {
            this.sendError(ws, "NOT_AUTHENTICATED", "You must authenticate first");
            return;
        }

        const elo = payload.elo || 1200;
        const language = payload.language || "javascript";

        const redis = RedisManager.getInstance();
        await redis.addToQueue(userId, elo);

        // Find a match
        const match = await redis.findMatch(userId, elo);
        if (match) {
            await redis.removeFromQueue(userId);
            await redis.removeFromQueue(match);
            await this.createBattle(userId, match, language);
        }
    }

    private async handleJoinRoom(ws: WebSocket, payload: any) {
        const userId = (ws as any).userId;
        const roomId = payload.roomId;

        if (!userId || !roomId) {
            this.sendError(ws, "INVALID_PARAMS", "userId and roomId are required");
            return;
        }

        // Track room membership
        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, new Set());
        }
        this.rooms.get(roomId)?.add(userId);

        console.log(`User ${userId} joining room ${roomId}. Current occupants:`, Array.from(this.rooms.get(roomId) || []));

        // If no battle room exists yet, try to create one if there are at least 2 people
        let battleRoom = this.battleRooms.get(roomId);
        if (!battleRoom) {
            const occupants = Array.from(this.rooms.get(roomId) || []);
            if (occupants.length >= 2 && occupants[0] && occupants[1]) {
                console.log(`2 users in room ${roomId}, initializing lobby`);
                // Create a waiting room state with voting enabled
                this.battleRooms.set(roomId, {
                    roomId,
                    player1Id: occupants[0],
                    player2Id: occupants[1],
                    player1Data: {
                        userId: occupants[0],
                        username: this.userInfo.get(occupants[0])?.username || `User_${occupants[0].substring(0, 6)}`,
                        elo: this.userInfo.get(occupants[0])?.elo || 1200,
                    },
                    player2Data: {
                        userId: occupants[1],
                        username: this.userInfo.get(occupants[1])?.username || `User_${occupants[1].substring(0, 6)}`,
                        elo: this.userInfo.get(occupants[1])?.elo || 1200,
                    },
                    battleState: {
                        roomId,
                        status: "WAITING",
                        startTime: Date.now(),
                    },
                    startTime: Date.now(),
                    votes: {},
                });
            }
        }

        // Broadcast current state to everyone in the room to ensure consistency
        this.broadcastRoomState(roomId);

        console.log(`User ${userId} joined room ${roomId}`);
    }

    private broadcastRoomState(roomId: string) {
        const battleRoom = this.battleRooms.get(roomId);
        const occupants = Array.from(this.rooms.get(roomId) || []);

        if (battleRoom) {
            const player1Info: PlayerInfo = {
                userId: battleRoom.player1Id,
                username: battleRoom.player1Data.username,
                elo: battleRoom.player1Data.elo,
                isReady: true,
                hasSubmitted: !!battleRoom.player1Data.submission,
                ...(battleRoom.player1Data.submission ? {
                    submissionTime: battleRoom.player1Data.submission.submissionTime,
                    executionTime: battleRoom.player1Data.submission.executionTime,
                    testsPassed: battleRoom.player1Data.submission.testsPassed,
                    totalTests: battleRoom.player1Data.submission.totalTests,
                } : {}),
            };

            const player2Info: PlayerInfo = {
                userId: battleRoom.player2Id,
                username: battleRoom.player2Data.username,
                elo: battleRoom.player2Data.elo,
                isReady: true,
                hasSubmitted: !!battleRoom.player2Data.submission,
                ...(battleRoom.player2Data.submission ? {
                    submissionTime: battleRoom.player2Data.submission.submissionTime,
                    executionTime: battleRoom.player2Data.submission.executionTime,
                    testsPassed: battleRoom.player2Data.submission.testsPassed,
                    totalTests: battleRoom.player2Data.submission.totalTests,
                } : {}),
            };

            this.sendToRoom(roomId, {
                type: "ROOM_STATE",
                payload: {
                    roomId,
                    battleState: battleRoom.battleState,
                    players: [player1Info, player2Info],
                    question: battleRoom.question,
                    votes: battleRoom.votes,
                },
            } as any);
        } else {
            // Send WAITING state with ALL current occupants
            const playersInfo = occupants.map(id => {
                const info = this.userInfo.get(id) || { username: `User_${id.substring(0, 6)}`, elo: 1200 };
                return {
                    userId: id,
                    username: info.username,
                    elo: info.elo,
                    isReady: true,
                    hasSubmitted: false
                };
            });

            this.sendToRoom(roomId, {
                type: "ROOM_STATE",
                payload: {
                    roomId,
                    battleState: { roomId, status: "WAITING", startTime: Date.now() },
                    players: playersInfo,
                    question: null
                },
            } as any);
        }
    }

    private async createManualBattle(roomId: string, player1Id: string, player2Id: string, difficulty: "EASY" | "MEDIUM" | "HARD" = "EASY") {
        try {
            // Fetch random question of the chosen difficulty
            const questions = await this.prisma.question.findMany({
                where: { difficulty }
            });

            if (questions.length === 0) {
                console.error(`No questions found for difficulty: ${difficulty}`);
                this.sendToRoom(roomId, {
                    type: "ERROR",
                    payload: { code: "NO_QUESTIONS", message: `No ${difficulty} questions available.` }
                } as any);
                return;
            }

            const selectedQuestion: any = questions[Math.floor(Math.random() * questions.length)];

            if (!selectedQuestion) {
                console.error(`Failed to select a question for difficulty: ${difficulty}`);
                return;
            }

            const player1Username = this.userInfo.get(player1Id)?.username || `User_${player1Id.substring(0, 6)}`;
            const player2Username = this.userInfo.get(player2Id)?.username || `User_${player2Id.substring(0, 6)}`;
            const player1Elo = this.userInfo.get(player1Id)?.elo || 1200;
            const player2Elo = this.userInfo.get(player2Id)?.elo || 1200;

            const startTime = Date.now();

            const battleRoom: BattleRoom = {
                roomId,
                player1Id,
                player2Id,
                player1Data: {
                    userId: player1Id,
                    username: player1Username,
                    elo: player1Elo,
                },
                player2Data: {
                    userId: player2Id,
                    username: player2Username,
                    elo: player2Elo,
                },
                battleState: {
                    roomId,
                    status: "IN_PROGRESS",
                    startTime,
                },
                startTime,
                questionId: selectedQuestion.id,
                question: {
                    id: selectedQuestion.id,
                    title: selectedQuestion.title,
                    prompt: selectedQuestion.prompt,
                    difficulty: selectedQuestion.difficulty as any,
                    examples: selectedQuestion.examples as any,
                    testCases: selectedQuestion.testCases as any,
                    starterCode: selectedQuestion.starterCode as any
                }
            };

            this.battleRooms.set(roomId, battleRoom);
            console.log(`Battle created for room ${roomId} with question: ${selectedQuestion.title}`);
            
            // Set battle timeout
            setTimeout(() => this.timeoutBattle(roomId), this.BATTLE_TIMEOUT);
        } catch (error) {
            console.error("Error creating manual battle:", error);
        }
    }

    private async handleSetVote(ws: WebSocket, payload: any) {
        const userId = (ws as any).userId;
        const { roomId, difficulty } = payload;

        if (!userId || !roomId || !difficulty) {
            this.sendError(ws, "INVALID_PARAMS", "roomId and difficulty are required");
            return;
        }

        const battleRoom = this.battleRooms.get(roomId);
        if (!battleRoom) return;

        if (!battleRoom.votes) battleRoom.votes = {};
        battleRoom.votes[userId] = difficulty;

        // Broadcast update
        this.sendToRoom(roomId, {
            type: "VOTE_UPDATE",
            payload: { votes: battleRoom.votes }
        } as any);

        // Check for consensus
        const votes = Object.values(battleRoom.votes);
        if (votes.length >= 2) {
            const allSame = votes.every(v => v === votes[0]);
            if (allSame) {
                console.log(`Consensus reached for ${votes[0]} in room ${roomId}`);
                await this.createManualBattle(roomId, battleRoom.player1Id, battleRoom.player2Id, votes[0]);
                this.broadcastRoomState(roomId);
            }
        }
    }

    private async handleRunCode(ws: WebSocket, payload: any) {
        const userId = (ws as any).userId;
        const { roomId, code, language } = payload;
        console.log(`[SOCKET] Received code run request from ${userId} for room ${roomId} (${language})`);

        if (!userId || !roomId || !code || !language) {
            this.sendError(ws, "INVALID_PARAMS", "roomId, code, and language are required");
            return;
        }

        const battleRoom = this.battleRooms.get(roomId);
        if (!battleRoom) {
            this.sendError(ws, "BATTLE_NOT_FOUND", `Battle room ${roomId} not found`);
            return;
        }

        try {
            // Priority 1: Use non-hidden testCases from the database
            // Priority 2: Fallback to examples if no testCases exist
            let testCasesToRun: any[] = [];
            
            if (battleRoom.question?.testCases && battleRoom.question.testCases.length > 0) {
                testCasesToRun = battleRoom.question.testCases
                    .filter(tc => !tc.isHidden)
                    .map(tc => ({
                        input: tc.input,
                        expectedOutput: tc.expectedOutput
                    }));
            }
            
            // If still no test cases, fallback to examples
            if (testCasesToRun.length === 0 && battleRoom.question?.examples) {
                testCasesToRun = battleRoom.question.examples.map(ex => ({
                    input: ex.input,
                    expectedOutput: ex.output
                }));
            }

            if (testCasesToRun.length === 0) {
                this.sendError(ws, "NO_TEST_CASES", "No test cases available to run.");
                return;
            }

            const results = await this.executor.executeTestCases(code, language, testCasesToRun as any);
            
            const testsPassed = results.filter(r => r.passed).length;
            const totalTests = results.length;
            const passedAllTests = testsPassed === totalTests && totalTests > 0;
            const totalExecutionTime = results.reduce((acc, r) => acc + (r.time || 0), 0);

            const runResult = {
                type: "RUN_RESULT",
                payload: {
                    userId,
                    roomId,
                    success: passedAllTests,
                    testResults: results,
                    time: totalExecutionTime,
                    testsPassed,
                    totalTests,
                },
            };

            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(runResult));
            }
        } catch (error: any) {
            this.sendError(ws, "EXECUTION_ERROR", error.message);
        }
    }

    private async handleCodeSubmission(ws: WebSocket, payload: any) {
        const userId = (ws as any).userId;
        const { roomId, code, language } = payload;
        console.log(`[SOCKET] Received code submission from ${userId} for room ${roomId} (${language})`);

        if (!userId || !roomId || !code || !language) {
            this.sendError(ws, "INVALID_PARAMS", "roomId, code, and language are required");
            return;
        }

        const battleRoom = this.battleRooms.get(roomId);
        if (!battleRoom) {
            this.sendError(ws, "BATTLE_NOT_FOUND", `Battle room ${roomId} not found`);
            return;
        }

        if (battleRoom.battleState.status !== "IN_PROGRESS") {
            this.sendError(ws, "BATTLE_NOT_IN_PROGRESS", "Battle is not in progress");
            return;
        }

        // Check if user is in battle
        if (userId !== battleRoom.player1Id && userId !== battleRoom.player2Id) {
            this.sendError(ws, "NOT_IN_BATTLE", "You are not in this battle");
            return;
        }

        // Skip if already submitted
        const playerData =
            userId === battleRoom.player1Id ? battleRoom.player1Data : battleRoom.player2Data;
        if (playerData.submission) {
            this.sendError(ws, "ALREADY_SUBMITTED", "You have already submitted code");
            return;
        }

        // Execute code against all test cases
        const submissionTime = Date.now() - battleRoom.startTime;
        console.log(`[SOCKET] Starting final submission for ${userId}. Found ${battleRoom.question?.testCases?.length || 0} total test cases.`);
        try {
            // Final submission uses ALL test cases (including hidden ones)
            const testCases = battleRoom.question?.testCases || [];
            const results = await this.executor.executeTestCases(code, language, testCases as any);
            
            const testsPassed = results.filter(r => r.passed).length;
            const totalTests = results.length;
            const passedAllTests = testsPassed === totalTests && totalTests > 0;
            const totalExecutionTime = results.reduce((acc, r) => acc + (r.time || 0), 0);

            const submission = {
                code: code as string,
                language: language as string,
                submissionTime,
                executionTime: totalExecutionTime,
                testResults: results,
                testsPassed,
                totalTests,
                passed: passedAllTests,
            };

            // Update player data
            playerData.submission = submission as any;

            // Broadcast submission result
            this.sendToRoom(roomId, {
                type: "SUBMISSION_RESULT",
                payload: {
                    userId,
                    roomId,
                    success: passedAllTests,
                    testResults: results,
                    time: totalExecutionTime,
                    testsPassed,
                    totalTests,
                    passedAllTests,
                    submissionTime,
                },
            } as any);

            // Check if battle should end
            await this.checkBattleCompletion(roomId, battleRoom);
        } catch (error: any) {
            this.sendError(ws, "EXECUTION_ERROR", error.message);
        }
    }

    private async handleChat(ws: WebSocket, payload: any) {
        const userId = (ws as any).userId;
        const { roomId, message: msg } = payload;

        if (!userId || !roomId || !msg) {
            this.sendError(ws, "INVALID_PARAMS", "roomId and message are required");
            return;
        }

        const userInfo = this.userInfo.get(userId) || { username: "Unknown", elo: 1200 };

        this.sendToRoom(roomId, {
            type: "CHAT_MESSAGE",
            payload: {
                userId,
                username: userInfo.username,
                message: msg,
                timestamp: Date.now(),
            },
        } as ServerMessage);
    }

    private async createBattle(player1Id: string, player2Id: string, language: string) {
        try {
            // Use mock user info (TODO: Fetch from database using Prisma)
            const player1Username = this.userInfo.get(player1Id)?.username || `User_${player1Id.substring(0, 6)}`;
            const player2Username = this.userInfo.get(player2Id)?.username || `User_${player2Id.substring(0, 6)}`;
            const player1Elo = this.userInfo.get(player1Id)?.elo || 1200;
            const player2Elo = this.userInfo.get(player2Id)?.elo || 1200;

            const roomId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const startTime = Date.now();

            const battleRoom: BattleRoom = {
                roomId,
                player1Id,
                player2Id,
                player1Data: {
                    userId: player1Id,
                    username: player1Username,
                    elo: player1Elo,
                },
                player2Data: {
                    userId: player2Id,
                    username: player2Username,
                    elo: player2Elo,
                },
                battleState: {
                    roomId,
                    status: "IN_PROGRESS",
                    startTime,
                },
                startTime,
                questionId: 1, // TODO: Select random question
            };

            // TODO: Fetch actual question from database
            // For now, use a sample question
            battleRoom.question = {
                id: 1,
                title: "Hello World",
                prompt: 'Write a function that prints "Hello Code Clash!" to the console.',
                difficulty: "EASY",
                examples: [
                    {
                        input: "",
                        output: "Hello Code Clash!",
                        explanation: "Simply print the message",
                    },
                ],
                testCases: [
                    {
                        id: "test_1",
                        input: "",
                        expectedOutput: "Hello Code Clash!",
                    },
                ],
            };

            this.battleRooms.set(roomId, battleRoom);
            this.rooms.set(roomId, new Set([player1Id, player2Id]));

            // Send match found to both players
            const player1Ws = this.users.get(player1Id);
            const player2Ws = this.users.get(player2Id);

            const matchFoundMsg: ServerMessage = {
                type: "MATCH_FOUND",
                payload: {
                    roomId,
                    opponentId: player2Id,
                    questionId: battleRoom.questionId || 1,
                    timeLimit: 15 * 60, // 15 minutes
                },
            };

            player1Ws?.send(JSON.stringify(matchFoundMsg));
            player2Ws?.send(
                JSON.stringify({
                    ...matchFoundMsg,
                    payload: {
                        ...matchFoundMsg.payload,
                        opponentId: player1Id,
                    },
                })
            );

            // Set battle timeout
            setTimeout(() => this.timeoutBattle(roomId), this.BATTLE_TIMEOUT);

            console.log(`Battle created: ${roomId} (${player1Id} vs ${player2Id})`);
        } catch (error) {
            console.error("Error creating battle:", error);
        }
    }

    private async checkBattleCompletion(roomId: string, battleRoom: BattleRoom) {
        const { player1Data, player2Data } = battleRoom;

        // 1. Immediate Winner: If current submission passed everything
        if (player1Data.submission?.passed) {
            await this.endBattle(roomId, battleRoom, battleRoom.player1Id, false);
            return;
        }
        if (player2Data.submission?.passed) {
            await this.endBattle(roomId, battleRoom, battleRoom.player2Id, false);
            return;
        }

        // 2. Both have submitted but neither passed everything
        if (player1Data.submission && player2Data.submission) {
            // Determine winner based on tests passed if neither got 100%
            let winnerId: string | undefined;
            const isDraw = player1Data.submission.testsPassed === player2Data.submission.testsPassed;

            if (player1Data.submission.testsPassed > player2Data.submission.testsPassed) {
                winnerId = battleRoom.player1Id;
            } else if (player2Data.submission.testsPassed > player1Data.submission.testsPassed) {
                winnerId = battleRoom.player2Id;
            }

            await this.endBattle(roomId, battleRoom, winnerId, isDraw);
        }
    }

    private async endBattle(
        roomId: string,
        battleRoom: BattleRoom,
        winnerId: string | undefined,
        isDraw: boolean
    ) {
        battleRoom.battleState.status = "COMPLETED";
        battleRoom.battleState.endTime = Date.now();
        if (winnerId) {
            battleRoom.battleState.winnerId = winnerId;
        }
        const durationSeconds = (battleRoom.battleState.endTime - battleRoom.startTime) / 1000;

        const player1Stats = {
            userId: battleRoom.player1Id,
            submissionTime: battleRoom.player1Data.submission?.submissionTime || 0,
            executionTime: battleRoom.player1Data.submission?.executionTime || 0,
            output: battleRoom.player1Data.submission?.output || "",
            testsPassed: battleRoom.player1Data.submission?.testsPassed || 0,
            totalTests: battleRoom.player1Data.submission?.totalTests || 0,
            ...(battleRoom.player1Data.submission?.error ? { error: battleRoom.player1Data.submission.error } : {}),
        } as SubmissionStats;

        const player2Stats = {
            userId: battleRoom.player2Id,
            submissionTime: battleRoom.player2Data.submission?.submissionTime || 0,
            executionTime: battleRoom.player2Data.submission?.executionTime || 0,
            output: battleRoom.player2Data.submission?.output || "",
            testsPassed: battleRoom.player2Data.submission?.testsPassed || 0,
            totalTests: battleRoom.player2Data.submission?.totalTests || 0,
            ...(battleRoom.player2Data.submission?.error ? { error: battleRoom.player2Data.submission.error } : {}),
        } as SubmissionStats;

        // Send battle end message
        this.sendToRoom(roomId, {
            type: "BATTLE_END",
            payload: {
                roomId,
                winnerId,
                isDraw,
                player1Stats,
                player2Stats,
                durationSeconds,
            },
        } as ServerMessage);

        // TODO: Save battle result to database

        // Clean up
        this.battleRooms.delete(roomId);
        this.rooms.delete(roomId);

        console.log(`Battle ended: ${roomId} (Winner: ${winnerId || "Draw"})`);
    }

    private timeoutBattle(roomId: string) {
        const battleRoom = this.battleRooms.get(roomId);
        if (battleRoom && battleRoom.battleState.status === "IN_PROGRESS") {
            console.log(`Battle ${roomId} timed out`);
            this.endBattle(
                roomId,
                battleRoom,
                undefined,
                true // Mark as draw on timeout
            );
        }
    }

    private handleDisconnect(ws: WebSocket) {
        const userId = (ws as any).userId;
        if (userId) {
            // Only remove from users map if this is the active connection
            if (this.users.get(userId) === ws) {
                this.users.delete(userId);
                
                // Remove from all rooms
                this.rooms.forEach((occupants, roomId) => {
                    if (occupants.has(userId)) {
                        occupants.delete(userId);
                        console.log(`User ${userId} removed from room ${roomId}`);
                        
                        // If battle is in progress, declare the other user winner
                        const battleRoom = this.battleRooms.get(roomId);
                        if (battleRoom && (battleRoom.battleState.status === "IN_PROGRESS" || battleRoom.battleState.status === "WAITING")) {
                            const remainingPlayerId = battleRoom.player1Id === userId ? battleRoom.player2Id : battleRoom.player1Id;
                            console.log(`Battle ${roomId} ending due to disconnect. Winner: ${remainingPlayerId}`);
                            
                            if (battleRoom.battleState.status === "IN_PROGRESS") {
                                this.endBattle(roomId, battleRoom, remainingPlayerId, false);
                            } else {
                                this.battleRooms.delete(roomId);
                                this.broadcastRoomState(roomId);
                            }
                        } else {
                            this.broadcastRoomState(roomId);
                        }
                    }
                });
            }
            RedisManager.getInstance().removeFromQueue(userId);
            console.log(`User ${userId} disconnected`);
        }
    }

    private sendToRoom(roomId: string, message: ServerMessage) {
        const roomUsers = this.rooms.get(roomId);
        if (roomUsers) {
            const data = JSON.stringify(message);
            roomUsers.forEach((userId) => {
                const ws = this.users.get(userId);
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                }
            });
        }
    }

    private sendError(ws: WebSocket, code: string, message: string) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "ERROR",
                    payload: { code, message },
                })
            );
        }
    }

    public broadcastToRoom(roomId: string, message: any) {
        this.sendToRoom(roomId, message);
    }
}

