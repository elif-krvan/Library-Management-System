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
import { LibraryService } from '../service/library-service';
import log_service from '../service/log-service';
import { UserService } from '../service/user-service';
import library_validation from '../validation/library-validation';
import user_validation from '../validation/user-validation';
import validate_body from '../validation/validate-body';
import BaseRouter from './base-router';

class userController implements BaseRouter {
    router: Router;
    userService: UserService;
    libraryService: LibraryService;

    constructor() {
        this.userService = new UserService();
        this.libraryService = new LibraryService();
        this.router = Router();
        this.init_controller();
    }
    
    init_controller(): void {
        this.router.get("/book", this.get_book);
        this.router.get("/:user_id", auth_middleware, this.get_user_by_id);
        this.router.get("/", pagination_middleware, this.get_users);               
        this.router.post("/", this.add_user);
        this.router.post("/v2", this.add_user_v2);
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
                log_service.log(LogStatus.Error, "get users: " + err)
                next(err);
            });
        })
        .catch((err) => {
            log_service.log(LogStatus.Error, "get users val err: " + err)
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });       
    }

    private get_user_by_id = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.user_id;
        
        user_validation.id_schema.validateAsync(id).then((validated: string) => {
            this.userService.get_user(validated).then((user) => {
                
                res.json(new ResponseSuccess("ok", {user: user}));
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

    private get_book = async (req: Request, res: Response, next: NextFunction) => {
        const isbn: string = req.query.isbn as string;

        library_validation.isbn_schema.validateAsync(isbn).then((validated: string) => {
            console.log("isbn", validated)
            this.libraryService.get_book_by_isbn(validated).then((book) => {
                res.json(new ResponseSuccess("ok", {book: book}));
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
                res.json(new ResponseSuccess("signup is successful", {id: new_user}));
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
                res.json(new ResponseSuccess("signup is successful", {id: new_user}));
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
                res.json(new ResponseSuccess("user is deleted"));
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
}

const user_controller = new userController();
export default user_controller.router;