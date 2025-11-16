
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { BusRequest } from '../types';
import { ArrowLeft, Check, X, MapPin, Loader } from 'lucide-react';

interface DriverPageProps {
    driverBusId: string;
    requests: Record<string, BusRequest>;
    handleDriverResponse: (busId: string, response: 'accepted' | 'rejected') => void;
    updateLocation: (busId: string, lat: number, lng: number) => void;
    goBack: () => void;
}

const DriverPage: React.FC<DriverPageProps> = ({ driverBusId, requests, handleDriverResponse, updateLocation, goBack }) => {
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastLocation, setLastLocation] = useState<{lat: number, lng: number} | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const incomingRequest = useMemo(() => {
        return requests[driverBusId] && requests[driverBusId].status === 'pending'
            ? requests[driverBusId]
            : null;
    }, [requests, driverBusId]);

    const stopLocationSharing = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
            console.log('[Driver] Stopped sharing location.');
        }
        setIsSharing(false);
    };

    const startLocationSharing = () => {
        console.log('[Driver] Attempting to start location sharing...');
        setError(null);

        if (!navigator.geolocation) {
            setError('Geolocation is not supported by your browser.');
            console.error('[Driver] Geolocation not supported.');
            return;
        }

        stopLocationSharing(); // Ensure any previous watch is cleared

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log(`[Driver] Location update: ${latitude}, ${longitude}`);
                updateLocation(driverBusId, latitude, longitude);
                setLastLocation({ lat: latitude, lng: longitude });
                setIsSharing(true);
            },
            (err) => {
                console.error(`[Driver] Geolocation error: ${err.message}`);
                setError(`Location access denied. Please enable location services in your browser settings. Error code: ${err.code}`);
                setIsSharing(false);
                stopLocationSharing();
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    };
    
    const handleAccept = () => {
        if (incomingRequest) {
            console.log('[Driver] Accepted request.');
            handleDriverResponse(driverBusId, 'accepted');
            startLocationSharing();
        }
    };

    const handleReject = () => {
        if (incomingRequest) {
            console.log('[Driver] Rejected request.');
            handleDriverResponse(driverBusId, 'rejected');
        }
    };
    
    // Cleanup on component unmount
    useEffect(() => {
        return () => {
            stopLocationSharing();
        };
    }, []);

    const renderContent = () => {
        if (isSharing) {
            return (
                <div className="text-center p-8 bg-green-50 rounded-lg">
                    <div className="relative flex justify-center items-center">
                       <MapPin className="h-16 w-16 text-green-500" />
                       <div className="absolute top-0 right-0 bottom-0 left-0 animate-ping rounded-full bg-green-400 opacity-75"></div>
                    </div>
                    <p className="mt-4 font-semibold text-green-800 text-lg">Live Location Sharing Active</p>
                    <p className="text-sm text-green-700">Your location is being shared with the student.</p>
                    {lastLocation && (
                        <p className="text-xs text-gray-500 mt-2">
                           Last updated: {lastLocation.lat.toFixed(4)}, {lastLocation.lng.toFixed(4)}
                        </p>
                    )}
                    <button onClick={stopLocationSharing} className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
                        Stop Sharing
                    </button>
                </div>
            );
        }
        
        if (incomingRequest) {
             return (
                <div className="text-center p-8 border-4 border-dashed border-indigo-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800">New Location Request!</h3>
                    <p className="text-gray-600 my-4">A student has requested the live location of your bus ({driverBusId}).</p>
                    <div className="flex justify-center space-x-4 mt-6">
                        <button onClick={handleReject} className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2 font-bold">
                            <X size={20} />
                            <span>Reject</span>
                        </button>
                        <button onClick={handleAccept} className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors flex items-center space-x-2 font-bold">
                            <Check size={20} />
                            <span>Accept</span>
                        </button>
                    </div>
                </div>
            );
        }

        return (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Loader className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
                <p className="mt-4 font-semibold text-gray-600">Waiting for student requests...</p>
                <p className="text-sm text-gray-500">Your Bus ID is: <span className="font-bold text-indigo-600">{driverBusId}</span></p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto min-h-[500px] flex flex-col">
            <header className="flex items-center mb-4">
                <button onClick={goBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 ml-2">Driver Dashboard</h1>
            </header>
            <div className="flex-grow flex flex-col justify-center">
              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert">{error}</div>}
              {renderContent()}
            </div>
        </div>
    );
};

export default DriverPage;
