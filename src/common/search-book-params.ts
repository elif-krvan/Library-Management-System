import { FilterUser } from "../interface/i-filter";
import { FilterParams } from "./base-params";

export class BookSearchParams extends FilterParams {
    title: string | undefined;
    isbn: string | undefined;

    constructor(params: any) {
        super(params);

        if (this.params.title) {this.title = this.params.title};
        if (this.params.isbn) {this.isbn = this.params.isbn};

        delete this.params;
    }
}