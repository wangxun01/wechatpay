// 订单状态
const TRADE_STATE = {
    NOTPAY: 'NOTPAY',
    SUCCESS: 'SUCCESS',
    CLOSED: 'CLOSED'
}

// 订单状态最大查询次数
const MAX_CHECK_COUNT = 30;

// 订单状态查询间隔时间
const CHECK_INTERVAL = 2000;

export {
    TRADE_STATE,
    MAX_CHECK_COUNT,
    CHECK_INTERVAL
}