import {getApp} from '../app.js';
import {port} from '../utils/index.js';
import debug from 'debug';
import http from 'http';
import os from 'os';
import cluster from 'cluster';

const workerSize = os.cpus().length;
const createServer = () => {
    const theDebug = debug('www.wukong.fan:server');
    const server = http.createServer(getApp());

    const onError = error => {
        if (error.syscall !== 'listen') throw error;
        const bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;

        // handle specific listen errors with friendly messages
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    const onListening = () => {
        const addr = server.address();
        const bind = typeof addr === 'string'
            ? 'pipe ' + addr
            : 'port ' + addr.port;
        theDebug('Listening on ' + bind);
    }

    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}

if (workerSize > 1) {
    if (cluster.isPrimary) {
        for(let i = 0; i < workerSize; i++) {
            cluster.fork();
        }
        cluster.on('exit', worker => {
            console.log(`worker: ${worker.id} 退出了`);
        })
    } else {
        createServer();
        console.log(`express sever on ${port}, the worker: ${process.pid}`);
    }
} else {
    createServer();
    console.log(`express sever on ${port}, single worker: ${process.pid}`);
}




