// 服务端ip前缀
const weChatPay_server_url_prefix = 'https://api.mch.weixin.qq.com';

// 微信服务端调用接口
const weChatPayUrl = {

    // 下单接口
    transactions_native: '/v3/pay/transactions/native',

    // 获取微信服务端证书
    get_wechat_certificates: '/v3/certificates',

    // 商户根据订单号操作订单状态
    order_state_base_url: '/v3/pay/transactions/out-trade-no',
}

export {
    weChatPayUrl,
    weChatPay_server_url_prefix
}