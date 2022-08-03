import { UnauthExc } from "../common/exception";
import { UserRepo } from "../repository/user-repo";
import bcrypt from 'bcrypt';
import { UserLogin } from "../model/user-login";
import { ILogin } from "../interface/i-login";
import sign_token from "../common/sign-token";

export class LoginService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    get_user_by_email(email: string): Promise<UserLogin> {
        return new Promise<UserLogin> ((resolve, reject) => {
            this.userRepo.get_user_by_email(email).then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
            })
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
                            console.log("login", err);
                            reject(err);
                        })
                    } else {
                        reject(new UnauthExc("incorrect password"));
                    }                    
                })
                .catch((err) => {
                    console.log("login", err);
                    reject(err);
                });
            })
            .catch((err) => {
                console.log("login", err);
                reject(err);
            })
        });
    }
}