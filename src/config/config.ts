import dotenv from 'dotenv';

if (process.env.NODE_ENV === "test") {
    dotenv.config({path: ".env.test"})
} else {
    dotenv.config();
}

class Config {
    // app port and status
    public PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    public STAT: string = process.env.NODE_ENV || "development";

    // postgres config
    public PG_HOST: string = process.env.PG_HOST || "localhost";
    public PG_PORT: number = parseInt(process.env.PG_PORT as string, 10) || 5432;
    public PG_DB: string = process.env.PG_DB || "test";
    public PG_USER: string = process.env.PG_USER || "postgres";
    public PG_PASS: string = process.env.PG_PASS || "password";

    constructor() {
        console.log("configs are loaded");
    }
}

const config = new Config();
export default config;