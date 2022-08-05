import { BookExistExc, UserAlreadyExistExc } from "../common/exception";
import {ResponseSuccess } from "../common/response-success";
import { PaginationOptions } from "../common/pagination-options";
import { UserFilterParams } from "../common/filter-params";
import { BookRepo } from "../repository/book-repo";
import { UserLibraryRepo } from "../repository/user-library-repo";
import { UserLibrary } from "../model/user-library";
import { Book } from "../model/book";
import { ApiLibraryService } from "./api-library-service";

export class BookService {
    private bookRepo: BookRepo;
    private apiLibraryService: ApiLibraryService;

    constructor() {
        this.bookRepo = new BookRepo();
        this.apiLibraryService = new ApiLibraryService();
    }

    add_book(isbn: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.bookRepo.isbn_exist(isbn).then(async (exist) => {
                if (!exist) { //test
                    //add book to books table from the api
                    await this.apiLibraryService.get_book_by_isbn(isbn).then((book: Book) => {
                        this.bookRepo.add_book(book).then((res) => {
                            resolve(res)
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    })                    
                } else {
                    resolve(false);
                }            
            })
            .catch((err) => {
                reject(err);
            })           
        })
    }

    get_book(filter: UserFilterParams, options: PaginationOptions): Promise<ResponseSuccess> { //edit all
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.bookRepo.get_books(filter, options).then((data) => {
                resolve(new ResponseSuccess("ok", data));
            })
            .catch((err) => {
                reject(err);
            })            
        });
    }

    delete_book(isbn: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.bookRepo.delete_book(isbn).then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}