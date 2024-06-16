import pgp from "pg-promise";


export interface AccountDAO {
  getAccountByEmail(email: string): Promise<any>;
  getAccountById(accountIdentifier: string): Promise<any>;
  saveAccount(account: any): Promise<void>;
}

export class AccountDAODatabase implements AccountDAO {

  async getAccountByEmail(email: string) {
    const connection = pgp()("postgres://api:password@localhost:5432/database");
    const [acc] = await connection.query("select * from cccat16.account where email = $1", [email]);
    await connection.$pool.end();
    return acc;
  }
  
  async getAccountById(accountId: string) {
    const connection = pgp()("postgres://api:password@localhost:5432/database");
    const [acc] = await connection.query("select * from cccat16.account where account_id = $1", [accountId]);
    await connection.$pool.end();
    return acc;
  }
  
  async saveAccount(account: any) {
    const connection = pgp()("postgres://api:password@localhost:5432/database");
    await connection.query(
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
    await connection.$pool.end();
  }

}

export class AccountDAOMemory implements AccountDAO {
  
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

