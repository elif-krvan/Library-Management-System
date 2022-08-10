import config from "../config/config";
import transport from "./mail-transporter";

function send_mail(name: string, surname: string, email: string, code: string): Promise<boolean> {
    return new Promise<boolean> ((resolve, reject) => {
        console.log("in send mail...");

        transport.sendMail({
            from: config.MAIL_ADDR,
            to: email,
            subject: "Mail confirmation",

            html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name}</h2>
            <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
            <a href=http://localhost:${config.PORT}/auth/${code}> Click here</a>
            </div>`
        })
        .then((result) => {
            console.log(result);
            resolve(true);
        })
        .catch((err) => {
            console.log("uf")
            reject(err);
        })
    })
    
}

export default send_mail;