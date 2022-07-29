import { User } from "../model/user";

export interface UserList {
    total_count: number;
    users: User[];
}