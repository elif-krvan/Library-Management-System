import { User } from "../model/user";
import { v4 as uuid } from 'uuid';
import { DBExc, UserAlreadyExistExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";

export class UserRepo {
    
    async add_new_user(user: User): Promise<User> {
        return new Promise(async (resolve, reject) => {
            this.user_exist(user.email).then(async (exists) => {
                if (exists) {
                    reject(new UserAlreadyExistExc());
                } else {
                    user.id = uuid();
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
                }
            })
            .catch((err) => {
                console.log(err);
                reject(new DBExc(err));
            }); //?            
        });        
    }

    async get_user(user_id: string): Promise<User> {
        return new Promise<User> (async (resolve, reject) => {
            await db.knx("user")
            .select("*")
            .where("id", user_id)
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

    async delete_user(user_id: string): Promise<User> {
        return new Promise<User> (async (resolve, reject) => {
            this.get_user(user_id).then(async (user) => {
                await db.knx("user")
                .where("id", user_id)
                .del()
                .then((result) => {
                    if (result != 0) {
                        resolve(user);
                    } else {
                        reject(new UserNotFoundExc()); 
                    }
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

    async user_exist(email: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user")
            .select("id")
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

    async get_users(): Promise<User[]> {
        return new Promise<User[]> (async (resolve, reject) => {
            await db.knx("user")
            .select("*")
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