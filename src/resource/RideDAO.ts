import pgp from 'pg-promise';


export interface RideDAO {
    getRideById(id: string): Promise<any>;
    hasActiveRideByPassengerId(passengerId: string): Promise<any>;
    saveRide(ride: any): Promise<any>;
}

export class RideDAODatabase implements RideDAO {
    async saveRide(ride: any): Promise<any> {
        const connection = pgp()("postgres://api:password@localhost:5432/database");
		await connection.query(
            "insert into cccat16.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)",
            [
            ride.id,
            ride.passenger_id,
            ride.driver_id,
            ride.status,
            ride.fare,
            ride.distance,
            ride.from_lat,
            ride.from_long,
            ride.to_lat,
            ride.to_long,
            ride.date
            ]
        );
        await connection.$pool.end();
    }
    
    async hasActiveRideByPassengerId(passengerId: string): Promise<any> {
        const connection = pgp()("postgres://api:password@localhost:5432/database");
		const [rideData] = await connection.query("select * from cccat16.ride where passenger_id = $1 and status <> 'completed'", [passengerId]);
		await connection.$pool.end();
		return !!rideData;
    }
    
    async getRideById(id: string): Promise<any> {
    const connection = pgp()("postgres://api:password@localhost:5432/database");
    const [ride] = await connection.query("select * from cccat16.ride where ride_id = $1", [id]);
    await connection.$pool.end();
    return ride;
    }
    
}