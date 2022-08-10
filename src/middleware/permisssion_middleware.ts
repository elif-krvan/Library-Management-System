import { Roles } from "../enums/roles";
import { Response, NextFunction } from 'express';
import ReqAuth from "../common/auth-decoded";
import { NoPermissionExc, UnauthExc } from "../common/exception";

function permission_middleware(...allowed_roles: Roles[]) {
    return (req: ReqAuth, res: Response, next: NextFunction) => {
        const user_role: Roles = req.user.role;

        if (user_role === undefined) {
            next(new NoPermissionExc()); //baska exc?
        }
        const result = allowed_roles.find(val => val == user_role);
        
        if (result === undefined) {
            next(new NoPermissionExc());
        } else {
            next();
        }
    }
}

export default permission_middleware;