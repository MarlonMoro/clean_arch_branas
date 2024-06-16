import crypto from "crypto";
import pgp from "pg-promise";
import { validate } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./resource";

export async function signup(input: any): Promise<any> {
  const account = input;
  try {
    account.id = crypto.randomUUID();
    const existingAccount = await getAccountByEmail(input.email);
    if (existingAccount) return -4;
    if (!account.name.match(/[a-zA-Z] [a-zA-Z]+/)) return -3;
    if (!account.email.match(/^(.+)@(.+)$/)) return -2;
    if (!validate(account.cpf)) return -1;
    if (
      !account.isDriver &&
      account.carPlate &&
      !account.carPlate.match(/[A-Z]{3}[0-9]{4}/)
    )
      return -5;
    await saveAccount(account);
    return {
      accountId: account.id,
    };
  } catch (e) {
    console.log(e);
  }
}

export async function getAccount(accountIdentifier: string) {
  const acc = await getAccountById(accountIdentifier)
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
