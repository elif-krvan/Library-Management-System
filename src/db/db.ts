import knex, { Knex } from "knex";

class DB {    
    config: Knex.Config = {
        client: 'postgres',
        connection: {
            host: 'localhost:5432', //port isteyebilir
            user: 'postgres',
            password: '123456',
            database: 'api_proj',
        }
    }
    knx = knex(this.config);
}

const db = new DB();
export default db.knx;