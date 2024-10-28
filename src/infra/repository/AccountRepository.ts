// framework and driver, interface adapter

import Account from "../../domain/Account";
import DatabaseConnection from "../database/DatabaseConnection";


export interface AccountRepository {
  getAccountByEmail(email: string): Promise<Account | undefined>;
  getAccountById(accountIdentifier: string): Promise<Account | undefined>;
  saveAccount(account: Account): Promise<void>;
}

export class AccountRepositoryDatabase implements AccountRepository {

  constructor(readonly connection: DatabaseConnection){
  }

  async getAccountByEmail(email: string): Promise<Account|undefined> {
    const [acc] = await this.connection.query("select * from cccat16.account where email = $1", [email]);
    if(!acc)
      return;
    return Account.restore(acc.account_id, acc.name, acc.email, acc.cpf, acc.car_plate, acc.is_passenger, acc.is_driver)
  }
  
  async getAccountById(accountId: string): Promise<Account|undefined> {
    const [acc] = await this.connection.query("select * from cccat16.account where account_id = $1", [accountId]);
    if(!acc)
      return;
    return  Account.restore(acc.account_id, acc.name, acc.email, acc.cpf, acc.car_plate, acc.is_passenger, acc.is_driver);
  }
  
  async saveAccount(account: Account) {
    await this.connection.query(
      "insert into cccat16.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)",
      [
        account.id,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
      ]
    );
  }

}

export class AccountRepositoryMemory implements AccountRepository {
  
  accounts: any[];

  constructor(){
    this.accounts = [];
  }
  
  async getAccountByEmail(email: string): Promise<any> {
    const account = this.accounts.find((account: any) => account.email === email);
    return account;
  }
  async getAccountById(accountIdentifier: string): Promise<any> {
    const account = this.accounts.find((account: any) => account.id === accountIdentifier);
    return account;
  }
  async saveAccount(account: any): Promise<void> {
    account.accountId = account.id
    this.accounts.push(account);
  }
  
}

