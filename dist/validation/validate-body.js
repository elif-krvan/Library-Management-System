"use strict";
// import IUserReq from "./IUserReq";
Object.defineProperty(exports, "__esModule", { value: true });
const exception_1 = require("../common/exception");
class ValidateBody {
    constructor() {
        this.UserReq = {
            name: "",
            surname: "",
            age: 0,
            send_ads: false,
            email: ""
        };
    }
    validate_add_user(user) {
        return new Promise((resolve, reject) => {
            for (let val of Object.values(user)) {
                if (val == undefined || val == null) {
                    reject(new exception_1.WrongRequestExc("undefined value"));
                }
            }
            const { name, surname, age, send_ads, email } = user;
            if (typeof name != typeof this.UserReq.name || name.length > 50) {
                reject(new exception_1.WrongRequestExc("name type is not string or it exceeds the 50 char limit"));
            }
            if (typeof surname != typeof this.UserReq.surname || surname.length > 50) {
                reject(new exception_1.WrongRequestExc("surname type is not string or it exceeds the 50 char limit"));
            }
            if (typeof age != typeof this.UserReq.age || age < 18) {
                reject(new exception_1.WrongRequestExc("age type is not number or it is less than 18"));
            }
            if (typeof send_ads != typeof this.UserReq.send_ads) {
                reject(new exception_1.WrongRequestExc("send_ads type is not boolean"));
            }
            if (typeof email != typeof this.UserReq.email) {
                reject(new exception_1.WrongRequestExc("email type is not string"));
            }
            const reg_exp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (!reg_exp.test(email)) {
                reject(new exception_1.WrongRequestExc("not a valid email"));
            }
            resolve(true);
        });
    }
}
const validate_body = new ValidateBody();
exports.default = validate_body;
