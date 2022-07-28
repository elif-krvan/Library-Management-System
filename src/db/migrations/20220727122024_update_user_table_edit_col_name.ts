import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.dropPrimary();
        table.renameColumn("id", "user_id");
        table.foreign("user_id")
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable("user", (table) => {
        table.dropForeign("user_id");
        table.renameColumn("user_id", "id");
    });
}