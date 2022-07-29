import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            pag_option: PaginationOptions;
        }
    }
}

export class PaginationOptions {
    skip: number;
    limit: number;
    sort_by: string;
    order: string;

    constructor(skip: number, limit: number, sort_by: string, order: string) {
        this.skip = skip;
        this.limit = limit;
        this.sort_by = sort_by;
        this.order = order;
    }
}

interface ReqPagination extends Request {
    pag_option: PaginationOptions;
}

export default ReqPagination;