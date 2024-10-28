import pgp from 'pg-promise';
import Ride from '../../domain/Ride';


export interface RideRepository {
    getRideById(id: string): Promise<Ride>;
    hasActiveRideByPassengerId(passengerId: string): Promise<boolean>;
    saveRide(ride: Ride): Promise<any>;
    
}

export class RideRepositoryDatabase implements RideRepository {
    async saveRide(ride: Ride): Promise<any> {
        const connection = pgp()("postgres://api:password@localhost:5432/database");
		await connection.query(
            "insert into cccat16.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [
            ride.rideId,
            ride.passengerId,
            null,
            ride.status,
            null,
            null,
            ride.fromLat,
            ride.fromLong,
            ride.toLat,
            ride.toLong,
            ride.date
            ]
        );
        await connection.$pool.end();
    }
    
    async hasActiveRideByPassengerId(passengerId: string): Promise<boolean> {
        const connection = pgp()("postgres://api:password@localhost:5432/database");
		const [rideData] = await connection.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
		await connection.$pool.end();
		return !!rideData;
    }
    
    async getRideById(id: string): Promise<Ride> {
    const connection = pgp()("postgres://api:password@localhost:5432/database");
    const [ride] = await connection.query("select * from cccat16.ride where ride_id = $1", [id]);
    await connection.$pool.end();
    return Ride.restore(ride.ride_id, ride.passenger_id, parseFloat(ride.from_lat), parseFloat(ride.from_long), parseFloat(ride.to_lat), parseFloat(ride.to_long), ride.status, ride.date);
    }
    
}