import { Request, Response, NextFunction } from 'express';
import { Exception, ValidationExc } from '../common/exception';
import ReqPagination, { PaginationOptions } from '../common/pagination-options';
import { Pagination } from '../interface/i_pagination';
import user_validation from '../validation/user-validation';

function find_offset(limit: number, page: number): number {
    return (page - 1) * limit;
}

function pagination_middleware(req: ReqPagination, res: Response, next: NextFunction) {
    let pag = {
        page: req.query.page as string,
        limit: req.query.limit as string,
        sort_by: req.query.sort_by as string,
        order: req.query.order as string
    };

    user_validation.pag_schema.validateAsync((pag)).then((validated_pag: Pagination) => {
        validated_pag.sort_by = validated_pag.sort_by == undefined ? "id" : validated_pag.sort_by;
        validated_pag.order = validated_pag.order == undefined ? "asc" : validated_pag.order;
        
        validated_pag.limit = validated_pag.limit == undefined ? 15 : (validated_pag.limit > 500 ? 500 : validated_pag.limit);
        validated_pag.page = validated_pag.page == undefined ? 1 : validated_pag.page; // first page 1 or 0?

        const skip = find_offset(validated_pag.limit, validated_pag.page);

        try {
            req.pag_option = new PaginationOptions(skip, validated_pag.limit, validated_pag.sort_by, validated_pag.order);
            next();
        } catch (error) {
            next(error);
        }
    })
    .catch((err) => {
        let exc: Exception = new ValidationExc(err);
        next(exc);
    })
}

export default pagination_middleware;