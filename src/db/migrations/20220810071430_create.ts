import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("user_role", (table) => {
        table.increments("id").notNullable().primary();
        table.string("user_id").notNullable();
        table.integer("role").notNullable();  
        table.foreign("user_id").references("user.user_id");
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("user_role");
}