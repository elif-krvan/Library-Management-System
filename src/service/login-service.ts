import { LoginExc } from "../common/exception";
import { UserRepo } from "../repository/user-repo";
import bcrypt from 'bcrypt';
import { ILogin } from "../interface/i-login";
import sign_token from "../common/sign-token";
import { RoleRepo } from "../repository/role-repo";
import { UserSignInfo } from "../model/user-login";
import { ResponseSuccess } from "../common/response-success";

export class LoginService {
    private userRepo: UserRepo;
    private roleRepo: RoleRepo;

    constructor() {
        this.userRepo = new UserRepo();
        this.roleRepo = new RoleRepo();
    }

    get_user_by_email(email: string): Promise<UserSignInfo> {
        return new Promise<UserSignInfo> ((resolve, reject) => {
            this.userRepo.get_user_by_email(email).then((user: UserSignInfo) => {
                this.roleRepo.get_user_roles(user.user_id).then((role) => {
                    user.role = role;
                    resolve(user);
                })
                .catch((err) => {
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    confirm_user(code: string): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.get_user_by_code(code).then((user_id) => {
                this.userRepo.update_user_status(user_id).then(() => {
                    resolve(new ResponseSuccess("user verification is completed")); 
                })
                .catch((err) => {
                    reject(err);
                })
                           
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    login(user_info: ILogin): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.get_user_by_email(user_info.email)
            .then((user_db: UserSignInfo) => {
                bcrypt.compare(user_info.password, user_db.password)
                .then((match) => {
                    if (match) {
                        sign_token(user_db)
                        .then((token) => {
                            resolve(new ResponseSuccess("login is successful", {token: token}));
                        })
                        .catch((err) => {
                            reject(err);
                        })
                    } else {
                        reject(new LoginExc("incorrect password"));
                    }                    
                })
                .catch((err) => {
                    reject(err);
                });
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}