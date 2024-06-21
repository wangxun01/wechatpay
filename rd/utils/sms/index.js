import tencentcloud from 'tencentcloud-sdk-nodejs';
import {
    secretKey,
    secretId,
    SmsSdkAppId,
    SignName,
    TemplateId
} from '../../secret/index.js';

const smsClient = tencentcloud.sms.v20210111.Client;

const client = new smsClient({
    credential: {
        secretId,
        secretKey,
    },
    region: 'ap-guangzhou',
    profile: {
        signMethod: 'HmacSHA256',
        httpProfile: {
            reqMethod: 'POST',
            reqTimeout: 30,
            endpoint: 'sms.tencentcloudapi.com'
        },
    },
})

const params = {
    SmsSdkAppId,
    SignName,
    ExtendCode: '',
    SenderId: '',
    SessionContext: '',
    TemplateId
}

// 验证码有效时间(单位：分钟)
const checkCodeKeepTime = 10;

const sms = ({PhoneNumberArr, code, keepTime = checkCodeKeepTime}, cb) => {
    params.PhoneNumberSet = PhoneNumberArr;
    params.TemplateParamSet = [code, keepTime];

    client.SendSms(params, function (err, response) {
        if (err) {
            cb(false, err);
            return;
        }
        cb(true, response);
    });
}

// 生成6位短信登录验证码
const getCheckCode = () => {
    let code = '';
    for(let i = 0; i < 6; i++) {
        code += parseInt(Math.random() * 10);
    }
    return code;
}

export {
    sms,
    getCheckCode,
    checkCodeKeepTime
}