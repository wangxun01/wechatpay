import express from 'express';
import {getFile, __dirname } from '../../utils/index.js';
import path from 'path';

const router = express.Router();

router.get('/test', async (req, res, _) => {
    const pemPath = path.join(__dirname(import.meta.url), '../../secret/weixin_pay/apiclient_key.pem');
    const apiClientKey = getFile(pemPath);
    return res.status(200).json({
        message: 'hello weixin_pay',
        data: {
            apiClientKey
        }
    });
});

const pay = router;
export {
    pay
}