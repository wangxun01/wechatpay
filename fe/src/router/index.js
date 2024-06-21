import {router, Link} from 'san-router';

const Pay = () => import('../pages/pay/index.san');

// 路由规则
const routes = [
    {
        rule: '/pay/:name',
        Component: Pay
    }
];

// 注册路由规则
routes.forEach(item => {
    router.add({
        ...item,
        target: '#main'
    });
});

const routerWatch = () => {
    // router.setMode('html5');
    router.setMode('history');
    router.listen(e => {
    });
}
routerWatch();

export {router, Link};