import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    knex.schema.alterTable("user", (table) => {
        table.string("password").defaultTo("").notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    knex.schema.alterTable("user", (table) => {
        table.dropColumn("password");
    });
}