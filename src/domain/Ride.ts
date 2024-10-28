import crypto from 'crypto'
export default class Ride {
    private constructor(readonly rideId: string, readonly passengerId: string, readonly fromLat: number, readonly fromLong: number, 
        readonly toLat: number, readonly toLong: number, readonly status: string, readonly date: Date) {
    }

    static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number): Ride {
        return new Ride(crypto.randomUUID(), passengerId, fromLat, fromLong, toLat, toLong, "requested", new Date());
    }

    static restore(rideId: string, passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number, status: string, date: Date): Ride {
        return new Ride(rideId, passengerId, fromLat, fromLong, toLat, toLong, status, date);
    }
}