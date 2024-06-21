const hostPrefixUrl = {
    devHost: 'http://127.0.0.1:3000/api/',
    productHost: 'http://82.156.118.225:3000/api/'
}

const hostType = {
    dev: 'devHost',
    prod: 'productHost'
}

// 当前模式
const model = hostType.dev;

const prefix = model === hostType.dev
               ? hostPrefixUrl.devHost
               : hostPrefixUrl.productHost

const getReqUrl = () => {
    return {

        // 获取商品
        getProducts: prefix + 'product/getProducts',

        // 创建订单
        createOrder: prefix + 'order/createOrder',

        // 查询订单状态
        checkOrderState: prefix + 'order/checkOrderState'
    }
}

export {getReqUrl, prefix}