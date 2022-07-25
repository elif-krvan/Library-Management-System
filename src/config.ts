import dotenv from 'dotenv';

if (process.env.NODE_ENV === "test") {
    dotenv.config({path: ".env.test"})
} else {
    dotenv.config();
}

class Config {
    
    public PORT: number = parseInt(process.env.PORT as string, 10) || 4000;
    public STAT: string = process.env.NODE_ENV || "development";

    // init() {
    //     this.PORT = process.env.PORT || 4000;
    // }

    constructor() {
        console.log("configs are loaded");
    }
}

const config = new Config();
export default config;