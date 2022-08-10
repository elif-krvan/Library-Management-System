import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import ReqAuth from '../common/auth-decoded';
import { UnauthExc } from '../common/exception';
import config from "../config/config";
import { LogStatus } from '../enums/log-status';
import { UserSignInfo } from '../model/user-login';
import log_service from '../service/log-service';

function verification_middleware(req: ReqAuth, res: Response, next: NextFunction) {
    const code: string = req.params.confirmation_code;
    if (!code) {
        next(new UnauthExc());
    } else {
        jwt.verify(code, config.TOKEN_SECRET, (error, decoded) => {
            if (error) {
                log_service.log(LogStatus.Error, `token verification: ` + error);
                next(new UnauthExc("error"));
            } else {
                try {
                    req.user = decoded as UserSignInfo;
                    console.log(req.user)
                    next();
                } catch (error) {
                    next(error);
                }
            }
        }); 
    }
}

export default verification_middleware;