import Joi from "joi";

const library_validation = {
    
    search_schema: Joi.object({
        isbn: Joi.string().min(10).max(13).pattern(new RegExp('^[0-9]+$')),
        title: Joi.string().pattern(new RegExp("^[a-zA-Z0-9-]+$"))
    })
    .xor("isbn", "title")
    .options({ abortEarly: false }),

    isbn_schema: Joi.string().min(10).max(13).pattern(new RegExp('^[0-9]+$'))
     
}

export default library_validation;