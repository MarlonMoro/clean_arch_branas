import pgp from "pg-promise";

export default interface DatabaseConnection {

    query(stament: string, params: any): Promise<any>;
    close(): Promise<any>;
}


export class PgPromiseAdapter implements DatabaseConnection {
    connection: any;

    constructor() {
        this.connection = pgp()("postgres://api:password@localhost:5432/database");
    }

    query(stament: string, params: any): Promise<any> {
        return this.connection.query(stament, params);
    }
    close(): Promise<any> {
        return this.connection.$pool.end();
    }

}