import paypal from 'paypal-rest-sdk';
import UserModel from '../../models/User';
import TransactionModel from '../../models/Transaction';
import SubscriptionModel from '../../models/Subscription';
import { errorCode } from '../../cms/errorCode';
import configuration from '../../config/config';
import getCurrentSubscription from '../../utils/getSubscription';
import getFormattedDate from '../../utils/formatDate';
import moment from 'moment';


class PaymentController {
    async buyPlan(req, res, next) {
        const { planName, userDetail } = req.body;
        const { id, email } = userDetail;
        const data = {
            mode: configuration.paypalMode, //sandbox or live
            client_id: configuration.paypalClientId,
            client_secret: configuration.paypalSecretId
        };
        console.log('data: ', data);
        paypal.configure({
            mode: configuration.paypalMode, //sandbox or live
            client_id: configuration.paypalClientId,
            client_secret: configuration.paypalSecretId
        });

        const selectSubscription = getCurrentSubscription(planName);
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": `${configuration.paypalRedirectUrl}/${id}/${planName}`,
                "cancel_url": `${configuration.paypalCancelUrl}/${id}/${planName}`
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": selectSubscription.name,
                        "sku": selectSubscription.name,
                        "price": selectSubscription.price,
                        "currency": selectSubscription.currency,
                        "quantity": selectSubscription.quantity
                    }]
                },
                "amount": {
                    "currency": selectSubscription.currency,
                    "total": selectSubscription.price
                },
                "description": "This is the payment for plan."
            }]
        };
        console.log('create_payment_json: ', create_payment_json);
        console.log('create_payment_json:>>> ', create_payment_json.transactions[0].item_list);
        console.log('create_payment_json:>>> ', create_payment_json.transactions[0].amount);

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                console.log('error: ', error.message);
                const response = { statusCode: errorCode.internal_server_error, msg: "Something went wrong" };
                next(response);
            } else {
                const approval = payment.links.find(pLink => pLink.rel === 'approval_url');
                console.log(approval.href);
                const response = {
                    status: 'ok',
                    code: errorCode.ok,
                    data: { link: approval.href },
                    message: "Data created successfully",

                };
                return res.status(errorCode.ok).json(response);
            }
        });
    }
    /**
     * After Successful payment
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     */
    async success(req, res, next) {
        console.log("testttt", req.query)
        const { PayerID, paymentId } = req.query;
        const { id, planName } = req.params;
        console.log('userid: ', id);
        console.log('planName: ', planName);
        const selectSubscription = getCurrentSubscription(planName);
        const execute_payment_json = {
            "payer_id": PayerID,
            "transactions": [{
                "amount": {
                    "currency": selectSubscription.currency,
                    "total": selectSubscription.price
                }
            }]
        };

        paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
            if (error) {
                console.log('err: ', error.message);
                const response = { statusCode: errorCode.internal_server_error, msg: "Something went wrong" };
                next(response);

            } else {
                console.log("payment", payment);

                // update user value value 
                const userData = await UserModel.update({ is_premium: 1 }, { where: { id: parseInt(id) } });

                // start creating data for transaction table
                const transactionData = {
                    userId: id,
                    transactionHash: paymentId || payment.id,
                    amount: payment.transactions[0].amount.total,
                    currency: payment.transactions[0].amount.currency,
                    status: payment.state,
                    timestamp: payment.create_time
                };

                const transData = await TransactionModel.create(transactionData);

                const finalTransData = transData.dataValues;
                console.log('finalTransData: ', finalTransData);

                // start creating data for subscription table
                let days = ''
                if (planName == 'pro') {
                    days = 30;

                } else {
                    days = 7;
                }
                const subscriptionData = {
                    userId: id,
                    planName: planName,
                    subscribedOn: moment().format('YYYY-MM-DD'),
                    validTill: moment().add(days, 'd').format('YYYY-MM-DD'),
                    transactionId: finalTransData.id
                }
                await SubscriptionModel.create(subscriptionData);

                res.render('index', { payment: 'success' });
            }
        })

    }
    cancel(req, res, next) {
        res.render('index', { payment: 'cancel' });
    }
};

export default new PaymentController;