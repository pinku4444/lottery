import { config } from 'dotenv';

config();

const envVars = process.env;

const configuration = Object.freeze({

    port: envVars.PORT,
    env: envVars.NODE_ENV,
    saltLength: envVars.saltLength,
    jwtSecret: envVars.jwtSecret,
    dataBase: envVars.DATABASE_NAME,
    dataBaseUserName: envVars.DATABASE_USER,
    databasePassword: envVars.DATABASE_PASSWORD,
    paypalClientId: envVars.PAYPAL_CLIENT_ID,
    paypalSecretId: envVars.PAYPAL_CLIENT_SECRET,
    paypalMode: envVars.PAYPAL_MODE,
    paypalRedirectUrl: envVars.PAYPAY_REDIRECT_URL,
    paypalCancelUrl: envVars.PAYPAL_CANCEL_URL


});


export default configuration;