import { BookExistExc, BookNotFoundExc, UserAlreadyExistExc, UserNotFoundExc } from "../common/exception";
import {ResponseSuccess } from "../common/response-success";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { UserLibraryRepo } from "../repository/user-library-repo";
import { BookService } from "./book-service";
import { UserLibrary } from "../model/user-library";
import { IISBN } from "../interface/i-isbn";
import { UserRepo } from "../repository/user-repo";

export class UserLibraryService {
    private libRepo: UserLibraryRepo;
    private bookService: BookService;
    private userRepo: UserRepo;

    constructor() {
        this.libRepo = new UserLibraryRepo();
        this.bookService = new BookService();
        this.userRepo = new UserRepo();
    }

    add_book(lib_book: UserLibrary): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.libRepo.isbn_exist(lib_book).then(async (book_in_library) => {
                if (book_in_library) {
                    reject(new BookExistExc());
                } else {
                    this.bookService.add_book(lib_book.isbn).then(() => { //if the book is not in the books library add it to the library first
                        
                        this.libRepo.add_book(lib_book).then((new_book_isbn: IISBN) => {
                            resolve(new ResponseSuccess("book is added to library", new_book_isbn));
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }                
            })
            .catch((err) => {
                reject(err);
            });            
        })
    }

    add_book_to_user(lib_book: UserLibrary): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.user_id_exist(lib_book.user_id).then((user_exist) => {
                if (!user_exist) {
                    reject(new UserNotFoundExc());
                } else {
                    this.libRepo.isbn_exist(lib_book).then(async (book_in_library) => {
                        if (book_in_library) {
                            reject(new BookExistExc());
                        } else {
                            this.bookService.add_book(lib_book.isbn).then(() => { //if the book is not in the books library add it to the library first
                                
                                this.libRepo.add_book(lib_book).then((new_book_isbn: IISBN) => {
                                    resolve(new ResponseSuccess("book is added to library", new_book_isbn));
                                })
                                .catch((err) => {
                                    reject(err);
                                });
                            })
                            .catch((err) => {
                                reject(err);
                            });
                        }                
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }
                
            })
            .catch((err) => {
                reject(err);
            });            
        })
    }

    remove_book(lib_book: UserLibrary): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.libRepo.isbn_exist(lib_book).then(async (book_in_library) => {
                if (book_in_library) {
                    //remove book from the library
                    this.libRepo.remove_book(lib_book).then((res) => {
                        resolve(new ResponseSuccess("book is removed from the library"));
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

    remove_book_from_user(lib_book: UserLibrary): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.user_id_exist(lib_book.user_id).then((user_exist) => {
                if (!user_exist) {
                    reject(new UserNotFoundExc());
                } else {
                    this.libRepo.isbn_exist(lib_book).then(async (book_in_library) => {
                        if (book_in_library) {
                            //remove book from the library
                            this.libRepo.remove_book(lib_book).then((res) => {
                                resolve(new ResponseSuccess("book is removed from the library"));
                            })
                            .catch((err) => {
                                reject(err);
                            })
                        } else {
                            reject(new BookNotFoundExc());
                        }                
                    });
                }
            })
            .catch((err) => {
                reject(err);
            })                        
        })
    }

    get_user_library(user_id: string): Promise<ResponseSuccess> {
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