import { Knex } from "knex";
import { UserStatus } from "../../enums/user-status";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.integer("status").notNullable().defaultTo(UserStatus.Pending);
        table.string("confirmation_code", 600).notNullable().defaultTo("null");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.dropColumn("status");
        table.dropColumn("confirmation_code");
    });
}