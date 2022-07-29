import { UserAlreadyExistExc } from "../common/exception";
import { UserFilterParams } from "../common/filter-params";
import { PaginationOptions } from "../common/pagination-options";
import { UserListResponse } from "../common/success-response";
import { FilterUser } from "../interface/i_filter";
import { Pagination } from "../interface/i_pagination";
import { User } from "../model/user";
import { UserRepo } from "../repository/user-repo";

export class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    create_user(user: User): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            this.userRepo.user_email_exist(user.email).then((exists) => {
                if (exists) {
                    reject(new UserAlreadyExistExc("user email already exists"));
                } else {
                    this.userRepo.add_new_user(user).then((new_user) => {
                        resolve(new_user);
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

    get_users(peg: PaginationOptions, filter: any): Promise<UserListResponse> {
        return new Promise<UserListResponse> ((resolve, reject) => {
            this.userRepo.get_users(peg, filter).then((users) => {
                resolve(users);
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