"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBExc = exports.ValidationExc = exports.WrongRequestExc = exports.UserAlreadyExistExc = exports.UserNotFoundExc = exports.Exception = void 0;
class Exception extends Error {
    constructor(status, message, error, data) {
        super();
        this.status = status;
        this.data = data;
        this.message = message;
        this.error = error;
    }
}
exports.Exception = Exception;
class UserNotFoundExc extends Exception {
    constructor() {
        super(405, "user not found");
    }
}
exports.UserNotFoundExc = UserNotFoundExc;
class UserAlreadyExistExc extends Exception {
    constructor(error) {
        let err = error || "user with the same e-mail exists";
        super(406, "user already exist", err);
    }
}
exports.UserAlreadyExistExc = UserAlreadyExistExc;
class WrongRequestExc extends Exception {
    constructor(error) {
        super(407, "wrong request content", error);
    }
}
exports.WrongRequestExc = WrongRequestExc;
class ValidationExc extends Exception {
    constructor(error) {
        super(407, "wrong request content", error.details[0].message);
    }
}
exports.ValidationExc = ValidationExc;
class DBExc extends Exception {
    constructor(error) {
        super(407, "database error", error);
    }
}
exports.DBExc = DBExc;
