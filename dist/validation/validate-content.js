"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ValidateContent {
    isEmpty(arr) {
        return arr.length == 0;
    }
    userExist(user) {
        return user !== undefined;
    }
}
const validate_content = new ValidateContent();
exports.default = validate_content;
