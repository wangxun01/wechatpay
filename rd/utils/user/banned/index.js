import {MongodbApi} from '../../../mongodb/index.js';

// check 1: 检测当前用户是否被封禁, 防止违规用户再登录
const checkCurrentUserBanned = async (req, _, next) => {
    const uid = req.uid;
    if (uid) {
        const {isBanned, isRoot} = await MongodbApi.checkUserBanned('users', {uid});
        req.isRoot = isRoot;
        if (isBanned) {
            const err = new Error();
            err.message = 'user banned';
            err.name = 'UserBanned';
            next(err);
            return;
        }
    }
    next();
    return;
}

// check 2: 浏览的用户个人主页时检测被浏览者是否被封禁, 防止违规用户的主页数据向外扩散
const checkAuthorWhenViewProfile = async (req, _, next) => {
    if (req.isRoot) {
        next();
        return;
    }

    const authorUid = req.query.uid;
    if (authorUid) {
        const {isBanned} = await MongodbApi.checkUserBanned('users', {uid: authorUid});
        if (isBanned) {
            const err = new Error();
            err.message = 'author profile banned';
            err.name = 'AuthorProfileBanned';
            next(err);
            return;
        }
    }
    next();
    return;
}

// check 3: 被浏览帖子的作者是否被封禁, 防止违规用户的帖子向外扩散
const checkAuthorWhenViewPost = async (req, _, next) => {
    if (req.isRoot) {
        next();
        return;
    }

    if (req.url?.includes('/posts/common/view/postDetail')) {
        const {
            postsType,
            postId
        } = req.query;
        const {isBanned} = await MongodbApi.checkPostAuthorBanned(postsType, {postId});
        if (isBanned) {
            const err = new Error();
            err.message = 'author post banned';
            err.name = 'AuthorPostBanned';
            next(err);
            return;
        }
    }
    next();
    return;
}

export {
    checkCurrentUserBanned,
    checkAuthorWhenViewProfile,
    checkAuthorWhenViewPost
}