import { FilterUser } from "../interface/i-filter";
import { FilterParams } from "./base-params";

export class UserFilterParams extends FilterParams {
    name: string | undefined;
    surname: string | undefined;
    age: number | string | undefined;
    signup_date_end: Date | string | undefined;
    signup_date_start: Date | string | undefined;
    send_ads: boolean | string | undefined; 

    constructor(params: FilterUser) {
        super(params);
        console.log("params",params)

        if (this.params.name) {this.name = this.params.name};
        if (this.params.surname) {this.surname = this.params.surname};
        if (this.params.age) {this.age = this.params.age};
        if (this.params.signup_date_end) {this.signup_date_end = this.params.signup_date_end};
        if (this.params.signup_date_start) {this.signup_date_start = this.params.signup_date_start};
        if (this.params.send_ads) {this.name = this.params.send_ads};

        delete this.params;
    }
}