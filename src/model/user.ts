export interface User {
    user_id?: string;
    name: string;
    surname: string;
    age: number;
    signup_date?: Date | string;
    send_ads: boolean;
    email: string;
}