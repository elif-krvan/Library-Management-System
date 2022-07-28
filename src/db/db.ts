import knex, { Knex } from "knex";
import { DBExc } from "../common/exception";
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

    mig_config: Knex.MigratorConfig = {
        directory: "./src/db/migrations",
        tableName: "knex_migrations"
    }
    
    knx: Knex = knex(this.config);

    async start(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {

            this.knx.migrate.latest(this.mig_config).then(async (res) => {
                console.log(res);
                console.log("migration completed successfuly");

                await this.knx.raw('SELECT now()')
                .catch((err) => {
                    console.log(err);
                    reject(new Error('unable to connect to Postgres via Knex, please ensure a valid connection.'));
                })
                .finally(() => {
                    console.log(`db connected on port ${config.PG_PORT} at ${config.PG_HOST} in ${config.STAT} mode`);
                    resolve(true);
                });
            })
            .catch((err) => {
                const result = this.knx.migrate.rollback();
                console.log(result);
                reject(new DBExc(err));
            });         
        });
    }
}

const db = new DB();
export default db;