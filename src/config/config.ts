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

    // password hashing
    public SALT_LENGTH: number = parseInt(process.env.SALT_LENGTH as string, 10) || 10;

    // JWT token info
    public TOKEN_EXPIRE_TIME: number = parseInt(process.env.TOKEN_EXPIRE_TIME as string, 10) || 60; //seconds
    public TOKEN_ISSUER: string = process.env.TOKEN_ISSUER || "microsoft";
    public TOKEN_SECRET: string = process.env.TOKEN_SECRET || "bill_gates";

    // api links
    public OPENLIB_BOOK_URL: string = process.env.OPENLIB_BOOK_URL || "https://openlibrary.org/api/books";

    constructor() {
        console.log("configs are loaded");
    }
}

const config = new Config();
export default config;