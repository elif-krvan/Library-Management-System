import { Moment } from "moment";
import { UserStatus } from "../enums/user-status";

export interface User {
    user_id?: string;
    name: string;
    surname: string;
    age: number;
    signup_date?: string | Moment;
    send_ads: boolean;
    email: string;
    password: string;
    confirmation_code?: string;
    status?: UserStatus.Active | UserStatus.Pending;
}