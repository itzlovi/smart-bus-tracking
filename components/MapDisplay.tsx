
import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { BusLocation } from '../types';

// Fix for default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


interface MapUpdaterProps {
    center: [number, number];
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ center }) => {
    const map = useMap();
    useEffect(() => {
        console.log('[Map] Flying to new coordinates:', center);
        map.flyTo(center, map.getZoom());
    }, [center, map]);
    return null;
}

interface MapDisplayProps {
    location: BusLocation;
}

const MapDisplay: React.FC<MapDisplayProps> = ({ location }) => {
    const position: [number, number] = [location.lat, location.lng];
    const lastUpdated = new Date(location.updatedAt).toLocaleTimeString();

    return (
        <div className="h-[400px] md:h-[500px] w-full rounded-lg overflow-hidden shadow-md">
            <MapContainer center={position} zoom={15} scrollWheelZoom={true} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        Bus ID: {location.busId} <br /> Last updated: {lastUpdated}
                    </Popup>
                </Marker>
                <MapUpdater center={position} />
            </MapContainer>
        </div>
    );
};

export default MapDisplay;
