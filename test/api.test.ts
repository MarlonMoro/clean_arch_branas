import axios from "axios";

axios.defaults.validateStatus = function () {
	return true;
}

test("Deve criar uma conta para o passageiro", async function () {
	const input = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
	const createAccountResponse = await axios.post("http://localhost:3000/signup", input);
	const createdAccountId = createAccountResponse.data.accountId;
	expect(createAccountResponse.status).toBe(200);
	expect(createdAccountId).toBeDefined();
	const getAccountResposne = await axios.get(`http://localhost:3000/accounts/${createdAccountId}`)
	const account = getAccountResposne.data
	expect(getAccountResposne.status).toBe(200);
	expect(account.accountId).toBe(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();
	expect(account.carPlate).toBeNull();
});

test("Nao deve criar uma conta se o cpf for invalido", async function () {
	const input = {
		name: "John Document Invalid",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "01020304567",
		isPassenger: true
	};
	const createAccountResponse = await axios.post("http://localhost:3000/signup", input);
	const createdAccountId = createAccountResponse.data;
	expect(createAccountResponse.status).toBe(422);
	expect(createdAccountId.message).toBe("Invalid cpf");

});