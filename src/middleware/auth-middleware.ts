import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import ReqAuth from '../common/auth-decoded';
import { UnauthExc } from '../common/exception';
import config from "../config/config";

function auth_middleware(req: ReqAuth, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
        next(new UnauthExc());
    }

    const arr: string[] = req.headers.authorization?.split(" ") as string[];

    if (arr.length == 2) {
        const token = arr[1];

        if (token) {
            jwt.verify(token, config.TOKEN_SECRET, (error, decoded) => {
                if (error) {
                    next(error);
                } else {
                    try {
                        req.user = decoded;
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