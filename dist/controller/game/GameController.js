"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errorCode = require("../../cms/errorCode");

var _Result = _interopRequireDefault(require("../../models/Result"));

var _GameData = _interopRequireDefault(require("../../models/GameData"));

var _formatDate = _interopRequireDefault(require("../../utils/formatDate"));

var _sequelize = require("sequelize");

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GameController {
  async saveResult(req, res, next) {
    try {
      let date = Date.now();
      let todayDate = (0, _formatDate.default)(date);

      for (let i = 1; i <= 360; i++) {
        let iData = [];
        iData[0] = Math.floor(Math.random() * 100) + 1;
        iData[1] = Math.floor(Math.random() * 100) + 1;
        iData[2] = Math.floor(Math.random() * 100) + 1;
        iData[3] = Math.floor(Math.random() * 100) + 1;
        iData[4] = Math.floor(Math.random() * 100) + 1;
        iData.sort(function (a, b) {
          return a - b;
        });
        iData[5] = Math.floor(Math.random() * 30) + 1;
        iData = iData.toString();
        await _Result.default.create({
          DATE: todayDate,
          DRAWNO: i,
          SYSTEM_GEN_NUMS: iData
        });
      }

      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data created successfully"
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async getNextDraw(req, res, next) {
    try {
      const drawNumber = parseInt(req.params.id);
      console.log('drawNumber: ', drawNumber);
      let date = Date.now();
      let todayDate = (0, _formatDate.default)(date);
      console.log('todayDate: ', todayDate);
      const data = await _Result.default.findOne({
        where: {
          DRAWNO: drawNumber,
          DATE: todayDate
        }
      });

      if (!data) {
        const response = {
          statusCode: _errorCode.errorCode.internal_server_error,
          msg: "Something went wrong"
        };
        next(response);
      }

      let newData = data.dataValues;
      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data fetch successfully",
        data: newData
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      console.log('ex: ', ex.message);
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async saveUserData(req, res, next) {
    try {
      const {
        data,
        userDetail
      } = req.body;

      for (let i = 0; i < data.length; i++) {
        let gameData = {
          userId: userDetail.id,
          draw_no: data[i].draw_no,
          num_gen: data[i].num_gen,
          is_completed: data[i].is_completed,
          result: data[i].result,
          points: data[i].points,
          date: data[i].date
        };
        await _GameData.default.create(gameData);
      }

      let gameData = await _GameData.default.findAll({
        where: {
          userId: userDetail.id,
          date: {
            [_sequelize.Op.gte]: (0, _moment.default)().subtract(6, 'd').format('YYYY-MM-DD')
          }
        }
      });
      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data fetch successfully",
        data: gameData || []
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      console.log('ex: ', ex.message);
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async getUserData(req, res, next) {
    try {
      const {
        userDetail
      } = req.body;
      let gameData = await _GameData.default.findAll({
        where: {
          userId: userDetail.id,
          date: {
            [_sequelize.Op.gte]: (0, _moment.default)().subtract(6, 'd').format('YYYY-MM-DD')
          }
        }
      });
      console.log('gameData: ', gameData);
      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data fetch successfully",
        data: gameData || []
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      console.log('ex: ', ex.message);
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async deleteGameData(req, res, next) {
    try {
      const {
        id
      } = req.params;
      const {
        userDetail
      } = req.body;
      await _GameData.default.destroy({
        where: {
          id,
          userId: userDetail.id
        }
      });
      let gameData = await _GameData.default.findAll({
        where: {
          userId: userDetail.id,
          date: {
            [_sequelize.Op.gte]: (0, _moment.default)().subtract(6, 'd').format('YYYY-MM-DD')
          }
        }
      });
      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data deleted successfully",
        data: gameData || []
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async deleteAllUserGameData(req, res, next) {
    try {
      const {
        userDetail
      } = req.body;
      await _GameData.default.destroy({
        where: {
          userId: userDetail.id
        }
      });
      let gameData = await _GameData.default.findAll({
        where: {
          userId: userDetail.id,
          date: {
            [_sequelize.Op.gte]: (0, _moment.default)().subtract(6, 'd').format('YYYY-MM-DD')
          }
        }
      });
      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data deleted successfully",
        data: gameData || []
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

  async updateUserGameData(req, res, next) {
    try {
      const {
        draw_no
      } = req.params;
      console.log('draw_no: ', draw_no);
      const {
        data,
        userDetail
      } = req.body;
      console.log('data: ', data);

      for (let i = 0; i < data.length; i++) {
        let gameData = {
          num_gen: data[i].num_gen,
          is_completed: data[i].is_completed,
          result: data[i].result,
          points: data[i].points
        };
        await _GameData.default.update(gameData, {
          where: {
            id: data[i].id,
            userId: userDetail.id,
            draw_no: draw_no
          }
        });
      }

      const response = {
        status: 'ok',
        code: _errorCode.errorCode.ok,
        message: "Data Updated successfully"
      };
      return res.status(_errorCode.errorCode.ok).json(response);
    } catch (ex) {
      const response = {
        statusCode: _errorCode.errorCode.internal_server_error,
        msg: "Something went wrong"
      };
      next(response);
    }
  }

}

var _default = new GameController();

exports.default = _default;