import Sequelize from 'sequelize';
import database from '../libs/database';

const db = database();

let GameData = db.define('GameData', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    is_completed: {
        type: Sequelize.INTEGER(8),
        allowNull: false
    },
    draw_no: {
        type: Sequelize.INTEGER(8),
        allowNull: false
    },
    num_gen: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },
    points: {
        type: Sequelize.STRING(300),
        allowNull: false,
    },
    result: {
        type: Sequelize.STRING(300),
        allowNull: false
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

export default GameData;