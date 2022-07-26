import db from "../db";
import migrate from "./migrate";

db.start().then(() => {
    console.log(11111111)
    migrate.create_user_table().then(() => {
    })
    .catch((err) => {
        console.log("wtf")
        console.log(err);
    });
}).catch((err) => {
    console.log(err);
    process.exit(1);
}).finally(() => {
    console.log("migration completed successfuly");
    // process.exit(0); //?????
});