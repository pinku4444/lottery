"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config/config"));

var _User = _interopRequireDefault(require("../models/User"));

var _errorCode = require("../cms/errorCode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const auth = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1]; // verify token

      const decode = _jsonwebtoken.default.verify(token, _config.default.jwtSecret);

      let user = decode.user; // check user exist or not

      const userData = await _User.default.findOne({
        where: {
          email: user.email
        }
      });

      if (userData) {
        req.body.userDetail = userData.dataValues;
        next();
      } else {
        const response = {
          statusCode: _errorCode.errorCode.unauthorized,
          msg: "Session expired,Please login again"
        };
        return next(response);
      }
    } else {
      const response = {
        statusCode: _errorCode.errorCode.unauthorized,
        msg: "Session expired,Please login again"
      };
      return next(response);
    }
  } catch (ex) {
    console.log('ex: ', ex.message);
    const response = {
      statusCode: _errorCode.errorCode.unauthorized,
      msg: "Session expired,Please login again"
    };
    return next(response);
  }
};

var _default = auth;
exports.default = _default;