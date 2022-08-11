import config from "../config/config";
import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.MAIL_ADDR,
        pass: config.MAIL_PASSWORD
    }
})

function send_mail(name: string, surname: string, email: string, code: string): Promise<boolean> {
    return new Promise<boolean> ((resolve, reject) => {

        transport.sendMail({
            from: config.MAIL_ADDR,
            to: email,
            subject: "Mail confirmation",

            html: `<h1>Email Confirmation</h1>
            <h2>Hello ${name} ${surname}</h2>
            <p>Thank you for signing up. Please confirm your email by clicking on the following link.</p>
            <a href=http://localhost:${config.PORT}/auth/${code}> Click Here</a>
            <p>atechcompany0</p>
            </div>`
        })
        .then((result) => {
            console.log(`confirmation mail is sent, mail id: ${result.messageId}`);
            resolve(true);
        })
        .catch((err) => {
            reject(err);
        });
    })    
}

export default send_mail;