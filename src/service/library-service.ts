import { Book } from "../model/book";
import axios from "axios";
import { AxiosExc } from "../common/exception";
import config from "../config/config";

export class LibraryService {

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
                    
                    resolve(book);
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