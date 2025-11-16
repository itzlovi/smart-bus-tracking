
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Role, BusRequest, BusLocation } from './types';
import RoleSelector from './components/RoleSelector';
import StudentPage from './components/StudentPage';
import DriverPage from './components/DriverPage';

// Get backend URL from environment or use localhost for development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'ws://localhost:3000';
const BACKEND_REST_URL = import.meta.env.VITE_BACKEND_REST_URL || 'http://localhost:3000';

const App: React.FC = () => {
    const [role, setRole] = useState<Role | null>(null);
    const [requests, setRequests] = useState<Record<string, BusRequest>>({});
    const [locations, setLocations] = useState<Record<string, BusLocation>>({});
    const [error, setError] = useState<string | null>(null);
    const wsRef = useRef<WebSocket | null>(null);
    const [connected, setConnected] = useState(false);

    // WebSocket connection setup
    useEffect(() => {
        const ws = new WebSocket(BACKEND_URL);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log('[App] WebSocket connected to:', BACKEND_URL);
            setConnected(true);
            setError(null);
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                console.log('[App] Received message:', message);

                if (message.type === 'init' || message.type === 'update') {
                    setRequests(message.requests || {});
                    setLocations(message.locations || {});
                }
            } catch (err) {
                console.error('[App] Error parsing message:', err);
            }
        };

        ws.onerror = () => {
            console.error('[App] WebSocket error');
            setConnected(false);
            setError('Connection to server failed. Make sure the server is running.');
        };

        ws.onclose = () => {
            console.log('[App] WebSocket disconnected');
            setConnected(false);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, []);

    const handleRoleSelect = (selectedRole: Role) => {
        setRole(selectedRole);
    };

    const requestLocation = useCallback((busId: string) => {
        console.log(`[App] Student requesting location for busId: ${busId}`);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'request',
                busId
            }));
        } else {
            setError('Not connected to server');
        }
    }, []);

    const handleDriverResponse = useCallback((busId: string, response: 'accepted' | 'rejected') => {
        console.log(`[App] Driver for busId: ${busId} responded with: ${response}`);
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'response',
                busId,
                response
            }));
        } else {
            setError('Not connected to server');
        }
    }, []);

    const updateLocation = useCallback((busId: string, lat: number, lng: number) => {
        console.log(`[App] Updating location for busId: ${busId}`, { lat, lng });
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
                type: 'location',
                busId,
                lat,
                lng
            }));
        } else {
            setError('Not connected to server');
        }
    }, []);
    
    const goBack = () => {
        setRole(null);
        // Reset state for a clean demo restart
        setRequests({});
        setLocations({});
        setError(null);
    }

    const renderContent = () => {
        switch (role) {
            case Role.STUDENT:
                return (
                    <StudentPage
                        requests={requests}
                        locations={locations}
                        requestLocation={requestLocation}
                        goBack={goBack}
                    />
                );
            case Role.DRIVER:
                return (
                    <DriverPage
                        // For this demo, the driver is hardcoded to "bus1"
                        driverBusId="bus1" 
                        requests={requests}
                        handleDriverResponse={handleDriverResponse}
                        updateLocation={updateLocation}
                        goBack={goBack}
                    />
                );
            default:
                return <RoleSelector onSelectRole={handleRoleSelect} />;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center font-sans p-4">
            {!connected && (
                <div className="fixed top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg z-50">
                    ⚠️ Not connected to server. Make sure to run: <code className="bg-red-200 px-2 py-1 rounded">npm run server</code>
                </div>
            )}
            <div className="w-full max-w-md mx-auto">
                {renderContent()}
            </div>
        </div>
    );
};

export default App;
