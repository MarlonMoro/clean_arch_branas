import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepositoryDatabase }from "../../infra/repository/RideRepository";


export class GetRide {

    constructor (readonly acountDAO: AccountRepository, readonly rideDAO: RideRepositoryDatabase){

    }

    async execute(input: Input): Promise<Output> {
        const ride = await this.rideDAO.getRideById(input.rideId);
        if(!ride)
            throw new Error("Ride not found");

        const passenger = await this.acountDAO.getAccountById(ride.passengerId);

        if(!passenger)
            throw new Error("Ride not found");

        return {
            ...ride,
            passengerName: passenger.name,
            passengerEmail: passenger.email
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