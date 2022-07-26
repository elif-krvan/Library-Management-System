"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const user_repo_1 = require("../repository/user-repo");
class UserService {
    constructor() {
        this.userRepo = new user_repo_1.UserRepo();
    }
    create_user(user) {
        return new Promise((resolve, reject) => {
            this.userRepo.add_new_user(user).then((new_user) => {
                resolve(new_user);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    // create_user(user: User): Promise<User> {
    //     return new Promise<User> ((resolve, reject) => {
    //         this.userRepo.create_user(user).then((new_user) => {
    //             resolve(new_user);
    //         })
    //         .catch((err) => {
    //             reject(err);
    //         })
    //     });
    // }
    get_user(user_id) {
        return new Promise((resolve, reject) => {
            this.userRepo.get_user(user_id).then((user) => {
                resolve(user);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    get_users() {
        return new Promise((resolve, reject) => {
            this.userRepo.get_users().then((users) => {
                resolve(users);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
    delete_user(user_id) {
        return new Promise((resolve, reject) => {
            this.userRepo.delete_user(user_id).then((user) => {
                resolve(user);
            })
                .catch((err) => {
                reject(err);
            });
        });
    }
}
exports.UserService = UserService;
