import { Router, Request, Response, NextFunction } from 'express';
import { Exception, ValidationExc } from '../common/exception';
import { UserFilterParams } from '../common/filter-params';
import { PaginationOptions } from '../common/pagination-options';
import { ResponseSuccess } from '../common/response-success';
import { LogStatus } from '../enums/log-status';
import { FilterUser } from '../interface/i-filter';
import auth_middleware from '../middleware/auth-middleware';
import pagination_middleware from '../middleware/pagination-middleware';
import { User } from '../model/user';
import { UserLibrary } from '../model/user-library';
import log_service from '../service/log-service';
import { UserLibraryService } from '../service/user-library-service';
import { UserService } from '../service/user-service';
import library_validation from '../validation/library-validation';
import user_validation from '../validation/user-validation';
import validate_body from '../validation/validate-body';
import BaseRouter from './base-router';

class UserController implements BaseRouter {
    router: Router;
    userService: UserService;
    libraryService: UserLibraryService;

    constructor() {
        this.userService = new UserService();
        this.libraryService = new UserLibraryService();
        this.router = Router();
        this.init_controller();
    }
    
    init_controller(): void {
        this.router.get("/book", auth_middleware, this.get_user_library);        
        this.router.get("/:user_id", auth_middleware, this.get_user_by_id);
        this.router.get("/", pagination_middleware, this.get_users);  
        this.router.post("/book", auth_middleware, this.add_book);             
        this.router.post("/:user_id/book/:isbn", auth_middleware, this.add_book_to_user);             
        this.router.post("/", this.add_user);
        this.router.post("/v2", this.add_user_v2);
        this.router.delete("/book", auth_middleware, this.remove_book);
        this.router.delete("/:user_id/book/:isbn", auth_middleware, this.remove_book_from_user);
        this.router.delete("/:user_id", auth_middleware, this.delete_user);
    }

    private get_users = async (req: Request, res: Response, next: NextFunction) => {
        const user_options = {
            ...req.pag_option,
            name: req.query.name as string,
            surname: req.query.surname as string,
            age: req.query.age as string,
            signup_date_start: req.query.signup_date_start as string,
            signup_date_end: req.query.signup_date_end as string,
            send_ads: req.query.send_ads as string
        };

        user_validation.user_list_filter_schema.validateAsync((user_options)).then(async (validated_filter) => {

            const user_filter: FilterUser = {
                name: validated_filter.name,
                surname: validated_filter.surname,
                age: validated_filter.age,
                signup_date_start: validated_filter.signup_date_start,
                signup_date_end: validated_filter.signup_date_end,
                send_ads: validated_filter.send_ads
            };
            const reduced_filter: UserFilterParams = new UserFilterParams(user_filter);
            const pag_opt: PaginationOptions = new PaginationOptions(validated_filter.skip, validated_filter.limit, validated_filter.sort_by, validated_filter.order);

            await this.userService.get_users(reduced_filter, pag_opt).then((data) => {
                log_service.log(LogStatus.Success, "get users");
                return res.json(data);
            })
            .catch((err) => {
                log_service.log(LogStatus.Error, "get users: " + err);
                next(err);
            });
        })
        .catch((err) => {
            log_service.log(LogStatus.Error, "get users val err: " + err);
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });       
    }

    private get_user_by_id = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.user_id;
        
