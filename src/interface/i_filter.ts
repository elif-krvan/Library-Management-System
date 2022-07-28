export interface FilterUser {
    name?: string | undefined;
    surname?: string | undefined;
    age?: number | string | undefined;
    signup_date?: Date | string | undefined;
    send_ads?: boolean | string | undefined;
    sort_by?: string | undefined;
    order?: string;    
}