import { BookNotFoundExc, DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import utils from "../common/utils";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { UserLibrary } from "../model/user-library";
import { UserLibraryList } from "../interface/user-lib-list";
import { BookList } from "../interface/book-list";
import { IISBN } from "../interface/i-isbn";

export class UserLibraryRepo {

    async add_book(lib_book: UserLibrary): Promise<IISBN> {
        return new Promise<IISBN> (async (resolve, reject) => {
            await db.knx("user_library")
            .insert(lib_book)
            .returning("isbn")
            .then((new_book) => {
                console.log("new user", new_book)
                if (new_book[0]) {
                    const data: IISBN = {isbn: new_book[0].isbn};
                    resolve(data);
                } else {
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
                    reject(new BookNotFoundExc("book cannot be removed")); 
                }                
            })
            .catch((err) => {
                reject(new DBExc(err));
            });            
        });        
    }

    async get_user_library(user_id: string): Promise<BookList> {
        return new Promise<BookList> (async (resolve, reject) => {
            await db.knx("user_library")
            .count("id as count")
            .where("user_library.user_id", user_id)
            .then(async (count) => {
                await db.knx("user_library")
                .join("books as b", "b.isbn", "user_library.isbn")
                .select(["b.isbn", "b.title", "b.author", "b.publisher", "b.publish_date", "b.cover"])
                .where("user_library.user_id", user_id)
                .then((result) => {
                    const data: BookList = {
                        total_count: count[0].count as number,
                        books: result
                    }  
                    resolve(data);
                })
                .catch((err) => {
                    reject(new DBExc(err));
                });
            })
             
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