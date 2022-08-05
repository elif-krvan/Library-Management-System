export class Exception extends Error {
    status: number;
    data?: any;
    message: string;
    error: any;
    validation_error?: string[];

    constructor(status: number, message: string, error: string, validation_error?: string[], data?: any) {
        super();

        this.status = status;
        this.data = data;
        this.message = message;
        this.error = error;
        this.validation_error = validation_error;
    }
}

export class UserNotFoundExc extends Exception {
    constructor(error?: string) {
        let err: string = error || "no matching id";
        super(405, "user not found", err);
    }
}

export class UserAlreadyExistExc extends Exception {
    constructor(error?: string) {
        let err: string = error || "user with the same e-mail exists";
        super(406, "signup is unsuccessful", err);
    }
}

export class WrongRequestExc extends Exception {
    constructor(error: string) {
        super(407, "wrong request content", error);
    }
}

export class ValidationExc extends Exception {
    constructor(error: any) {
        console.log(error)
        super(407, "wrong request content", "");
        this.validation_error = [];

        for (let detail of error.details) {
            this.validation_error.push(detail.message);
        }
    }
} //dogru mu?

export class DBExc extends Exception {
    constructor(error?: any) {
        super(408, "database error", error);
    }
}

export class UnauthExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "error";
        super(401, "unauthorized", err);
    }
}

export class LoginExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "incorrect password";
        super(401, "login is unsuccessful", err);
    }
}

export class JWTExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "token cannot be signed";
        super(401, "login is unsuccessful", err);
    }
}

export class AxiosExc extends Exception {
    constructor(error?: any) {
        let err: string = error || "incorrect params";
        super(409, "unsuccessful fetch", err);
    }
}