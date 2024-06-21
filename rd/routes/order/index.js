import express from 'express';
import {MongodbApi} from '../../mongodb/index.js';
import {weixinPayConfig} from '../../secret/index.js';
import {getFile, __dirname, WechatPay} from '../../utils/index.js';
import path from 'path';
import {weChatPayUrl, ORDER_STATE_TYPE} from '../../type/index.js';

const router = express.Router();
const publicKeyPath = path.join(__dirname(import.meta.url), '../../secret/weixin_pay/apiclient_cert.pem');
const privateKeyPath = path.join(__dirname(import.meta.url), '../../secret/weixin_pay/apiclient_key.pem');
const wechatPay = new WechatPay({
    appid: weixinPayConfig.appid,
    mchid: weixinPayConfig.mchId,
    secretKey: weixinPayConfig.apiV3Key,
    publicKey: getFile(publicKeyPath),
    privateKey: getFile(privateKeyPath)
});

async function invokeNativePay({product, newOrder, req}) {
    const res = await wechatPay.transactions_native({
        description: `黑神话悟空-粉丝交流论坛，购买：${product.name}`,
        out_trade_no: newOrder.id,
        notify_url: weixinPayConfig.notifyDomain,
        amount: {
            total: product.price,
            currency: 'CNY'
        },
        scene_info: {
            payer_client_ip: req.ip
        }
    });
    const {code_url} = res;

    // 更新订单信息
    await MongodbApi.updateOrder('orders', {
        id: newOrder.id,
        newDataObj: {
            code_url
        }
    });
    return code_url;
}

router.get('/createOrder', async (req, res, _) => {
    const {productId} = req.query;
    const product = await MongodbApi.checkProduct('products', {productId});
    if (product) {
        const {newOrder, isSave} = await MongodbApi.createOrder('orders', {product});
        if (isSave) {

            // 调起微信下单接口
            const code_url = await invokeNativePay({
                product, newOrder, req
            });
            return res.status(200).json({
                message: '创建订单成功',
                code_url,
                orderId: newOrder.id
            });
        }

        res.status(500).json({
            message: '创建新订单失败',
            info: '保存新订单失败'
        });
    }
    res.status(500).json({
        message: '创建新订单失败',
        info: '未查询到当前商品信息'
    });
});

// 微信支付回调通知接口
router.post('/callback', async (req, res, _) => {

    // 微信端响应数据
    const {headers, body} = req;
    const timestamp = headers['Wechatpay-Timestamp'];
    const nonce = headers['Wechatpay-Nonce'];
    const signature = headers['Wechatpay-Signature'];
    const serial = headers['Wechatpay-Serial'];
    const isVerified = await wechatPay.verifySign({body, signature, timestamp, nonce, serial});
    return res.status(200).json({
        message: 'notify_url 支付成功回调',
        isVerified
    });
});

// 查询订单状态
router.get('/checkOrderState', async (req, res, _) => {
    let {orderId, isLastCheck} = req.query;

    // string to boolean
    isLastCheck === 'false' ? (isLastCheck = false) : (isLastCheck = true);
    const url = `${weChatPayUrl.order_state_base_url}/${orderId}?mchid=${weixinPayConfig.mchId}`;
    const checkRes = await wechatPay.request({method: 'get', url});
    const {trade_state} = checkRes.data;
    switch(trade_state) {
        case ORDER_STATE_TYPE.SUCCESS:
            await MongodbApi.updateOrder('orders', {
                id: orderId,
                newDataObj: {
                    orderStatus: ORDER_STATE_TYPE.SUCCESS
                }
            });
            break;
        case ORDER_STATE_TYPE.NOTPAY:
            if (isLastCheck) {
                const url = `${weChatPayUrl.order_state_base_url}/${orderId}/close`;
                const closeRes = await wechatPay.request({
                    method: 'post',
                    url,
                    data: {mchid: weixinPayConfig.mchId}
                });
                if (closeRes.status === 204) {
                    await MongodbApi.updateOrder('orders', {
                        id: orderId,
                        newDataObj: {
                            orderStatus: ORDER_STATE_TYPE.CLOSED
                        }
                    });
                }
            }
            break;
        default:
            break;
    }
    return res.status(200).json({
        message: '查询订单状态接口，成功调用',
        trade_state
    });
});

const order = router;
export {
    order
}