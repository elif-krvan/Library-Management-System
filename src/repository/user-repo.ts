import { User } from "../model/user";
import { v4 as uuid } from 'uuid';
import { UserAlreadyExistExc, UserNotFoundExc } from "../common/exception";

export class UserRepo {
    private users: User[];

    constructor() {
        this.users = [];
    }

    create_user(user: User): Promise<User> {
        return new Promise<User> (async (resolve, reject) => {
            this.user_exist(user.name, user.surname, user.email).then(({user_exist, msg}) => {
                if (user_exist) {
                    reject(new UserAlreadyExistExc(msg)); //?
                } else {
                    user.id = uuid();
                    user.signup_date = new Date;

                    this.users.push(user);
                    resolve(user);
                }                
            })
            .catch((err) => {
                reject(err);
            });
        });
    }

    get_user(user_id: string): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            const result: User | undefined = this.users.find(x => x.id == user_id);

            if ( result === undefined ) {
                reject(new UserNotFoundExc());
            } else {
                resolve(result);
            }
        });        
    }

    delete_user(user_id: string): Promise<User> {
        return new Promise<User> ((resolve, reject) => {
            const index: number = this.users.findIndex(x => x.id == user_id);

            if ( index === -1 ) {
                reject(new UserNotFoundExc());
            } else {
                const deletedUser: User = this.users[index];
                this.users.splice(index, 1);
                resolve(deletedUser); // maybe error
            }
        });
    }

    user_exist(name: string, surname: string, email: string): Promise<any> { //?
        return new Promise<any> ((resolve, reject) => {
            for ( let user of this.users ) {
                if (user.name === name && user.surname === surname) {
                    resolve({user_exist: true, msg: "account with same name and surname exists"}); //??
                }

                if (user.email === email) {
                    resolve({user_exist: true, msg: "account with same email exists"}); //??
                }
            }
            resolve(false);
        });
    }

    get_users(): Promise<User[]> {
        return new Promise<User[]> ((resolve, reject) => {
            resolve(this.users);
        });
    }
}