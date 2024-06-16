import { AccountDAO } from "../resource/AccountDAO";

export class GetAccount {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(accountIdentifier: string) {
    const acc = await this.accountDAO.getAccountById(accountIdentifier);
  if (!acc) {
    return;
  }
  const {
    account_id: accountId,
    is_passenger: isPassenger,
    is_driver: isDriver,
    car_plate: carPlate,
    ...otherProperties
  } = acc;
  return { accountId, isPassenger, isDriver, carPlate, ...otherProperties };
  }
}