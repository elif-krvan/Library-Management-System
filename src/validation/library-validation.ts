import Joi from "joi";

class LibraryValidation {
    isbn_schema = Joi.string().min(10).max(13).pattern(new RegExp('^[0-9]+$')).required()
    .options({ abortEarly: false });
}

const library_validation =  new LibraryValidation();
export default library_validation;