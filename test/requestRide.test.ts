import { RequestRide } from '../src/application/RequestRide'
import { AccountDAODatabase } from '../src/resource/AccountDAO';
import sinon from 'sinon'
import { RideDAODatabase } from '../src/resource/RideDAO';

test("Não deve criar uma corrida se não for passageiro", async function() {
    const input = {
        passengerId: "someInexistentId",
        fromLat: 150,
        fromLong: 200,
        toLat: 350,
        toLong: 200
    }
    
    const accountMock = sinon.mock(AccountDAODatabase.prototype);
    accountMock.expects("getAccountById").withArgs(input.passengerId).resolves({
        is_passenger: false
    });
    const rideMock = sinon.mock(RideDAODatabase.prototype);
    rideMock.expects("hasActiveRideByPassengerId").never();
    const sut = new RequestRide(new AccountDAODatabase(), new RideDAODatabase());
    await expect(() => sut.execute(input)).rejects.toThrow(new Error("Invalid passenger"));
    accountMock.verify();
    accountMock.restore();
    rideMock.verify();
    rideMock.restore();

});

test("Não deve criar uma corrida com outra corrida ativa", async function() {
    const input = {
        passengerId: "somePassenger",
        fromLat: 150,
        fromLong: 200,
        toLat: 350,
        toLong: 200
    }
    
    const accountMock = sinon.mock(AccountDAODatabase.prototype);
    accountMock.expects("getAccountById").withArgs(input.passengerId).once().resolves({
        is_passenger: true,
        account_id: input.passengerId
    });
    const rideMock = sinon.mock(RideDAODatabase.prototype);
    rideMock.expects("hasActiveRideByPassengerId").withArgs(input.passengerId).once().resolves(true);
    const sut = new RequestRide(new AccountDAODatabase(), new RideDAODatabase());
    await expect(() => sut.execute(input)).rejects.toThrow(new Error("Ride active"));
    accountMock.verify();
    accountMock.restore();
    rideMock.verify();
    rideMock.restore();

});