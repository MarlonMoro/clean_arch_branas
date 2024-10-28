import crypto from 'crypto'
import { validate } from './validateCpf';

export default class Account {

    private constructor(readonly id: string, readonly name: string, readonly email: string, readonly cpf: string, readonly carPlate: string | null, readonly isPassenger: boolean, readonly isDriver: boolean=false) {
        if (!this.name.match(/[a-zA-Z] [a-zA-Z]+/))
            throw new Error("Invalid Name");
          if (!this.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
          if (!validate(this.cpf)) throw new Error("Invalid cpf");
          if (
            !this.isDriver &&
            this.carPlate &&
            !this.carPlate.match(/[A-Z]{3}[0-9]{4}/)
          )
            throw new Error("Invalid carPlate");
    }

    static create(name: string, email: string, cpf: string, carPlate: string | null, isPassenger: boolean, isDriver: boolean) {
        const accountId = crypto.randomUUID();
        return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);
    }

    static restore(accountId: string, name: string, email: string, cpf: string, carPlate: string | null, isPassenger: boolean, isDriver: boolean) {
        return new Account(accountId, name, email, cpf, carPlate, isPassenger, isDriver);

    }
}