import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.timestamp("signup_date").alter();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.dateTime("signup_date").alter();
    });
}

