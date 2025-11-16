# Smart Bus Web Tracking System - Setup Guide

## Problem Fixed
The app was using **local React state** which doesn't sync between different browser instances. When you opened the driver panel on a mobile phone and student panel on a laptop, they couldn't communicate because each browser had its own separate state.

## Solution
Added a **WebSocket server** that acts as a central hub to sync data between all connected clients in real-time.

## How to Run

### Step 1: Start the WebSocket Server
Open a terminal in the project directory and run:
```bash
npm run server
```
You should see:
```
Server running on http://localhost:3000
WebSocket server running on ws://localhost:3000
```

### Step 2: Start the Frontend Development Server
Open a **second terminal** and run:
```bash
npm run dev
```
This will start Vite on `http://localhost:5173`

### Step 3: Access on Multiple Devices
- **Driver Panel**: Open `http://localhost:5173` on your mobile phone
- **Student Panel**: Open `http://localhost:5173` on your laptop

If using localhost on different devices, use your computer's IP address instead:
- Get your PC's IP: Run `ipconfig` in terminal, look for "IPv4 Address"
- Use `http://<your-ip>:5173` on both devices

### Step 4: Test the Communication
1. Select "Driver" on the mobile phone, keep Bus ID as "bus1"
2. Select "Student" on the laptop
3. Enter "bus1" and click the send button
4. The request should now appear on the driver panel! ✅

## Architecture

### Frontend (React)
- Connects to WebSocket server on app load
- Sends events when student requests location or driver responds
- Updates UI in real-time when receiving data from server

### Backend (Node.js/Express)
- Maintains a single source of truth for all requests and locations
- Broadcasts updates to all connected clients when state changes
- Handles WebSocket connections and messages

## Files Modified
- `App.tsx` - Added WebSocket connection logic
- `package.json` - Added server dependencies and scripts
- `server.js` - New WebSocket server (created)

## Troubleshooting

**"Not connected to server" error?**
- Make sure `npm run server` is running in a separate terminal
- Check that no other app is using port 3000
- Try accessing the server: `http://localhost:3000/api/requests`

**Mobile can't connect to localhost?**
- Use your PC's IP address instead of localhost
- Make sure both devices are on the same network
- Check Windows Firewall - allow Node.js through

**Still not seeing requests?**
- Open browser console (F12) and check for errors
- Verify both browsers are actually connected to the same server
- Try refreshing the page
