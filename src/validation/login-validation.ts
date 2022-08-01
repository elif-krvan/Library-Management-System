import Joi from "joi";

class LoginValidation {
    user_info_schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required() //edit
    })
    .options({ abortEarly: false });
}

const login_validation =  new LoginValidation();
export default login_validation;