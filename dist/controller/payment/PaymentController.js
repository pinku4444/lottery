"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _paypalRestSdk = _interopRequireDefault(require("paypal-rest-sdk"));

var _User = _interopRequireDefault(require("../../models/User"));

var _Transaction = _interopRequireDefault(require("../../models/Transaction"));

var _Subscription = _interopRequireDefault(require("../../models/Subscription"));

var _errorCode = require("../../cms/errorCode");

var _config = _interopRequireDefault(require("../../config/config"));

var _getSubscription = _interopRequireDefault(require("../../utils/getSubscription"));

var _formatDate = _interopRequireDefault(require("../../utils/formatDate"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PaymentController {
  async buyPlan(req, res, next) {
    const {
      planName,
      userDetail
    } = req.body;
    const {
      id,
      email
    } = userDetail;
    const data = {
      mode: _config.default.paypalMode,
      //sandbox or live
      client_id: _config.default.paypalClientId,
      client_secret: _config.default.paypalSecretId
    };
    console.log('data: ', data);

    _paypalRestSdk.default.configure({
      mode: _config.default.paypalMode,
      //sandbox or live
      client_id: _config.default.paypalClientId,
      client_secret: _config.default.paypalSecretId
    });

    const selectSubscription = (0, _getSubscription.default)(planName);
    var create_payment_json = {
      "intent": "sale",
      "payer": {
        "payment_method": "paypal"
      },
      "redirect_urls": {
        "return_url": `${_config.default.paypalRedirectUrl}/${id}/${planName}`,
        "cancel_url": `${_config.default.paypalCancelUrl}/${id}/${planName}`
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

    _paypalRestSdk.default.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.log('error: ', error.message);
        const response = {
          statusCode: _errorCode.errorCode.internal_server_error,
          msg: "Something went wrong"
        };
        next(response);
      } else {
        const approval = payment.links.find(pLink => pLink.rel === 'approval_url');
        console.log(approval.href);
        const response = {
          status: 'ok',
          code: _errorCode.errorCode.ok,
          data: {
            link: approval.href
          },
          message: "Data created successfully"
        };
        return res.status(_errorCode.errorCode.ok).json(response);
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
    console.log("testttt", req.query);
    const {
      PayerID,
      paymentId
    } = req.query;
    const {
      id,
      planName
    } = req.params;
    console.log('userid: ', id);
    console.log('planName: ', planName);
    const selectSubscription = (0, _getSubscription.default)(planName);
    const execute_payment_json = {
      "payer_id": PayerID,
      "transactions": [{
        "amount": {
          "currency": selectSubscription.currency,
          "total": selectSubscription.price
        }
      }]
    };

    _paypalRestSdk.default.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
      if (error) {
        console.log('err: ', error.message);
        const response = {
          statusCode: _errorCode.errorCode.internal_server_error,
          msg: "Something went wrong"
        };
        next(response);
      } else {
        console.log("payment", payment); // update user value value 

        const userData = await _User.default.update({
          is_premium: 1
        }, {
          where: {
            id: parseInt(id)
          }
        }); // start creating data for transaction table

        const transactionData = {
          userId: id,
          transactionHash: paymentId || payment.id,
          amount: payment.transactions[0].amount.total,
          currency: payment.transactions[0].amount.currency,
          status: payment.state,
          timestamp: payment.create_time
        };
        const transData = await _Transaction.default.create(transactionData);
        const finalTransData = transData.dataValues;
        console.log('finalTransData: ', finalTransData); // start creating data for subscription table

        let days = '';

        if (planName == 'pro') {
          days = 30;
        } else {
          days = 7;
        }

        const subscriptionData = {
          userId: id,
          planName: planName,
          subscribedOn: (0, _moment.default)().format('YYYY-MM-DD'),
          validTill: (0, _moment.default)().add(days, 'd').format('YYYY-MM-DD'),
          transactionId: finalTransData.id
        };
        await _Subscription.default.create(subscriptionData);
        res.render('index', {
          payment: 'success'
        });
      }
    });
  }

  cancel(req, res, next) {
    res.render('index', {
      payment: 'cancel'
    });
  }

}

;

var _default = new PaymentController();

exports.default = _default;