import { Knex } from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable("user", (table) => {
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
    return knex.schema.dropTable("user");
}