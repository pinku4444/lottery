import Sequelize from 'sequelize';
import database from '../libs/database';

const db = database();

let Result = db.define('Result', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    DATE: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    DRAWNO: {
        type: Sequelize.INTEGER(8),
        allowNull: false
    },
    SYSTEM_GEN_NUMS: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },

    createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
});

export default Result;