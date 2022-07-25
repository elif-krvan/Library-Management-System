import db from "../db";

export class MigrateUser {
    constructor() {

    }

    create_user_table() {
        db.schema.createTable("user", (table: any) => {
            table.increments();
            table.string("user_id");
            table.string("name");
            table.string("surname");
            table.int("age");
            table.boolean("send_ads");
        })
    }
} 