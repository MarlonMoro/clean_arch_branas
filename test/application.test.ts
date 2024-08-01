import { GetAccount } from "../src/application/GetAccount"
import { Signup } from "../src/application/Signup"
import { AccountDAODatabase, AccountDAOMemory } from "../src/resource/AccountDAO";
import { MailerGatewayMemory } from "../src/resource/MailerGateway";
import sinon from "sinon"

let signup: Signup;
let getAccount: GetAccount;

beforeEach(async () => {
	//Fake é uma implementação falsa que "supre" a necessidade daquele componente
	const accountDAO = new AccountDAOMemory();
	const mailerGateway = new MailerGatewayMemory();
	signup = new Signup(accountDAO, mailerGateway);
	getAccount = new GetAccount(accountDAO);
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
	expect(account.accountId).toBe(createdAccountId);
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
	expect(account.accountId).toBe(createdAccountId);
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

	const expectedAccount = {
		account_id: null,
		is_passenger: input.isPassenger,
		is_driver: null,
		car_plate: null,
		...input
	}

	const getAccounByEmailStub = sinon.stub(AccountDAODatabase.prototype, "getAccountByEmail").resolves(null);
	const saveAccountStub = sinon.stub(AccountDAODatabase.prototype, "saveAccount").resolves();
	const getAccountByIdStub = sinon.stub(AccountDAODatabase.prototype, "getAccountById").resolves(expectedAccount);

	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountDAO, mailerGateway);
	const getAccount = new GetAccount(accountDAO);
	
	const signupOutput = await signup.execute(input);
	const createdAccountId = signupOutput.accountId;
	expectedAccount.account_id = createdAccountId;

	expect(createdAccountId).toBeDefined();
	const account = await getAccount.execute(createdAccountId);
	expect(account.accountId).toBe(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();

	getAccounByEmailStub.restore();
	saveAccountStub.restore();
	getAccountByIdStub.restore();
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

	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountDAO, mailerGateway);
	const getAccount = new GetAccount(accountDAO);
	
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
	const accountDAO = new AccountDAODatabase();
	const mailerGateway = new MailerGatewayMemory();
	const signup = new Signup(accountDAO, mailerGateway);
	const getAccount = new GetAccount(accountDAO);
	
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
});