## Readvio Backend (Express + TypeScript + MongoDB)

![readvio-logo](https://github.com/user-attachments/assets/218df98c-309e-426c-910d-d048f8f3d334)

![Node.js](https://img.shields.io/badge/Node.js-Runtime-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-Server-000000?logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Language-3178c6?logo=typescript&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![Mongoose](https://img.shields.io/badge/Mongoose-ODM-880000?logo=mongoose&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better%20Auth-Authentication-7952b3?logo=passport&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3E69E4?logo=zod&logoColor=white)
![Helmet](https://img.shields.io/badge/Helmet-Security-2E2E2E?logo=helmet&logoColor=white)
![CORS](https://img.shields.io/badge/CORS-Policy-576574?logo=http&logoColor=white)
![Morgan](https://img.shields.io/badge/Morgan-Logger-352C28?logo=logstash&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployment-000000?logo=vercel&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-Data%20Visualization-0088FE?logo=chartdotjs&logoColor=white)

A production-ready backend for the Readvio e‑book store and referral system. It provides REST APIs for books, purchases, referral dashboards, and authentication using Better Auth. Deployed as a serverless Express app on Vercel.

Live server url: https://readvio-backend.vercel.app

### Tech Stack

- **Runtime**: Node.js (ESM)
- **Server**: Express 5 (TypeScript)
- **Database**: MongoDB (Mongoose + MongoDB Node driver)
- **Auth**: Better Auth (MongoDB adapter, cookie-based sessions)
- **Validation & Utils**: Zod, Helmet, CORS, Morgan
- **Deployment**: Vercel Serverless Functions

### Key Features

- Books CRUD/read endpoints
- Purchase flow with referral/credit logic (user-only)
- Auth-protected dashboard metrics and lists
- Cookie-based session auth with cross‑site support (SameSite=None, Secure)
- Serverless-friendly DB connection caching

---

## Getting Started

### Prerequisites

- Node.js ≥ 18.18 (recommended LTS)
- npm or pnpm

### Install

```bash
git clone https://github.com/friyad/readvio.git
```

```bash
cd readvio
```

```bash
npm install
```

### Environment Variables

Create a `.env` in the project root:

```bash
# App environment
NODE_ENV=development
PORT=5000

# MongoDB connection
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# Frontend origin allowed by CORS (must match exactly, including protocol)
FRONTEND_URL=http://localhost:3000

# Better Auth session secret (should be a long random string in production)
BETTER_AUTH_SECRET=your_better_auth_secret_here

# Optional for cookie domain tuning (used by Better Auth advanced settings)
NEXT_PUBLIC_FRONTEND_DOMAIN=localhost
```

Notes:

- In production, set `FRONTEND_URL` to your frontend origin (for example `https://readvio.vercel.app`).
- For cross‑site cookies in production, the app sets `SameSite=None; Secure` automatically.

### Scripts

- `npm run dev` — start dev server (nodemon + tsx)
- `npm run build` — compile TypeScript to `dist/`
- `npm start` — run compiled server from `dist/` (for non-serverless)
- `npm run type-check` — typecheck without emit
- `npm run clean` — remove build output

---

## Project Structure (Backend)

```
readvio-backend/
├─ api/
│  └─ index.ts              # Vercel serverless entrypoint (exports Express app)
├─ src/
│  ├─ app.ts                # Express app (middleware, routes, auth handler)
│  ├─ server.ts             # Node server (local dev/non-serverless)
│  ├─ config/
│  │  ├─ env.ts             # env loader and mapping
│  │  ├─ db.ts              # Mongoose connection (cached for serverless)
│  │  └─ auth.ts            # Better Auth config (MongoDB adapter, cookies)
│  ├─ controllers/          # route handlers (books, purchase, dashboard)
│  ├─ middleware/           # requireAuth, errorHandlers
│  ├─ models/               # Mongoose schemas (Book, User, Referral)
│  ├─ routes/               # Express routers
│  ├─ types/                # shared types and Express augmentation
│  └─ validations/          # zod schemas
└─ vercel.json              # Vercel builds+routes
```

---

## API Overview

Base URL: `${BACKEND_URL}` (local `http://localhost:5000`) and serverless path `/api` on Vercel.

### Auth (Better Auth)

- Mounted under: `/api/auth/*`
- Cookie: `better-auth.session_token` (HttpOnly; `SameSite=None; Secure` in prod)
- Client must send requests with `credentials: 'include'` for protected routes

### Books

- `GET /api/v1/books` — list books
- `GET /api/v1/books/:id` — get a single book by id

### Purchase (protected)

- `POST /api/v1/purchase` — body `{ bookId: string }`
  - Validates session via `requireAuth`
  - Applies referral/credit logic on first purchase

### Dashboard (protected)

- `GET /api/v1/dashboard` — aggregate referral and credit metrics
- `GET /api/v1/dashboard/referrals` — list referred users
- `GET /api/v1/dashboard/purchased-books` — list purchased books

---

## Authentication & CORS

- CORS configured in `src/app.ts`:
  - `origin: env.FRONTEND_URL`
  - `credentials: true`
  - methods `GET, POST, PUT, DELETE, OPTIONS`
- Cookies are cross‑site compatible in production:
  - `SameSite=None; Secure; HttpOnly` (set in Better Auth advanced options)
- Frontend must use `fetch(..., { credentials: 'include' })` when hitting protected routes.

---

## Deployment (Vercel)

- The Express app is exported as default from `api/index.ts`.
- `vercel.json` builds `api/index.ts` with `@vercel/node` and routes all traffic to it.
- Ensure these environment variables are set in Vercel Project Settings:
  - `MONGO_URI`
  - `FRONTEND_URL`
  - `NODE_ENV=production`
  - Optionally: `NEXT_PUBLIC_FRONTEND_DOMAIN`

ESM note:

- The project uses ESM (`"type": "module"` in `package.json`) and `NodeNext` in `tsconfig.json`. Local imports use explicit `.js` extensions.

---

## Troubleshooting

- Unauthorized on protected routes in production:

  - Confirm frontend sends `credentials: 'include'` and the request domain matches `FRONTEND_URL`.
  - Check Better Auth endpoints under `/api/auth/*` are reachable and set the session cookie.
  - Verify cookies have `Secure` and `SameSite=None` on HTTPS domains.

- MongoDB timeouts or buffering:

  - Ensure `MONGO_URI` is correct and accessible from Vercel.
  - Connection caching is enabled in `src/config/db.ts`; ensure `await connectToDatabase()` is called before requests (it is in `api/index.ts`).
  - Consider adjusting `serverSelectionTimeoutMS` if your cluster is slow to respond.

- ESM / module resolution errors:
  - Use `.js` extensions for local imports.
  - Keep `package.json` with `"type": "module"` and `tsconfig.json` with `"module": "NodeNext"`.

---

## License

This project is licensed under the **MIT License**.
