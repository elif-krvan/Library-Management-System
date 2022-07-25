"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const uuid_1 = require("uuid");
const exception_1 = require("../common/exception");
class UserRepo {
    constructor() {
        this.users = [];
    }
    create_user(user) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.user_exist(user.name, user.surname, user.email).then(({ user_exist, msg }) => {
                if (user_exist) {
                    reject(new exception_1.UserAlreadyExistExc(msg)); //?
                }
                else {
                    user.id = (0, uuid_1.v4)();
                    user.signup_date = new Date;
                    this.users.push(user);
                    resolve(user);
                }
            })
                .catch((err) => {
                reject(err);
            });
        }));
    }
    get_user(user_id) {
        return new Promise((resolve, reject) => {
            const result = this.users.find(x => x.id == user_id);
            if (result === undefined) {
                reject(new exception_1.UserNotFoundExc());
            }
            else {
                resolve(result);
            }
        });
    }
    delete_user(user_id) {
        return new Promise((resolve, reject) => {
            const index = this.users.findIndex(x => x.id == user_id);
            if (index === -1) {
                reject(new exception_1.UserNotFoundExc());
            }
            else {
                const deletedUser = this.users[index];
                this.users.splice(index, 1);
                resolve(deletedUser); // maybe error
            }
        });
    }
    user_exist(name, surname, email) {
        return new Promise((resolve, reject) => {
            for (let user of this.users) {
                if (user.name === name && user.surname === surname) {
                    resolve({ user_exist: true, msg: "account with same name and surname exists" }); //??
                }
                if (user.email === email) {
                    resolve({ user_exist: true, msg: "account with same email exists" }); //??
                }
            }
            resolve(false);
        });
    }
    get_users() {
        return new Promise((resolve, reject) => {
            resolve(this.users);
        });
    }
}
exports.UserRepo = UserRepo;
