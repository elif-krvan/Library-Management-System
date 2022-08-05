import { Moment } from "moment";

export interface ILog {
    status: string,
    message: string,
    date?: Moment | string
}