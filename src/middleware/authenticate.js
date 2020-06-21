import jwt from 'jsonwebtoken';
import configuration from '../config/config';
import UserModel from '../models/User';
import { errorCode } from '../cms/errorCode';


const auth = async (req, res, next) => {
    try {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            // verify token
            const decode = jwt.verify(token, configuration.jwtSecret);
            let user = decode.user;
            // check user exist or not
            const userData = await UserModel.findOne({ where: { email: user.email } });
            if (userData) {
                req.body.userDetail = userData.dataValues;
                next();
            } else {
                const response = { statusCode: errorCode.unauthorized, msg: "Session expired,Please login again" };
                return next(response);
            }
        } else {
            const response = { statusCode: errorCode.unauthorized, msg: "Session expired,Please login again" };
            return next(response);
        }
    } catch (ex) {
        console.log('ex: ', ex.message);
        const response = { statusCode: errorCode.unauthorized, msg: "Session expired,Please login again" };
        return next(response);
    }
};


export default auth;