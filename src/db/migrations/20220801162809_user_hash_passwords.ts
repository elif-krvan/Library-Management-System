import { Knex } from "knex";
import bcrypt from 'bcrypt';
import config from "../../config/config";

export async function up(knex: Knex): Promise<void> {
    // return bcrypt.hash("123456", config.SALT_LENGTH).then((hash) => {
    //     return knex("user").update("password", hash);
    // });    
}

export async function down(knex: Knex): Promise<void> {
}

