import Account from "../src/domain/Account";
import { GetAccount } from "../src/application/usecase/GetAccount"
import { Signup } from "../src/application/usecase/Signup"
import { AccountRepositoryDatabase, AccountRepositoryMemory } from "../src/infra/repository/AccountRepository";
import { MailerGatewayMemory } from "../src/infra/gateway/MailerGateway";
import sinon from "sinon"
import { PgPromiseAdapter } from "../src/infra/database/DatabaseConnection";

let signup: Signup;
let getAccount: GetAccount;

beforeEach(async () => {
	//Fake é uma implementação falsa que "supre" a necessidade daquele componente
	const AccountRepository = new AccountRepositoryMemory();
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(AccountRepository, mailerGateway);
	getAccount = new GetAccount(AccountRepository);
})


test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const signupOutput = await signup.execute(input);

	const createdAccountId = signupOutput.accountId;
	expect(createdAccountId).toBeDefined();
	const account = await getAccount.execute(createdAccountId);
	if(!account) {
		throw new Error();
	}
	expect(account.id).toBe(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();
});

test("Deve criar uma conta para o driver", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		carPlate: "AAA1010",
		isPassenger: false,
		isDriver: true
	};
	const signupOutput = await signup.execute(input);

	const createdAccountId = signupOutput.accountId;
	expect(createdAccountId).toBeDefined();
	const account = await getAccount.execute(createdAccountId);
	if(!account) {
		throw new Error();
	}
	expect(account.id).toBe(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeFalsy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeTruthy();
	expect(account.carPlate).toBe(input.carPlate)
});

test("Nao deve criar uma conta para o passageiro se o nome for invalido", async function () {
	const input = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid Name"));

});

test("Nao deve criar uma conta para o passageiro se o email for invalido", async function () {
	const input = {
		name: "John Email Invalid",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid email"));

});

test("Nao deve criar uma conta se o cpf for invalido", async function () {
	const input = {
		name: "John Document Invalid",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "01020304567",
		isPassenger: true
	};
	await expect(() => signup.execute(input)).rejects.toThrow(new Error("Invalid cpf"));

});

//Stub faz a sobrescrita do comportamento do método determinando somente o retorno dele
test("Deve criar uma conta para o passageiro com stub", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	
	const expectedAccount = Account.restore("null",input.name, input.email, input.cpf, null, input.isPassenger, false);

	const getAccounByEmailStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountByEmail").resolves(undefined);
	const saveAccountStub = sinon.stub(AccountRepositoryDatabase.prototype, "saveAccount").resolves();
	const getAccountByIdStub = sinon.stub(AccountRepositoryDatabase.prototype, "getAccountById").resolves(expectedAccount);

	const connection = new PgPromiseAdapter();
	const AccountRepository = new AccountRepositoryDatabase(connection);
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(AccountRepository, mailerGateway);
	const getAccount = new GetAccount(AccountRepository);
	
	const signupOutput = await signup.execute(input);
	const createdAccountId = signupOutput.accountId;

	expect(createdAccountId).toBeDefined();
	const account = await getAccount.execute(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();

	getAccounByEmailStub.restore();
	saveAccountStub.restore();
	getAccountByIdStub.restore();
	connection.close();
});

//Registra tudo o que aconteceu com o componente, e ao final é preciso fazer a verificação do que era esperado
test("Deve criar uma conta para o passageiro com spy", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const sendSpy = sinon.spy(MailerGatewayMemory.prototype, "send");
	const connection = new PgPromiseAdapter();
	const AccountRepository = new AccountRepositoryDatabase(connection);
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(AccountRepository, mailerGateway);
	const getAccount = new GetAccount(AccountRepository);
	
	const signupOutput = await signup.execute(input);
	const createdAccountId = signupOutput.accountId;

	expect(createdAccountId).toBeDefined();
	const account = await getAccount.execute(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();
	expect(sendSpy.calledOnce).toBe(true);
	expect(sendSpy.calledWith(input.email, "Welcome!", "")).toBe(true);
	sendSpy.restore();
	connection.close();
});

//Mock é uma mistura do spy com o stub. Criando as "expectativas" no próprio objeto mockado
test("Deve criar uma conta para o passageiro com mock", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};

	const sendMock = sinon.mock(MailerGatewayMemory.prototype);
	sendMock.expects("send").withArgs(input.email, "Welcome!", "").once();
	const connection = new PgPromiseAdapter();
	const AccountRepository = new AccountRepositoryDatabase(connection);
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(AccountRepository, mailerGateway);
	const getAccount = new GetAccount(AccountRepository);
	
	const signupOutput = await signup.execute(input);
	const createdAccountId = signupOutput.accountId;

	expect(createdAccountId).toBeDefined();
	const account = await getAccount.execute(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();
	sendMock.verify();
	sendMock.restore();
	connection.close();
});