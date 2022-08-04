import { Request } from "express";
import jwt from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            auth_decoded: string | jwt.JwtPayload | undefined;
        }
    }
}

interface ReqAuth extends Request {
    auth_decoded: string | jwt.JwtPayload | undefined; //gerkli mi
}

export default ReqAuth;