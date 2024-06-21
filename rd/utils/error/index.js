import multer from 'multer';

const errorHandler = (err, req, res, next) => {
    let code = 500;
    let message = '网络开小差了，请稍后再试';

    switch (err.name) {

        // token异常
        case 'UnauthorizedError':
            code = 401;
            message = '身份验证失败';
            break;

        // 用户被封禁
        case 'UserBanned':
            code = 402;
            message = '用户违规，已被平台封禁';
            break;

        // 被浏览者已被封禁，无法查看个人信息
        case 'AuthorProfileBanned':
            code = 403;
            message = '该用户已被平台封禁, 无法查看个人信息';
            break;

        // 被浏览者已被封禁，无法查看当前帖子
        case 'AuthorPostBanned':
            code = 405;
            message = '该用户已被平台封禁, 无法查看帖子';
            break;

        case 'OverStep':
            code = 406;
            message = '非法操作, 拒绝执行';
            break;
        default:
            break;
    }

    // 文件上传失败
    if (err instanceof multer.MulterError) {
        code = 406;
        message = '文件上传失败';
    }

    res.statusCode = code;
    return res.send({
        status: code,
        message
    });
}

export {
    errorHandler
}