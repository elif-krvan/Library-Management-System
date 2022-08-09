import { BookNotFoundExc, DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import utils from "../common/utils";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { Book } from "../model/book";
import { BookList } from "../interface/book-list";

export class BookRepo {
    
    async add_book(book: Book): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("books")
            .insert(book)
            .returning("id")
            .then((res) => {
                if (res[0]) {
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

    async get_book(isbn: string): Promise<Book | boolean> {
        return new Promise<Book | boolean> (async (resolve, reject) => {
            await db.knx("books")
            .select("*")
            .where("isbn", isbn)
            .then((result) => {
                if (result[0]) {
                    resolve(result[0]);
                } else {
                    reject(new BookNotFoundExc());
                }  
            })
            .catch((err) => {
                reject(new DBExc(err));
            }); 
        });      
    }

    async delete_book(isbn: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("books")
            .where("isbn", isbn)
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

    async isbn_exist(isbn: string): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("books")
            .select("isbn")
            .where("isbn", isbn)
            .then((result) => {
                console.log("result", result)
                resolve(result.length != 0);
            })
            .catch((err) => {
                reject(new DBExc(err));
            });
        });
    }

    //edit!!!!!!!
    async get_books(filter: UserFilterParams, options: PaginationOptions): Promise<BookList> {
        return new Promise<BookList> (async (resolve, reject) => {
            await db.knx("books") //count filtered users
            .count("id as count")
            .where((query_builder) => {
                utils.user_list_builder(query_builder, filter);
            })
            .then((count_result) => {
                db.knx("books") //select users
                .select("*")
                .limit(options.limit as number)
                .offset(options.skip)
                .orderBy(options.sort_by, options.order || "asc")
                .where((query_builder) => {
                    utils.user_list_builder(query_builder, filter);
                })
                .then((result) => {
                    const data: BookList = { total_count: count_result[0].count as number, books: result};
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