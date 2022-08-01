import { Response, NextFunction } from 'express';
import ReqPagination, { PaginationOptions } from '../common/pagination-options';

function find_offset(limit: number, page: number): number {
    return (page) * limit; //page index starts from 0 //test
}

function pagination_middleware(req: ReqPagination, res: Response, next: NextFunction) {
    let pag = {
        page: req.query.page as string | number,
        limit: req.query.limit as string | number,
        sort_by: req.query.sort_by as string,
        order: req.query.order as string
    };

    pag.sort_by = pag.sort_by == undefined ? "id" : pag.sort_by;
    pag.order = pag.order == undefined ? "asc" : pag.order;
    
    pag.limit = pag.limit == undefined ? 15 : (Number(pag.limit)) > 500 ? 500 : (Number(pag.limit));
    pag.page = pag.page == undefined ? 0 : pag.page;

    const skip: number = find_offset(pag.limit, (Number(pag.page)));

    try {
        req.pag_option = new PaginationOptions(skip, pag.limit, pag.sort_by, pag.order);
        next();
    } catch (error) {
        next(error);
    }
}

export default pagination_middleware;