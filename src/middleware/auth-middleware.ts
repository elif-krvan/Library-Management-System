import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import ReqAuth from '../common/auth-decoded';
import { UnauthExc } from '../common/exception';
import config from "../config/config";

function auth_middleware(req: ReqAuth, res: Response, next: NextFunction) {
    let token: string;
    if (req.headers.authorization?.length == 2) {
        token = req.headers.authorization?.split(" ")[1];

        if (token) {
            jwt.verify(token, config.TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    next(error);
                } else {
                    try {
                        req.auth_decoded = decoded;
                        next();
                    } catch (error) {
                        next(error);
                    }
                }
            }); 
        } else {
            next(new UnauthExc());
        }
    } else {
        next(new UnauthExc());
    }
}

export default auth_middleware;