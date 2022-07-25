import express, { Application } from "express"
import bodyparser from 'body-parser';
import user_controller from './controller/user-controller';
import { Const } from "./constants/constrants";
// import dotenv from 'dotenv';
// import path from "path";
import config from "./config";

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
                this.app.use(bodyparser.json());
                this.app.use(bodyparser.urlencoded({extended: false}));
    
                this.app.use(Const.ROUTE_EMPTY,this.appRouter);
                this.appRouter.use(Const.ROUTE_USER, user_controller);

                this.load_config();

                // dotenv.config({path: path.resolve(__dirname, "config/.env")});
                // console.log(dotenv.config({path: path.resolve( ".env")}))
            } catch (error) {
                console.log(error);
                reject(false);
            } finally {
                resolve(true);
            }
        });              
    }

    load_config() {
        config
    }

    listen(): void {
        // let PORT: string | undefined = this.get_port();

        this.app.listen(config.PORT, () => {
            console.log(`Server is running in ${config.STAT} mode and listening on port ${config.PORT}...`);
        }).on('error', (err) => {
            console.log(err);
            process.exit(2);
        });
    }

    // get_port(): string | undefined {
    //     if (process.env.STATUS == "production") {
    //         return process.env.PROD_PORT;
    //     } else if (process.env.STATUS == "development") {
    //         return process.env.DEV_PORT;
    //     } else {
    //         console.log("please specify a status in .env file (STATUS = development or STATUS = production)");
    //         process.exit(3);
    //     }
    // }
}

const app = new App();
export default app;