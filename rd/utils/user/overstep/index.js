import {MongodbApi} from '../../../mongodb/index.js';

const thOverStepType = {
    xOverStep: 'xOverStep',
    yOverStep: 'yOverStep'
}

const overStepCheck = (req, res, next) => {
    const overStepType = req.overStepType;

    // 水平越权检测
    if (overStepType === thOverStepType.xOverStep) {
        xOverStepCheck(req, res, next);
        return;
    }

    // 垂直越权检测
    if (overStepType === thOverStepType.yOverStep) {
        yOverStepCheck(req, res, next);
        return;
    }

    // 无需越权检测
    next();
    return;
}

// 水平越权检测
const xOverStepCheck = (req, res, next) => {

    // 后端取消下放uid后，对修改个人信息的操作，自带水平越权检测）

    // 对帖子的操作，进行水平越权检测
    dealPostsOverStepCheck(req, res, next);
}


const dealPostsOverStepCheck = async (req, res, next) => {
    const canPassUrlArr = [
        '/posts/common/edit/closeComment',
        '/posts/common/edit/openPost',
        '/posts/common/edit/closePost'
    ];

    if (canPassUrlArr.includes(req.pureUrl)) {
        const isPass = await checkPostsAuthor({
            postId: req.query.postId,
            postsType: req.query.postsType || 'total_posts',
            uid: req.uid
        });

        if (!isPass) {

            // 对帖子的越权操作
            const err = new Error();
            err.message = 'xOverStep';
            err.name = 'OverStep';
            next(err);
            return;
        }
    }
    next();
    return;
}

const checkPostsAuthor = async ({postsType, postId, uid}) => {
    return await MongodbApi.checkPostAuthor(postsType, {postId, uid});
}

// 垂直越权检测(root涉及的任何浏览 + 操作)
const yOverStepCheck = async (req, res, next) => {
    const isRoot = await MongodbApi.checkRoot('users', {uid: req.uid});
    if (!isRoot) {

        // 对root的越权操作
        const err = new Error();
        err.message = 'yOverStep';
        err.name = 'OverStep';
        next(err);
        return;
    }
    next();
    return;
}

export {
    overStepCheck,
    thOverStepType
}