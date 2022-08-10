import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserLogin } from "../model/user-login";

declare global {
    namespace Express {
        interface Request {
            user: UserLogin; //fix this
        }
    }
}

interface ReqAuth extends Request {
    user: UserLogin;
}

export default ReqAuth;