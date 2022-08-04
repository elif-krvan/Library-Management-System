import Joi from "joi";

const library_validation = {
    isbn_schema: Joi.string().min(10).max(13).pattern(new RegExp('^[0-9]+$')).required()
    .options({ abortEarly: false })
}

export default library_validation;