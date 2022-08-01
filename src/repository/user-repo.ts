import { User } from "../model/user";
import { v4 as uuid } from 'uuid';
import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import format_date from "../common/date-formatter";
import { FilterUser } from "../interface/i_filter";
import { UserList } from "../interface/i-user-list";
import utils from "../common/utils";
import { PaginationOptions } from "../common/pagination-options";
import { UserLogin } from "../model/user-login";

export class UserRepo {
    
    async add_new_user(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            user.user_id = uuid();
            user.signup_date = format_date(new Date);
            console.log("date", user);
            console.log(new Date())
            
            await db.knx<User>("user")
            .insert(user)
            .returning("*")// edit this!!
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

    async get_user_by_email(email: string): Promise<UserLogin> {
        return new Promise<UserLogin> (async (resolve, reject) => {
            await db.knx("user")
            .select("user_id", "email", "password")
            .where("email", email)
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

    async get_users(filter: FilterUser, options: PaginationOptions): Promise<UserList> { //?
        return new Promise<UserList> (async (resolve, reject) => {
            await db.knx("user") //count filtered users
            .count("id as count")
            .where((query_builder) => {
                utils.user_list_builder(query_builder, filter);
            })
            .then((count_result) => {
                db.knx("user") //select users
                .select("*")
                .limit(options.limit as number)
                .offset(options.skip)
                .orderBy(options.sort_by, options.order || "asc")
                .where((query_builder) => {
                    utils.user_list_builder(query_builder, filter);
                })
                .then((result) => {
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