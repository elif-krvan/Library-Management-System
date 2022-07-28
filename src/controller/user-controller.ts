import { Router, Request, Response, NextFunction } from 'express';
import { nextTick } from 'process';
import { Exception, ValidationExc } from '../common/exception';
import { SuccessResponse } from '../common/success';
import { FilterUser } from '../interface/i_filter';
import { Pagination } from '../interface/i_pagination';
import { User } from '../model/user';
import { UserService } from '../service/user-service';
import validation from '../validation/valdation';
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
        this.router.get("/", this.get_users);
        this.router.get("/:user_id", this.get_user_by_id);
        this.router.post("/", this.add_user);
        this.router.post("/v2", this.add_user_v2);
        this.router.delete("/:user_id", this.delete_user);
    }

    private get_users = async (req: Request, res: Response, next: NextFunction) => {
        let pag: Pagination = {
            page: req.query.page as string,
            limit: req.query.limit as string
        }

        let filter: FilterUser = {
            name: req.query.name as string,
            surname: req.query.surname as string,
            age: req.query.age as string,
            signup_date: req.query.signup_date as string,
            send_ads: req.query.send_ads as string,
            sort_by: req.query.sort_by as string,
            order: req.query.order as string
        }

        validation.peg_schema.validateAsync((pag)).then((val_pag: Pagination) => {
            validation.filter_user_schema.validateAsync((filter)).then((val_filter: FilterUser) => {
                this.userService.get_users(val_pag, val_filter).then((users) => {
                    const succ_res: SuccessResponse = {
                        data: users,
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
        })
        .catch((err) => {
            const exc: Exception = new ValidationExc(err);
            next(exc);
        });       
    }

    private get_user_by_id = async (req: Request, res: Response, next: NextFunction) => {
        const id: string = req.params.user_id;

        validation.id_schema.validateAsync(id).then((validated: string) => {
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
            email: req.body.email
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
            email: req.body.email
        }

        validation.user_schema.validateAsync(new_user).then((validated) => {
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
        validation.id_schema.validateAsync(id).then((validated: string) => {
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