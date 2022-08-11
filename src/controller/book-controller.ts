import { Router, Request, Response, NextFunction } from 'express';
import { Exception, ValidationExc } from "../common/exception";
import { ResponseSuccess } from '../common/response-success';
import { BookSearchParams } from '../common/search-book-params';
import { LogStatus } from '../enums/log-status';
import { ApiLibraryService } from '../service/api-library-service';
import log_service from '../service/log-service';
import library_validation from "../validation/library-validation";
import BaseRouter from "./base-router";

class BookController implements BaseRouter {
    router: Router;
    apiLibraryService: ApiLibraryService;

    constructor() {
        this.apiLibraryService = new ApiLibraryService();
        this.router = Router();
        this.init_controller();
    }

    init_controller() {
        this.router.get("/", this.search_book);
    }

    private search_book = async (req: Request, res: Response, next: NextFunction) => {

        const search_param = {
            isbn: req.query.isbn as string,
            title: req.query.title as string
        }
        library_validation.search_schema.validateAsync(search_param).then((validated) => {
            const search: BookSearchParams = new BookSearchParams(validated)
            this.apiLibraryService.search_book(search).then((book) => {
                log_service.log(LogStatus.Success, `search book: ${validated}`);
                return res.json(new ResponseSuccess("ok", {book: book}));
            })
            .catch((err) => {
                log_service.log(LogStatus.Error, `search book: ${validated}`);
                next(err);
            });
        })
        .catch((err) => {
            log_service.log(LogStatus.Error, `search book: ${search_param}`);
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });        
    }    
}

const book_controller = new BookController();
export default book_controller.router;