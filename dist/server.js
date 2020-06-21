"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _cors = _interopRequireDefault(require("cors"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _helmet = _interopRequireDefault(require("helmet"));

var _database = _interopRequireDefault(require("./libs/database"));

var _libs = require("./libs");

var _router = _interopRequireDefault(require("./router"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Server {
  constructor(config) {
    this.config = config;
    this.app = (0, _express.default)();
  }

  bootstrap() {
    this.app.use(_express.default.static(__dirname + '/public'));
    this.initHelmet();
    this.initBodyParser();
    this.setUpRoutes();
    this.app.set('view engine', 'ejs');
    return this.app;
  }

  initHelmet() {
    this.app.use((0, _helmet.default)());
  }

  initBodyParser() {
    this.app.use(_bodyParser.default.json());
    this.app.use(_bodyParser.default.urlencoded({
      extended: true
    }));
  }

  setUpRoutes() {
    this.app.use('/api', _router.default);
    this.run();
  }

  async run() {
    const {
      app
    } = this;
    const {
      port
    } = this.config;

    try {
      const db = (0, _database.default)();
      await db.authenticate();
      console.log("connected to database");
    } catch (ex) {
      console.log("Not connected to database", ex.message);
    }

    app.get('/', function (req, res) {
      console.log("test");
      res.render('index', {
        payment: 'not'
      });
    });
    app.listen(port, () => {
      console.log(`App is Running at ${port}`);
    });
    app.use(_libs.notFoundRoute);
    app.use(_libs.errorHandlerRoute);
  }

}

var _default = Server;
exports.default = _default;