import db from "../db";

class Migrate {

    async create_user_table(): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx.schema.createTable("user", (table) => {
                table.string("id").notNullable().primary();
                table.string("name").notNullable();
                table.string("surname").notNullable();
                table.integer("age").notNullable();
                table.boolean("send_ads").notNullable();
                table.date("signup_date").notNullable();
                table.string("email").notNullable().unique();

                console.log("himmm")
            })
            .catch((err) => {
                console.log(err);
                reject(false);
            }).finally(() => {
                console.log(3333)
                resolve(true);
            })            
        });        
    }
}

const migrate = new Migrate();
export default migrate;