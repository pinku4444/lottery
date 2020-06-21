import jwt from 'jsonwebtoken';
import configuration from '../config/config';
import UserModel from '../models/User';
import { errorCode } from '../cms/errorCode';
import SubscriptionModel from '../models/Subscription';
import moment from 'moment';


const checkPremium = async (req, res, next) => {
    try {
        const { userDetail } = req.body;
        const { id, is_premium } = userDetail;
        console.log('id: ', id);
        if (is_premium == 0) {
            const response = { statusCode: errorCode.forbidden, msg: "Plan expired,Please buy plan again" };
            await UserModel.update({ is_premium: 0 }, { where: { id } });
            return next(response);
        }

        let subsData = await SubscriptionModel.findAll({ limit: 1, where: { userId: id }, order: [['id', 'DESC']] });
        if (!subsData) {
            await UserModel.update({ is_premium: 0 }, { where: { id } });
            const response = { statusCode: errorCode.forbidden, msg: "Plan expired,Please buy plan again" };
            return next(response);
        }
        let finalSubsData = subsData[0].dataValues;
        let planDate = moment(finalSubsData.validTill);
        let now = moment();
        if (now > planDate) {
            await UserModel.update({ is_premium: 0 }, { where: { id } });
            const response = { statusCode: errorCode.forbidden, msg: "Plan expired,Please buy plan again" };
            return next(response);
        }
        next();
    } catch (ex) {
        console.log('ex: ', ex.message);
        const response = { statusCode: errorCode.internal_server_error, msg: "Something went wrong" };
        return next(response);
    }
};


export default checkPremium;