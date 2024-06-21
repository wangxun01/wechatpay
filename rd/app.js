import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';

// 响应路由
import {pay, product, order} from './routes/index.js';

// 全局中间件
import {
    errorHandler,
    __dirname,
    errorLogStream,
    accessLogStream
} from './utils/index.js';

const getApp = () => {
    const app = express();

    // 内置中间件
    app.use(express.json());
    app.use(express.urlencoded({extended: false}));

    // 控制台日志
    morgan.token('localDate', () => new Date().toLocaleString());
    app.use(morgan('dev'));

    // 文件日志: 正常访问的log日志
    app.use(morgan(':localDate :remote-addr :method :url :status :res[content-length] - :response-time ms',{
        stream: accessLogStream
    }));

    // 文件日志: 访问出错的log日志
    app.use(morgan(':localDate :remote-addr :method :url :status :res[content-length] - :response-time ms', {
        skip: function (_, res) {
            return res.statusCode < 400;
        },
        stream: errorLogStream
    }));

    app.use('/images', express.static(path.join(__dirname(import.meta.url), './public/images')));

    // 第三方中间件
    app.use(cookieParser());
    app.use(cors());

    // 路由响应
    app.use('/api/pay', pay);
    app.use('/api/product', product);
    app.use('/api/order', order);

    // 全局错误处理中间件
    app.use(errorHandler);

    return app;
}

export {getApp}
