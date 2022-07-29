export interface FilterUser {
    name?: string;
    surname?: string;
    age?: number | string;
    signup_date_end?: Date | string;
    signup_date_start?: Date | string;
    send_ads?: boolean | string;
    skip: number;
    limit: number;
    sort_by: string;
    order: string;     
}