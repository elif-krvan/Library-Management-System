import { Book } from "../model/book";

export interface BookList {
    total_count: number;
    books: Book[];
}