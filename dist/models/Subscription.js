"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = _interopRequireDefault(require("../libs/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = (0, _database.default)();
let Subscription = db.define('Subscription', {
  id: {
    type: _sequelize.default.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  planName: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  subscribedOn: {
    type: _sequelize.default.DATEONLY,
    allowNull: false
  },
  validTill: {
    type: _sequelize.default.DATEONLY,
    allowNull: false
  },
  transactionId: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  createdAt: {
    type: _sequelize.default.DATE,
    allowNull: false,
    defaultValue: _sequelize.default.NOW
  },
  updatedAt: {
    type: _sequelize.default.DATE,
    allowNull: false,
    defaultValue: _sequelize.default.NOW
  }
});
var _default = Subscription;
exports.default = _default;