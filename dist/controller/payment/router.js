"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _PaymentController = _interopRequireDefault(require("./PaymentController"));

var _authenticate = _interopRequireDefault(require("../../middleware/authenticate"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.post("/buyPlan", _authenticate.default, _PaymentController.default.buyPlan);
router.get("/success/:id/:planName", _PaymentController.default.success);
router.get("/cancel/:id/:planName", _PaymentController.default.cancel);
var _default = router;
exports.default = _default;