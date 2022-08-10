import { User } from "../model/user";

export interface ICreateUser {
    user: User;
    roles: number;
}