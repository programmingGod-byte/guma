# OmniCode - Full Stack DSA Platform

OmniCode is an enterprise-grade, open-source Data Structures and Algorithms (DSA) practice platform. It provides a real-time coding environment (via Monaco Editor), automated test case evaluation (via a custom Python/C++ Judge), and intelligent Socratic feedback (via local LLMs using Ollama).

## System Architecture

The system is designed with a clear separation of concerns:
1. **Frontend (Next.js):** Handles the UI, state management, code editing, and rendering Markdown.
2. **Backend (FastAPI):** Exposes RESTful endpoints for authentication, problem management, submissions, and AI analysis.
3. **Database (PostgreSQL):** Stores users, problems (and JSONB test cases), and submission history.
4. **Execution Engine (Judge):** Securely compiles and executes user code against database test cases.
5. **AI Engine (Ollama):** Analyzes user code locally without sending data to external APIs.

---

## Directory & File Breakdown

### 🖥️ Frontend (Next.js + Tailwind CSS)
**Path:** `/frontend`

#### Core App (`/frontend/app`)
- **`layout.tsx` & `globals.css`**: The root layout wrapping the entire application. Loads the Inter font and base Tailwind directives for the minimalist light-mode design.
- **`page.tsx` (Landing Page)**: The highly polished marketing entry point. Showcases features and provides navigation to auth/problems.
- **`login/page.tsx` & `register/page.tsx`**: Clean split-pane authentication pages. They interact with the backend `/auth` routes and store JWTs in local storage.
- **`problems/page.tsx` (Dashboard)**: Fetches and displays all available problems. Implements client-side filtering by Difficulty and Topic.
- **`problems/[slug]/page.tsx` (Workspace)**: The core solving interface.
  - *Left Panel*: Toggles between the Problem Description (Markdown) and the Submission Result (Test case verdicts, runtime).
  - *Right Panel*: Monaco Editor configured for C++ and Python.
  - *Functions*: `handleSubmit()` sends code to the execution judge; `handleAnalyze()` streams AI complexity feedback; `getHint()` asks the AI for a Socratic hint on failed submissions.
- **`admin/page.tsx`**: A protected portal for creating, editing, and deleting problems and their associated JSON test cases.

#### Utilities & Components
- **`components/Logo.tsx`**: A custom SVG logo designed to match the platform's minimalist brand.
- **`lib/api.ts`**: Configures Axios to attach the JWT Bearer token to all outgoing backend requests.
- **`lib/auth.ts`**: Utility functions (`setToken`, `removeToken`, `isLoggedIn`) to manage local storage auth state.

---

### ⚙️ Backend (FastAPI + SQLAlchemy)
**Path:** `/backend`

#### Core Configuration
- **`app/main.py`**: The entry point. Initializes FastAPI, configures CORS for the frontend, and includes all routers.
- **`app/database.py`**: Manages the PostgreSQL connection pool using SQLAlchemy. Provides the `get_db()` dependency injection.
- **`app/dependencies.py`**: Contains the `get_current_user` function, which intercepts requests, decodes JWTs, and enforces route protection.

#### Database Models (`/backend/app/models/`)
- **`user.py`**: Defines the `users` table (id, username, email, hashed_password).
- **`problem.py`**: Defines the `problems` table. Notably uses a `JSONB` column for `test_cases` to allow flexible input/output schemas.
- **`submission.py`**: Defines the `submissions` table, linking a User's code attempt to a Problem, tracking `verdict` and `runtime_ms`.

#### API Routers (`/backend/app/routers/`)
- **`auth.py`**: Endpoints for `/register` and `/login`. Handles password hashing and OAuth2 JWT generation.
- **`problems.py`**: CRUD endpoints for the problem catalog.
- **`submissions.py`**: The central hub for code execution. Exposes endpoints for code submission and AI analysis.

#### Core Services (`/backend/app/services/`)
- **`judge.py`**: The Execution Engine. 
  - *How it works*: Receives raw code and test cases. Writes the code to a temporary file (`/tmp`). For C++, it shells out to `g++` to compile a binary. For Python, it executes `python3`. It pipes test case inputs into `stdin` and compares `stdout` to the expected output. Returns a verdict (`accepted`, `wrong_answer`, `compilation_error`).
- **`ai_service.py`**: The AI integration layer.
  - *How it works*: Constructs a highly specific prompt containing the problem description, test cases, and user code. It sends this to the local Ollama daemon (`llama3.2:1b`). The prompt strictly commands the AI to act as an interviewer, analyze Big-O complexity, and provide hints without writing code.
- **`auth_service.py`**: Helper functions for bcrypt password hashing and JWT encoding/decoding.

#### Utility Scripts
- **`seed_more.py`**: A database initialization script that populates the PostgreSQL database with a curated list of high-quality DSA problems and edge-case testing data.

---

## How to Setup & Run

We have provided a comprehensive bootstrap script that handles everything.

```bash
# Run the automated setup
chmod +x setup.sh
./setup.sh
```

**Manual Start:**
1. **Database:** `docker-compose up -d`
2. **Backend:** `cd backend && source venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload`
3. **Frontend:** `cd frontend && npm run dev`
4. **AI Engine:** Ensure Ollama is running (`ollama serve`)

## Future Roadmap (Interview Talking Points)
- **Security:** Migrate the `judge.py` subprocess execution to Docker sandboxes or Firecracker microVMs to prevent Remote Code Execution (RCE) vulnerabilities.
- **Caching:** Implement Redis to cache the problem list and test cases to reduce PostgreSQL load.
- **Auth:** Transition from `localStorage` JWTs to `httpOnly` secure cookies to prevent XSS attacks.
