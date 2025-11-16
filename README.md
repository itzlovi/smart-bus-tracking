# 🚌 Smart Bus Web Tracking System

A real-time bus location tracking system where students can request bus locations and drivers can share their live position.

## ✨ Features

- **📍 Real-time Location Tracking** - Live bus location updates
- **🎓 Student Panel** - Request and track bus location
- **🚌 Driver Panel** - Accept requests and share location  
- **🌐 Cross-Device Support** - Works on mobile and desktop
- **⚡ Fast Deployment** - Deploy to Netlify + Railway in minutes
- **🔄 Real-time Sync** - WebSocket + REST API

## 🚀 Quick Deploy (5 minutes)

### Frontend: Netlify
1. Push code to GitHub
2. Go to https://netlify.com → Import project
3. Build command: `npm run build`, Directory: `dist`
4. Deploy! ✅

### Backend: Railway
1. Go to https://railway.app → New Project
2. Select GitHub repo
3. Add `PORT=3000` environment variable
4. Deploy! ✅

**Full guide: [NETLIFY_RAILWAY_DEPLOY.md](NETLIFY_RAILWAY_DEPLOY.md)**

## 💻 Local Development

### Prerequisites
- Node.js 18+

### Setup

```bash
# Install dependencies
npm install

# Terminal 1: Start backend
npm run server

# Terminal 2: Start frontend  
npm run dev
```

Open http://localhost:5173 in your browser!

## 🎯 How to Use

### Student
1. Select "Student" role
2. Enter Bus ID (e.g., "bus1")
3. Click "Request Location"
4. View live location on map when driver accepts

### Driver
1. Select "Driver" role
2. Wait for location requests
3. Click "Accept" to share location
4. Location automatically syncs

## 🌍 Deployment

### ⭐ Option 1: Netlify + Railway (Recommended)
- **Frontend:** Netlify (free)
- **Backend:** Railway ($5/month free credit)
- **Cost:** ~$0-5/month
- **Guide:** [NETLIFY_RAILWAY_DEPLOY.md](NETLIFY_RAILWAY_DEPLOY.md)

### Option 2: Streamlit + Railway
- Use Python Streamlit frontend instead
- Same backend on Railway
- Great for quick deployment

### Option 3: Self-Hosted
- Full control over infrastructure
- Pay for your own server

## 📁 Project Structure

```
smart-bus-web-tracking-system/
├── server.js              # Node.js Express backend
├── App.tsx                # React main component
├── components/            # React components
├── types.ts              # TypeScript types
├── package.json          # Dependencies
├── vite.config.ts        # Vite config
├── netlify.toml          # Netlify config
├── .env.local            # Dev env variables
├── .env.production       # Production env variables
└── NETLIFY_RAILWAY_DEPLOY.md  # Deployment guide
```

## 🔧 API Endpoints

```
POST   /api/request         Create location request
GET    /api/status/:busId   Get status + location
POST   /api/respond         Accept/reject request
POST   /api/location        Update location
GET    /api/requests        Get all requests
GET    /health              Server status
```

## 📦 Tech Stack

- **Frontend:** React, TypeScript, Vite, Leaflet
- **Backend:** Node.js, Express, WebSocket
- **Deployment:** Netlify, Railway, GitHub

## ✅ Quick Commands

```bash
npm install         # Install dependencies
npm run dev         # Start dev server
npm run server      # Start backend
npm run build       # Build for production
```

## 📚 Documentation

- [NETLIFY_RAILWAY_DEPLOY.md](NETLIFY_RAILWAY_DEPLOY.md) - Complete deployment guide
- [server.js](server.js) - Backend implementation
- [App.tsx](App.tsx) - Frontend app

## 🚀 Getting Started

1. **Clone repo and install:**
   ```bash
   git clone <repo-url>
   npm install
   ```

2. **Run locally:**
   ```bash
   npm run server   # Terminal 1
   npm run dev      # Terminal 2
   ```

3. **Deploy:**
   - Push to GitHub
   - Netlify + Railway auto-deploy
   - Your app is live! 🎉

## 🐛 Troubleshooting

**Frontend can't reach backend?**
- Check `.env.production` has correct Railway URL
- Verify CORS in `server.js`
- Check browser console (F12)

**Backend won't start?**
- Run `npm run server` - should show "Server running"
- Check port 3000 isn't in use

**Netlify build fails?**
- Test locally: `npm run build`
- Check Node version: `node --version` (needs 18+)

## 📱 Test on Mobile

```bash
# Get PC IP
ipconfig

# On mobile (same WiFi)
http://<your-pc-ip>:5173
```

## 📄 License

MIT

---

**Deploy now: [NETLIFY_RAILWAY_DEPLOY.md](NETLIFY_RAILWAY_DEPLOY.md)** 🚀
