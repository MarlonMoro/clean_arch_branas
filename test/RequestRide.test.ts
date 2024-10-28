import { RequestRide } from '../src/application/usecase/RequestRide'
import { Signup } from '../src/application/usecase/Signup'
import { GetRide } from '../src/application/usecase/GetRide'
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository';
import sinon from 'sinon'
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository';
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway';
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection';

test("Deve solicitar uma corrida", async () => {
    const connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const mailerGateway = new MailerGatewayMemory();
    const signup = new Signup(accountRepository, mailerGateway);
    const signupInput = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    const signupOutput = await signup.execute(signupInput);
    const rideDAO = new RideRepositoryDatabase();
    const requestRide = new RequestRide(accountRepository, rideDAO);
    const requestRideInput = {
        passengerId: signupOutput.accountId,
        fromLat: 27,
        fromLong: 28,
        toLat: 55,
        toLong: 58
    }
    const rideOutput = await requestRide.execute(requestRideInput);
    const getRide = new GetRide(accountRepository, rideDAO);
    const ride = await getRide.execute(rideOutput)
    expect(ride.rideId).toBe(rideOutput.rideId);
    expect(ride.passengerId).toBe(signupOutput.accountId);
    expect(ride.passengerName).toBe(signupInput.name);
    expect(ride.passengerEmail).toBe(signupInput.email);
    connection.close();
});

test("Não deve criar uma corrida se não for passageiro", async function() {
    const input = {
        passengerId: "someInexistentId",
        fromLat: 150,
        fromLong: 200,
        toLat: 350,
        toLong: 200
    }
    
    const accountMock = sinon.mock(AccountRepositoryDatabase.prototype);
    accountMock.expects("getAccountById").withArgs(input.passengerId).resolves({
        is_passenger: false
    });
    const rideMock = sinon.mock(RideRepositoryDatabase.prototype);
    rideMock.expects("hasActiveRideByPassengerId").never();
    const connection = new PgPromiseAdapter();
    const sut = new RequestRide(new AccountRepositoryDatabase(connection), new RideRepositoryDatabase());
    await expect(() => sut.execute(input)).rejects.toThrow(new Error("Invalid passenger"));
    accountMock.verify();
    accountMock.restore();
    rideMock.verify();
    rideMock.restore();
    connection.close();
});

test("Não deve criar uma corrida com outra corrida ativa", async function() {
    const input = {
        passengerId: "somePassenger",
        fromLat: 150,
        fromLong: 200,
        toLat: 350,
        toLong: 200
    }
    
    const accountMock = sinon.mock(AccountRepositoryDatabase.prototype);
    accountMock.expects("getAccountById").withArgs(input.passengerId).once().resolves({
        isPassenger: true,
        id: input.passengerId
    });
    const rideMock = sinon.mock(RideRepositoryDatabase.prototype);
    rideMock.expects("hasActiveRideByPassengerId").withArgs(input.passengerId).once().resolves(true);
    const connection = new PgPromiseAdapter();
    const sut = new RequestRide(new AccountRepositoryDatabase(connection), new RideRepositoryDatabase());
    await expect(() => sut.execute(input)).rejects.toThrow(new Error("Ride active"));
    accountMock.verify();
    accountMock.restore();
    rideMock.verify();
    rideMock.restore();
    connection.close();

});