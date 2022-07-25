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
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.appRouter = express_1.default.Router();
    }
    init() {
        return new Promise((resolve, reject) => {
            try {
                this.app.use(body_parser_1.default.json());
                this.app.use(body_parser_1.default.urlencoded({ extended: false }));
                this.app.use(constrants_1.Const.ROUTE_EMPTY, this.appRouter);
                this.appRouter.use(constrants_1.Const.ROUTE_USER, user_controller_1.default);
                // dotenv.config({path: path.resolve(__dirname, "config/.env")});
                console.log(dotenv_1.default.config({ path: path_1.default.resolve("./src/config/.env") }));
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
    listen() {
        let PORT = this.get_port();
        this.app.listen(PORT, () => {
            console.log(`Server is running in ${process.env.STATUS} mode and listening on port ${PORT}...`);
        }).on('error', (err) => {
            console.log(err);
            process.exit(2);
        });
    }
    get_port() {
        if (process.env.STATUS == "production") {
            return process.env.PROD_PORT;
        }
        else if (process.env.STATUS == "development") {
            return process.env.DEV_PORT;
        }
        else {
            console.log("please specify a status in .env file (STATUS = development or STATUS = production)");
            process.exit(3);
        }
    }
}
exports.App = App;
const app = new App();
exports.default = app;
