import { Request } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: any; //fix this
        }
    }
}

interface ReqAuth extends Request {
    user: any;
}

export default ReqAuth;