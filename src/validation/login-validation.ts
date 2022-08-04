import Joi from "joi";

const login_validation = {
    user_info_schema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required() //edit
    })
    .options({ abortEarly: false })
}

export default login_validation;