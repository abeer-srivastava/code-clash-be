

# 📘 Technical Requirements Document (TRD)

## Product Name

**Code Clash**

## Document Version

v1.0

## Author

Abeer Srivastava

## Last Updated

20 Feb 2026

---

# 1. Technical Overview

## 1.1 Purpose

This document defines the **technical architecture, system design, infrastructure, and engineering constraints** required to build and scale Code Clash.

It serves as:

* Engineering implementation guide
* Architecture alignment document
* Infrastructure planning blueprint
* Scalability & security reference

---

# 2. System Architecture

## 2.1 High-Level Architecture

![Image](https://www.peerbits.com/static/6ff22f32c5c02a27fb406f24672a2518/c5b3e/web-application-architecture-and-diagram.png)

![Image](https://substackcdn.com/image/fetch/f_auto%2Cq_auto%3Agood%2Cfl_progressive%3Asteep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5634c993-d806-4857-881d-59efe68fb5e7_1616x1432.png)

![Image](https://cdn.sanity.io/images/sy1jschh/production/20fc31652ed03a5f3374120280d46add9b5214cf-588x455.svg)

![Image](https://cdn.sanity.io/images/sy1jschh/production/ceb9b29b780d666c312d1f3bf6d22b264b513ada-1144x592.jpg?auto=format\&fit=clip\&q=80\&w=3840)

### Architecture Style

Hybrid Architecture:

* Monolithic core (MVP phase)
* Event-driven modules for real-time battles
* Microservice-ready for scaling execution engine

---

## 2.2 Core Components

### 1. Client Application

* React / Next.js SPA
* WebSocket client for real-time updates
* REST API for CRUD operations

### 2. API Gateway

* Central entry point
* Authentication middleware
* Rate limiting
* Logging & request tracing

### 3. Application Server

* Node.js / NestJS
* REST + WebSocket support
* Business logic layer

### 4. Matchmaking Engine

* Redis-backed queue system
* Skill-based pairing algorithm
* Timeout and fallback handling

### 5. Code Execution Engine

* Docker-based isolated containers
* Multi-language support
* Test case runner
* Resource limiter (CPU, memory, timeout)

### 6. Database Layer

* MongoDB / PostgreSQL (core data)
* Redis (caching, queues, session store)

---

# 3. Detailed Technical Design

---

# 3.1 Authentication & Authorization

### Requirements

* JWT-based authentication
* OAuth (Google, GitHub)
* Role-based access control (RBAC)

### Flow

1. User logs in
2. Server issues JWT
3. Client attaches token in headers
4. Middleware validates token

### Security Controls

* Refresh tokens
* Secure HTTP-only cookies
* Rate-limited login endpoints

---

# 3.2 Real-Time Battle System

### Technology

* WebSocket (Socket.IO or native ws)
* Redis Pub/Sub for multi-instance sync

### Flow

1. User enters matchmaking queue
2. Redis stores queue state
3. Matchmaker pairs users
4. Battle room created
5. WebSocket room initiated
6. Timer broadcasted
7. Code submissions validated
8. Winner determined
9. Results persisted

### Edge Case Handling

* User disconnect → Grace period (10 sec)
* Reconnection allowed
* Force auto-submit on timeout

---

# 3.3 Matchmaking Algorithm

### Inputs

* ELO rating
* Win/loss ratio
* Recent activity
* Problem difficulty history

### Matching Rules

* Rating difference threshold (±100 initially)
* Expand threshold if no match found
* Queue timeout: 30 seconds

### Data Structure

Redis Sorted Sets:

```
matchmaking:queue
score = ELO
value = userId
```

---

# 3.4 Code Execution Engine

## 3.4.1 Isolation Strategy

* Docker containers per submission
* No network access
* Limited CPU (1 core)
* Limited memory (512MB)
* Execution timeout (2–5 sec)

## 3.4.2 Execution Flow

1. Submission received
2. Job pushed to execution queue
3. Worker pulls job
4. Container spun up
5. Code compiled & executed
6. Test cases validated
7. Results returned
8. Container destroyed

## 3.4.3 Supported Languages (MVP)

* JavaScript (Node)
* Python
* C++
* Java

---

# 3.5 Database Schema (High-Level)

### Users

* id
* email
* username
* passwordHash
* eloRating
* createdAt

### Battles

* id
* player1Id
* player2Id
* problemId
* winnerId
* duration
* createdAt

### Problems

* id
* title
* description
* difficulty
* tags
* testCases

### Submissions

* id
* userId
* battleId
* language
* status
* executionTime
* memoryUsed

---

# 4. Non-Functional Requirements

---

## 4.1 Performance

* API latency < 200ms
* WebSocket broadcast < 100ms
* Execution response < 3 seconds
* Matchmaking < 3 seconds

---

## 4.2 Scalability Strategy

### Phase 1 (MVP)

* Single app server
* Single Redis instance
* Execution workers horizontally scalable

### Phase 2

* Kubernetes deployment
* Auto-scaling execution workers
* Redis cluster mode
* Load balancer (NGINX)

---

## 4.3 Reliability

* Retry failed executions
* Graceful fallback for WebSocket disconnection
* Circuit breaker for execution service

---

## 4.4 Observability

### Logging

* Winston or Pino
* Structured logs (JSON)

### Monitoring

* Prometheus + Grafana
* Error tracking (Sentry)

### Metrics

* Active battles
* Queue length
* Execution failures
* Avg battle duration

---

# 5. Security Considerations

### 5.1 Execution Security

* Sandboxed containers
* No filesystem access outside sandbox
* Disable networking
* Prevent fork bombs

### 5.2 API Security

* Rate limiting
* CSRF protection
* Input validation
* SQL injection prevention

### 5.3 Anti-Cheating Measures

* Code similarity detection (future)
* Submission rate throttling
* Hidden test cases

---

# 6. DevOps & Infrastructure

---

## 6.1 Environment Setup

### Development

* Docker Compose
* Local MongoDB
* Local Redis

### Production

* AWS / GCP / Azure
* Managed DB (RDS / Atlas)
* Elasticache (Redis)
* CI/CD (GitHub Actions)

---

## 6.2 CI/CD Pipeline

1. PR opened
2. Lint + Unit tests
3. Build Docker image
4. Push to registry
5. Deploy to staging
6. Manual approval → Production

---

# 7. Deployment Strategy

* Blue-Green deployment
* Rolling updates
* Zero-downtime WebSocket handling

---

# 8. Failure Scenarios & Recovery

| Scenario                  | Mitigation              |
| ------------------------- | ----------------------- |
| Execution container crash | Retry job               |
| Redis failure             | Auto-reconnect & backup |
| Battle server crash       | Persist state & resume  |
| High load                 | Auto-scale workers      |

---

# 9. Technical Risks

### 1. High Execution Costs

Mitigation: Batch containers, reuse images, optimize timeouts

### 2. Real-Time Sync Complexity

Mitigation: Redis Pub/Sub + idempotent events

### 3. Security Vulnerabilities

Mitigation: Strict sandboxing & periodic audits

---

# 10. Future Architecture Evolution

* Microservice separation:

  * Auth service
  * Battle service
  * Execution service
* Event streaming (Kafka)
* AI-based coaching service
* Edge caching for global expansion

---

# 11. Engineering Milestones

| Phase   | Timeline | Deliverables                 |
| ------- | -------- | ---------------------------- |
| Phase 1 | 4 weeks  | Core battle system           |
| Phase 2 | 3 weeks  | Matchmaking + Leaderboard    |
| Phase 3 | 4 weeks  | Scalable execution engine    |
| Phase 4 | 2 weeks  | Observability & optimization |

---

# ✅ This TRD Includes

✔ System architecture
✔ Real-time design
✔ Execution sandbox strategy
✔ Scalability model
✔ DevOps pipeline
✔ Security planning
✔ Failure mitigation
✔ Future scaling roadmap

---
