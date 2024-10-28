import { AccountRepositoryDatabase } from "../src/infra/repository/AccountRepository";
import Account from "../src/domain/Account";
import { PgPromiseAdapter} from "../src/infra/database/DatabaseConnection";

test("Deve salvar um registro na tabela account e consultar por id", async function() {

	const account = Account.create("John due",  `john.doe${Math.random()}@gmail.com`, "87748248800", null, true, false)
	const connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
    await accountRepository.saveAccount(account);
    const savedAccount = await accountRepository.getAccountById(account.id)
	expect(savedAccount?.name).toBe(account.name);
	expect(savedAccount?.isPassenger).toBeTruthy();
	expect(savedAccount?.email).toBe(account.email);
	expect(savedAccount?.cpf).toBe(account.cpf);
	expect(savedAccount?.isDriver).toBeFalsy();
	expect(savedAccount?.carPlate).toBeNull();
	connection.close();
});

test("Deve salvar um registro na tabela account e consultar por email", async function() {

	const account = Account.create("John due",  `john.doe${Math.random()}@gmail.com`, "87748248800", null, true, false)	
	const connection = new PgPromiseAdapter();
	const accountRepository = new AccountRepositoryDatabase(connection);
    await accountRepository.saveAccount(account);
    const savedAccount = await accountRepository.getAccountByEmail(account.email)
	expect(savedAccount?.name).toBe(account.name);
	expect(savedAccount?.isPassenger).toBeTruthy();
	expect(savedAccount?.email).toBe(account.email);
	expect(savedAccount?.cpf).toBe(account.cpf);
	expect(savedAccount?.isDriver).toBeFalsy();
	expect(savedAccount?.carPlate).toBeNull();
	connection.close();
});