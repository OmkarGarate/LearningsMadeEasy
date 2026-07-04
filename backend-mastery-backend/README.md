# 🔧 Backend Mastery API

Express + MongoDB + JWT + AI tutor backend. Simple code-based auth + OpenAI-powered chatbot.

## 🚀 Quick start

```bash
npm install
cp .env.example .env
# Fill in MONGODB_URI (required). Others optional.
npm run dev
```

## 🔐 Auth flow (code-based, super simple)

1. User enters email → `POST /api/auth/otp/request`
2. Server generates a 6-digit code, stores it in DB (10 min expiry)
3. **In dev mode**: code is LOGGED to the terminal AND returned in the response
4. **In production**: code is sent via email (Resend) — set `RESEND_API_KEY` in `.env`
5. User enters the code → `POST /api/auth/otp/verify`
6. Server returns access + refresh tokens

That's it. No passkeys, no biometrics, no OAuth complexity.

## 🤖 AI tutor (OpenAI-compatible)

- **With `AI_API_KEY`**: real GPT answers using the entire curriculum as context
- **Without `AI_API_KEY`**: smart pattern-based fallback using the concept's own data
- Set `AI_BASE_URL` to use other providers (Together, Groq, Anyscale, Ollama)
- Set `AI_MODEL` to your preferred model (default: `gpt-4o-mini`)

## 📡 Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET  | `/api/health` | No | Health check |
| POST | `/api/auth/otp/request` | No | Request code (logs to terminal in dev) |
| POST | `/api/auth/otp/verify` | No | Verify code, get tokens |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | No | Logout |
| GET  | `/api/auth/me` | Yes | Get current user |
| POST | `/api/ai/chat` | Yes | AI tutor chat |
| POST | `/api/user/progress/:conceptId/toggle` | Yes | Mark concept done |
| POST | `/api/user/mcq/answer` | Yes | Record MCQ answer (+5 XP if correct) |
| POST | `/api/user/problem/solved` | Yes | Mark problem solved (+20 XP) |
| PUT  | `/api/user/notes/:conceptId` | Yes | Save note |
| POST | `/api/user/reminders` | Yes | Add reminder |
| PATCH| `/api/user/reminders/:id/toggle` | Yes | Toggle done |
| DELETE| `/api/user/reminders/:id` | Yes | Delete reminder |
| PUT  | `/api/user/preferences` | Yes | Save preferences |
| POST | `/api/user/badges/sync` | Yes | Sync earned badges |

## 🔒 Security

- Codes are bcrypt-hashed in DB
- 10 minute expiry
- 5 wrong attempts → code invalidated
- Max 10 codes per email per hour
- JWT access (15 min) + refresh (7 day) with rotation
- Helmet + CORS + rate limiting
- All sensitive operations require auth

## 💰 Free services

| Service | Cost | Setup |
|---|---|---|
| MongoDB Atlas | Free 512MB forever | https://www.mongodb.com/cloud/atlas |
| Resend (email) | Free 100/day | https://resend.com (optional) |
| OpenAI | Pay-as-you-go | https://platform.openai.com (optional) |
| Render | Free 750h/month | https://render.com |

## 🚀 Deploy to Render

1. Push to GitHub
2. Render → "New Web Service" → connect repo
3. Set env vars (especially `MONGODB_URI`, `JWT_*_SECRET`)
4. Deploy

The `render.yaml` auto-configures most of it.
