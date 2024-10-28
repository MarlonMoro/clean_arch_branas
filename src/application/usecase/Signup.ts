// use case, entity
import { AccountRepository } from "../../infra/repository/AccountRepository";
import { MailerGateway } from "../../infra/gateway/MailerGateway";
import Account from "../../domain/Account";

export class Signup {
  constructor(readonly accountRepository: AccountRepository, readonly mailerGarteway: MailerGateway) {}

  async execute(input: any): Promise<Output> {
 
    const existingAccount = await this.accountRepository.getAccountByEmail(input.email);
    if (existingAccount) throw new Error("Account already exists");
    const account = Account.create(input.name, input.email, input.cpf, input.carPlate, input.isPassenger, input.isDriver);
    await this.accountRepository.saveAccount(account);
    await this.mailerGarteway.send(account.email, "Welcome!", "")
    return {
      accountId: account.id,
    };
  }
}

type Output = {
  accountId: string
}
