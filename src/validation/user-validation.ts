import Joi from "joi";

class UserValidation {
    user_schema = Joi.object({
        name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
        surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
        age: Joi.number().min(18).required(),
        send_ads: Joi.boolean().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required() //edit
    })
    .options({ abortEarly: false });

    user_list_filter_schema = Joi.object({
        name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        age: Joi.number().min(18),
        send_ads: Joi.boolean(),
        signup_date_start: Joi.date(),
        signup_date_end: Joi.date(),
        sort_by: Joi.string().valid("id", "user_id", "name", "surname", "age", "signup_date", "send_ads"),
        order: Joi.string().valid("asc", "desc"),
        skip: Joi.number().min(0),
        limit: Joi.number().min(1)
    })
    .with("limit", "skip")
    .with("skip", "limit")
    .with("order", "sort_by")
    .options({ abortEarly: false });

    pag_schema = Joi.object({
        page: Joi.number().min(1),
        limit: Joi.number().min(1),
        sort_by: Joi.string().valid("id", "user_id", "name", "surname", "age", "signup_date", "send_ads"),
        order: Joi.string().valid("asc", "desc")
    })
    .with("order", "sort_by")
    .with("page", "limit")
    .with("limit", "page")
    .options({ abortEarly: false });
    
    filter_user_schema = Joi.object({
        name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        age: Joi.number().min(18),
        send_ads: Joi.boolean(),
        signup_date_start: Joi.date(),
        signup_date_end: Joi.date()
    })
    .options({ abortEarly: false });

    id_schema = Joi.string().pattern(new RegExp("^[a-zA-Z0-9-]+$")).required();
}

const user_validation = new UserValidation();
export default user_validation;