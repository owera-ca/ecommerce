# Ecommerce Project

A full-stack ecommerce application with a **FastAPI** backend and a **React/Vite** frontend.

---

## Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/) — fast Python package manager
- [Node.js 18+](https://nodejs.org/) and npm

Install `uv` if you don't have it:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

---

## Initial Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd ecommerce
```

### 2. Backend — Python virtual environment

Create and activate a virtual environment using `uv`, then install dependencies:

```bash
uv venv .venv
source .venv/bin/activate        # macOS / Linux
# .venv\Scripts\activate          # Windows

uv pip install -r backend/requirements.txt
```

### 3. Run database migrations

```bash
cd backend
alembic upgrade head
cd ..
```

### 4. Frontend — Node dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the Development Environment

### Option A — `devenv` script (recommended)

Use the `devenv` script to manage both servers with a single command:

```bash
# First-time setup: create venv, install Python + Node dependencies
./devenv setup

# Start both servers (opens separate Terminal windows)
./devenv up

# Stop both servers
./devenv down
```

> **Backend** → http://localhost:8000  
> **Frontend** → http://localhost:5173  
> **API Docs** → http://localhost:8000/docs

### Option B — Start servers individually

**Backend:**

```bash
cd backend && source ../.venv/bin/activate && uvicorn app.main:app --reload
```

**Frontend:**

```bash
cd frontend && npm run dev
```

---

## Project Structure

```
ecommerce/
├── .venv/              # Python virtual environment (not committed)
├── backend/            # FastAPI application
│   ├── alembic/        # Database migrations
│   ├── app/            # Application source (routes, models, schemas)
│   ├── tests/          # Backend tests
│   ├── alembic.ini
│   └── requirements.txt
└── frontend/           # React + Vite application
    ├── public/
    ├── src/
    ├── index.html
    └── package.json
```

---

## API Documentation

Once the backend is running, interactive API docs are available at:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
