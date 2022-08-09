import { BookExistExc, BookNotFoundExc, UserAlreadyExistExc } from "../common/exception";
import {ResponseSuccess } from "../common/response-success";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { UserLibraryRepo } from "../repository/user-library-repo";
import { BookService } from "./book-service";
import { UserLibrary } from "../model/user-library";

export class UserLibraryService {
    private libRepo: UserLibraryRepo;
    private bookService: BookService;

    constructor() {
        this.libRepo = new UserLibraryRepo();
        this.bookService = new BookService();
    }

    add_book(lib_book: UserLibrary): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.libRepo.isbn_exist(lib_book).then(async (book_in_library) => {
                if (book_in_library) {
                    reject(new BookExistExc());
                } else {
                    this.bookService.add_book(lib_book.isbn).then(() => { //if the book is not in the books library add it to the library first
                        
                        this.libRepo.add_book(lib_book).then((res) => {
                            resolve(res);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }                
            });            
        })
    }

    remove_book(lib_book: UserLibrary): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.libRepo.isbn_exist(lib_book).then(async (book_in_library) => {
                if (book_in_library) {
                    //remove book from the library
                    this.libRepo.remove_book(lib_book).then((res) => {
                        resolve(res);
                    })
                    .catch((err) => {
                        reject(err);
                    })
                } else {
                    reject(new BookNotFoundExc());
                }                
            });            
        })
    }

    get_user_library(user_id: string): Promise<ResponseSuccess> { //return user's books
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.libRepo.get_user_library(user_id).then((data) => {
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