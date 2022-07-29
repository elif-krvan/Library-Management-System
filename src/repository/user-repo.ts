import { User } from "../model/user";
import { v4 as uuid } from 'uuid';
import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import format_date from "../common/date-formatter";
import { FilterUser } from "../interface/i_filter";
import { UserList } from "../interface/i-user-list";

export class UserRepo {
    
    async add_new_user(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            user.user_id = uuid();
            user.signup_date = format_date(new Date); //?
            // user.signup_date = (new Date).toLocaleString("en-US", {timeZone: "Turkey"}); //?
            console.log("date", user);
            
            await db.knx<User>("user")
            .insert(user)
            .returning("*")// edit
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

    async get_users(filter: FilterUser): Promise<UserList> { //?
        return new Promise<UserList> (async (resolve, reject) => {
            await db.knx("user")
            .select("*") //fix this no password info
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

                if (filter.sort_by) {
                    queryBuilder.orderBy(filter.sort_by, filter.order || "asc");
                }

                if (filter.limit) {
                    queryBuilder.limit(filter.limit as number)
                    .offset(filter.skip);
                }
            })
            .then((result) => {
                db.knx("user").count("id as count").then((count_result) => { //fix
                    const data: UserList = { total_count: count_result[0].count as number, users: result};
                    resolve(data);
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