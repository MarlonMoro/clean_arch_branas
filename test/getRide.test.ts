import { GetRide } from '../src/application/GetRide'
import { AccountDAODatabase } from '../src/resource/AccountDAO'
import { RideDAODatabase } from '../src/resource/RideDAO'
import sinon from 'sinon'

test("Deve retornar erro se não encontrar a corrida", async () => {

    const input = {
        rideId: "someId"
    }
    const rideDAOMock = sinon.mock(RideDAODatabase.prototype);
    rideDAOMock.expects("getRideById").withArgs(input.rideId).once().resolves(null)
    const sut = new GetRide(new AccountDAODatabase(),new RideDAODatabase());
    await expect(() => sut.execute(input)).rejects.toThrow(new Error("Ride not found"));
    rideDAOMock
    rideDAOMock.restore();
})