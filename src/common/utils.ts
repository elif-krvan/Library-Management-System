import { Knex } from "knex";
import { FilterUser } from "../interface/i_filter";

class Utils {
    user_list_builder(query_builder: Knex.QueryBuilder, filter: FilterUser) {
        if (filter.name) {
            query_builder.where("name", filter.name);
        }

        if (filter.surname) {
            query_builder.where("surname", filter.surname);
        }

        if (filter.age) {
            query_builder.where("age", filter.age);
        }

        if (filter.send_ads) {
            query_builder.where("send_ads", filter.send_ads);
        }

        if (filter.signup_date_start) { //? fix this!!!!                   
            query_builder.where("signup_date", ">=", filter.signup_date_start);
        }

        if (filter.signup_date_end) { //? fix this!!!!
            query_builder.where("signup_date", "<=", filter.signup_date_end);
        }
    }
}

const utils = new Utils();
export default utils;