import { UserAlreadyExistExc } from "../common/exception";
import { User } from "../model/user";
import { UserRepo } from "../repository/user-repo";
import bcrypt from 'bcrypt';
import { FilterUser } from "../interface/i-filter";
import config from "../config/config";
import {ResponseSuccess } from "../common/response-success";
import { PaginationOptions } from "../common/pagination-options";
import { UserLogin } from "../model/user-login";

export class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    create_user(user: User): Promise<string> {
        return new Promise<string> ((resolve, reject) => {
            this.userRepo.user_email_exist(user.email).then((exists) => {
                if (exists) {
                    reject(new UserAlreadyExistExc("user email already exists"));
                } else {
                    bcrypt.hash(user.password, config.SALT_LENGTH).then((hash) => {
                        user.password = hash;
                        this.userRepo.add_new_user(user).then((new_user) => {
                            resolve(new_user);
                        })
                        .catch((err) => {
                            reject(err);
                        });
                    })
                    .catch((err) => {
                        reject(err);
                    });
                }
            })            
            .catch((err) => {
                reject(err);
            })
        });
    }

    get_user(user_id: string): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            this.userRepo.get_user(user_id).then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
            })
        });
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

    get_users(filter: FilterUser, options: PaginationOptions): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.get_users(filter, options).then((data) => {
                resolve(new ResponseSuccess("ok", data));
            })
            .catch((err) => {
                reject(err);
            })            
        });
    }

    delete_user(user_id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.userRepo.delete_user(user_id).then((result) => {
                resolve(result);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}