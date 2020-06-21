import Sequelize from 'sequelize';
import config from '../config/config'
const database = () => {
    try {
        const db = new Sequelize(config.dataBase, config.dataBaseUserName, config.databasePassword, {
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
        console.log("Error in database", ex.message)
    }
}


export default database;
