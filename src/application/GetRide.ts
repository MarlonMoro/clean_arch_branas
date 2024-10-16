import { AccountDAO } from "../resource/AccountDAO";
import { RideDAO } from "../resource/RideDAO";


export class GetRide {

    constructor (readonly acountDAO: AccountDAO, readonly rideDAO: RideDAO){

    }

    async execute(input: Input): Promise<Output> {
        const ride = await this.rideDAO.getRideById(input.rideId);
        if(!ride)
            throw new Error("Ride not found");
        return {
            rideId: ride.ride_id,
            passengerId: ride.passenger_id,
            fromLat: ride.from_lat,
            fromLong: ride.from_long,
            toLat: ride.to_lat,
            toLong: ride.to_long,
            status: ride.status,
            passengerName: ride.passenger_name,
            passengerEmail: ride.passenger_email
        }
    }
}


type Input = {
    rideId: string
}

type Output = {
    rideId: string,
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number,
    status: string,
    passengerName: string,
    passengerEmail: string
}