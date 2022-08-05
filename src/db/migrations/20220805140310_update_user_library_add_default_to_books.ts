import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("user_library", (table) => {
        table.specificType("books", "TEXT[]").defaultTo("{}").alter();        
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("user_library", (table) => {
        table.specificType("books", "TEXT[]").alter();        
    });
}