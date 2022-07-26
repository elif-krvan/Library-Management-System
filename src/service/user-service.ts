import { User } from "../model/user";
import { UserRepo } from "../repository/user-repo";

export class UserService {
    private userRepo: UserRepo;

    constructor() {
        this.userRepo = new UserRepo();
    }

    create_user(user: User): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            this.userRepo.add_new_user(user).then((new_user) => {
                resolve(new_user);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
    // create_user(user: User): Promise<User> {
    //     return new Promise<User> ((resolve, reject) => {
    //         this.userRepo.create_user(user).then((new_user) => {
    //             resolve(new_user);
    //         })
    //         .catch((err) => {
    //             reject(err);
    //         })
    //     });
    // }

    get_user(user_id: string): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            this.userRepo.get_user(user_id).then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    get_users(): Promise<User[]> {
        return new Promise<User[]> ((resolve, reject) => {
            this.userRepo.get_users().then((users) => {
                resolve(users);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }

    delete_user(user_id: string): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            this.userRepo.delete_user(user_id).then((user) => {
                resolve(user);
            })
            .catch((err) => {
                reject(err);
            })
        });
    }
}