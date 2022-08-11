function create_conf_code(): Promise<string> {
    return new Promise<string> ((resolve, reject) => {
        const chars: string = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        let code: string = "";

        for (let i = 0; i < 10; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        resolve(code);
    });
}

export default create_conf_code;