import { User } from "../model/user";

export class ResponseSuccess {
    data?: any;
    message: string;

    constructor(msg: string, data: any) {
        this.data = data;
        this.message = msg;
    }
}

export class UserListResponse extends ResponseSuccess {
    constructor(msg: string, count: number, list: User[]) {
        super(msg, {count: count, users: list});
    }
}//remove