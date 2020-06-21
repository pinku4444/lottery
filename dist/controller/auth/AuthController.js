"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _User = _interopRequireDefault(require("../../models/User"));

var _errorCode = require("../../cms/errorCode");

var _config = _interopRequireDefault(require("../../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class AuthController {
  async signup(req, res, next) {
    try {
      let {
        email,
        password,
        fullName
      } = req.body; // checking user exist or not

      let user = await _User.default.findOne({
        where: {
          email
        }
      });

      if (user) {
        const errorRes = {
          statusCode: _errorCode.errorCode.bad_request,
          msg: "User Already exist"
        };
        return next(errorRes);
      } // encrypt password 


      const salt = await _bcrypt.default.genSalt(parseInt(_config.default.saltLength));
      password = await _bcrypt.default.hash(password, salt);
      const userData = await _User.default.create({
        email,
        password,
        fullName
      });
      const {
        id: newId,
        email: newEmail,
        fullName: newFullName,
        is_premium
      } = userData.dataValues; //generate token 

      const payLoad = {
        user: {
          email: newEmail
        }
      };

      _jsonwebtoken.default.sign(payLoad, _config.default.jwtSecret, {
        expiresIn: 3600
      }, (error, token) => {
        if (error) {
          throw error;
        }

        ;
        const newUser = {
          'id': newId,
          'fullName': newFullName,
          'email': newEmail,
          'is_premium': is_premium,
          'token': token
        };
        const response = {
          status: 'ok',
          code: _errorCode.errorCode.ok,
          message: "User created successfully",
          data: newUser
        };
        return res.status(_errorCode.errorCode.ok).json(response);
      });
    } catch (ex) {
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async login(req, res, next) {
    try {
      const {
        email,
        password
      } = req.body; // check user exist or not

      const user = await _User.default.findOne({
        where: {
          email
        }
      });
      console.log('user: ', user);

      if (!user) {
        const response = {
          statusCode: _errorCode.errorCode.unauthorized,
          msg: "Invalid credentials"
        };
        return next(response);
      }

      ;
      const {
        id: newId,
        email: newEmail,
        fullName: newFullName,
        password: newPassword,
        is_premium
      } = user.dataValues;
      console.log('newPassword: ', newPassword);
      const isMatch = await _bcrypt.default.compare(password, newPassword);

      if (!isMatch) {
        const response = {
          statusCode: _errorCode.errorCode.unauthorized,
          msg: "Invalid credentials"
        };
        return next(response);
      }

      ; // generate token

      const payload = {
        user: {
          email: newEmail
        }
      };

      _jsonwebtoken.default.sign(payload, _config.default.jwtSecret, {
        expiresIn: 36000
      }, (err, token) => {
        if (err) {
          throw err;
        }

        const newUser = {
          'id': newId,
          'fullName': newFullName,
          'email': newEmail,
          'is_premium': is_premium,
          'token': token
        };
        const response = {
          "status": "ok",
          "code": _errorCode.errorCode.ok,
          "msg": "login successfully",
          "data": newUser
        };
        return res.status(200).send(response);
      });
    } catch (ex) {
      console.log('ex: ', ex.message);
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Internal Server error"
      };
      return next(response);
    }
  }

  async forgetPassword(req, res, next) {
    try {
      let {
        email,
        password
      } = req.body; // checking user exist or not

      let user = await _User.default.findOne({
        where: {
          email
        }
      });

      if (!user) {
        const errorRes = {
          statusCode: _errorCode.errorCode.bad_request,
          msg: "User Not exist"
        };
        return next(errorRes);
      } // encrypt password 


      const salt = await _bcrypt.default.genSalt(parseInt(_config.default.saltLength));
      password = await _bcrypt.default.hash(password, salt);
      const userData = await _User.default.update({
        password
      }, {
        where: {
          email
        }
      });
      const {
        id: newId,
        email: newEmail,
        fullName: newFullName,
        is_premium
      } = user.dataValues; //generate token 

      const payLoad = {
        user: {
          email: newEmail
        }
      };

      _jsonwebtoken.default.sign(payLoad, _config.default.jwtSecret, {
        expiresIn: 3600
      }, (error, token) => {
        if (error) {
          throw error;
        }

        ;
        const newUser = {
          'id': newId,
          'fullName': newFullName,
          'email': newEmail,
          'is_premium': is_premium,
          'token': token
        };
        const response = {
          status: 'ok',
          code: _errorCode.errorCode.ok,
          message: "password changed successfully",
          data: newUser
        };
        return res.status(_errorCode.errorCode.ok).json(response);
      });
    } catch (ex) {
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

}

var _default = new AuthController();

exports.default = _default;