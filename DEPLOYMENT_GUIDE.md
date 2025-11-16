# Deployment Guide - Streamlit + Node.js Backend

## Architecture

```
┌─────────────────────┐
│  Streamlit Frontend │  (Deployed on Streamlit Cloud)
│   streamlit_app.py  │
└──────────┬──────────┘
           │ HTTPS/REST API
           │
┌──────────▼──────────┐
│   Node.js Backend   │  (Deployed on Railway)
│    server.js        │
│  WebSocket + REST   │
└─────────────────────┘
```

## Deployment Steps

### Step 1: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub

2. **Push Code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

3. **Deploy on Railway**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway auto-detects Node.js
   - Set these environment variables:
     - `PORT=3000`
   - Wait for deployment to complete
   - Copy your Railway URL: `https://your-app.railway.app`

4. **Update Backend URL**
   - The backend URL is shown in Railway dashboard
   - You'll use this in the Streamlit app

### Step 2: Deploy Frontend to Streamlit Cloud

1. **Create Streamlit Cloud Account**
   - Go to https://share.streamlit.io
   - Sign up with GitHub

2. **Deploy Streamlit App**
   - Click "New app"
   - Select your GitHub repo
   - Choose `streamlit_app.py` as the main file
   - Click "Deploy"

3. **Update Backend URL in Code**
   - Edit `streamlit_app.py`
   - Change:
     ```python
     BACKEND_URL = "http://localhost:3000"
     ```
   - To:
     ```python
     BACKEND_URL = "https://your-app.railway.app"
     ```
   - Commit and push
   - Streamlit will auto-redeploy

### Step 3: Enable CORS for Production

Update `server.js` to allow requests from your Streamlit domain:

```javascript
const cors = require('cors');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:8501',
        'https://your-app-name.streamlit.app',  // Your Streamlit URL
    ],
    credentials: true
}));
```

## Local Testing Before Deployment

### Terminal 1: Start Backend
```bash
npm run server
```
Should output:
```
✅ Server running on http://localhost:3000
🔌 WebSocket server running on ws://localhost:3000
📡 REST API available at http://localhost:3000/api
```

### Terminal 2: Start Streamlit
```bash
streamlit run streamlit_app.py
```
Should output:
```
You can now view your Streamlit app in your browser.
  Local URL: http://localhost:8501
  Network URL: http://192.168.x.x:8501
```

## Testing Cross-Device

### On Same Local Network:

1. Get your PC's IP: `ipconfig` → "IPv4 Address"
2. On laptop: `http://localhost:8501`
3. On mobile: `http://192.168.x.x:8501`

### On Deployed Services:

1. Backend: `https://your-app.railway.app`
2. Frontend: `https://your-app-name.streamlit.app`
3. Both work on any device with internet

## Troubleshooting

**CORS Error on Deployment?**
- Update `server.js` CORS origins with your Streamlit Cloud URL
- Streamlit Cloud URLs end with `.streamlit.app`

**Backend timeout?**
- Railway free tier might be slow
- Check Railway dashboard for errors
- Try upgrading to paid plan for better performance

**Streamlit app not updating location?**
- Verify backend URL is correct
- Check browser console (F12) for errors
- Make sure backend is running and accessible

**WebSocket connection failed?**
- WebSocket should use `wss://` on HTTPS
- REST API works better for Streamlit on cloud

## Environment Variables

### Railway Backend
```
PORT=3000
```

### Streamlit Cloud (no env vars needed)
- Just make sure BACKEND_URL in code points to Railway

## Cost Estimate

| Service | Free Tier | Notes |
|---------|-----------|-------|
| **Railway** | $5/month credit | Covers small projects |
| **Streamlit Cloud** | Unlimited | Truly free |
| **GitHub** | Free | Required for both |
| **Total** | ~$5/month | Optional, can be free with Railway credits |

## After Deployment

1. **Test both roles:**
   - Open 2 browsers (or browser + mobile)
   - One as Student, one as Driver
   - Send requests and verify they sync

2. **Monitor Performance:**
   - Railway dashboard shows logs and metrics
   - Streamlit Cloud shows deployment status

3. **Update Code:**
   - Push to GitHub
   - Both services auto-redeploy (usually within 1-2 minutes)

## Rolling Back

- Go to respective platform dashboard
- Select previous deployment version
- Click "Redeploy"

Done! Your app is now live! 🎉
