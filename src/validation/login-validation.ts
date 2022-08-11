import Joi from "joi";

const login_validation = {
    user_info_schema: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required() //edit
    })
    .options({ abortEarly: false }),

    verification_code_schema: Joi.string().alphanum()    
}

export default login_validation;