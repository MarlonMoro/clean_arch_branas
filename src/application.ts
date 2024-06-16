import crypto from "crypto";
import { validate } from "./validateCpf";
import { getAccountByEmail, getAccountById, saveAccount } from "./resource";

export async function signup(input: any): Promise<any> {
  const account = input;
  account.id = crypto.randomUUID();
  const existingAccount = await getAccountByEmail(input.email);
  if (existingAccount) throw new Error("Account already exists");
  if (!account.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid Name");
  if (!account.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
  if (!validate(account.cpf)) throw new Error("Invalid cpf");
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
