import {router} from './router';
import App from './app.san';

// 挂载app
new App().attach(document.getElementById('app'));

// 启动路由
router.start();