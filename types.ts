
export enum Role {
    STUDENT = 'STUDENT',
    DRIVER = 'DRIVER',
}

export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'tracking';

export interface BusRequest {
    busId: string;
    status: 'pending' | 'accepted' | 'rejected';
    requestedAt: number;
}

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface BusLocation extends Coordinates {
    busId: string;
    updatedAt: number;
}
