
import React, { useState, useEffect, useMemo } from 'react';
import { BusRequest, BusLocation } from '../types';
import MapDisplay from './MapDisplay';
import { ArrowLeft, Send, Loader, XCircle, MapPin } from 'lucide-react';

interface StudentPageProps {
    requests: Record<string, BusRequest>;
    locations: Record<string, BusLocation>;
    requestLocation: (busId: string) => void;
    goBack: () => void;
}

const StudentPage: React.FC<StudentPageProps> = ({ requests, locations, requestLocation, goBack }) => {
    const [busId, setBusId] = useState('');
    const [submittedBusId, setSubmittedBusId] = useState('');

    const request = useMemo(() => {
        return submittedBusId ? requests[submittedBusId] : null;
    }, [requests, submittedBusId]);

    const location = useMemo(() => {
        return submittedBusId ? locations[submittedBusId] : null;
    }, [locations, submittedBusId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (busId.trim()) {
            setSubmittedBusId(busId.trim());
            requestLocation(busId.trim());
            console.log(`[Student] Requesting location for bus: ${busId.trim()}`);
        }
    };
    
    const reset = () => {
        setBusId('');
        setSubmittedBusId('');
    }

    const renderStatus = () => {
        if (!request) {
            return null;
        }

        switch (request.status) {
            case 'pending':
                return (
                    <div className="text-center p-8 bg-blue-50 rounded-lg animate-pulse">
                        <Loader className="mx-auto h-12 w-12 text-blue-500" />
                        <p className="mt-4 font-semibold text-blue-700">Waiting for driver response...</p>
                        <p className="text-sm text-blue-600">Request sent for Bus ID: {submittedBusId}</p>
                    </div>
                );
            case 'rejected':
                return (
                    <div className="text-center p-8 bg-red-50 rounded-lg">
                        <XCircle className="mx-auto h-12 w-12 text-red-500" />
                        <p className="mt-4 font-semibold text-red-700">Request Denied</p>
                        <p className="text-sm text-red-600">The driver of bus {submittedBusId} has denied your location request.</p>
                        <button onClick={reset} className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                            Try Again
                        </button>
                    </div>
                );
            case 'accepted':
                 if (location) {
                    return <MapDisplay location={location} />;
                 }
                 return (
                    <div className="text-center p-8 bg-green-50 rounded-lg animate-pulse">
                        <MapPin className="mx-auto h-12 w-12 text-green-500" />
                        <p className="mt-4 font-semibold text-green-700">Request Accepted!</p>
                        <p className="text-sm text-green-600">Waiting for first location update...</p>
                    </div>
                 );
            default:
                return null;
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md mx-auto min-h-[500px] flex flex-col">
            <header className="flex items-center mb-4">
                <button onClick={goBack} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
                    <ArrowLeft className="h-5 w-5 text-gray-600" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 ml-2">Student Dashboard</h1>
            </header>

            {!submittedBusId || (request && request.status === 'rejected') ? (
                <div className="flex-grow flex flex-col justify-center">
                    <h2 className="text-lg font-semibold text-gray-700 mb-1">Track Your Bus</h2>
                    <p className="text-gray-500 mb-4">Enter the Bus ID to request its live location.</p>
                    <form onSubmit={handleSubmit} className="flex space-x-2">
                        <input
                            type="text"
                            value={busId}
                            onChange={(e) => setBusId(e.target.value)}
                            placeholder="e.g., bus1"
                            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                        />
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors flex items-center justify-center w-12 h-12"
                            disabled={!busId.trim()}
                        >
                            <Send className="h-5 w-5" />
                        </button>
                    </form>
                </div>
            ) : (
                <div className="flex-grow flex flex-col">
                   {renderStatus()}
                </div>
            )}
        </div>
    );
};

export default StudentPage;
