import { Knex } from "knex";
import db from "../db";


export async function up(knex: Knex) {
    return db.knx.schema.createTable("user", (table) => {
        table.string("id").notNullable().primary();
        table.string("name").notNullable();
        table.string("surname").notNullable();
        table.integer("age").notNullable();
        table.boolean("send_ads").notNullable();
        table.date("signup_date").notNullable();
        table.string("email").notNullable().unique();       
    });
}


export async function down(knex: Knex): Promise<void> {
    return db.knx.schema.dropTable("user");
}

