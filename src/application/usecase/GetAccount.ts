import { AccountRepository } from "../../infra/repository/AccountRepository";
import Account from "../../domain/Account";

export class GetAccount {
  constructor(readonly accountRepository: AccountRepository) {}

  async execute(accountIdentifier: string): Promise<any> {
    const acc = await this.accountRepository.getAccountById(accountIdentifier);
  if (!acc) {
    return;
  }

  return acc;
  }
}