import { Request } from "express";
import jwt from "jsonwebtoken";
import { UserSignInfo } from "../model/user-login";

declare global {
    namespace Express {
        interface Request {
            user: UserSignInfo; //fix this
        }
    }
}

interface ReqAuth extends Request {
    user: UserSignInfo;
}

export default ReqAuth;