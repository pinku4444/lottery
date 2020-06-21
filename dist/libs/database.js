"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sequelize = _interopRequireDefault(require("sequelize"));

var _config = _interopRequireDefault(require("../config/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const database = () => {
  try {
    const db = new _sequelize.default(_config.default.dataBase, _config.default.dataBaseUserName, _config.default.databasePassword, {
      host: 'localhost',
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
    return db;
  } catch (ex) {
    console.log("Error in database", ex.message);
  }
};

var _default = database;
exports.default = _default;