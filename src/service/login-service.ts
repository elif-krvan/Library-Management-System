import { LoginExc } from "../common/exception";
import { UserRepo } from "../repository/user-repo";
import bcrypt from 'bcrypt';
import { UserLogin } from "../model/user-login";
import { ILogin } from "../interface/i-login";
import sign_token from "../common/sign-token";
import { RoleRepo } from "../repository/role-repo";

export class LoginService {
    private userRepo: UserRepo;
    private roleRepo: RoleRepo;

    constructor() {
        this.userRepo = new UserRepo();
        this.roleRepo = new RoleRepo();
    }

    get_user_by_email(email: string): Promise<UserLogin> {
        return new Promise<UserLogin> ((resolve, reject) => {
            this.userRepo.get_user_by_email(email).then((user: UserLogin) => {
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

    login(user_info: ILogin): Promise<string> {
        return new Promise<string> ((resolve, reject) => {
            this.get_user_by_email(user_info.email)
            .then((user_db: UserLogin) => {
                bcrypt.compare(user_info.password, user_db.password)
                .then((match) => {
                    if (match) {
                        sign_token(user_db)
                        .then((token) => {
                            resolve(token);
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