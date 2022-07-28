import { FilterUser } from "../interface/i_filter";

export class FilterParams {
    private params: any;

    constructor(params: any) {
        this.params = params;
        this.reduce();
    }

    private reduce(): void {
        for (let key of Object.keys(this.params)) {            
            if (this.params[key] === undefined) {
                delete this.params[key];
            }
        }
    }

    get_filter(): any {
        return this.params;
    }
}

export class UserFilterParams extends FilterParams {
    constructor(params: FilterUser) { // or any?
        super(params);
    }
}