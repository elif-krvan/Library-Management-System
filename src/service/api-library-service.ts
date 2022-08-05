import { Book } from "../model/book";
import axios from "axios";
import { AxiosExc } from "../common/exception";
import config from "../config/config";
import { BookSearchParams } from "../common/search-book-params";

export class ApiLibraryService {

    search_book(param: BookSearchParams): Promise<Book[] | Book> {
        return new Promise<Book[] | Book> ((resolve, reject) => {
            if (param.isbn) {
                this.get_book_by_isbn(param.isbn).then((book: Book) => {
                    resolve(book);
                })
                .catch((err) => {
                    reject(err);
                })
            } else if (param.title) {
                this.get_book_by_title(param.title).then((book: Book[]) => {
                    resolve(book);
                })
                .catch((err) => {
                    reject(err);
                })
            }
        });
    }

    get_book_by_isbn(isbn: string): Promise<Book> {
        return new Promise<Book> ((resolve, reject) => {
            const axios_config = {
                method: 'get',
                url: config.OPENLIB_BOOK_URL,
                params: {
                    bibkeys: `ISBN:${isbn}`,
                    format: "json",
                    jscmd: "data"
                }
            }

            axios(axios_config).then((res) => {
                if (res.status != 200) {
                    reject(new AxiosExc());
                } else if (Object.keys(res.data).length === 0) {
                    resolve(res.data);              
                } else {
                    const book_info = JSON.parse(JSON.stringify(res.data))[`ISBN:${isbn}`];
                    
                    const book: Book = {
                        isbn: isbn,
                        title: book_info.title,
                        author: this.get_authors(book_info.authors),
                        publisher: book_info.publishers[0].name,
                        publish_date: book_info.publish_date,
                        cover: book_info.cover.medium
                    };
                    console.log(book)
                    resolve(book);
                }                
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    get_book_by_title(title: string): Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            const axios_config = {
                method: 'get',
                url: config.OPENLIB_SEARCH_URL,
                params: {
                    title: title
                }
            }

            axios(axios_config).then((res) => {
                if (res.status != 200) {
                    reject(new AxiosExc());
                } else if (Object.keys(res.data).length === 0) {
                    resolve(res.data);              
                } else {
                    this.get_work(res.data.docs[0].key).then((res) => {
                        resolve(res);
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

    get_work(work: string): Promise<any> {
        return new Promise<any> ((resolve, reject) => {
            const axios_config = {
                method: 'get',
                url: config.OPENLIB_BASE_URL + work + ".json"
            }

            axios(axios_config).then((res) => {
                if (res.status != 200) {
                    reject(new AxiosExc());
                } else if (Object.keys(res.data).length === 0) {
                    console.log("here ", res.data);
                    resolve(res.data);              
                } else {
                    resolve(res.data);
                }                
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    private get_authors(authors: any): string[] {
        let author_names: string[] = [];

        for (let obj of authors) {
            author_names.push(obj.name);
        }
        return author_names;
    }
}