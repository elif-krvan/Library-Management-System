import { NextFunction, Request, Response } from "express";
import Joi, { ObjectSchema } from "joi";
import { ErrorResponse } from "../common/error";

class Validation {
    
    validate_joi = (schema: ObjectSchema) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.validateAsync(req.body);
                
                next();
            } catch (err) {
                console.log(err);

                const err_res: ErrorResponse = {
                    error: "wrong request content",
                    message: "signup is not successful"
                }
                return res.status(400).json(err_res);
            }
        };
    };

    validate_joi_param = (schema: ObjectSchema) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                await schema.validateAsync(req.params);
                
                next();
            } catch (err) {
                console.log(err);

                const err_res: ErrorResponse = {
                    error: "wrong request content",
                    message: "signup is not successful"
                }
                return res.status(400).json(err_res);
            }
        };
    };

    user_schema = Joi.object({
        name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
        surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')).required(),
        age: Joi.number().min(18).required(),
        send_ads: Joi.boolean().required(),
        email: Joi.string().email().required()
    });

    peg_schema = Joi.alternatives().try(
        Joi.object({
            page: Joi.number().min(1).required(),
            limit: Joi.number().min(1).required()
        }),
        Joi.object({
            page: Joi.valid(null, '', NaN),
            limit: Joi.valid(null, '', NaN)
        })
    )

    filter_user_schema = Joi.object({
        name: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        surname: Joi.string().min(3).max(50).pattern(new RegExp('^[a-zA-Z]')),
        age: Joi.number().min(18),
        send_ads: Joi.boolean(),
        signup_date: Joi.date(),
        sort_by: Joi.string().valid("id", "user_id", "name", "surname", "age", "signup_date", "send_ads"),
        order: Joi.string().valid("asc", "desc")
    })
    .with("order", "sort_by");

    id_schema = Joi.string().pattern(new RegExp("^[a-zA-Z0-9-]+$")).required();
}

const validation = new Validation();
export default validation;