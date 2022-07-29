import { Router, Request, Response, NextFunction } from 'express';
import { Exception, ValidationExc } from '../common/exception';
import { UserFilterParams } from '../common/filter-params';
import { SuccessResponse } from '../common/success';
import { FilterUser } from '../interface/i_filter';
import pagination_middleware from '../middleware/pagination-middleware';
import { User } from '../model/user';
import { UserService } from '../service/user-service';
import user_validation from '../validation/user-validation';
import validate_body from '../validation/validate-body';
import BaseRouter from './base-router';

class userController implements BaseRouter {
    router: Router;
    userService: UserService;

    constructor() {
        this.userService = new UserService();
        this.router = Router();
        this.init_controller();
    }
    
    init_controller(): void {
        this.router.get("/", pagination_middleware, this.get_users);
        this.router.get("/:user_id", this.get_user_by_id);
        this.router.post("/", this.add_user);
        this.router.post("/v2", this.add_user_v2);
        this.router.delete("/:user_id", this.delete_user);
    }

    private get_users = async (req: Request, res: Response, next: NextFunction) => {
        let user_filter: FilterUser = {
            name: req.query.name as string,
            surname: req.query.surname as string,
            age: req.query.age as string,
            signup_date_start: req.query.signup_date_start as string,
            signup_date_end: req.query.signup_date_end as string,
            send_ads: req.query.send_ads as string
        };

        user_validation.filter_user_schema.validateAsync((user_filter)).then(async (validated_filter: FilterUser) => {
            let reduced_filter: UserFilterParams = (new UserFilterParams(validated_filter)).get_filter();

            await this.userService.get_users(req.pag_option, reduced_filter).then((data) => {
                res.json(data);
            })
            .catch((err) => {
                next(err);
            });
        })
        .catch((err) => {
            console.log(err)
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });       
    }

    private get_user_by_id = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.user_id;

        user_validation.id_schema.validateAsync(id).then((validated: string) => {
            this.userService.get_user(validated).then((user) => {
                
                const succ_res: SuccessResponse = {
                    data: user,
                    message: 'ok'
                }
                res.json(succ_res);
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
                const succ_res: SuccessResponse = {
                    data: new_user,
                    message: 'ok'
                }
                res.json(succ_res);
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
                const succ_res: SuccessResponse = {
                    data: new_user,
                    message: 'ok'
                }
                res.json(succ_res);
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
            this.userService.delete_user(validated).then((deleted_user) => {
                const succ_res: SuccessResponse = {
                    data: deleted_user,
                    message: 'user is deleted'
                }
                res.json(succ_res);
            })
            .catch((err) => { //user with parameter id does not exist
                next(err);
            });
        })
        .catch((err) => { //the parameter is in the wrong format or it does not exist
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });
    }    
}

const user_controller = new userController();
export default user_controller.router;