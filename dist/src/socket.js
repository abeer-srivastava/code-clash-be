import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { RedisManager } from "./redis.js";
import { CodeExecutor } from "./executor.js";
import prisma from "./ds.js";
export class SocketManager {
    constructor(server) {
        this.BATTLE_TIMEOUT = 10 * 60 * 1000; // 10 minutes
        this.BATTLE_CHECK_INTERVAL = 1000; // 1 second
        this.MATCHMAKING_INTERVAL = 5000; // 5 seconds
        this.BASE_ELO_RANGE = 100;
        this.ELO_EXPANSION_PER_MINUTE = 50;
        this.wss = new WebSocketServer({ server });
        this.users = new Map();
        this.userInfo = new Map();
        this.rooms = new Map();
        this.battleRooms = new Map();
        this.executor = CodeExecutor.getInstance();
        this.init();
        // Start periodic matchmaking
        setInterval(() => this.runMatchmaking(), this.MATCHMAKING_INTERVAL);
    }
    static getInstance(server) {
        if (!SocketManager.instance && server) {
            SocketManager.instance = new SocketManager(server);
        }
        return SocketManager.instance;
    }
    init() {
        this.wss.on("connection", (ws) => {
            console.log("New WebSocket connection");
            ws.on("message", async (data) => {
                try {
                    const message = JSON.parse(data.toString());
                    await this.handleMessage(ws, message);
                }
                catch (e) {
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
    async handleMessage(ws, message) {
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
                case "CURSOR_MOVE":
                    this.handleCursorMove(ws, payload);
                    break;
                default:
                    this.sendError(ws, "UNKNOWN_MESSAGE_TYPE", `Unknown message type: ${type}`);
            }
        }
        catch (error) {
            console.error(`Error handling message type ${type}:`, error);
            this.sendError(ws, "MESSAGE_HANDLER_ERROR", error.message);
        }
    }
    handleCursorMove(ws, payload) {
        const userId = ws.userId;
        const { roomId, line, ch } = payload;
        if (!userId || !roomId)
            return;
        // Broadcast to other users in the room
        this.sendToRoom(roomId, {
            type: "CURSOR_MOVE",
            payload: { roomId, userId, line, ch }
        }, userId);
    }
    async handleAuth(ws, payload) {
        const { userId, username } = payload;
        if (!userId) {
            this.sendError(ws, "INVALID_AUTH", "userId is required");
            return;
        }
        this.users.set(userId, ws);
        ws.userId = userId;
        const info = {
            username: username || `User_${userId.substring(0, 6)}`,
            elo: 1200,
        };
        this.userInfo.set(userId, info);
        // Update name in any active battle rooms
        this.battleRooms.forEach((room, roomId) => {
            if (room.player1Id === userId)
                room.player1Data.username = info.username;
            if (room.player2Id === userId)
                room.player2Data.username = info.username;
            this.broadcastRoomState(roomId);
        });
        console.log(`User ${userId} authenticated as ${info.username}`);
    }
    async handleJoinMatchmaking(ws, payload) {
        const userId = ws.userId;
        if (!userId) {
            this.sendError(ws, "NOT_AUTHENTICATED", "You must authenticate first");
            return;
        }
        const elo = payload.elo || 1200;
        const language = payload.language || "javascript";
        console.log(`[MATCHMAKING] User ${userId} joining queue with ELO ${elo} (${language})`);
        const redis = RedisManager.getInstance();
        await redis.addToQueue(userId, elo, language);
        // Try to find a match immediately for better UX
        const match = await redis.findMatch(userId, elo, this.BASE_ELO_RANGE);
        if (match) {
            console.log(`[MATCHMAKING] Immediate match found for ${userId}: ${match}`);
            await redis.removeFromQueue(userId);
            await redis.removeFromQueue(match);
            await this.createBattle(userId, match, language);
        }
        else {
            // Notify user they are in queue
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "IN_QUEUE",
                    payload: { elo, message: "Searching for opponents..." }
                }));
            }
        }
    }
    async handleJoinRoom(ws, payload) {
        const userId = ws.userId;
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
    broadcastRoomState(roomId) {
        const battleRoom = this.battleRooms.get(roomId);
        const occupants = Array.from(this.rooms.get(roomId) || []);
        if (battleRoom) {
            const player1Info = {
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
            const player2Info = {
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
            });
        }
        else {
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
            });
        }
    }
    async createManualBattle(roomId, player1Id, player2Id, difficulty = "EASY") {
        try {
            // Fetch random question of the chosen difficulty
            const questions = await prisma.question.findMany({
                where: { difficulty }
            });
            if (questions.length === 0) {
                console.error(`No questions found for difficulty: ${difficulty}`);
                this.sendToRoom(roomId, {
                    type: "ERROR",
                    payload: { code: "NO_QUESTIONS", message: `No ${difficulty} questions available.` }
                });
                return;
            }
            const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
            if (!selectedQuestion) {
                console.error(`Failed to select a question for difficulty: ${difficulty}`);
                return;
            }
            const player1Username = this.userInfo.get(player1Id)?.username || `User_${player1Id.substring(0, 6)}`;
            const player2Username = this.userInfo.get(player2Id)?.username || `User_${player2Id.substring(0, 6)}`;
            const player1Elo = this.userInfo.get(player1Id)?.elo || 1200;
            const player2Elo = this.userInfo.get(player2Id)?.elo || 1200;
            const startTime = Date.now();
            const battleRoom = {
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
                    difficulty: selectedQuestion.difficulty,
                    examples: selectedQuestion.examples,
                    testCases: selectedQuestion.testCases,
                    starterCode: selectedQuestion.starterCode
                }
            };
            this.battleRooms.set(roomId, battleRoom);
            console.log(`Battle created for room ${roomId} with question: ${selectedQuestion.title}`);
            // Set battle timeout
            setTimeout(() => this.timeoutBattle(roomId), this.BATTLE_TIMEOUT);
        }
        catch (error) {
            console.error("Error creating manual battle:", error);
        }
    }
    async handleSetVote(ws, payload) {
        const userId = ws.userId;
        const { roomId, difficulty } = payload;
        if (!userId || !roomId || !difficulty) {
            this.sendError(ws, "INVALID_PARAMS", "roomId and difficulty are required");
            return;
        }
        const battleRoom = this.battleRooms.get(roomId);
        if (!battleRoom)
            return;
        if (!battleRoom.votes)
            battleRoom.votes = {};
        battleRoom.votes[userId] = difficulty;
        // Broadcast update
        this.sendToRoom(roomId, {
            type: "VOTE_UPDATE",
            payload: { votes: battleRoom.votes }
        });
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
    async handleRunCode(ws, payload) {
        const userId = ws.userId;
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
            // Broadcast that user is running tests
            this.sendToRoom(roomId, {
                type: "OPPONENT_PROGRESS",
                payload: { userId, roomId, activity: "RUNNING" }
            }, userId);
            // Priority 1: Use non-hidden testCases from the database
            // Priority 2: Fallback to examples if no testCases exist
            let testCasesToRun = [];
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
            const results = await this.executor.executeTestCases(code, language, testCasesToRun, battleRoom.question);
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
            // Broadcast results to opponent
            this.sendToRoom(roomId, {
                type: "OPPONENT_PROGRESS",
                payload: {
                    userId,
                    roomId,
                    activity: "IDLE",
                    testsPassed,
                    totalTests,
                    success: passedAllTests
                }
            }, userId);
        }
        catch (error) {
            this.sendError(ws, "EXECUTION_ERROR", error.message);
        }
    }
    async handleCodeSubmission(ws, payload) {
        const userId = ws.userId;
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
        const playerData = userId === battleRoom.player1Id ? battleRoom.player1Data : battleRoom.player2Data;
        if (playerData.submission) {
            this.sendError(ws, "ALREADY_SUBMITTED", "You have already submitted code");
            return;
        }
        // Execute code against all test cases
        const submissionTime = Date.now() - battleRoom.startTime;
        console.log(`[SOCKET] Starting final submission for ${userId}. Found ${battleRoom.question?.testCases?.length || 0} total test cases.`);
        // Broadcast starting submission
        this.sendToRoom(roomId, {
            type: "OPPONENT_PROGRESS",
            payload: { userId, roomId, activity: "SUBMITTING" }
        }, userId);
        try {
            // Final submission uses ALL test cases (including hidden ones)
            const testCases = battleRoom.question?.testCases || [];
            const results = await this.executor.executeTestCases(code, language, testCases, battleRoom.question);
            const testsPassed = results.filter(r => r.passed).length;
            const totalTests = results.length;
            const passedAllTests = testsPassed === totalTests && totalTests > 0;
            const totalExecutionTime = results.reduce((acc, r) => acc + (r.time || 0), 0);
            // Broadcast results to opponent
            this.sendToRoom(roomId, {
                type: "OPPONENT_PROGRESS",
                payload: {
                    userId,
                    roomId,
                    activity: "IDLE",
                    testsPassed,
                    totalTests,
                    success: passedAllTests
                }
            }, userId);
            const submission = {
                code: code,
                language: language,
                submissionTime,
                executionTime: totalExecutionTime,
                testResults: results,
                testsPassed,
                totalTests,
                passed: passedAllTests,
            };
            // Update player data
            playerData.submission = submission;
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
            });
            // Check if battle should end
            await this.checkBattleCompletion(roomId, battleRoom);
        }
        catch (error) {
            this.sendError(ws, "EXECUTION_ERROR", error.message);
        }
    }
    async handleChat(ws, payload) {
        const userId = ws.userId;
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
        });
    }
    async createBattle(player1Id, player2Id, language) {
        try {
            // Fetch random EASY question by default for matchmaking
            const difficulty = "EASY";
            const questions = await prisma.question.findMany({
                where: { difficulty }
            });
            if (questions.length === 0) {
                console.error(`[BATTLE] No questions found for difficulty: ${difficulty}`);
                return;
            }
            const selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
            const player1Username = this.userInfo.get(player1Id)?.username || `User_${player1Id.substring(0, 6)}`;
            const player2Username = this.userInfo.get(player2Id)?.username || `User_${player2Id.substring(0, 6)}`;
            const player1Elo = this.userInfo.get(player1Id)?.elo || 1200;
            const player2Elo = this.userInfo.get(player2Id)?.elo || 1200;
            const roomId = `battle_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            const startTime = Date.now();
            const battleRoom = {
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
                    difficulty: selectedQuestion.difficulty,
                    examples: selectedQuestion.examples,
                    testCases: selectedQuestion.testCases,
                    starterCode: selectedQuestion.starterCode
                }
            };
            this.battleRooms.set(roomId, battleRoom);
            this.rooms.set(roomId, new Set([player1Id, player2Id]));
            // Send match found to both players
            const player1Ws = this.users.get(player1Id);
            const player2Ws = this.users.get(player2Id);
            const matchFoundMsg = {
                type: "MATCH_FOUND",
                payload: {
                    roomId,
                    opponentId: player2Id,
                    questionId: battleRoom.questionId,
                    timeLimit: 15 * 60,
                },
            };
            if (player1Ws && player1Ws.readyState === WebSocket.OPEN) {
                player1Ws.send(JSON.stringify(matchFoundMsg));
            }
            if (player2Ws && player2Ws.readyState === WebSocket.OPEN) {
                player2Ws.send(JSON.stringify({
                    ...matchFoundMsg,
                    payload: {
                        ...matchFoundMsg.payload,
                        opponentId: player1Id,
                    },
                }));
            }
            // Set battle timeout
            setTimeout(() => this.timeoutBattle(roomId), this.BATTLE_TIMEOUT);
            console.log(`[BATTLE] Battle created: ${roomId} (${player1Username} vs ${player2Username}) with question: ${selectedQuestion.title}`);
        }
        catch (error) {
            console.error("[BATTLE] Error creating battle:", error);
        }
    }
    async checkBattleCompletion(roomId, battleRoom) {
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
            let winnerId;
            const isDraw = player1Data.submission.testsPassed === player2Data.submission.testsPassed;
            if (player1Data.submission.testsPassed > player2Data.submission.testsPassed) {
                winnerId = battleRoom.player1Id;
            }
            else if (player2Data.submission.testsPassed > player1Data.submission.testsPassed) {
                winnerId = battleRoom.player2Id;
            }
            await this.endBattle(roomId, battleRoom, winnerId, isDraw);
        }
    }
    async endBattle(roomId, battleRoom, winnerId, isDraw) {
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
        };
        const player2Stats = {
            userId: battleRoom.player2Id,
            submissionTime: battleRoom.player2Data.submission?.submissionTime || 0,
            executionTime: battleRoom.player2Data.submission?.executionTime || 0,
            output: battleRoom.player2Data.submission?.output || "",
            testsPassed: battleRoom.player2Data.submission?.testsPassed || 0,
            totalTests: battleRoom.player2Data.submission?.totalTests || 0,
            ...(battleRoom.player2Data.submission?.error ? { error: battleRoom.player2Data.submission.error } : {}),
        };
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
        });
        // TODO: Save battle result to database
        // Clean up
        this.battleRooms.delete(roomId);
        this.rooms.delete(roomId);
        console.log(`Battle ended: ${roomId} (Winner: ${winnerId || "Draw"})`);
    }
    timeoutBattle(roomId) {
        const battleRoom = this.battleRooms.get(roomId);
        if (battleRoom && battleRoom.battleState.status === "IN_PROGRESS") {
            console.log(`Battle ${roomId} timed out`);
            this.endBattle(roomId, battleRoom, undefined, true // Mark as draw on timeout
            );
        }
    }
    handleDisconnect(ws) {
        const userId = ws.userId;
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
                            }
                            else {
                                this.battleRooms.delete(roomId);
                                this.broadcastRoomState(roomId);
                            }
                        }
                        else {
                            this.broadcastRoomState(roomId);
                        }
                    }
                });
            }
            RedisManager.getInstance().removeFromQueue(userId);
            console.log(`User ${userId} disconnected`);
        }
    }
    sendToRoom(roomId, message, excludeUserId) {
        const roomUsers = this.rooms.get(roomId);
        if (roomUsers) {
            const data = JSON.stringify(message);
            roomUsers.forEach((userId) => {
                if (userId === excludeUserId)
                    return;
                const ws = this.users.get(userId);
                if (ws && ws.readyState === WebSocket.OPEN) {
                    ws.send(data);
                }
            });
        }
    }
    sendError(ws, code, message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: "ERROR",
                payload: { code, message },
            }));
        }
    }
    broadcastToRoom(roomId, message) {
        this.sendToRoom(roomId, message);
    }
    async runMatchmaking() {
        try {
            const redis = RedisManager.getInstance();
            const queue = await redis.getQueue();
            if (queue.length < 2)
                return;
            console.log(`[MATCHMAKING] Checking queue of size ${queue.length}`);
            const matchedUsers = new Set();
            for (const userId of queue) {
                if (matchedUsers.has(userId))
                    continue;
                const elo = await redis.getUserElo(userId);
                const joinTime = await redis.getUserJoinTime(userId);
                if (elo === null || joinTime === null)
                    continue;
                const waitTimeMinutes = (Date.now() - joinTime) / (60 * 1000);
                const currentRange = this.BASE_ELO_RANGE + (waitTimeMinutes * this.ELO_EXPANSION_PER_MINUTE);
                const matchId = await redis.findMatch(userId, elo, currentRange);
                if (matchId && !matchedUsers.has(matchId)) {
                    console.log(`[MATCHMAKING] Found match: ${userId} vs ${matchId} (Range: ${currentRange})`);
                    matchedUsers.add(userId);
                    matchedUsers.add(matchId);
                    const userLang = await redis.getUserLanguage(userId);
                    const matchLang = await redis.getUserLanguage(matchId);
                    // Prefer user's language, fallback to match's, then javascript
                    const finalLang = userLang || matchLang || "javascript";
                    await redis.removeFromQueue(userId);
                    await redis.removeFromQueue(matchId);
                    await this.createBattle(userId, matchId, finalLang);
                }
            }
        }
        catch (error) {
            console.error("[MATCHMAKING] Error in periodic matcher:", error);
        }
    }
}
//# sourceMappingURL=socket.js.map