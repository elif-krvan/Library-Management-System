import { Request } from "express";

declare global {
    namespace Express {
        interface Request {
            auth_decoded: any;
        }
    }
}

interface ReqAuth extends Request {
    auth_decoded: any; //fix
}

export default ReqAuth;