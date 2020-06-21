import Sequelize from 'sequelize';
import database from '../libs/database';

const db = database();

let Transaction = db.define('Transaction', {
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
    transactionHash: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    amount: {
        type: Sequelize.STRING,
        allowNull: false
    },
    currency: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    timestamp: {
        type: Sequelize.STRING,
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

export default Transaction;