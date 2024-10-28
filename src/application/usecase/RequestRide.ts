import { AccountRepository } from "../../infra/repository/AccountRepository";
import { RideRepositoryDatabase } from "../../infra/repository/RideRepository";
import Ride from "../../domain/Ride";

export class RequestRide {

    constructor(readonly accountRepository: AccountRepository, readonly rideDAO: RideRepositoryDatabase) {}

    async execute(input: Input): Promise<Output> {
        const account = await this.accountRepository.getAccountById(input.passengerId);
        if(!account || !account.isPassenger)
            throw new Error("Invalid passenger");
        
        const hasActiveRide = await this.rideDAO.hasActiveRideByPassengerId(account.id);
        if(hasActiveRide)
            throw new Error("Ride active");

        const newRide = Ride.create(input.passengerId, input.fromLat, input.fromLong, input.toLat, input.toLong);

        await this.rideDAO.saveRide(newRide);

        return { rideId: newRide.rideId };

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
    rideId: string
}