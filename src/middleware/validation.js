import Joi from "@hapi/joi";
import { errorCode } from '../cms/errorCode';

const validation = (schema) => {
    return async (req, res, next) => {
        console.log(req.body);
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
        });
        const valid = error == null;
        if (valid) {
            return next()
        }
        const { details } = error;
        const errorMsg = details.map((error) => {
            return error.message.replace(/['"]+/g, '');
        });
        const response = { statusCode: errorCode.bad_request, msg: errorMsg };
        return next(response);

    };
};

export default validation;
