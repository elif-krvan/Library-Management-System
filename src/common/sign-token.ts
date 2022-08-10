import jwt from "jsonwebtoken";
import config from "../config/config";
import { UserSignInfo } from "../model/user-login";
import { JWTExc } from "./exception";

function sign_token(user: UserSignInfo): Promise<string> {
    return new Promise<string> ((resolve, reject) => {
        try {
            jwt.sign(
                {
                    email: user.email,
                    user_id: user.user_id,
                    role: user.role
                },
                config.TOKEN_SECRET,
                {
                    issuer: config.TOKEN_ISSUER,
                    algorithm: "HS256",
                    expiresIn: config.TOKEN_EXPIRE_TIME //seconds
                },
                (err, token) => {
                    if (err) {
                        reject(new JWTExc(err))
                    } else {
                        resolve(token as string);
                    }
                }
            )
        } catch (error) {
            reject(error);
        }        
    });
}

export default sign_token;