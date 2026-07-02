# ⚡ Backend Mastery — Frontend (Passkey Edition)

React + Redux Toolkit + Vite frontend. Uses **passkeys** (Face ID, fingerprint, Windows Hello) for login. No passwords, no codes, no email.

## 🚀 Quick start

```bash
npm install
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000/api
npm run dev
```

## 🔑 How passkeys work here

1. **First time:** Pick a username → browser prompts for Face ID / fingerprint → passkey created → you're in
2. **Next time:** Type username → browser prompts for Face ID / fingerprint → you're in (2 seconds)
3. **New device:** Same flow. Your passkey auto-syncs from iCloud/Google.

## 📦 Stack

- React 18 + hooks
- Redux Toolkit
- React Router 6
- Tailwind CSS 3
- Vite 5
- @simplewebauthn/browser (passkeys)

## 📁 State management

Four slices: `auth`, `progress`, `reminders`, `user`. Every API call is a `createAsyncThunk`.

## 🌐 Deploy to Vercel

1. Push to GitHub
2. Vercel → "New Project" → import
3. Add env var: `VITE_API_URL` = your Render backend URL + `/api`
4. Click Deploy

**Important for passkeys:** Vercel gives you HTTPS by default — required for passkeys in production.

## 📱 Pages

| Path | Purpose |
|---|---|
| `/` | Dashboard |
| `/learn` | All phases |
| `/learn/:phaseId` | Phase detail |
| `/reminders` | Reminders |
| `/badges` | Badges |
| `/stats` | Stats + device list |
