import knex, { Knex } from "knex";
import config from "../config";

class DB {  
    config: Knex.Config = {
        client: 'postgres',
        connection: {
            host: config.PG_HOST,
            user: config.PG_USER,
            password: config.PG_PASS,
            database: config.PG_DB,
            port: config.PG_PORT
        }
    }
    
    knx: Knex = knex(this.config);;
    async start(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            console.log(`db connected on port ${config.PG_PORT} at ${config.PG_HOST} in ${config.STAT} mode`);

            await this.knx.raw('SELECT now()')
            .catch((err) => {
                console.log(err);
                reject(new Error('Unable to connect to Postgres via Knex. Ensure a valid connection.'));
            })
            .finally(() => {
                resolve(true);
            });
        });
    }
}

const db = new DB();
export default db;