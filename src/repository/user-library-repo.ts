import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import utils from "../common/utils";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { UserLibrary } from "../model/user-library";
import { UserLibraryList } from "../interface/user-lib-list";

export class UserLibraryRepo {

    async add_book(lib_book: UserLibrary): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            console.log("user lib repo")
            
            await db.knx("user_library")
            .insert(lib_book)
            .returning("*")
            .then((new_user) => {
                console.log("new user", new_user)
                if (new_user[0]) {
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

    async remove_book(lib_book: UserLibrary): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            console.log("user lib repooo")

            await db.knx("user_library")
            .where("user_id", lib_book.user_id)
            .where("isbn", lib_book.isbn)
            .del()
            .then((result) => {
                console.log("new user", result)
                if (result != 0) {
                    console.log("lib repo", result)
                    resolve(true);
                } else {
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
            // .join("books", "books.isbn", "user_library.isbn")
            .select("books")
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

    async isbn_exist(lib_book: UserLibrary): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user_library")
            .select("id")
            .where("user_id", lib_book.user_id)
            .where("isbn", lib_book.isbn)
            .then((result) => { 
                console.log("user_repo_lib", result)               
                resolve(result[0]);
            })
            .catch((err) => {
                reject(new DBExc(err));
            });
        });
    }
}