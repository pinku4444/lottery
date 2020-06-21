"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = _interopRequireDefault(require("../libs/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = (0, _database.default)();
let User = db.define('User', {
  id: {
    type: _sequelize.default.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: _sequelize.default.STRING(300),
    allowNull: false,
    unique: true
  },
  password: {
    type: _sequelize.default.STRING(300),
    allowNull: false,
    unique: true
  },
  is_premium: {
    type: _sequelize.default.INTEGER(11),
    allowNull: false,
    defaultValue: 0
  },
  fullName: {
    type: _sequelize.default.STRING(300),
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
var _default = User;
exports.default = _default;