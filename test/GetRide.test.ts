import { GetRide } from '../src/application/usecase/GetRide'
import { Signup } from '../src/application/usecase/Signup'
import { AccountRepositoryDatabase } from '../src/infra/repository/AccountRepository'
import { MailerGatewayMemory } from '../src/infra/gateway/MailerGateway'
import { RideRepositoryDatabase } from '../src/infra/repository/RideRepository'
import sinon from 'sinon'
import { PgPromiseAdapter } from '../src/infra/database/DatabaseConnection'

/*
test("Deve retornar erro se não encontrar a corrida", async () => {

    const input = {
        rideId: "someId"
    }
    const rideDAOMock = sinon.mock(RideRepositoryDatabase.prototype);
    rideDAOMock.expects("getRideById").withArgs(input.rideId).once().resolves(null)
    const sut = new GetRide(new accountRepositoryDatabase(),new RideRepositoryDatabase());
    await expect(() => sut.execute(input)).rejects.toThrow(new Error("Ride not found"));
    rideDAOMock
    rideDAOMock.restore();
}); */

test("Deve retornar uma corrida", async () => {
    const connection = new PgPromiseAdapter();
    const accountRepository = new AccountRepositoryDatabase(connection);
    const RideDAO = new RideRepositoryDatabase();
    const sut = new GetRide(accountRepository, RideDAO);
    const mailerGarteway = new MailerGatewayMemory();
    const signUp = new Signup(accountRepository, mailerGarteway)

    const singupInput = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

    const signupOutput = await signUp.execute(singupInput);
    connection.close();

    //const ride = sut.execute(])
})