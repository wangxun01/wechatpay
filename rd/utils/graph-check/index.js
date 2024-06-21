import tencentcloud from 'tencentcloud-sdk-nodejs-captcha';
const CaptchaClient = tencentcloud.captcha.v20190722.Client;
import {
    secretKey,
    secretId,
    AppSecretKey,
    CaptchaAppId
} from '../../secret/index.js';

const clientConfig = {
    credential: {
        secretId,
        secretKey
    },
    region: '',
    profile: {
        httpProfile: {
            endpoint: 'captcha.tencentcloudapi.com'
        }
    }
}

const client = new CaptchaClient(clientConfig);

const graphCheck = ({params, successCb, failedCb}) => {
    params.AppSecretKey = AppSecretKey;
    params.CaptchaAppId = CaptchaAppId;
    params.CaptchaType = 9;
    client.DescribeCaptchaResult(params).then(successCb, failedCb);
}

export {
    graphCheck
}