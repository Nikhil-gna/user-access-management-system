# Backend - User Access Management System

This is the backend of the User Access Management System built with **Node.js**, **Express**, **TypeScript**, **PostgreSQL**, and **TypeORM**.

---

## Features

- JWT-based Authentication
- Role-based Access Control (Admin, Manager, Employee)
- Software Management
- Access Request Flow
- Zod Validation
- Centralized Error Handling

---

## Setup Instructions

1. **Install Dependencies**

```bash
npm install
```

2. **Setup `.env`** (you can refer .env.sample)

```
PORT=
DB_HOST=
DB_PORT=
DB_USERNAME=
DB_PASSWORD=
DB_DATABASE=
JWT_SECRET=
```

3. **Start PostgreSQL**, then:

```bash
npm run dev
```

---

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Software (Admin)

- `POST /api/software`
- `GET /api/software`

### Requests

- `POST /api/requests` (Employee)
- `GET /api/requests` (Manager or Employee)
- `PATCH /api/requests/:id` (Manager)

---

## Tech Stack

- Node.js
- Express.js
- TypeScript
- TypeORM
- PostgreSQL
- Zod
- JWT
