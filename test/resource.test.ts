import crypto from "crypto";
import { saveAccount, getAccountById, getAccountByEmail } from "../src/resource";

test("Deve salvar um registro na tabela account e consultar por id", async function() {
    const account = {
        id: crypto.randomUUID(),
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    await saveAccount(account);
    const savedAccount = await getAccountById(account.id)
    expect(savedAccount.account_id).toBe(account.id);
	expect(savedAccount.name).toBe(account.name);
	expect(savedAccount.is_passenger).toBeTruthy();
	expect(savedAccount.email).toBe(account.email);
	expect(savedAccount.cpf).toBe(account.cpf);
	expect(savedAccount.is_driver).toBeFalsy();
	expect(savedAccount.car_plate).toBeNull();
});

test("Deve salvar um registro na tabela account e consultar por email", async function() {
    const account = {
        id: crypto.randomUUID(),
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "87748248800",
		isPassenger: true
	};
    await saveAccount(account);
    const savedAccount = await getAccountByEmail(account.email)
    expect(savedAccount.account_id).toBe(account.id);
	expect(savedAccount.name).toBe(account.name);
	expect(savedAccount.is_passenger).toBeTruthy();
	expect(savedAccount.email).toBe(account.email);
	expect(savedAccount.cpf).toBe(account.cpf);
	expect(savedAccount.is_driver).toBeFalsy();
	expect(savedAccount.car_plate).toBeNull();
});