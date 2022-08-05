import { Moment } from "moment";

export interface Book {
    isbn: string;
    title: string;
    author: string[];
    publisher: string;
    publish_date: string | Moment;
    cover: string,
}