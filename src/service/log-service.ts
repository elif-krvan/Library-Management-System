import moment from "moment-timezone";
import { LogStatus } from "../enums/log-status";

class LogService {

    log(status: LogStatus, message: string) {
        const date = moment().tz("Europe/Istanbul").format();
        console.log(`${date} | ${status} | ${message}`);
    }
}

const log_service = new LogService();
export default log_service;