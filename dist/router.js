"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _router = _interopRequireDefault(require("./controller/auth/router"));

var _router2 = _interopRequireDefault(require("./controller/game/router"));

var _router3 = _interopRequireDefault(require("./controller/payment/router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.use('/auth', _router.default);
router.use('/game', _router2.default);
router.use('/plan', _router3.default);
var _default = router;
exports.default = _default;