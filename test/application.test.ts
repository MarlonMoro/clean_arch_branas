import { getAccount, signup } from "../src/application"

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const signupOutput = await signup(input);

	const createdAccountId = signupOutput.accountId;
	expect(createdAccountId).toBeDefined();
	const account = await getAccount(createdAccountId);
	expect(account.accountId).toBe(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();
	expect(account.carPlate).toBeNull();
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
	const signupOutput = await signup(input);

	const createdAccountId = signupOutput.accountId;
	expect(createdAccountId).toBeDefined();
	const account = await getAccount(createdAccountId);
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
	await expect(() => signup(input)).rejects.toThrow(new Error("Invalid Name"));

});

test("Nao deve criar uma conta para o passageiro se o email for invalido", async function () {
	const input = {
		name: "John Email Invalid",
		email: `john.doe${Math.random()}gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	await expect(() => signup(input)).rejects.toThrow(new Error("Invalid email"));

});

test("Nao deve criar uma conta se o cpf for invalido", async function () {
	const input = {
		name: "John Document Invalid",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "01020304567",
		isPassenger: true
	};
	await expect(() => signup(input)).rejects.toThrow(new Error("Invalid cpf"));

});