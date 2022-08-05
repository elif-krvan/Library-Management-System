import { UserLibrary } from "../model/user-library";

export interface UserLibraryList {
    total_count: number;
    user_library: UserLibrary[];
}