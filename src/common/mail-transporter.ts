import nodemailer from "nodemailer";
import config from "../config/config";

const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.MAIL_ADDR,
        pass: config.MAIL_PASSWORD
    }
})

export default transport;