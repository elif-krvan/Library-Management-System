import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.table("books", (table) => {
        table.integer("publish_date").alter();        
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.table("books", (table) => {
        table.string("publish_date").alter();        
    });
}