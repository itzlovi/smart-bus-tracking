# 🚀 Netlify + Railway Deployment Guide

## Architecture

```
Netlify (Frontend - React/Vite)
        ↓ HTTPS REST API
        ↓
Railway (Backend - Node.js/Express)
        ↓ Data Storage
        ↓
In-Memory State (or Database)
```

---

## STEP 1: Deploy Backend to Railway ✅

### 1.1 Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

### 1.2 Push Code to GitHub
```bash
git init
git add .
git commit -m "Smart Bus Tracking System"
git push origin main
```

### 1.3 Create Railway Project
1. Click "New Project" on Railway dashboard
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Railway auto-detects Node.js
5. Click "Deploy"

### 1.4 Set Environment Variables (Railway)
In Railway dashboard → Variables:
```
PORT=3000
NODE_ENV=production
```

### 1.5 Get Your Railway URL
- After deployment, Railway gives you a URL like:
  ```
  https://your-app-name.railway.app
  ```
- Save this URL - you'll use it for Netlify

---

## STEP 2: Configure Frontend for Railway

### 2.1 Update Environment File
Edit `.env.production`:
```
VITE_BACKEND_URL=wss://your-app-name.railway.app
VITE_BACKEND_REST_URL=https://your-app-name.railway.app
```

Replace `your-app-name` with your actual Railway app name.

### 2.2 Update Vite Config (if needed)
The app uses Vite, which automatically loads `.env.production` during build.

---

## STEP 3: Deploy Frontend to Netlify ✅

### 3.1 Create Netlify Account
- Go to https://netlify.com
- Sign up with GitHub

### 3.2 Deploy from GitHub
1. Click "Import an existing project"
2. Select "GitHub"
3. Choose your repository
4. **Build command:** `npm run build`
5. **Publish directory:** `dist`
6. Click "Deploy site"

### 3.3 Set Environment Variables (Netlify)
1. Go to Site settings → Build & deploy → Environment
2. Add these environment variables:
   ```
   VITE_BACKEND_URL = wss://your-app-name.railway.app
   VITE_BACKEND_REST_URL = https://your-app-name.railway.app
   ```

### 3.4 Trigger Rebuild
- Make a commit to GitHub
- Or click "Trigger deploy" in Netlify
- Wait 2-3 minutes for build and deployment

### 3.5 Get Your Netlify URL
- After deployment, Netlify gives you a URL like:
  ```
  https://your-app-name.netlify.app
  ```

---

## STEP 4: Enable CORS on Backend

Update `server.js` to allow requests from Netlify:

```javascript
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://your-app-name.netlify.app',  // Your Netlify URL
    ],
    credentials: true
}));
```

Commit and push to trigger Railway redeploy.

---

## STEP 5: Test the Deployment

### 5.1 Test Student Panel
1. Open your Netlify URL in a browser
2. Select "Student" role
3. Enter "bus1"
4. Click "Request Location"
5. Should see "Waiting for driver response..."

### 5.2 Test Driver Panel
1. Open your Netlify URL in another tab/browser
2. Select "Driver" role
3. You should see the student's request
4. Click "Accept Request"
5. Student should see "Request Accepted!"

---

## ✅ Deployment Checklist

- [ ] GitHub account created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Railway project deployed
- [ ] Railway URL obtained
- [ ] `.env.production` updated with Railway URL
- [ ] Netlify account created
- [ ] Netlify connected to GitHub
- [ ] Environment variables set in Netlify
- [ ] Frontend deployed
- [ ] Netlify URL obtained
- [ ] `server.js` CORS updated with Netlify URL
- [ ] Both URLs tested and working

---

## 🔧 Troubleshooting

### "Cannot reach backend from frontend"
**Problem:** Browser console shows WebSocket/fetch errors
**Solution:**
1. Check Railway is running: `https://your-app.railway.app/health`
2. Verify CORS in `server.js` includes your Netlify URL
3. Check environment variables in Netlify are correct
4. Rebuild Netlify: Settings → Deploys → Trigger deploy

### "CORS error"
**Problem:** Browser console shows "Cross-origin request blocked"
**Solution:**
1. Update `server.js` CORS to include your Netlify URL
2. Push to GitHub
3. Railway auto-redeploys (check activity)
4. Rebuild Netlify

### "Railway app won't start"
**Problem:** Railway shows "Deploy failed"
**Solution:**
1. Check build logs in Railway
2. Make sure `npm start` runs `node server.js`
3. Check `package.json` has all dependencies
4. Check `server.js` has no syntax errors

### "Netlify build fails"
**Problem:** Netlify shows "Build failed"
**Solution:**
1. Check build logs
2. Run locally: `npm run build`
3. Fix any errors
4. Push to GitHub

---

## 📊 Cost Estimate

| Service | Cost | Features |
|---------|------|----------|
| **Railway** | Free (with $5/month credit) | Full-featured backend hosting |
| **Netlify** | Free | Unlimited static deployments |
| **GitHub** | Free | Code hosting |
| **Total** | ~$0-5/month | Production-ready deployment |

---

## 🔄 Continuous Deployment

Both services auto-deploy when you push to GitHub!

```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Railway auto-deploys backend (2-3 min)
# Netlify auto-deploys frontend (2-3 min)
# Your live app updates automatically!
```

---

## 📝 Important Notes

1. **WebSocket over HTTPS:** Railway uses `wss://` (secure WebSocket)
2. **CORS is required:** Must allow Netlify domain in `server.js`
3. **Environment variables:** Different for local dev and production
4. **Auto-deploy:** Both services watch your GitHub repo
5. **Free tier:** Railway gives free credits monthly

---

## 🎉 You're Live!

Your Smart Bus Tracking System is now:
- ✅ Frontend: Deployed on Netlify
- ✅ Backend: Deployed on Railway
- ✅ Auto-deployed on every git push
- ✅ Accessible worldwide

Share your Netlify URL with anyone to use your app!

---

## Next: Database Integration

To persist data beyond server restart:
1. Add MongoDB/PostgreSQL
2. Replace in-memory storage
3. Add user authentication
4. Track location history

See [README.md](README.md) for more options.
