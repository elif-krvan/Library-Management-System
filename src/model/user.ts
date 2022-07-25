export interface User {
    id?: string;
    name: string;
    surname: string;
    age: number;
    signup_date?: Date;
    send_ads: boolean;
    email: string;
}