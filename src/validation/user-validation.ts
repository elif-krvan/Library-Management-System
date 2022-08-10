import Joi from "joi";
import { Roles } from "../enums/roles";
const user_validation = {
    user_schema: Joi.object({
        user: Joi.object({
            name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
            surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
            age: Joi.number().min(18).required(),
            send_ads: Joi.boolean().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        }),        
        roles: Joi.number().valid(...Object.values(Roles)).default(Roles.user)// "\"roles\" must be one of [admin, user, manager, 0, 1, 2]"
    })
    .options({ abortEarly: false }),

    user_list_filter_schema: Joi.object({
        name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        age: Joi.number().min(18),
        send_ads: Joi.boolean(),
        signup_date_start: Joi.date(),
        signup_date_end: Joi.date().when("signup_date_start", {not: undefined, then: Joi.date().greater(
            Joi.ref("signup_date_start")
        ) }),
        sort_by: Joi.string().valid("id", "user_id", "name", "surname", "age", "signup_date", "send_ads"),
        order: Joi.string().valid("asc", "desc"),
        skip: Joi.number().min(0),
        limit: Joi.number().min(1)
    })
    .with("limit", "skip")
    .with("skip", "limit")
    .with("order", "sort_by")
    .options({ abortEarly: false }),

    pag_schema: Joi.object({
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sort_by: Joi.string().valid("id", "user_id", "name", "surname", "age", "signup_date", "send_ads"),
        order: Joi.string().valid("asc", "desc")
    })
    .with("order", "sort_by")
    .with("page", "limit")
    .with("limit", "page")
    .options({ abortEarly: false }),

    id_schema: Joi.string().pattern(new RegExp("^[a-zA-Z0-9-]+$")).required()
}

export default user_validation;