import { BookExistExc, UserAlreadyExistExc } from "../common/exception";
import {ResponseSuccess } from "../common/response-success";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { BookRepo } from "../repository/book-repo";
import { UserLibraryRepo } from "../repository/user-library-repo";
import { UserLibrary } from "../model/user-library";
import { Book } from "../model/book";
import { ApiLibraryService } from "./api-library-service";

export class UserLibraryService {
    private bookRepo: BookRepo;
    private libRepo: UserLibraryRepo;
    private apiLibraryService: ApiLibraryService;

    constructor() {
        this.bookRepo = new BookRepo();
        this.libRepo = new UserLibraryRepo();
        this.apiLibraryService = new ApiLibraryService();
    }

    create_user(user_id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.libRepo.user_id_exist(user_id).then((exists) => {
                if (exists) {
                    reject(new UserAlreadyExistExc("user id already exists"));
                } else {
                    this.libRepo.add_new_user(user_id).then((added) => {
                        resolve(added);
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }
            })            
            .catch((err) => {
                
                reject(err);
            })
        });
    }

    add_book(user_id: string, isbn: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.libRepo.isbn_exist(user_id, isbn).then(async (book_in_library) => {
                if (book_in_library) {
                    reject(new BookExistExc());
                } else {
                    await this.bookRepo.isbn_exist(isbn).then(async (exist) => {
                        if (!exist) { //test
                            //add book to books table from the api
                            await this.apiLibraryService.get_book_by_isbn(isbn).then((book: Book) => {
                                this.bookRepo.add_book(book);
                            })
                            .catch((err) => {
                                reject(err);
                            })                    
                        }
                            
                        await this.libRepo.add_book(user_id, isbn).then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        })              
                    })
                }                
            })            
        })
    }

    get_user_library(user_id: string): Promise<string[]> { //return user's books
        return new Promise<string[]> ((resolve, reject) => {
            this.libRepo.get_user_library(user_id).then((books) => {
                resolve(books);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    get_users(filter: UserFilterParams, options: PaginationOptions): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.libRepo.get_users(filter, options).then((data) => {
                resolve(new ResponseSuccess("ok", data));
            })
            .catch((err) => {
                reject(err);
            })            
        });
    }

    delete_user(user_id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.libRepo.delete_user(user_id).then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}