import { DBExc, UserNotFoundExc } from "../common/exception";
import db from "../db/db";
import { IRole } from "../interface/i-role";

export class RoleRepo {
    
    async add_role(user: IRole): Promise<boolean> {
        return new Promise<boolean> (async (resolve, reject) => {
            
            await db.knx("user_role")
            .insert(user)
            .returning("id")
            .then((new_role) => {
                if (new_role[0]) {
                    resolve(true);
                } else {
                    reject(new DBExc("new role cannot be added")); 
                }                
            })
            .catch((err) => {
                reject(new DBExc(err));
            });            
        });        
    }

    async get_user_roles(user_id: string): Promise<any> { //fix this
        return new Promise<any> (async (resolve, reject) => {
            await db.knx("user_role")
            .select("role")
            .where("user_id", user_id)
            .then((result) => {
                if (result[0]) {
                    console.log("get roles", result[0].role);
                    resolve(result[0].role); //!
                } else {
                    reject(new UserNotFoundExc()); 
                }  
            })
            .catch((err) => {
                reject(new DBExc(err));
            }); 
        });      
    }

    async delete_user(user_id: string): Promise<boolean> {//edt name
        return new Promise<boolean> (async (resolve, reject) => {
            await db.knx("user_role")
            .where("user_id", user_id)
            .del()
            .then((result) => {
                if (result != 0) {
                    resolve(true);
                } else {
                    reject(new UserNotFoundExc()); 
                }
            })
            .catch((err) => {
                reject(new DBExc(err));
            });            
        });
    }
}