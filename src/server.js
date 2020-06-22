import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import helmet from 'helmet';
import database from './libs/database';
import { notFoundRoute, errorHandlerRoute } from './libs';
import router from './router';


class Server {
    constructor(config) {
        this.config = config;
        this.app = express();
    }
    bootstrap() {
        this.app.use(express.static(__dirname + '/public'));
        this.initHelmet();
        this.initBodyParser();
        this.setUpRoutes();
        this.app.set('view engine', 'ejs');
        return this.app;

    }
    initHelmet() {
        this.app.use(helmet());
    }
    initBodyParser() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }))
    }
    setUpRoutes() {
        this.app.use('/api', router);
        this.run();

    }
    async run() {
        const { app } = this;
        const { port } = this.config;
        try {
            const db = database();
            await db.authenticate();
            console.log("connected to database")

        } catch (ex) {
            console.log("Not connected to database", ex.message);
        }

        app.get('/', function (req, res) {
            console.log("test")
            res.render('index', { payment: 'not' });
        });

        app.listen(80, () => {
            console.log(`App is Running at ${port}`)
        })
        app.use(notFoundRoute);
        app.use(errorHandlerRoute);
    }


}

export default Server;