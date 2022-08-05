import { User } from "../model/user";
import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import utils from "../common/utils";
import { PaginationOptions } from "../common/pagination-options";
import moment from "moment-timezone";
import { UserFilterParams } from "../common/filter-params";
import { UserLibrary } from "../model/user-library";
import { Book } from "../model/book";
import { UserLibraryList } from "../interface/user-lib-list";

export class UserLibraryRepo {
    
    async add_new_user(user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            const lib: UserLibrary = {
                user_id: user_id,
                books: []
            }
            
            await db.knx("user_library")
            .insert(lib)
            .then((new_user) => {
                if (new_user[0]) {
                    resolve(true);
                } else {
                    reject(new DBExc("new user cannot be added")); 
                }                
            })
            .catch((err) => {
                reject(new DBExc(err));
            });            
        });        
    }

    async add_book(user_id: string, isbn: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            console.log("user lib repo")
            await db.knx("user_library")
            .update({books: db.knx.raw("array_append(books, ?)", isbn)}) //test
            .where("user_id", user_id)
            .then((new_user) => {
                console.log("new user", new_user)
                if (new_user) {
                    console.log("lib repo", new_user)
                    resolve(true);
                } else {
                    console.log("anaa")
                    reject(new DBExc("new book cannot be added")); 
                }                
            })
            .catch((err) => {
                reject(new DBExc(err));
            });            
        });        
    }

    async get_user_library(user_id: string): Promise<string[]> {
        return new Promise<string[]> (async (resolve, reject) => {
            await db.knx("user_library")
            .select("*")
            .where("user_id", user_id)
            .then((result: string[][]) => {
                if (result[0]) {
                    resolve(result[0]);
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
            await db.knx("user_library")
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

    async user_id_exist(user_id: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user_library")
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

    async isbn_exist(user_id: string, isbn: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user_library")
            .select("books")
            .where("user_id", user_id)
            .then((result) => {
                console.log("db", result[0].books)
                for (let book of result[0].books) {
                    if (book == isbn) {
                        resolve(true);
                    }
                }
                resolve(false);
            })
            .catch((err) => {
                reject(new DBExc(err));
            });
        });
    }

    async get_users(filter: UserFilterParams, options: PaginationOptions): Promise<UserLibraryList> {
        return new Promise<UserLibraryList> (async (resolve, reject) => {
            await db.knx("user_library") //count filtered users
            .count("id as count")
            .where((query_builder) => {
                utils.user_list_builder(query_builder, filter);
            })
            .then((count_result) => {
                db.knx("user_library") //select users
                .select("*")
                .limit(options.limit as number)
                .offset(options.skip)
                .orderBy(options.sort_by, options.order || "asc")
                .where((query_builder) => {
                    utils.user_list_builder(query_builder, filter);
                })
                .then((result) => {
                    const data: UserLibraryList = { total_count: count_result[0].count as number, user_library: result};
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