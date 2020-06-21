"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const errorHandlerRoute = (err, req, res, next) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  ;
  const errorResponse = {
    status: false,
    code: err.statusCode,
    errors: err.msg
  };
  res.status(err.statusCode).json(errorResponse);
};

var _default = errorHandlerRoute;
exports.default = _default;