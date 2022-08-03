import { Router, Request, Response, NextFunction } from 'express';
import { ILogin } from '../interface/i-login';
import login_validation from '../validation/login-validation';
import BaseRouter from './base-router';
import { ResponseSuccess } from '../common/response-success';
import auth_middleware from '../middleware/auth-middleware';
import { LoginService } from '../service/login-service';

class LoginController implements BaseRouter {
    router: Router;
    loginService: LoginService;

    constructor() {
        this.loginService = new LoginService();
        this.router = Router();
        this.init_controller();
    }
    
    init_controller(): void {
        this.router.post("/login", this.login);
        this.router.get("/test", auth_middleware, this.test);
    }

    private login = async (req: Request, res: Response, next: NextFunction) => {
        const user_info: ILogin = req.body;
        
        login_validation.user_info_schema.validateAsync((user_info))
        .then((validated_user_info: ILogin) => {
            this.loginService.login(validated_user_info)
            .then((token: string) => {
                res.json(new ResponseSuccess("login is successful", {token: token}));
            })
            .catch((err) => {
                next(err);
            })            
        })
        .catch((err) => {
            next(err);
        })
    }

    private test = async (req: Request, res: Response) => {
        res.json(new ResponseSuccess("user is authanticated", {msg: "top secret info"}));
    }
}

const login_controller = new LoginController();
export default login_controller.router;