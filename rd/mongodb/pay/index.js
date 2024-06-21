import {MongodbApi} from '../init/index.js';
import {
    deteleFileAsync,
    getFormatTime,
    getNanoid
} from '../../utils/index.js';

// 保存用户登录验证码
MongodbApi.saveCheckCode = async function(collectName, {phoneNum, code}) {
    try {
        await this.openCollect(collectName);
        const collect = this.collectMap.get(collectName);
        const res = await collect.find({phoneNum}).toArray();

        // 再次向当前手机号发送验证码
        if (res.length) {
            return await collect.updateOne({phoneNum}, {
                $set: {
                    code,

                    // 更新当前验证码的时间戳
                    timeStamp: Date.now()
                }
            });
        }

        // 向当前手机号第一次发送验证码
        return collect.insertOne({
            phoneNum,
            code,
            timeStamp: Date.now()
        });
    } catch (err) {
        return false;
    }
}

export {
    MongodbApi
}