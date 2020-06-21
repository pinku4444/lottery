"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "errorHandlerRoute", {
  enumerable: true,
  get: function () {
    return _errorHandlerRoute.default;
  }
});
Object.defineProperty(exports, "notFoundRoute", {
  enumerable: true,
  get: function () {
    return _notFoundRoute.default;
  }
});

var _errorHandlerRoute = _interopRequireDefault(require("./routes/errorHandlerRoute"));

var _notFoundRoute = _interopRequireDefault(require("./routes/notFoundRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }