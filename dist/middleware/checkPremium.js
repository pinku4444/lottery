"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("../config/config"));

var _User = _interopRequireDefault(require("../models/User"));

var _errorCode = require("../cms/errorCode");

var _Subscription = _interopRequireDefault(require("../models/Subscription"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const checkPremium = async (req, res, next) => {
  try {
    const {
      userDetail
    } = req.body;
    const {
      id,
      is_premium
    } = userDetail;
    console.log('id: ', id);

    if (is_premium == 0) {
      const response = {
        statusCode: _errorCode.errorCode.forbidden,
        msg: "Plan expired,Please buy plan again"
      };
      await _User.default.update({
        is_premium: 0
      }, {
        where: {
          id
        }
      });
      return next(response);
    }

    let subsData = await _Subscription.default.findAll({
      limit: 1,
      where: {
        userId: id
      },
      order: [['id', 'DESC']]
    });

    if (!subsData) {
      await _User.default.update({
        is_premium: 0
      }, {
        where: {
          id
        }
      });
      const response = {
        statusCode: _errorCode.errorCode.forbidden,
        msg: "Plan expired,Please buy plan again"
      };
      return next(response);
    }

    let finalSubsData = subsData[0].dataValues;
    let planDate = (0, _moment.default)(finalSubsData.validTill);
    let now = (0, _moment.default)();

    if (now > planDate) {
      await _User.default.update({
        is_premium: 0
      }, {
        where: {
          id
        }
      });
      const response = {
        statusCode: _errorCode.errorCode.forbidden,
        msg: "Plan expired,Please buy plan again"
      };
      return next(response);
    }

    next();
  } catch (ex) {
    console.log('ex: ', ex.message);
    const response = {
      statusCode: _errorCode.errorCode.internal_server_error,
      msg: "Something went wrong"
    };
    return next(response);
  }
};

var _default = checkPremium;
exports.default = _default;