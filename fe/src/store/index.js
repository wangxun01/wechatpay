import {Store, connect} from 'san-store';
import {builder} from 'san-update';

const museumStore = new Store({
    initData: {
        projectName: 'weixin_pay'
    },
    actions: {
        setLogin(isLogin) {
            return builder().set('isLogin', isLogin);
        }
    }
});

const storeConnect = (store, data) => {
    return (target) => {
        return connect(store, data)(target);
    }
}

export {
    museumStore,
    storeConnect
}