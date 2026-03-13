# ⚙️ Code Clash Backend: The Battle Brain

This is the real-time core for **Code Clash**, responsible for matchmaking, room management, and secure code execution.

## 🏗️ Architecture & System Design

The backend is built as a **State-Authoritative WebSocket Server**. It holds the "Single Source of Truth" for every battle arena and manages all communication between players.

### Core Services
- **`SocketManager` (`src/socket.ts`)**: The central hub. It orchestrates matchmaking, battle room lifecycles, and broadcasts state updates via WebSockets.
- **`CodeExecutor` (`src/executor.ts`)**: A singleton service that interfaces with the **Judge0 API**. It handles language mapping, base64 encoding, and robust error/timeout handling for user code.
- **`RedisManager` (`src/redis.ts`)**: Manages the high-concurrency matchmaking queue using Redis Sorted Sets and ELO-based range matching.
- **`Prisma Service`**: Provides type-safe access to the PostgreSQL database for user profiles, challenge questions, and battle history.

## 🔄 Data Flow (Server-Side)
1. **Matchmaking Pipeline**:
   - `JOIN_MATCHMAKING` event -> Redis Queue -> Periodic Matcher -> `MATCH_FOUND` broadcast.
2. **Battle Interaction**:
   - **Run Request**: Backend executes code only on public test cases and returns results only to the requester.
   - **Submit Request**: Backend executes code on **all** test cases (public + hidden).
3. **Immediate Victory Logic**: If a player's submission passes all tests (including hidden ones), the `SocketManager` immediately updates the state to `COMPLETED` and notifies all players.

## 🛠️ Tech Stack
- **Runtime**: Node.js + TypeScript (ES Modules).
- **Communication**: WebSockets (`ws`).
- **Data Persistence**: PostgreSQL + Prisma ORM.
- **Concurrency & Caching**: Redis (Matchmaking).
- **Sandboxed Execution**: Judge0 CE.

## ⚙️ Development & Setup
1. Install dependencies: `npm install`
2. Generate Prisma Client: `npx prisma generate`
3. Seed the database with questions: `npx ts-node prisma/seed.ts`
4. Start the server: `npm run dev`
