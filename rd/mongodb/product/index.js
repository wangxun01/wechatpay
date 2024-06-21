import {MongodbApi} from '../order/index.js';

MongodbApi.getProducts = async function(collectName) {
    try {
        await this.openCollect(collectName);
        const collect = this.collectMap.get(collectName);
        return await collect.find({}).toArray();
    } catch (err) {
        return false;
    }
}

MongodbApi.checkProduct = async function(collectName, {productId}) {
    try {
        await this.openCollect(collectName);
        const collect = this.collectMap.get(collectName);
        const [product] = await collect.find({id: productId}).toArray();
        return product;
    } catch (err) {
        return false;
    }
}


export {
    MongodbApi
}