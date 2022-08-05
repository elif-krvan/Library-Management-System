import { Request } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user: any;
        }
    }
}

interface ReqAuth extends Request {
    user: any;
}

export default ReqAuth;