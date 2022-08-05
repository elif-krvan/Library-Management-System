import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable("books", (table) => {
        table.increments("id").notNullable().primary();
        table.string("isbn").notNullable().unique();
        table.string("title").notNullable();
        table.specificType("author", "TEXT[]").notNullable();
        table.string("publisher").notNullable();
        table.date("publish_date").notNullable();     
        table.string("cover");     
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable("books");
}

