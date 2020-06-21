import Sequelize from 'sequelize';
import database from '../libs/database';

const db = database();

let User = db.define('User', {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true
    },
    is_premium: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0
    },
    fullName: {
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

export default User;