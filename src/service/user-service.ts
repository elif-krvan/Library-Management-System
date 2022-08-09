import { UserAlreadyExistExc } from "../common/exception";
import { User } from "../model/user";
import { UserRepo } from "../repository/user-repo";
import bcrypt from 'bcrypt';
import config from "../config/config";
import {ResponseSuccess } from "../common/response-success";
import { PaginationOptions } from "../common/pagination-options";
import { UserLogin } from "../model/user-login";
import { UserFilterParams } from "../common/filter-params";
import { UserLibraryService } from "./user-library-service";

export class UserService {
    private userRepo: UserRepo;
    private userLibService: UserLibraryService;

    constructor() {
        this.userRepo = new UserRepo();
        this.userLibService = new UserLibraryService();
    }

    create_user(user: User): Promise<string> {
        return new Promise<string> ((resolve, reject) => {
            this.userRepo.user_email_exist(user.email).then((exists) => {
                if (exists) {
                    reject(new UserAlreadyExistExc("user email already exists"));
                } else {
                    bcrypt.hash(user.password, config.SALT_LENGTH).then((hash) => {
                        user.password = hash;
                        this.userRepo.add_new_user(user).then((new_user_id) => {
                            resolve(new_user_id);
                            
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

    get_users(filter: UserFilterParams, options: PaginationOptions): Promise<ResponseSuccess> {
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
                this.userLibService.delete_user(user_id).then((res) => {
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                })
                
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}