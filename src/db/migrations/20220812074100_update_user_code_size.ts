import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.string("confirmation_code", 255).alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.string("confirmation_code", 600).alter();
    });
}