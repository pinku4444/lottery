"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _AuthController = _interopRequireDefault(require("./AuthController"));

var _middleware = require("../../middleware");

var _schema = require("./schema");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post('/signup', (0, _middleware.validation)(_schema.signupSchema), _AuthController.default.signup);
router.post('/login', (0, _middleware.validation)(_schema.loginSchema), _AuthController.default.login);
router.post('/forgetPassword', (0, _middleware.validation)(_schema.loginSchema), _AuthController.default.forgetPassword);
var _default = router;
exports.default = _default;