import { User } from "../model/user";
import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import { UserList } from "../interface/i-user-list";
import utils from "../common/utils";
import { PaginationOptions } from "../common/pagination-options";
import { UserSignInfo } from "../model/user-login";
import moment from "moment-timezone";
import { UserFilterParams } from "../common/filter-params";
import { IUserId } from "../interface/i-user_id";
import sign_token from "../common/sign-token";
import { UserStatus } from "../enums/user-status";

export class UserRepo {
    
    async add_new_user(user: User): Promise<IUserId> {
        return new Promise<IUserId> (async (resolve, reject) => {
            user.signup_date = moment().tz("Europe/Istanbul").format();
            
            await db.knx("user")
            .insert(user)
            .returning(["user_id", "id", "name", "surname", "send_ads", "email", "signup_date"])
            .then((new_user) => {
                if (new_user[0]) {
                    console.log(new_user);
                    new_user[0].signup_date = moment(new_user[0].signup_date).tz("Europe/Istanbul").format("DD.MM.YYYY HH:mm");
                    const new_user_id: IUserId = {user_id: new_user[0].user_id};
                    resolve(new_user_id);
                } else {
                    reject(new DBExc("new user cannot be added")); 
                }                
            })
            .catch((err) => {
                reject(new DBExc(err));
            });            
        });        
    }

    async get_user(user_id: string): Promise<User> {
        return new Promise<User> (async (resolve, reject) => {
            await db.knx("user")
            .select("user_id", "id", "name", "surname", "send_ads", "email", "signup_date")
            .where("user_id", user_id)
            .then((result: User[]) => {
                if (result[0]) {
                    console.log(result[0].signup_date);
                    result[0].signup_date = moment(result[0].signup_date).tz("Europe/Istanbul").format("DD.MM.YYYY HH:mm");
                    resolve(result[0] as User);
                } else {
                    reject(new UserNotFoundExc()); 
                }  
            })
            .catch((err) => {
                reject(new DBExc(err));
            }); 
        });      
    }

    async get_active_user_by_email(email: string): Promise<UserSignInfo> {
        return new Promise<UserSignInfo> (async (resolve, reject) => {
            await db.knx("user")
            .select("user_id", "email", "password")
            .where("email", email)
            .where("status", UserStatus.Active)
            .then((result) => {
                if (result[0]) {                    
                    result[0].signup_date = moment(result[0].signup_date).tz("Europe/Istanbul").format("DD.MM.YYYY HH:mm");                    
                    resolve(result[0]);
                } else {
                    reject(new UserNotFoundExc("no active user")); 
                }  
            })
            .catch((err) => {
                reject(new DBExc(err));
            }); 
        });      
    }

    async update_user_status(user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user")
            .update({status: UserStatus.Active})
            .where("user_id", user_id)
            .then((result) => {
                if (result) {                    
                    resolve(true);
                } else {
                    reject(new UserNotFoundExc()); 
                }  
            })
            .catch((err) => {
                reject(new DBExc(err));
            }); 
        });      
    }

    async get_user_by_code(code: string): Promise<string> {
        return new Promise<string> (async (resolve, reject) => {
            await db.knx("user")
            .select("user_id")
            .where("confirmation_code", code)
            .then((result) => {
                if (result[0]) {                    
                    resolve(result[0].user_id);
                } else {
                    reject(new UserNotFoundExc()); 
                }  
            })
            .catch((err) => {
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
                reject(new DBExc(err));
            });
        });
    }

    async get_users(filter: UserFilterParams, options: PaginationOptions): Promise<UserList> {
        return new Promise<UserList> (async (resolve, reject) => {
            await db.knx("user") //count filtered users
            .count("id as count")
            .where((query_builder) => {
                utils.user_list_builder(query_builder, filter);
            })
            .then((count_result) => {
                db.knx("user") //select users
                .select("user_id", "id", "name", "surname", "send_ads", "email", "signup_date")
                .limit(options.limit as number)
                .offset(options.skip)
                .orderBy(options.sort_by, options.order || "asc")
                .where((query_builder) => {
                    utils.user_list_builder(query_builder, filter);
                })
                .then((result) => {
                    if (result.length != 0) {
                        console.log(result[0])
                        for (let user of result) {
                            user.signup_date = moment(user.signup_date).tz("Europe/Istanbul").format();
                        } 
                    }
                    const data: UserList = { total_count: count_result[0].count as number, users: result};
                    resolve(data);
                    
                                                      
                })
                .catch((err) => {
                    reject(new DBExc(err));
                });
            })
            .catch((err) => {
                reject(new DBExc(err));
            }); 
        });
    }
}