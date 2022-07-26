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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepo = void 0;
const uuid_1 = require("uuid");
const exception_1 = require("../common/exception");
const db_1 = __importDefault(require("../db/db"));
class UserRepo {
    constructor() {
        this.users = [];
    }
    add_new_user(user) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                user.id = (0, uuid_1.v4)();
                user.signup_date = new Date;
                yield db_1.default.knx("user")
                    .insert(user)
                    .returning("*")
                    .then((new_user) => {
                    if (new_user[0]) {
                        resolve(new_user[0]);
                    }
                    else {
                        reject(new exception_1.DBExc("new user cannot be added"));
                    }
                })
                    .catch((err) => {
                    console.log(err);
                    reject(new exception_1.UserAlreadyExistExc());
                });
            }));
        });
    }
    create_user(user) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            this.user_exist(user.email).then((user_exist) => {
                if (user_exist) {
                    reject(new exception_1.UserAlreadyExistExc());
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
                resolve(deletedUser);
            }
        });
    }
    user_exist(email) {
        return new Promise((resolve, reject) => {
            for (let user of this.users) {
                if (user.email === email) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    }
    // get_users(): Promise<User[]> {
    //     return new Promise<User[]> ((resolve, reject) => {
    //         resolve(this.users);
    //     });
    // }
    get_users() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                yield db_1.default.knx("user")
                    .select("*")
                    .then((result) => {
                    resolve(result);
                })
                    .catch((err) => {
                    console.log(err);
                    reject(false); //?
                });
            }));
        });
    }
}
exports.UserRepo = UserRepo;
