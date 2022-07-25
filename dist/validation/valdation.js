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
const joi_1 = __importDefault(require("joi"));
const exception_1 = require("../common/exception");
class Validation {
    constructor() {
        this.validate_joi = (schema) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield schema.validateAsync(req.body);
                    next();
                }
                catch (err) {
                    console.log(err);
                    const err_res = {
                        error: "wrong request content",
                        result: "signup is not successful"
                    };
                    return res.status(400).json(err_res);
                }
            });
        };
        this.validate_joi_param = (schema) => {
            return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield schema.validateAsync(req.params);
                    next();
                }
                catch (err) {
                    console.log(err);
                    const err_res = {
                        error: "wrong request content",
                        result: "signup is not successful"
                    };
                    return res.status(400).json(err_res);
                }
            });
        };
        this.user_schema = joi_1.default.object({
            name: joi_1.default.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
            surname: joi_1.default.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
            age: joi_1.default.number().min(18).required(),
            send_ads: joi_1.default.boolean().required(),
            email: joi_1.default.string().email().required()
        });
        this.id_schema = joi_1.default.string().pattern(new RegExp("^[a-zA-Z0-9-]+$")).required();
    }
    validate(schema, value) {
        return new Promise((resolve, reject) => {
            schema.validateAsync(value).then(() => {
                resolve(true);
            })
                .catch((err) => {
                reject(new exception_1.WrongRequestExc(err.details[0].message));
            });
        });
    }
}
const validation = new Validation();
exports.default = validation;
