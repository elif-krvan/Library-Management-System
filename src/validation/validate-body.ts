// import IUserReq from "./IUserReq";

import { WrongRequestExc } from "../common/exception";
import { User } from "../model/user";

class ValidateBody {
    UserReq: User = {
        name: "",
        surname: "",
        age: 0,
        send_ads: false,
        email: "",
        password: ""
    }

    validate_add_user(user: User): Promise<WrongRequestExc | boolean> {
        return new Promise<WrongRequestExc | boolean> ((resolve, reject) => {
            for ( let value of Object.values(user) ) {
                if ( value == undefined || value == null ) {
                    reject(new WrongRequestExc("undefined value"));
                }
            }
    
            const {name, surname, age, send_ads, email, password} = user;
    
            if (typeof name != typeof this.UserReq.name || name.length > 50) {
                reject(new WrongRequestExc("name type is not string or it exceeds the 50 char limit"))
            }
    
            if (typeof surname != typeof this.UserReq.surname || surname.length > 50) {
                reject(new WrongRequestExc("surname type is not string or it exceeds the 50 char limit"))
            }
    
            if (typeof age != typeof this.UserReq.age || age < 18) {
                reject(new WrongRequestExc("age type is not number or it is less than 18"))
            }
    
            if (typeof send_ads != typeof this.UserReq.send_ads) {
                reject(new WrongRequestExc("send_ads type is not boolean"))
            }
    
            if (typeof email != typeof this.UserReq.email) {
                reject(new WrongRequestExc("email type is not string"))
            }
    
            const reg_exp: RegExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

            if (!reg_exp.test(email)) {
                reject(new WrongRequestExc("not a valid email"))
            }

            if (typeof password != typeof this.UserReq.password || password.length < 5) {
                reject(new WrongRequestExc("password type is not string or its length is less than 5"))
            }
            
            resolve(true);        
        });
    }
}

const validate_body = new ValidateBody();
export default validate_body;