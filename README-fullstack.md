# Fullstack - User Access Management System

This project is a fullstack implementation using **Node.js (Express + TypeORM + PostgreSQL)** for the backend and **Vite + React + TypeScript** for the frontend.

---

## Project Structure

```
root/
├── backend/
│   └── Express + TypeORM + JWT + PostgreSQL
├── frontend/
│   └── Vite + React + TypeScript + Zod
```

---

## Quick Start

### 1. Start Backend

```bash
cd backend
npm install
npm run dev
```

> Configure `.env` for DB and JWT refer backend/.env.sample

### 2. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

> Configure `.env` for Backend-API refer frontend/.env.sample

> Make sure backend is running at `http://localhost:BACKEND_PORT`

---

## User Roles & Access

| Role     | Can Create Software | Can Approve Requests | Can Request Access |
| -------- | ------------------- | -------------------- | ------------------ |
| Admin    | ✅                  | ❌                   | ❌                 |
| Manager  | ❌                  | ✅                   | ❌                 |
| Employee | ❌                  | ❌                   | ✅                 |

---

## Tech Stack

**Backend:**

- Node.js, Express, TypeScript, PostgreSQL, TypeORM, Zod

**Frontend:**

- Vite, React, TypeScript, Zod, React Router
