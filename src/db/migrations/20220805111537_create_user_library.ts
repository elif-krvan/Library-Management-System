import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_library", (table) => {
        table.increments("id").notNullable().primary();
        table.string("user_id").notNullable().unique();
        table.specificType("books", "TEXT[]");   
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_library");
}