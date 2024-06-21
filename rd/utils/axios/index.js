import axios from "axios";
import {weChatPay_server_url_prefix} from "../../type/index.js";

const wechatPayAPI = axios.create({
    baseURL: weChatPay_server_url_prefix,
    headers: {
        'Accept': 'application/json',
        "Content-Type": 'application/json'
    }
});

export {
    wechatPayAPI
}