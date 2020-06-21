"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = _interopRequireDefault(require("../libs/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = (0, _database.default)();
let Transaction = db.define('Transaction', {
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
  transactionHash: {
    type: _sequelize.default.STRING,
    allowNull: false,
    unique: true
  },
  amount: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  currency: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  status: {
    type: _sequelize.default.STRING,
    allowNull: false
  },
  timestamp: {
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
var _default = Transaction;
exports.default = _default;