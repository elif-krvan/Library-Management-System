import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_library");
}


export async function down(knex: Knex): Promise<void> {
}

