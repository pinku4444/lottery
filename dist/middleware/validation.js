"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _errorCode = require("../cms/errorCode");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const validation = schema => {
  return async (req, res, next) => {
    console.log(req.body);
    const {
      error,
      value
    } = schema.validate(req.body, {
      abortEarly: false
    });
    const valid = error == null;

    if (valid) {
      return next();
    }

    const {
      details
    } = error;
    const errorMsg = details.map(error => {
      return error.message.replace(/['"]+/g, '');
    });
    const response = {
      statusCode: _errorCode.errorCode.bad_request,
      msg: errorMsg
    };
    return next(response);
  };
};

var _default = validation;
exports.default = _default;