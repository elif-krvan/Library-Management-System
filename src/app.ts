import express, { Application } from "express"
import bodyparser from 'body-parser';
import user_controller from './controller/user-controller';
import { Const } from "./constants/constrants";
// import dotenv from 'dotenv';
// import path from "path";
import config from "./config";
import db from "./db/db";

export class App {
    private app: Application;
    private appRouter: express.Router;

    constructor() {
        this.app = express();
        this.appRouter = express.Router();
    }

    init() {
        return new Promise((resolve, reject) => {
            try {
                db.start();
                this.load_config();
                this.load_router();
            } catch (error) {
                console.log(error);
                reject(false);
            } finally {
                resolve(true);
            }
        });              
    }

    load_config() {
        this.app.use(bodyparser.json());
        this.app.use(bodyparser.urlencoded({extended: false}));
    }

    load_router() {
        this.app.use(Const.ROUTE_EMPTY, this.appRouter);
        this.appRouter.use(Const.ROUTE_USER, user_controller);
    }

    listen(): void {
        this.app.listen(config.PORT, () => {
            console.log(`Server is running in ${config.STAT} mode and listening on port ${config.PORT}...`);
        }).on('error', (err) => {
            console.log(err);
            process.exit(2);
        });
    }    
}

const app = new App();
export default app;