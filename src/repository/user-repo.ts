import { User } from "../model/user";
import { v4 as uuid } from 'uuid';
import { DBExc, UserAlreadyExistExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import pagination from "../middleware/pagination";
import { FilterUser } from "../interface/i_filter";
import { Pagination } from "../interface/i_pagination";

export class UserRepo {
    
    async add_new_user(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            user.user_id = uuid();
            user.signup_date = new Date;
            
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

    // async get_users(): Promise<User[]> {
    //     return new Promise<User[]> (async (resolve, reject) => {
    //         await db.knx("user")
    //         .select("*")
    //         .then((result) => {
    //             console.log("type", typeof result);
    //             resolve(result)
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //             reject(new DBExc(err));
    //         }); 
    //     });
    // }

    async get_users(peg: Pagination, filter: FilterUser): Promise<User[]> {
        return new Promise<User[]> (async (resolve, reject) => {
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

                if (filter.signup_date) { //?
                    queryBuilder.where("signup_date", filter.signup_date);
                }

                if (filter.sort_by) {
                    queryBuilder.orderBy(filter.sort_by, filter.order || "asc");
                }

                if (peg.limit) {
                    queryBuilder.limit(peg.limit as number)
                    .offset(pagination.find_offset(peg.limit as number, peg.page as number));
                }
            })
            .then((result) => {
                resolve(result)
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            }); 
        });
    }
}