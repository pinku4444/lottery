"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _GameController = _interopRequireDefault(require("./GameController"));

var _authenticate = _interopRequireDefault(require("../../middleware/authenticate"));

var _checkPremium = _interopRequireDefault(require("../../middleware/checkPremium"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = _express.default.Router();

router.get('/genResult', _GameController.default.saveResult);
router.get("/getNextDraw/:id", _GameController.default.getNextDraw);
router.post("/saveData", _authenticate.default, _checkPremium.default, _GameController.default.saveUserData);
router.get("/getUserData", _authenticate.default, _checkPremium.default, _GameController.default.getUserData);
router.delete("/deleteGameData/:id", _authenticate.default, _checkPremium.default, _GameController.default.deleteGameData);
router.delete("/deleteAllUserGameData", _authenticate.default, _checkPremium.default, _GameController.default.deleteAllUserGameData);
router.put("/updateData/:draw_no", _authenticate.default, _checkPremium.default, _GameController.default.updateUserGameData);
var _default = router;
exports.default = _default;