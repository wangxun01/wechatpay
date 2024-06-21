import jwt from 'jsonwebtoken';
import {tokenSecretKey} from '../../../secret/index.js';
import {thOverStepType} from '../overstep/index.js';

const getToken = ({uid, sustain = '10d'}) => {
    return 'Bearer ' + jwt.sign({
            user: {
                uid
            }
        },
        tokenSecretKey,
        {
            expiresIn: sustain
        }
    );
}

const checkToken = (req, _, next) => {
    const url = req.url.split('?')[0];
    req.pureUrl = url;
    const [, , ySign, xSign, ]= url.split('/');

    // 带token则需验证
    // 不带token则需满足: 'common' + 'view'
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token && ySign === 'common' && xSign === 'view') {
        next();
        return;
    }

    jwt.verify(token, tokenSecretKey, function(err, data) {
        if (err) {
            const err = new Error();
            err.message = 'token err';
            err.name = 'UnauthorizedError';
            next(err);
            return;
        }

        // 解析出的uid, 用于操作鉴权
        req.uid = data?.user?.uid;
        let overStepType = '';

        // 设置越权检测类别
        if (ySign === 'common' && xSign === 'edit') {
            overStepType = thOverStepType.xOverStep;
        }

        if (ySign === 'root') {
            overStepType = thOverStepType.yOverStep;
        }
        req.overStepType = overStepType;
        next();
        return;
    });
}

export {
    getToken,
    checkToken
}