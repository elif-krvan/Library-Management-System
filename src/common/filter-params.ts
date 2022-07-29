import { FilterUser } from "../interface/i_filter";
import { FilterParams } from "./base-params";

export class UserFilterParams extends FilterParams {
    constructor(params: FilterUser) {
        super(params);
    }
}