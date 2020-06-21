import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../../models/User';
import { errorCode } from '../../cms/errorCode';
import configuration from '../../config/config';
class AuthController {

    async signup(req, res, next) {
        try {
            let { email, password, fullName } = req.body;
            // checking user exist or not
            let user = await UserModel.findOne({ where: { email } });
            if (user) {
                const errorRes = { statusCode: errorCode.bad_request, msg: "User Already exist" };
                return next(errorRes);
            }

            // encrypt password 
            const salt = await bcrypt.genSalt(parseInt(configuration.saltLength));
            password = await bcrypt.hash(password, salt);

            const userData = await UserModel.create({ email, password, fullName });
            const { id: newId, email: newEmail, fullName: newFullName, is_premium } = userData.dataValues;


            //generate token 

            const payLoad = {
                user: {
                    email: newEmail
                }
            };

            jwt.sign(payLoad, configuration.jwtSecret, { expiresIn: 3600 }, (error, token) => {
                if (error) {
                    throw error
                };
                const newUser = {
                    'id': newId,
                    'fullName': newFullName,
                    'email': newEmail,
                    'is_premium': is_premium,
                    'token': token

                }
                const response = {
                    status: 'ok',
                    code: errorCode.ok,
                    message: "User created successfully",
                    data: newUser,

                };
                return res.status(errorCode.ok).json(response);

            })
        } catch (ex) {
            const response = { statusCode: errorCode.internal_server_error, msg: "Something went wrong" };
            next(response);
        }

    }
    async login(req, res, next) {

        try {
            const { email, password } = req.body;
            // check user exist or not
            const user = await UserModel.findOne({ where: { email } });
            console.log('user: ', user);
            if (!user) {
                const response = { statusCode: errorCode.unauthorized, msg: "Invalid credentials" };
                return next(response);
            };
            const { id: newId, email: newEmail, fullName: newFullName, password: newPassword, is_premium } = user.dataValues;
            console.log('newPassword: ', newPassword);
            const isMatch = await bcrypt.compare(password, newPassword);

            if (!isMatch) {
                const response = { statusCode: errorCode.unauthorized, msg: "Invalid credentials" };
                return next(response);
            };

            // generate token

            const payload = {
                user: {
                    email: newEmail
                }
            };

            jwt.sign(payload, configuration.jwtSecret, { expiresIn: 36000 }, (err, token) => {
                if (err) {
                    throw err;
                }
                const newUser = {
                    'id': newId,
                    'fullName': newFullName,
                    'email': newEmail,
                    'is_premium': is_premium,
                    'token': token

                }
                const response = {
                    "status": "ok",
                    "code": errorCode.ok,
                    "msg": "login successfully",
                    "data": newUser
                };
                return res.status(200).send(response);
            })
        } catch (ex) {
            console.log('ex: ', ex.message);
            const response = { statusCode: errorCode.internal_server_error, msg: "Internal Server error" };
            return next(response);

        }


    }
    async forgetPassword(req, res, next) {
        try {
            let { email, password } = req.body;
            // checking user exist or not
            let user = await UserModel.findOne({ where: { email } });
            if (!user) {
                const errorRes = { statusCode: errorCode.bad_request, msg: "User Not exist" };
                return next(errorRes);
            }

            // encrypt password 
            const salt = await bcrypt.genSalt(parseInt(configuration.saltLength));
            password = await bcrypt.hash(password, salt);

            const userData = await UserModel.update({ password }, { where: { email } });
            const { id: newId, email: newEmail, fullName: newFullName, is_premium } = user.dataValues;


            //generate token 

            const payLoad = {
                user: {
                    email: newEmail
                }
            };

            jwt.sign(payLoad, configuration.jwtSecret, { expiresIn: 3600 }, (error, token) => {
                if (error) {
                    throw error
                };
                const newUser = {
                    'id': newId,
                    'fullName': newFullName,
                    'email': newEmail,
                    'is_premium': is_premium,
                    'token': token

                }
                const response = {
                    status: 'ok',
                    code: errorCode.ok,
                    message: "password changed successfully",
                    data: newUser,

                };
                return res.status(errorCode.ok).json(response);

            })
        } catch (ex) {
            const response = { statusCode: errorCode.internal_server_error, msg: "Something went wrong" };
            next(response);
        }

    }

}

export default new AuthController;