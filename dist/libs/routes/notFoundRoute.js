"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

const notFoundRoute = (req, res, next) => {
  let error = {
    'msg': 'url not found',
    'statusCode': 404
  };
  next(error);
};

var _default = notFoundRoute;
exports.default = _default;