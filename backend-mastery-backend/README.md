# 🔧 Backend Mastery API — Passkey Edition

Express + MongoDB + WebAuthn (passkeys) backend. No passwords, no codes, no emails — just your device's built-in auth (Face ID, fingerprint, Windows Hello).

## 🚀 Quick start

```bash
npm install
cp .env.example .env
# Fill in MONGODB_URI (free at mongodb.com/cloud/atlas)
npm run dev
```

## 🔑 How passkeys work

1. **First time** (on a device): Pick a username → browser prompts for Face ID/fingerprint → passkey created + saved to your device's secure enclave + synced to iCloud/Google account → you're in
2. **Next time**: Click sign in → same username → browser prompts for Face ID/fingerprint → you're in (2 seconds)
3. **New device**: Same flow. Your passkey auto-syncs from your iCloud/Google account, so it just works.

## 🛡️ Why passkeys are the best

- **More secure than passwords** — keys never leave your device, can't be phished, can't be leaked
- **Faster** — 2 seconds vs 20 seconds for email codes
- **No "forgot password"** — your face/finger IS the password
- **Multi-device** — passkeys sync via iCloud Keychain (Apple) or Google Password Manager
- **No third-party services** — no email provider, no SMS, nothing to set up

## 📡 Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| GET  | `/api/health` | No | Health check |
| POST | `/api/auth/register/start` | No | Start passkey registration |
| POST | `/api/auth/register/finish` | No | Finish registration, get tokens |
| POST | `/api/auth/login/start` | No | Start passkey login |
| POST | `/api/auth/login/finish` | No | Finish login, get tokens |
| POST | `/api/auth/refresh` | No | Refresh access token |
| POST | `/api/auth/logout` | No | Logout |
| GET  | `/api/auth/me` | Yes | Get current user |
| GET  | `/api/auth/credentials` | Yes | List your devices |
| DELETE | `/api/auth/credentials/:id` | Yes | Remove a device |
| POST | `/api/user/progress/:conceptId/toggle` | Yes | Mark concept done/undone |
| PUT  | `/api/user/notes/:conceptId` | Yes | Save note |
| POST | `/api/user/reminders` | Yes | Add reminder |
| PATCH| `/api/user/reminders/:id/toggle` | Yes | Toggle done |
| DELETE| `/api/user/reminders/:id` | Yes | Delete reminder |
| PUT  | `/api/user/preferences` | Yes | Save preferences |
| POST | `/api/user/badges/sync` | Yes | Sync earned badges |

## 🌐 Browser support

| Browser | Passkeys |
|---|---|
| Chrome 109+ | ✅ |
| Edge 109+ | ✅ |
| Safari 16+ | ✅ |
| Firefox 122+ | ✅ |
| Mobile Safari (iOS 16+) | ✅ (with iCloud sync) |
| Chrome Android | ✅ (with Google sync) |

## 🧪 Local testing

```bash
# 1. Start the backend
npm run dev

# 2. Start the frontend (in another terminal)
cd ../backend-mastery-frontend
npm run dev

# 3. Open http://localhost:5173
# 4. Pick a username, click "Sign up"
# 5. Browser will prompt: "Use your passkey?" → click "Use"
# 6. Sign in next time with the same username
```

## 🔒 Production setup

When you deploy:

1. Set `RP_ID` to your domain (e.g., `backend-mastery.vercel.app`)
2. Set `ORIGIN` to your full frontend URL (e.g., `https://backend-mastery.vercel.app`)
3. **Important:** Passkeys need HTTPS in production. Vercel gives you this for free.
4. For local dev, `RP_ID=localhost` and `ORIGIN=http://localhost:5173` work without HTTPS (browsers allow it for localhost).

## 🌐 Deploy to Render

1. Push to GitHub
2. Render → "New Web Service" → connect your repo
3. Set env vars:
   - `MONGODB_URI`
   - `FRONTEND_URL`
   - `RP_ID` (your Vercel domain without protocol)
   - `ORIGIN` (your Vercel URL with https://)
4. Deploy