        user_validation.id_schema.validateAsync(id).then((validated: string) => {
            this.userService.get_user(validated).then((user) => {
                log_service.log(LogStatus.Success, "get user by id");
                return res.json(new ResponseSuccess("ok", {user: user}));
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

    private add_user = async (req: Request, res: Response, next: NextFunction) => {
        let new_user: User = {
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            send_ads: req.body.send_ads,
            email: req.body.email,
            password: req.body.password,
        }

        validate_body.validate_add_user(new_user).then(() => {
            this.userService.create_user(new_user).then((new_user) => {
                log_service.log(LogStatus.Success, "add a new user, id: " + new_user);
                return res.json(new ResponseSuccess("signup is successful", {id: new_user}));
            })
            .catch((err) => {
                next(err);
            });
        })
        .catch((err) => {
            next(err);
        });
    }

    private add_user_v2 = async (req: Request, res: Response, next: NextFunction) => {
        let new_user: User = {
            name: req.body.name,
            surname: req.body.surname,
            age: req.body.age,
            send_ads: req.body.send_ads,
            email: req.body.email,
            password: req.body.password,
        }

        user_validation.user_schema.validateAsync(new_user).then((validated: User) => {
            this.userService.create_user(validated).then((new_user) => {
                log_service.log(LogStatus.Success, "add a new user, id: " + new_user);
                return res.json(new ResponseSuccess("signup is successful", {id: new_user}));
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

    private delete_user = async (req: Request, res: Response, next: NextFunction) => {
        // delete the user if it exists
        const id: string = req.params.user_id;
        user_validation.id_schema.validateAsync(id).then((validated: string) => {
            this.userService.delete_user(validated).then(() => {
                log_service.log(LogStatus.Success, "deleted user");
                return res.json(new ResponseSuccess("user is deleted"));
            })
            .catch((err) => { //user with parameter id does not exist
                next(err);
            });
        })
        .catch((err) => { //the parameter is in the wrong format
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });
    } 
    
    private add_book = async (req: Request, res: Response, next: NextFunction) => {
        const isbn: string = req.body.isbn as string;

        library_validation.isbn_schema.validateAsync(isbn).then((validated_isbn: string) => {
            const lib_book: UserLibrary = {
                user_id: req.user.user_id,
                isbn: validated_isbn
            }
            
            this.libraryService.add_book(lib_book).then((book) => {
                log_service.log(LogStatus.Success, "user add book to library");
                return res.json(new ResponseSuccess("ok", {added: book}));
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

    private add_book_to_user = async (req: Request, res: Response, next: NextFunction) => {
        const lib_book: UserLibrary = {
            user_id: req.params.user_id as string,
            isbn: req.params.isbn as string
        }
        
        library_validation.user_library_schema.validateAsync(lib_book).then((validated_lib: UserLibrary) => {            
            
            this.libraryService.add_book(validated_lib).then((book) => {
                log_service.log(LogStatus.Success, "user add book to library via admin " + req.user.user_id);
                return res.json(new ResponseSuccess("ok", {added: book}));
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

    private remove_book_from_user = async (req: Request, res: Response, next: NextFunction) => {
        const lib_book: UserLibrary = {
            user_id: req.params.user_id as string,
            isbn: req.params.isbn as string
        }

        library_validation.user_library_schema.validateAsync(lib_book).then((validated_lib: UserLibrary) => {            
            
            this.libraryService.remove_book(validated_lib).then((book) => {
                log_service.log(LogStatus.Success, `user remove book ${validated_lib.isbn} from library via admin ${req.user.user_id}`);
                return res.json(new ResponseSuccess("ok", {added: book}));
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

    private remove_book = async (req: Request, res: Response, next: NextFunction) => {
        const isbn: string = req.body.isbn as string;

        library_validation.isbn_schema.validateAsync(isbn).then((validated_isbn: string) => {
            const lib_book: UserLibrary = {
                user_id: req.user.user_id,
                isbn: validated_isbn
            }

            this.libraryService.remove_book(lib_book).then((book) => {
                log_service.log(LogStatus.Success, "user add book to library");
                return res.json(new ResponseSuccess("ok", {deleted: book}));
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

    private get_user_library = async (req: Request, res: Response, next: NextFunction) => {
        this.libraryService.get_user_library(req.user.user_id).then((books) => {
            log_service.log(LogStatus.Success, "user get library data");
            return res.json(new ResponseSuccess("ok", {books: books}));
        })
        .catch((err) => {
            next(err);
        });        
    }
}

const user_controller = new UserController();
export default user_controller.router;