# Frontend - User Access Management System

This is the frontend built using **Vite + React + TypeScript** for the User Access Management System.

---

## Features

- AuthContext with JWT
- Protected Routes by Role
- Dynamic Dashboard Based on User Role
- Zod Client Validation
- Modular Code Structure

---

## Setup Instructions

1. **Install Dependencies**

```bash
npm install
```

2. **Run Frontend**

```bash
npm run dev
```

> Configure `.env` for Backend-API refer frontend/.env.sample

> Make sure backend is running at `http://localhost:BACKEND_PORT`

---

## Pages

- `/` — Dashboard based on role
- `/login` — Login page
- `/signup` — Signup page
- `/create-software` — Admin-only
- `/request-access` — Employee-only
- `/my-requests` — Employee-only
- `/pending-requests` — Manager-only

---

## Tech Stack

- Vite
- React
- TypeScript
- React Router v6
- Zod
