import { AccountDAO } from "../resource/AccountDAO";
import { RideDAO } from "../resource/RideDAO";
import crypto from 'crypto'

export class RequestRide {

    constructor(readonly accountDAO: AccountDAO, readonly rideDAO: RideDAO) {}

    async execute(input: Input) {
        const account = await this.accountDAO.getAccountById(input.passengerId);
        if(!account || !account.is_passenger)
            throw new Error("Invalid passenger");
        
        const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(account.account_id);
        if(hasActiveRide)
            throw new Error("Ride active");

        const newRide = {
            id: crypto.randomUUID(),
            passenger_id: account.account_id,
            driver_id: null,
            status: 'requested',
            date: new Date(),
            from_lat: input.fromLat,
            from_long: input.fromLong,
            to_lat: input.toLat,
            to_long: input.toLong,
            fare: null,
            distance: null
        }

        await this.rideDAO.saveRide(newRide);

        return newRide;

    }

}

type Input = {
    passengerId: string,
    fromLat: number,
    fromLong: number,
    toLat: number,
    toLong: number
}

type Output = {
    reideId: string
}