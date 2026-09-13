# TaskFlow — Phase-Wise Technical Implementation Plan

> **Based on PRD:** [`TaskFlow_AI_DevOps_Phasewise_PRD.md`](file:///d:/EasyTaskiFy/TaskFlow_AI_DevOps_Phasewise_PRD.md)  
> **Target Audience:** Full-Stack & DevOps Engineering Team  
> **Core Strategy:** Progressive Evolution (Build MVP → Containerize → Automate CI/CD → Provision IaC → Scale & Cache → Integrate AI → Orchestrate K8s → Monitor & Hard Security)

---

## Technical Overview & Progressive Evolution Architecture

```
VERSION 1-9: Core Product MVP (React + Node + Express + MongoDB) [COMPLETED]
VERSION 10-11: Containerization & Automation (Docker + Docker Compose + GitHub Actions)
VERSION 12-14: Cloud & Infrastructure (AWS EC2/VPC + Terraform IaC)
VERSION 15-16: Performance & Async Workers (Redis Caching + BullMQ Background Queue)
VERSION 17-23: AI Integration Engine (LLM Structured Outputs + Human-in-the-Loop Task Gen)
VERSION 24-27: Production Orchestration (Kubernetes + HPA + Helm + AWS EKS)
VERSION 28-31: Observability & Security (Prometheus + Grafana + Structured Logs + Security Hardening)
```

---

## 🧭 Role-Based Navigation & Sidebar Architecture (4-Tier Isolation)

TaskFlow uses a tailored 4-tier navigation architecture to present role-appropriate sidebar links, icons, and route paths:

```
[ User Logs In ]
       |
       +---> SUPER_ADMIN ---> [/superadmin/*] (System Dashboard, Workspaces Directory, System Team, Global Projects, Audit & Analytics)
       +---> ADMIN       ---> [/admin/*]      (Workspace Dashboard, My Workspace, Projects, Task Board, Team & Roles, Analytics)
       +---> MANAGER     ---> [/manager/*]    (Manager Dashboard, My Projects, Kanban Task Board, Project Team, Team Analytics)
       +---> MEMBER      ---> [/member/*]     (My Dashboard, My Task Board, Assigned Projects, Team & Activity)
```

### Role Navigation Matrix

| Role | Tailored Sidebar Links | Route Prefix | Permissions & Scope |
|---|---|---|---|
| **SUPER_ADMIN** | System Dashboard, Workspaces Directory, System Team & Roles, Global Projects, Audit & Analytics | `/superadmin` | Unrestricted global access, workspace creation, multi-workspace directory inspection. |
| **ADMIN** | Workspace Dashboard, My Workspace, Projects, Task Board, Team & Roles, Analytics | `/admin` | Workspace administration, project creation, workspace member invitations & role management. |
| **MANAGER** | Manager Dashboard, My Projects, Kanban Task Board, Project Team, Team Analytics | `/manager` | Project operations, sprint/task management, task assignment, team workload. |
| **MEMBER** | My Dashboard, My Task Board, Assigned Projects, Team & Activity | `/member` | Individual task updates, personal Kanban execution, project participation. |

---

# SECTION A: MVP CORE PRODUCT (PHASES 1 – 9) [COMPLETED]

---

## Phase 1 — Project Foundation & Environment Setup

### 🎯 Objective
Establish monorepo/folder architecture, set up frontend React with Tailwind CSS, backend Express API server, MongoDB connection, CORS, and environment variables.

### 🏗 Architecture
```
[React Client (Port 3000/5173)] ---> REST API ---> [Express Server (Port 5000)] ---> [MongoDB (Port 27017)]
```

### 📋 Actionable Tasks
- [x] Initialize git repository with comprehensive `.gitignore` for Node, React, and environment files.
- [x] Create repository folder structure: `client/` and `server/`.
- [x] **Client Setup**:
  - [x] Initialize React app inside `client/`.
  - [x] Install dependencies: `react-router-dom`, `axios`, `@tanstack/react-query`, `lucide-react`.
  - [x] Configure Tailwind CSS, PostCSS, and `tailwind.config.js`.
  - [x] Setup base layout components (Navbar, Sidebar, Main Container).
- [x] **Server Setup**:
  - [x] Initialize `package.json` inside `server/`.
  - [x] Install dependencies: `express`, `mongoose`, `dotenv`, `cors`, `helmet`, `morgan`, `nodemon` (dev).
  - [x] Establish standard directory layout (`config/`, `controllers/`, `middleware/`, `models/`, `routes/`, `services/`, `app.js`).
  - [x] Setup MongoDB Mongoose connection with retry & error handling.
  - [x] Implement global CORS configuration allowing client origin.
  - [x] Add `/api/health` healthcheck endpoint returning `{ status: "ok", timestamp: ISO, uptime: Number }`.

### 🧪 Verification Criteria
- `curl GET http://localhost:5000/api/health` returns `200 OK` with JSON payload.
- Database connection log confirms successful handshake with MongoDB.
- React frontend runs locally with Tailwind styles rendering properly.

---

## Phase 2 — Authentication & Authorization Module

### 🎯 Objective
Implement secure user signup, login, JWT token issuance, password hashing using bcrypt, auth middleware, role-scoped route guards, and session management.

### 🏗 Auth Sequence Flow
```
User -> React Login Form -> POST /api/auth/login -> Express -> Validate Credentials -> bcrypt.compare() -> Generate JWT -> Return Token & User Info -> Stored in Context & LocalStorage
```

### 📋 Actionable Tasks
- [x] **Database Model (`User.js`)**:
  - Schema fields: `name` (string), `email` (unique string, indexed), `passwordHash` (string, select: false), `role` (enum: `SUPER_ADMIN`, `ADMIN`, `MANAGER`, `MEMBER`), `createdAt`, `updatedAt`.
- [x] **Backend API**:
  - `POST /api/auth/register`: Validate email/password inputs, assign appropriate role (`SUPER_ADMIN`, `ADMIN`, `MANAGER`, `MEMBER`), hash password with `bcrypt`, save User.
  - `POST /api/auth/login`: Find user by email, compare password, sign JWT with secret, and auto-correct role if non-superadmin email was wrongly stored.
  - `POST /api/auth/logout`: Invalidate client session token / clear cookies.
  - `GET /api/auth/me`: Decodes JWT from Authorization Header (`Bearer <token>`), performs role self-healing if needed, and returns user profile.
- [x] **Middleware (`authMiddleware.js`)**:
  - Intercept requests, verify Bearer JWT token, attach `req.user` to context, return `401 Unauthorized` on missing/invalid token.
- [x] **Frontend Integration**:
  - AuthContext / State wrapper storing JWT token and user status.
  - Axios interceptor to append JWT header on every outgoing API call.
  - `ProtectedRoute` layout wrapper preventing unauthenticated access to dashboard pages.
  - `RequireRole` route guard protecting routes per role (`/superadmin/*`, `/admin/*`, `/manager/*`, `/member/*`).
  - Role-scoped login redirection logic (`Login.jsx`) preventing post-logout cross-role redirect leaks.
  - Tailored 4-tier role sidebar navigation items (`Sidebar.jsx`).
  - Clean confirmation modal for Logout action with **Yes** / **No** buttons in Sidebar and Navbar.

### 🧪 Verification Criteria
- Cannot register existing email (returns 400 validation error).
- Invalid passwords return 401. Valid login yields signed JWT token.
- Accessing `/api/auth/me` without Bearer token returns 401; with valid token returns user data.
- Logging out clears session token and workspace state cleanly.

---

## Phase 3 — Organization & Team Management

### 🎯 Objective
Enable users to create organizations, manage team members, assign organizational roles (`ADMIN`, `MANAGER`, `MEMBER`), provide global workspace governance for Superadmins, and handle multi-tenant scoping.

### 📋 Actionable Tasks
- [x] **Database Models**:
  - `Organization.js`: `_id`, `name`, `ownerId` (ref: User), `assignedAdminEmail`, `createdAt`, `updatedAt`.
  - `OrganizationMember.js`: `_id`, `organizationId` (ref: Org), `userId` (ref: User), `role` (enum: `ADMIN`, `MANAGER`, `MEMBER`), `createdAt`. Unique compound index on `(organizationId, userId)`.
  - `PendingInvite.js`: Pending invitations tracker.
- [x] **Backend APIs**:
  - `POST /api/organizations`: Create new organization and automatically insert creator as `ADMIN` in `OrganizationMember`.
  - `GET /api/organizations/my`: Fetch organizations the logged-in user belongs to (or all system organizations for Superadmin).
  - `GET /api/organizations/:id/members`: Fetch all members and their roles.
  - `POST /api/organizations/:id/members`: Add user by email to organization with designated role.
  - `DELETE /api/organizations/:id/members/:userId`: Remove user from organization.
- [x] **RBAC Middleware (`checkRole.js`)**:
  - Verify user has required organization role (`ADMIN`, `MANAGER`, `MEMBER`) or global `SUPER_ADMIN` before allowing mutating routes.
- [x] **Frontend Components**:
  - Organization Switcher dropdown in layout header.
  - Team Management view showing member list, role badges, and invitation modal.
  - **Superadmin Workspace Directory (`SuperadminWorkspaces.jsx`)**: Interactive workspace cards with **Enter Workspace & View Team** navigation and fixed **Create Workspace** modal dialog.
  - **Superadmin System Team & Roles (`SuperadminTeam.jsx`)**: All-workspace selector cards, dynamic workspace member directory inspection, and targeted workspace invitations.

### 🧪 Verification Criteria
- Creating an organization automatically establishes `ADMIN` ownership.
- Superadmins can view and enter any system workspace directory.
- Non-Admin members cannot delete members or alter roles (returns 403 Forbidden).

---

## Phase 4 — Project Management Module

### 🎯 Objective
Build full CRUD APIs and UI for multi-project management within an organization, supporting project lifecycles and metadata.

### 📋 Actionable Tasks
- [x] **Database Model (`Project.js`)**:
  - Fields: `_id`, `organizationId`, `name`, `description`, `status` (enum: `PLANNING`, `ACTIVE`, `COMPLETED`, `ARCHIVED`), `ownerId`, `createdAt`, `updatedAt`.
- [x] **Backend APIs**:
  - `POST /api/projects`: Create project under active organization.
  - `GET /api/projects?organizationId=xyz`: List projects scoped to organization.
  - `GET /api/projects/:id`: Get project details.
  - `PATCH /api/projects/:id`: Update project details or status.
  - `DELETE /api/projects/:id`: Archive or delete project.
- [x] **Frontend Integration**:
  - Projects Dashboard grid/list view with status tags across role views (`Superadmin`, `Admin`, `Manager`, `Member`).
  - Create Project modal and Edit Project view.

### 🧪 Verification Criteria
- Projects are strictly scoped to the specified `organizationId`.
- Projects can be transitioned across lifecycle states (`PLANNING` -> `ACTIVE` -> `COMPLETED`).

---

## Phase 5 — Task Management System

### 🎯 Objective
Core task management features: task creation, status updates, priority setting, assignee tagging, due dates, and detailed task views.

### 📋 Actionable Tasks
- [x] **Database Model (`Task.js`)**:
  - Fields: `_id`, `projectId`, `organizationId`, `title`, `description`, `status` (enum: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), `priority` (enum: `LOW`, `MEDIUM`, `HIGH`, `URGENT`), `assigneeId` (ref: User), `createdBy` (ref: User), `dueDate`, `labels` ([string]), `createdAt`, `updatedAt`.
- [x] **Backend APIs**:
  - `POST /api/projects/:projectId/tasks`: Create task.
  - `GET /api/projects/:projectId/tasks`: Query tasks with filtering by status, priority, assignee.
  - `GET /api/tasks/:id`: Get task details.
  - `PATCH /api/tasks/:id`: Update status, priority, description, or assignee.
  - `DELETE /api/tasks/:id`: Delete task.
- [x] **Frontend Integration**:
  - Task List Table view with status pills, priority badges, and due date highlight.
  - Task Modal/Drawer for viewing and editing full details.

### 🧪 Verification Criteria
- Task creation linked to correct `projectId` and `organizationId`.
- Filtering tasks by priority or status yields correct subset.

---

## Phase 6 — Interactive Kanban Board

### 🎯 Objective
Visualize tasks in a 4-column layout (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`) with drag-and-drop status changes and optimistic updates.

### 🏗 Board Layout
```
+----------------+----------------+----------------+----------------+
|     TODO       |  IN PROGRESS   |   IN REVIEW    |      DONE      |
+----------------+----------------+----------------+----------------+
| [Task Card 1]  | [Task Card 3]  | [Task Card 5]  | [Task Card 6]  |
| [Task Card 2]  | [Task Card 4]  |                |                |
+----------------+----------------+----------------+----------------+
```

### 📋 Actionable Tasks
- [x] Frontend integration using `@hello-pangea/dnd` / Kanban component architecture.
- [x] Map task states dynamically into four status columns.
- [x] Implement drag-and-drop handler to dispatch `PATCH /api/tasks/:id` with updated `status`.
- [x] Add optimistic state update so board UI changes instantaneously before server response.
- [x] Roll back optimistic update with error toast if backend update fails.

### 🧪 Verification Criteria
- Dragging a task card from `TODO` to `IN_PROGRESS` updates task status seamlessly in DB.

---

## Phase 7 — Comments & Activity Log System

### 🎯 Objective
Enable task discussions through comments and maintain an immutable audit trail of all project actions.

### 📋 Actionable Tasks
- [x] **Comment Model (`Comment.js`)**:
  - Fields: `_id`, `taskId`, `userId`, `content`, `createdAt`, `updatedAt`.
- [x] **Activity Model (`Activity.js`)**:
  - Fields: `_id`, `organizationId`, `userId`, `action` (`PROJECT_CREATED`, `TASK_CREATED`, `TASK_STATUS_CHANGED`, `TASK_ASSIGNED`, `COMMENT_ADDED`), `entityType`, `entityId`, `metadata` (Object), `createdAt`.
- [x] **Backend APIs**:
  - `POST /api/tasks/:taskId/comments`: Add comment.
  - `GET /api/tasks/:taskId/comments`: List comments chronologically.
  - `GET /api/organizations/:orgId/activities`: Stream activity feed.
- [x] **Activity Trigger Service (`activityService.js`)**:
  - Centralized function called inside controllers whenever a resource is mutated.

### 🧪 Verification Criteria
- Task state changes automatically insert an entry into `activities` collection.
- Comments appear in real-time under task details drawer.

---

## Phase 8 — Metrics & Analytics Dashboard

### 🎯 Objective
Provide high-level visual telemetry on project counts, task status distributions, completion percentages, and overdue warnings.

### 📋 Actionable Tasks
- [x] **Backend Aggregation API**:
  - `GET /api/dashboard/stats?organizationId=xyz`: Aggregate totals:
    - Total Projects, Total Tasks
    - Tasks by status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`)
    - Completion percentage `(DONE / Total) * 100`
    - Overdue tasks (`dueDate < Date.now()` AND `status != DONE`)
- [x] **Frontend Integration**:
  - Summary metric cards with responsive grids.
  - Visual charts and progress indicators for status distribution across all role dashboards (`Superadmin`, `Admin`, `Manager`, `Member`).

### 🧪 Verification Criteria
- Aggregations match exact database counts.
- Overdue counter correctly filters non-completed tasks past due date.

---

## Phase 9 — Production Hardening & Testing

### 🎯 Objective
Harden backend against security vulnerabilities, add rate limiting, input validation, structured error handling, MongoDB indexing, and session cleanup.

### 📋 Actionable Tasks
- [x] **Validation Layer**: Input validation & schema checks on API routes.
- [x] **Security Headers & Rate Limiting**:
  - Configure `helmet()` for security headers.
  - Add rate limiting middleware.
- [x] **Database Performance & Self-Healing**:
  - Add indexes on `User.email`, `Task (projectId, status)`, `OrganizationMember (organizationId, userId)`.
  - Self-healing role sync in `login` and `getMe` controllers for user accounts.
- [x] **Session & UX Hardening**:
  - Clear `taskflow_token` and `taskflow_active_org_id` on logout.
  - Role-validated redirect logic in `Login.jsx`.
  - Streamlined Logout Confirmation Modal dialog (**Yes** / **No**).

### 🧪 Verification Criteria
- Exceeding rate limit returns `429 Too Many Requests`.
- App handles role switching cleanly without state pollution.

---

# SECTION B: CONTAINERIZATION & DEVOPS AUTOMATION (PHASES 10 – 14)

---

## Phase 10 — Containerization with Docker & Docker Compose

### 🎯 Objective
Containerize React client, Express server, and MongoDB into isolated Docker containers orchestrated via Docker Compose.

### 🏗 Container Topology
```
                  [ Docker Compose Network ]
                              |
    +-------------------------+-------------------------+
    |                         |                         |
    v                         v                         v
[ Frontend ]               [ Backend ]              [ MongoDB ]
Node/Nginx:80            Node Express:5000         Mongo DB:27017
```

### 📋 Actionable Tasks
- [ ] Create `server/Dockerfile`:
  - Multi-stage build (Node 20 alpine), `npm ci --only=production`, non-root user setup, EXPOSE 5000.
- [ ] Create `client/Dockerfile`:
  - Build stage: `npm run build` static output.
  - Production stage: Nginx alpine serving static assets on port 80.
- [ ] Create `.dockerignore` for both client and server (exclude `node_modules`, `.env`, logs).
- [ ] Create `docker-compose.yml`:
  ```yaml
  version: '3.8'
  services:
    frontend:
      build: ./client
      ports: ["80:80"]
      depends_on: [backend]
    backend:
      build: ./server
      ports: ["5000:5000"]
      environment:
        - MONGO_URI=mongodb://mongodb:27017/taskflow
      depends_on: [mongodb]
    mongodb:
      image: mongo:7.0
      ports: ["27017:27017"]
      volumes:
        - mongo_data:/data/db
  volumes:
    mongo_data:
  ```

### 🧪 Verification Criteria
- Running `docker compose up --build` spins up all 3 containers without errors.
- App is fully functional via browser on `http://localhost`. Data persists across container restarts via volume.

---

## Phase 11 — CI/CD Pipeline with GitHub Actions

### 🎯 Objective
Automate code linting, automated testing, container image building, and pushing images to container registry on push/PR.

### 🏗 CI/CD Workflow Schema
```
Git Push to main/PR -> GitHub Action Runner -> Lint & Test -> Docker Build -> Tag Image -> Push to ECR / Docker Hub
```

### 📋 Actionable Tasks
- [ ] Create `.github/workflows/ci.yml`:
  - **Job 1: Lint & Test**: Run tests on backend & frontend.
  - **Job 2: Docker Build**: If tests pass, trigger `docker/build-push-action`.
  - Store Docker Hub / AWS credentials safely in GitHub Secrets (`DOCKER_USERNAME`, `DOCKER_PASSWORD`).
- [ ] Add caching for `node_modules` and Docker layers to speed up execution under 3 minutes.

### 🧪 Verification Criteria
- Opening a Pull Request triggers the workflow; status check passes before merge allowed.

---

## Phase 12 — AWS Core Infrastructure Fundamentals

### 🎯 Objective
Set up AWS Cloud resources manually or via CLI to understand cloud networking before automating via IaC.

### 📋 Actionable Tasks
- [ ] **IAM Setup**: Create deployment IAM user with strict policies (EC2, S3, ECR access).
- [ ] **VPC Networking**:
  - Create VPC (`10.0.0.0/16`).
  - Create 2 Public Subnets and 2 Private Subnets across 2 Availability Zones.
  - Attach Internet Gateway (IGW) and Route Tables.
- [ ] **Security Groups**:
  - `web-sg`: Allow Inbound HTTP (80) & HTTPS (443) from `0.0.0.0/0`.
  - `app-sg`: Allow Inbound Port 5000 strictly from `web-sg`.
  - `db-sg`: Allow Inbound Port 27017 strictly from `app-sg`.

### 🧪 Verification Criteria
- EC2 launched in public subnet is reachable via SSH and HTTP; database port is inaccessible from public internet.

---

## Phase 13 — AWS Single-Instance EC2 Deployment

### 🎯 Objective
Deploy TaskFlow Docker Compose stack onto an AWS EC2 instance behind Nginx with Let's Encrypt SSL.

### 📋 Actionable Tasks
- [ ] Provision Ubuntu t3.medium EC2 instance.
- [ ] Install Docker & Docker Compose on instance.
- [ ] Configure Nginx on EC2 host / container with Certbot for free TLS/SSL certificates (`https://yourdomain.com`).
- [ ] Connect backend to managed MongoDB Atlas cluster (recommended for cloud persistence).

### 🧪 Verification Criteria
- Application resolves over HTTPS with valid SSL certificate.

---

## Phase 14 — Infrastructure as Code (IaC) with Terraform

### 🎯 Objective
Replace manual cloud configuration with reproducible declarative Terraform code.

### 🏗 Terraform Directory Structure
```
terraform/
  ├── main.tf (providers, backend)
  ├── variables.tf
  ├── outputs.tf
  ├── vpc.tf
  ├── ec2.tf
  ├── security_groups.tf
  └── terraform.tfvars
```

### 📋 Actionable Tasks
- [ ] Define AWS Provider in `main.tf`.
- [ ] Write `vpc.tf` for VPC, subnets, route tables, IGW.
- [ ] Write `security_groups.tf` for ingress/egress rules.
- [ ] Write `ec2.tf` to launch deployment instance with user_data script installing Docker.
- [ ] Setup S3 bucket + DynamoDB table for Terraform Remote State locking.

### 🧪 Verification Criteria
- `terraform plan` previews resources cleanly.
- `terraform apply` provisions complete infrastructure automatically within 2 minutes.

---

# SECTION C: ASYNC JOBS, CACHING & AI ENGINE (PHASES 15 – 23)

---

## Phase 15 — Performance Caching with Redis

### 🎯 Objective
Integrate Redis to cache expensive DB aggregations (e.g. Dashboard stats) and reduce MongoDB load.

### 🏗 Cache Flow Pattern (Read-Through & Invalidation)
```
GET /api/dashboard/stats -> Check Redis Cache key "org:stats:{id}"
    ├── HIT -> Return Cached JSON instantly (<10ms)
    └── MISS -> Query MongoDB -> Set Redis Key with TTL 300s -> Return Response
Mutation Event (Task Created/Updated) -> Trigger Redis `DEL org:stats:{id}`
```

### 📋 Actionable Tasks
- [ ] Add Redis service to `docker-compose.yml` (`image: redis:7-alpine`).
- [ ] Install `ioredis` in Express server.
- [ ] Implement `cacheService.js` with helper methods (`get`, `setEx`, `del`).
- [ ] Wrap `/api/dashboard/stats` with Redis cache middleware (TTL 5 minutes).
- [ ] Flush/invalidate cache key whenever a task or project in that organization is modified.

### 🧪 Verification Criteria
- Second request to `/api/dashboard/stats` returns in under 10ms with `X-Cache: HIT` header.

---

## Phase 16 — Asynchronous Processing & Background Workers

### 🎯 Objective
Decouple time-consuming operations (activity log persistence, emails) from main HTTP request-response loops using BullMQ / Redis queues.

### 📋 Actionable Tasks
- [ ] Install `bullmq` queue library in backend.
- [ ] Create `queueService.js` initializing queues: `activityQueue`, `emailQueue`.
- [ ] Create separate worker process (`server/src/workers/activityWorker.js`).
- [ ] Refactor controllers to push activity events onto `activityQueue` instantly instead of writing directly to MongoDB synchronously.

### 🧪 Verification Criteria
- HTTP task creation response completes in <50ms; worker asynchronously writes activity log entry.

---

## Phase 17 — AI Task Generation System

### 🎯 Objective
Enable users to enter a prompt (e.g. "Build OAuth Login") and generate actionable task lists via LLM structured JSON outputs with human preview approval.

### 🏗 Human-in-the-Loop AI Flow
```
User Prompt -> POST /api/ai/generate-tasks -> LLM Service (OpenAI/Gemini) -> Validated Structured JSON -> Client Preview Modal -> User Edits/Selects -> Batch Insert to DB
```

### 📋 Actionable Tasks
- [ ] Add LLM API client wrapper (`server/src/services/aiService.js`).
- [ ] Construct strict system prompt enforcing JSON output format.
- [ ] `POST /api/ai/generate-tasks`: Accepts prompt, returns candidate tasks array `{ title, description, priority }`.
- [ ] Frontend modal displaying AI candidate tasks with checkboxes allowing user approval/edit before saving to DB.

### 🧪 Verification Criteria
- AI generates structured tasks matching project context without direct unvalidated DB writes.

---

## Phase 18 — AI Task Decomposition & Breakdown

### 🎯 Objective
Break down complex tasks or features into hierarchical subtasks and milestones.

### 📋 Actionable Tasks
- [ ] `POST /api/ai/breakdown-task`: Accepts high-level task title/description.
- [ ] Prompt LLM to output subtask array with recommended execution sequence.
- [ ] Render subtask tree on frontend task drawer.

---

## Phase 19 — AI Automated Description & Acceptance Criteria Generator

### 🎯 Objective
Auto-fill task descriptions with detailed requirements, scope, and acceptance criteria based on short task titles.

### 📋 Actionable Tasks
- [ ] `POST /api/ai/enhance-description`: Takes title string, returns formatted markdown string containing Objective, Scope, and Acceptance Criteria checklist.
- [ ] "Enhance with AI" button on Task Create/Edit form.

---

## Phase 20 — AI Project Executive Summaries

### 🎯 Objective
Generate automated natural language progress updates summarizing project velocity, recent activity, and remaining milestones.

### 📋 Actionable Tasks
- [ ] Aggregate project state (total tasks, done tasks, recent activity feed).
- [ ] Send compressed state context to LLM asking for 3-bullet summary.
- [ ] Display summary card on top of Project Overview view.

---

## Phase 21 — AI Risk Detection & Delay Prediction Engine

### 🎯 Objective
Analyze project dependencies, stagnant tasks, and approaching deadlines to warn managers about project risks.

### 📋 Actionable Tasks
- [ ] Heuristic + LLM scanner searching for tasks stuck in `IN_PROGRESS` > 5 days or approaching due dates with incomplete dependencies.
- [ ] Highlight at-risk tasks with red alert callouts and reason summaries on Kanban board.

---

## Phase 22 — AI Backend Architecture & Provider Abstraction

### 🎯 Objective
Decouple AI provider logic (OpenAI, Gemini, Claude) behind a generic provider interface to prevent vendor lock-in.

### 🏗 Architecture Pattern
```
ai.controller.js -> ai.service.js -> AIServiceProvider Interface -> [ OpenAIAdapter | GeminiAdapter ]
```

### 📋 Actionable Tasks
- [ ] Implement `AIProvider` interface class.
- [ ] Create `OpenAIAdapter` and `GeminiAdapter` implementing standard `generateStructuredJSON()` method.
- [ ] Switch provider via environment variable (`AI_PROVIDER=gemini`).

---

## Phase 23 — AI Structured Output & Schema Validation

### 🎯 Objective
Ensure AI outputs strictly conform to application schemas using Zod validation before passing data to frontend or backend services.

### 📋 Actionable Tasks
- [ ] Define Zod schemas for AI responses (`taskGenerationSchema`).
- [ ] Pass output schema to LLM JSON Mode.
- [ ] Validate raw response with Zod; throw retry or fallback error if parsing fails.

---

# SECTION D: KUBERNETES & CLOUD ORCHESTRATION (PHASES 24 – 27)

---

## Phase 24 — Orchestration with Kubernetes (K8s)

### 🎯 Objective
Migrate Docker Compose setup to Kubernetes manifests for deployment, service discovery, configuration management, and scalability.

### 📋 Actionable Tasks
- [ ] Setup local K8s environment (Minikube / Kind / Docker Desktop K8s).
- [ ] Write K8s manifests in `k8s/`:
  - `namespace.yaml`: `taskflow` namespace.
  - `configmap.yaml` & `secret.yaml`: Non-sensitive & sensitive environment variables.
  - `backend-deployment.yaml` & `backend-service.yaml` (ClusterIP).
  - `frontend-deployment.yaml` & `frontend-service.yaml` (ClusterIP).
  - `ingress.yaml`: Nginx Ingress Controller routing HTTP traffic.

### 🧪 Verification Criteria
- `kubectl get pods -n taskflow` shows all frontend & backend pods in `Running` state.

---

## Phase 25 — Kubernetes Autoscaling & Health Probes

### 🎯 Objective
Implement Liveness, Readiness, and Startup probes, resource limits, and Horizontal Pod Autoscaling (HPA).

### 📋 Actionable Tasks
- [ ] Add probes to backend deployment:
  - `livenessProbe`: `GET /api/health` every 10s.
  - `readinessProbe`: `GET /api/health` every 5s.
- [ ] Configure `resources`: `requests: { cpu: "100m", memory: "128Mi" }`, `limits: { cpu: "500m", memory: "512Mi" }`.
- [ ] Write `hpa.yaml`: Autoscale backend pods between min 2 and max 10 when average CPU utilization > 70%.

### 🧪 Verification Criteria
- Simulating CPU load via `hey` or `artillery` triggers HPA to scale up backend replicas automatically.

---

## Phase 26 — Helm Chart Packaging

### 🎯 Objective
Package TaskFlow Kubernetes resources into reusable Helm charts with variable templating per environment (dev, staging, prod).

### 📋 Actionable Tasks
- [ ] Initialize Helm structure: `helm create taskflow-chart`.
- [ ] Parameterize images, replica counts, resources, and env vars in `values.yaml`.
- [ ] Test helm deployment: `helm upgrade --install taskflow ./helm/taskflow-chart -n taskflow`.

---

## Phase 27 — Managed Kubernetes on AWS EKS & ECR

### 🎯 Objective
Deploy Helm chart to production-grade managed AWS Elastic Kubernetes Service (EKS) with images stored in AWS ECR.

### 📋 Actionable Tasks
- [ ] Create AWS ECR repositories for `taskflow-backend` and `taskflow-frontend`.
- [ ] Provision EKS cluster and Managed Node Groups via Terraform or `eksctl`.
- [ ] Deploy AWS Load Balancer Controller to provision AWS Application Load Balancer (ALB) via K8s Ingress.

### 🧪 Verification Criteria
- AWS ALB URL routes external traffic cleanly to EKS pods.

---

## Phase 28 — Monitoring & Observability with Prometheus & Grafana

### 🎯 Objective
Capture real-time system metrics (CPU, RAM, API HTTP status codes, latency) and visualize them in custom Grafana dashboards.

### 📋 Actionable Tasks
- [ ] Add `prom-client` to Node.js backend exposing `/metrics` endpoint.
- [ ] Deploy Prometheus via Helm (`kube-prometheus-stack`).
- [ ] Deploy Grafana and build dashboards tracking:
  - Request Rate (RPS)
  - 4xx & 5xx Error Rates
  - P95/P99 HTTP Response Latency
  - Pod CPU & Memory Usage

### 🧪 Verification Criteria
- Grafana dashboard displays real-time spikes when traffic load is generated.

---

## Phase 29 — Centralized Structured Logging & Tracing

### 🎯 Objective
Implement structured JSON logging with Correlation IDs to trace requests across microservices.

### 📋 Actionable Tasks
- [ ] Replace `console.log` with `winston` or `pino` logger outputting structured JSON (`level`, `message`, `timestamp`, `requestId`).
- [ ] Add Correlation ID middleware (`express-request-id`) appending unique UUID to request context and log statements.

---

## Phase 30 — Production Security Hardening

### 🎯 Objective
Apply defense-in-depth security hardening across Application, Docker, AWS, and Kubernetes layers.

### 📋 Actionable Tasks
- [ ] **Docker Security**: Ensure containers run as non-root user (`USER node`). Scan images with Trivy.
- [ ] **K8s Security**: Apply `NetworkPolicies` restricting pod-to-pod communication. Enforce read-only root filesystems where possible.
- [ ] **Secrets Management**: Move hardcoded secrets to AWS Secrets Manager / HashiCorp Vault.

---

## Phase 31 — Advanced System Design & High Availability

### 🎯 Objective
Incorporate high-availability patterns including database read replicas, zero-downtime rolling deployments, and circuit breakers.

### 📋 Actionable Tasks
- [ ] Configure MongoDB Read Preference (`secondaryPreferred`) for read-heavy query routes.
- [ ] Configure Kubernetes `RollingUpdate` deployment strategy (`maxSurge: 25%`, `maxUnavailable: 0`) ensuring 0 downtime during updates.
- [ ] Conduct chaos testing (stopping pods, simulating high latency) to ensure continuous system availability.

---

# SECTION F: COMPLETE MILESTONE SUMMARY & ROADMAP CHECKLIST

| Phase | Core Milestone Domain | Primary Tech Stack | Status |
|---|---|---|---|
| **Phase 1-9** | **Product MVP** | React, Node.js, Express, MongoDB, Tailwind | ✅ Completed |
| **Phase 10-11** | **Containerization & CI/CD** | Docker, Docker Compose, GitHub Actions | 🔲 Planned |
| **Phase 12-14** | **Cloud & IaC** | AWS (VPC, EC2, S3), Terraform | 🔲 Planned |
| **Phase 15-16** | **Caching & Async Queues** | Redis, BullMQ Background Worker | 🔲 Planned |
| **Phase 17-23** | **AI Engineering System** | OpenAI / Gemini API, Zod Validation | 🔲 Planned |
| **Phase 24-27** | **Kubernetes & Cloud Orchestration** | K8s, Helm, AWS EKS, AWS ECR | 🔲 Planned |
| **Phase 28-31** | **Observability & Security Hardening** | Prometheus, Grafana, Pino, Security Audit | 🔲 Planned |
