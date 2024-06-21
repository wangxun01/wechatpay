import {MongodbApi} from '../pay/index.js';
import {ORDER_STATE_TYPE} from '../../type/index.js';
import { getNanoid } from '../../utils/index.js';

MongodbApi.createOrder = async function(collectName, {product}) {
    try {
        await this.openCollect(collectName);
        const collect = this.collectMap.get(collectName);
        const newOrder = {
            productId: product.id,
            totalFee: product.price,
            orderStatus: ORDER_STATE_TYPE.NOTPAY,
            id: getNanoid()
        }
        const isSave = await collect.insertOne(newOrder);
        return {newOrder, isSave};
    } catch (err) {
        return false;
    }
}

MongodbApi.updateOrder = async function(collectName, {id, newDataObj}) {
    try {
        await this.openCollect(collectName);
        const collect = this.collectMap.get(collectName);
        return await collect.updateOne({id}, {
            $set: newDataObj
        });
    } catch (err) {
        return false;
    }
}

export {
    MongodbApi
}