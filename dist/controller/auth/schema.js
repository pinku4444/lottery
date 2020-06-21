"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.forgetPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signupSchema = _joi.default.object({
  email: _joi.default.string().email().required(),
  password: _joi.default.string().min(3).required(),
  fullName: _joi.default.string().min(3).required()
});

exports.signupSchema = signupSchema;

const loginSchema = _joi.default.object({
  email: _joi.default.string().email().required(),
  password: _joi.default.string().required()
});

exports.loginSchema = loginSchema;

const forgetPasswordSchema = _joi.default.object({
  email: _joi.default.string().email().required(),
  password: _joi.default.string().required()
});

exports.forgetPasswordSchema = forgetPasswordSchema;