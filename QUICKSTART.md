# Quick Start - Cross-Device Testing

## The Problem You Had
When opening driver panel on mobile and student panel on laptop, requests didn't sync because they were separate browser instances with separate React state.

## The Solution Implemented
✅ **WebSocket Server** - A central hub that syncs data between all devices in real-time
✅ **Real-time Communication** - Both panels now receive updates instantly
✅ **Multi-Device Support** - Works across different browsers and networks

## Running the App

### Terminal 1: Start the Server
```bash
cd c:\Users\Dell\Downloads\smart-bus-web-tracking-system
npm run server
```
Expected output:
```
Server running on http://localhost:3000
WebSocket server running on ws://localhost:3000
```

### Terminal 2: Start the Frontend
```bash
cd c:\Users\Dell\Downloads\smart-bus-web-tracking-system
npm run dev
```
Expected output:
```
VITE v6.2.0  ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Testing on Mobile + Laptop

### Option 1: Same Network (Recommended)
1. Get your PC's IP: Open terminal and run `ipconfig`, find "IPv4 Address" (e.g., 192.168.1.100)
2. On laptop: `http://localhost:5173`
3. On mobile: `http://192.168.1.100:5173`

### Option 2: Using localhost with Forwarding
- If mobile and laptop are on the same network, use the IP method above
- Or use mobile browser remote debugging

## Test Flow
1. **Phone (Driver)**: Select "Driver" role → Keep "bus1" → Wait for requests
2. **Laptop (Student)**: Select "Student" role → Enter "bus1" → Click send
3. **Phone (Driver)**: You should now see "New Location Request!" popup ✅
4. **Driver accepts**: Location sharing starts automatically
5. **Laptop (Student)**: Map displays with bus location ✅

## What Changed

### Files Added
- `server.js` - WebSocket + REST API server

### Files Modified
- `App.tsx` - Added WebSocket client logic
- `package.json` - Added server scripts and dependencies

### Components Unchanged
- StudentPage.tsx, DriverPage.tsx, MapDisplay.tsx - No changes needed!

## Key Technical Points

**Before**: 
```
Phone Browser → Local State ← Separate Instance
Laptop Browser → Local State ← Separate Instance
❌ No communication between them
```

**After**:
```
Phone Browser ─┐
               ├→ WebSocket Server → Synced State
Laptop Browser ┘
✅ All browsers sync in real-time
```

## Debugging

**See what's happening:**
- Server: Terminal logs show all messages
- Client: Browser console (F12) shows connection status
- REST API: Visit `http://localhost:3000/api/requests` to see current state

**Reset state:**
- POST to `http://localhost:3000/api/reset`

## Port Info
- Server: `3000`
- Frontend: `5173`
- If ports are in use, change in `server.js` and Vite config
