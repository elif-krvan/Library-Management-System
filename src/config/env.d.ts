declare global {
    namespace NodeJS {
        interface ProcessEnv {
            STATUS: "development" | "production",
            DEV_PORT: string,
            PROD_PORT: string
        }
    }
}

export {};