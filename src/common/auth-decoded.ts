import { Request } from "express";
import { UserSignInfo } from "../model/user-login";

declare global {
    namespace Express {
        interface Request {
            user: UserSignInfo;
        }
    }
}

interface ReqAuth extends Request {
    user: UserSignInfo;
}

export default ReqAuth;