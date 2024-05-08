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
	const getAccountResposne = await axios.get(`http://localhost:3000/account/${createdAccountId}`)
	const account = getAccountResposne.data
	expect(createAccountResponse.status).toBe(200);
	expect(getAccountResposne.status).toBe(200);
	expect(account.accountId).toBe(createdAccountId);
	expect(account.name).toBe(input.name);
	expect(account.isPassenger).toBeTruthy();
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
	expect(account.isDriver).toBeFalsy();
	expect(account.carPlate).toBeUndefined();
});
