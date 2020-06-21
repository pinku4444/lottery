"use strict";

var _config = _interopRequireDefault(require("./config/config"));

var _server = _interopRequireDefault(require("./server"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const server = new _server.default(_config.default);
server.bootstrap();