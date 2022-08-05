import { Router, Request, Response, NextFunction } from 'express';
import { Exception, ValidationExc } from "../common/exception";
import { ResponseSuccess } from '../common/response-success';
import { BookSearchParams } from '../common/search-book-params';
import { LogStatus } from '../enums/log-status';
import { LibraryService } from '../service/library-service';
import log_service from '../service/log-service';
import library_validation from "../validation/library-validation";
import BaseRouter from "./base-router";

class BookController implements BaseRouter {
    router: Router;
    libraryService: LibraryService;

    constructor() {
        this.libraryService = new LibraryService();
        this.router = Router();
        this.init_controller();
    }

    init_controller() {
        this.router.get("/", this.get_book);
    }

    private get_book = async (req: Request, res: Response, next: NextFunction) => {

        const search_param = {
            isbn: req.query.isbn as string,
            title: req.query.title as string
        }
        library_validation.search_schema.validateAsync(search_param).then((validated) => {
            console.log("isbn", validated)
            const search: BookSearchParams = new BookSearchParams(validated)
            this.libraryService.search_book(search).then((book) => {
                log_service.log(LogStatus.Success, "get user book");
                return res.json(new ResponseSuccess("ok", {book: book}));
            })
            .catch((err) => {
                next(err);
            });
        })
        .catch((err) => {
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });        
    }
    
}

const book_controller = new BookController();
export default book_controller.router;