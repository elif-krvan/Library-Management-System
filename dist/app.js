"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const user_controller_1 = __importDefault(require("./controller/user-controller"));
const constrants_1 = require("./constants/constrants");
// import dotenv from 'dotenv';
// import path from "path";
const config_1 = __importDefault(require("./config"));
const db_1 = __importDefault(require("./db/db"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.appRouter = express_1.default.Router();
    }
    init() {
        return new Promise((resolve, reject) => {
            try {
                db_1.default.start();
                this.load_config();
                this.load_router();
            }
            catch (error) {
                console.log(error);
                reject(false);
            }
            finally {
                resolve(true);
            }
        });
    }
    load_config() {
        this.app.use(body_parser_1.default.json());
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
    }
    load_router() {
        this.app.use(constrants_1.Const.ROUTE_EMPTY, this.appRouter);
        this.appRouter.use(constrants_1.Const.ROUTE_USER, user_controller_1.default);
    }
    listen() {
        this.app.listen(config_1.default.PORT, () => {
            console.log(`Server is running in ${config_1.default.STAT} mode and listening on port ${config_1.default.PORT}...`);
        }).on('error', (err) => {
            console.log(err);
            process.exit(2);
        });
    }
}
exports.App = App;
const app = new App();
exports.default = app;
