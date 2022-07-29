export interface FilterUser {
    name: string | undefined;
    surname: string | undefined;
    age: number | string | undefined;
    signup_date_end: Date | string | undefined;
    signup_date_start: Date | string | undefined;
    send_ads?: boolean | string | undefined;    
}