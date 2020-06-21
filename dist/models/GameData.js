"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _database = _interopRequireDefault(require("../libs/database"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const db = (0, _database.default)();
let GameData = db.define('GameData', {
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
  date: {
    type: _sequelize.default.DATEONLY,
    allowNull: false
  },
  is_completed: {
    type: _sequelize.default.INTEGER(8),
    allowNull: false
  },
  draw_no: {
    type: _sequelize.default.INTEGER(8),
    allowNull: false
  },
  num_gen: {
    type: _sequelize.default.STRING(300),
    allowNull: false
  },
  points: {
    type: _sequelize.default.STRING(300),
    allowNull: false
  },
  result: {
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
var _default = GameData;
exports.default = _default;