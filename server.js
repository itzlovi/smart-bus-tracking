import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Store data in memory (in production, use a database)
let requests = {};
let locations = {};
let responses = {};
const clients = new Set();

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('New client connected');
    clients.add(ws);

    // Send current state to new client
    ws.send(JSON.stringify({
        type: 'init',
        requests,
        locations
    }));

    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            console.log('Received message:', message);

            if (message.type === 'request') {
                // Student requesting location
                requests[message.busId] = {
                    busId: message.busId,
                    status: 'pending',
                    requestedAt: Date.now()
                };
                broadcastUpdate();
            } else if (message.type === 'response') {
                // Driver responding to request
                if (requests[message.busId]) {
                    requests[message.busId].status = message.response;
                    broadcastUpdate();
                }
            } else if (message.type === 'location') {
                // Driver updating location
                locations[message.busId] = {
                    busId: message.busId,
                    lat: message.lat,
                    lng: message.lng,
                    updatedAt: Date.now()
                };
                broadcastUpdate();
            }
        } catch (err) {
            console.error('Error processing message:', err);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

function broadcastUpdate() {
    const update = JSON.stringify({
        type: 'update',
        requests,
        locations
    });
    
    clients.forEach((client) => {
        if (client.readyState === 1) { // WebSocket.OPEN
            client.send(update);
        }
    });
}

// REST API Endpoints (for Streamlit and other clients)
app.post('/api/request', (req, res) => {
    const { busId } = req.body;
    if (!busId) {
        return res.status(400).json({ error: 'busId required' });
    }
    requests[busId] = {
        busId,
        status: 'pending',
        requestedAt: Date.now()
    };
    broadcastUpdate();
    res.json({ success: true, message: 'Request created' });
});

app.get('/api/requests/:busId', (req, res) => {
    const { busId } = req.params;
    const request = requests[busId];
    if (!request) {
        return res.json({});
    }
    res.json(request);
});

app.get('/api/status/:busId', (req, res) => {
    const { busId } = req.params;
    res.json({
        status: requests[busId]?.status || 'none',
        location: locations[busId] || null
    });
});

app.post('/api/respond', (req, res) => {
    const { busId, response } = req.body;
    if (!busId || !response) {
        return res.status(400).json({ error: 'busId and response required' });
    }
    if (requests[busId]) {
        requests[busId].status = response;
        responses[busId] = response;
    }
    broadcastUpdate();
    res.json({ success: true, message: `Request ${response}` });
});

app.post('/api/location', (req, res) => {
    const { busId, lat, lng } = req.body;
    if (!busId || lat === undefined || lng === undefined) {
        return res.status(400).json({ error: 'busId, lat, lng required' });
    }
    locations[busId] = {
        busId,
        lat,
        lng,
        updatedAt: Date.now()
    };
    broadcastUpdate();
    res.json({ success: true, message: 'Location updated' });
});

// Get all requests
app.get('/api/requests', (req, res) => {
    res.json(requests);
});

// Get all locations
app.get('/api/locations', (req, res) => {
    res.json(locations);
});

// Reset all data
app.post('/api/reset', (req, res) => {
    requests = {};
    locations = {};
    responses = {};
    broadcastUpdate();
    res.json({ success: true, message: 'State reset' });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket server running on ws://localhost:${PORT}`);
    console.log(`📡 REST API available at http://localhost:${PORT}/api`);
});
