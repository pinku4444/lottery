import Sequelize from 'sequelize';
import database from '../libs/database';

const db = database();

let Subscription = db.define('Subscription', {
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
    planName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    subscribedOn: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    validTill: {
        type: Sequelize.DATEONLY,
        allowNull: false,
    },
    transactionId: {
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

export default Subscription;