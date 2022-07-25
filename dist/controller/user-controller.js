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
const express_1 = require("express");
const exception_1 = require("../common/exception");
const user_service_1 = require("../service/user-service");
const valdation_1 = __importDefault(require("../validation/valdation"));
const validate_body_1 = __importDefault(require("../validation/validate-body"));
class userController {
    constructor() {
        this.get_users = (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.userService.get_users().then((users) => {
                const succ_res = {
                    data: users,
                    message: 'ok'
                };
                res.json(succ_res);
            })
                .catch((err) => {
                res.status(err.status).json(new exception_1.ValidationExc(err));
            });
        });
        this.get_user_by_id = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.user_id;
            valdation_1.default.id_schema.validateAsync(id).then((validated) => {
                this.userService.get_user(validated).then((user) => {
                    const succ_res = {
                        data: user,
                        message: 'ok'
                    };
                    res.json(succ_res);
                })
                    .catch((err) => {
                    res.status(err.status).status(err.status).json(err);
                });
            })
                .catch((err) => {
                const exc = new exception_1.ValidationExc(err);
                res.status(exc.status).json(exc);
            });
        });
        this.add_user = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let new_user = {
                name: req.body.name,
                surname: req.body.surname,
                age: req.body.age,
                send_ads: req.body.send_ads,
                email: req.body.email
            };
            validate_body_1.default.validate_add_user(new_user).then(() => {
                this.userService.create_user(new_user).then((new_user) => {
                    const succ_res = {
                        data: new_user,
                        message: 'ok'
                    };
                    res.json(succ_res);
                })
                    .catch((err) => {
                    res.status(err.status).json(err);
                });
            })
                .catch((err) => {
                res.status(err.status).json(err);
            });
        });
        this.add_user_v2 = (req, res) => __awaiter(this, void 0, void 0, function* () {
            let new_user = {
                name: req.body.name,
                surname: req.body.surname,
                age: req.body.age,
                send_ads: req.body.send_ads,
                email: req.body.email
            };
            valdation_1.default.user_schema.validateAsync(new_user).then((validated) => {
                this.userService.create_user(validated).then((new_user) => {
                    const succ_res = {
                        data: new_user,
                        message: 'ok'
                    };
                    res.json(succ_res);
                })
                    .catch((err) => {
                    res.status(err.status).json(err);
                });
            })
                .catch((err) => {
                const exc = new exception_1.ValidationExc(err);
                res.status(exc.status).json(exc);
            });
        });
        this.delete_user = (req, res) => __awaiter(this, void 0, void 0, function* () {
            // delete the user if it exists
            const id = req.params.user_id;
            valdation_1.default.id_schema.validateAsync(id).then((validated) => {
                this.userService.delete_user(validated).then((deleted_user) => {
                    const succ_res = {
                        data: deleted_user,
                        message: 'user is deleted'
                    };
                    res.json(succ_res);
                })
                    .catch((err) => {
                    res.status(err.status).json(err);
                });
            })
                .catch((err) => {
                const exc = new exception_1.ValidationExc(err);
                res.status(exc.status).json(exc);
            });
        });
        this.userService = new user_service_1.UserService();
        this.router = (0, express_1.Router)();
        this.init_controller();
    }
    init_controller() {
        this.router.get("/", this.get_users);
        this.router.get("/:user_id", this.get_user_by_id);
        this.router.post("/", this.add_user);
        this.router.post("/v2", this.add_user_v2);
        this.router.delete("/:user_id", this.delete_user);
    }
}
const user_controller = new userController();
exports.default = user_controller.router;
