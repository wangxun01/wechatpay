import {wechatPayAPI} from "../axios/index.js";
import {Certificate} from "@fidm/x509";
import {weChatPayUrl} from '../../type/index.js';
import crypto from 'crypto';

class WechatPay {
    static getSerialNo(publicKey) {
        return Certificate.fromPEM(publicKey).serialNumber;
    }

    // 缓存微信平台证书
    wechat_certificates = [];

    constructor({appid, mchid, secretKey, publicKey, privateKey}) {
        this.appid = appid;
        this.mchid = mchid;
        this.secretKey = secretKey;
        this.publicKey = publicKey;
        this.privateKey = privateKey;
        this.serial_no = WechatPay.getSerialNo(publicKey);
    }

    async request({method, url, data}) {

        // 请求方式必须为大写形式
        method = method.toUpperCase();

        // 构造请求的签名信息
        const timestamp = Math.floor(Date.now() / 1000).toString();
        const nonce_str = Math.random().toString(36).substring(2, 17);
        const signature = this.sign({method, url, timestamp, nonce_str, data});

        // 完善请求头
        const headers = {
            Authorization: `WECHATPAY2-SHA256-RSA2048 mchid="${this.mchid}",nonce_str="${nonce_str}",timestamp="${timestamp}",signature="${signature}",serial_no="${this.serial_no}"`
        }

        const res = await wechatPayAPI.request({
            headers,
            method,
            url,
            data
        });
        return res;
    }

    async transactions_native(params) {
        const method = 'post';

        // 完善请求体数据
        const data = {
            ...params,
            appid: this.appid,
            mchid: this.mchid
        }
        const url = weChatPayUrl.transactions_native;
        const res = await this.request({method, url, data});
        return res.data;
    }

    // 商户签名
    sign({method, url, timestamp, nonce_str, data}) {

        // 按照规则构造请求串
        let targetStr = `${method}\n${url}\n${timestamp}\n${nonce_str}\n`;
        targetStr += (method !== 'GET' && data) ? `${JSON.stringify(data)}\n` : '\n';

        // 计算签名值
        const rsaSha = crypto.createSign('RSA-SHA256');
        rsaSha.update(targetStr);
        return rsaSha.sign(this.privateKey, 'base64');
    }

    // 商户验签
    async verifySign({body, signature, timestamp, nonce, serial}) {

        // 构造验签串
        const verifyStr = `${timestamp}\n${nonce}\n${JSON.stringify(body)}\n`;

        // 获取weChatPayPublicKey
        const weChatPayPublicKey = await this.fetchWeChatPayPublicKey({serial});

        console.log(`
            ------ 获取到的微信平台公钥 ------
            ${weChatPayPublicKey}
            `
        );

        // 验证签名
        const verifyObj = crypto.createVerify('RSA-SHA256');
        verifyObj.update(verifyStr);
        return verifyObj.verify(weChatPayPublicKey, signature, 'base64');
    }

    async fetchWeChatPayPublicKey({serial}) {

        // 返回已经存在的证书
        const weChatPayPublicKey = this.wechat_certificates[serial];
        if (weChatPayPublicKey) return weChatPayPublicKey;

        // 获取新证书
        const url = weChatPayUrl.get_wechat_certificates;
        const res = await this.request({
            method: 'get',
            url
        });
        const certificates = res.data.data;
        certificates.forEach(({serial_no, encrypt_certificate}) => {

            // 解密证书
            const certificate = this.decrypt({encrypted:encrypt_certificate});
            this.wechat_certificates[serial_no] = Certificate.fromPEM(certificate).publicKey.toPEM();
        });
        return this.wechat_certificates[serial];
    }

    decrypt({encrypted: {algorithm, nonce, associated_data, ciphertext}}) {

        // 密文base64 -> buffer
        const encryptedBuffer = Buffer.from(ciphertext, 'base64');

        // 认证标签
        const authTag = encryptedBuffer.subarray(encryptedBuffer.length - 16);

        // 加密后的数据
        const encryptedData = encryptedBuffer.subarray(0, encryptedBuffer.length - 16);

        // 解密器
        const decipherer = crypto.createDecipheriv('aes-256-gcm', this.secretKey, nonce);
        decipherer.setAuthTag(authTag);

        // 设置附加认证数据
        decipherer.setAAD(Buffer.from(associated_data));

        // 解密结果
        const decrypted = Buffer.concat([decipherer.update(encryptedData), decipherer.final()]);
        const decryptedStr = decrypted.toString('utf-8');
        return decryptedStr;
    }
}

export {
    WechatPay
}