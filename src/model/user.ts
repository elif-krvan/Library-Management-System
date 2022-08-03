import { Moment } from "moment";

export interface User {
    user_id?: string;
    name: string;
    surname: string;
    age: number;
    signup_date?: string | Moment;
    send_ads: boolean;
    email: string;
    password: string;
}