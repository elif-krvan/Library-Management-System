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
import { IUserId } from "../interface/i-user_id";
import { RoleRepo } from "../repository/role-repo";
import { IRole } from "../interface/i-role";
import { ICreateUser } from "../interface/i-create-user";

export class UserService {
    private userRepo: UserRepo;
    private userLibService: UserLibraryService;
    private roleRepo: RoleRepo;

    constructor() {
        this.userRepo = new UserRepo();
        this.userLibService = new UserLibraryService();
        this.roleRepo = new RoleRepo();
    }

    create_user(user_info: ICreateUser): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.user_email_exist(user_info.user.email).then((exists) => {
                if (exists) {
                    reject(new UserAlreadyExistExc("user email already exists"));
                } else {
                    bcrypt.hash(user_info.user.password, config.SALT_LENGTH).then((hash) => {
                        user_info.user.password = hash;
                        this.userRepo.add_new_user(user_info.user).then((new_user_id: IUserId) => {
                            const user_roles: IRole = {user_id: new_user_id.user_id, role: user_info.roles as number};

                            this.roleRepo.add_role(user_roles).then(() => {
                                resolve(new ResponseSuccess("ok", new_user_id)); 
                            })
                            .catch((err) => {
                                reject(err);
                            });
                                                       
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

    get_user(user_id: string): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.get_user(user_id).then((user: User) => {
                resolve(new ResponseSuccess("ok", {user: user}));
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    get_user_by_email(email: string): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.get_user_by_email(email).then((user: UserLogin) => {
                resolve(new ResponseSuccess("ok", user));
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

    delete_user(user_id: string): Promise<ResponseSuccess> {
        return new Promise<ResponseSuccess> ((resolve, reject) => {
            this.userRepo.delete_user(user_id).then((result) => { //resultu kullanayım mı
                this.userLibService.delete_user(user_id).then((res) => {
                    resolve(new ResponseSuccess("user is deleted"));
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

    user_id_exist(user_id: string): Promise<boolean> {
        return new Promise<boolean> ((resolve, reject) => {
            this.userRepo.user_id_exist(user_id).then((user_exist) => {
                resolve(user_exist);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}