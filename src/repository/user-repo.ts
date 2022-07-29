import { User } from "../model/user";
import { v4 as uuid } from 'uuid';
import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import { UserListResponse } from "../common/success-response";
import { PaginationOptions } from "../common/pagination-options";
import format_date from "../common/date-formatter";

export class UserRepo {
    
    async add_new_user(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            user.user_id = uuid();
            user.signup_date = format_date(new Date); //?
            // user.signup_date = (new Date).toLocaleString("YYYY-mm-dd:", {timeZone: "Turkey"}); //?
            console.log("date", user);
            
            await db.knx<User>("user")
            .insert(user)
            .returning("*")
            .then((new_user) => {
                if (new_user[0]) {
                    resolve(new_user[0]); //add new user
                } else {
                    reject(new DBExc("new user cannot be added")); 
                }                
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            });            
        });        
    }

    async get_user(user_id: string): Promise<User> {
        return new Promise<User> (async (resolve, reject) => {
            await db.knx("user")
            .select("*")
            .where("user_id", user_id)
            .then((result) => {
                if (result[0]) {
                    resolve(result[0]);
                } else {
                    reject(new UserNotFoundExc()); 
                }  
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            }); 
        });      
    }

    async delete_user(user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user")
            .where("user_id", user_id)
            .del()
            .then((result) => {
                if (result != 0) {
                    resolve(true);
                } else {
                    reject(new UserNotFoundExc()); 
                }
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            });            
        });
    }

    async user_email_exist(email: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user")
            .select("user_id")
            .where("email", email)
            .then((result) => {
                resolve(result.length != 0);
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            });
        });
    }

    async user_id_exist(user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user")
            .select("user_id")
            .where("user_id", user_id)
            .then((result) => {
                resolve(result.length != 0);
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            });
        });
    }

    async get_users(pag: PaginationOptions, filter: any): Promise<UserListResponse> { //?
        return new Promise<UserListResponse> (async (resolve, reject) => {
            await db.knx("user")
            .select("*")
            .modify((queryBuilder) => {
                if (filter.name) {
                    queryBuilder.where("name", filter.name);
                }

                if (filter.surname) {
                    queryBuilder.where("surname", filter.surname);
                }

                if (filter.age) {
                    queryBuilder.where("age", filter.age);
                }

                if (filter.send_ads) {
                    queryBuilder.where("send_ads", filter.send_ads);
                }

                if (filter.signup_date_start) { //? fix this!!!!                   
                    queryBuilder.where("signup_date", ">=", filter.signup_date_start);
                }

                if (filter.signup_date_end) { //? fix this!!!!
                    queryBuilder.where("signup_date", "<=", filter.signup_date_end)
                }

                if (pag.sort_by) {
                    queryBuilder.orderBy(pag.sort_by, pag.order || "asc");
                }

                if (pag.limit) {
                    queryBuilder.limit(pag.limit as number)
                    .offset(pag.skip);
                }
            })
            .then((result) => {
                db.knx("user").count("id as count").then((count_result) => {
                    resolve(new UserListResponse("OK", count_result[0].count as number, result));
                })
                .catch((err) => {
                    console.log(err);
                    reject(new DBExc(err));
                });                
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            }); 
        });
    }
}