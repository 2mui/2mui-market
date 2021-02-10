import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './assets/css/icon/iconfont.css';
import './assets/css/main.scss';
import 'babel-polyfill';
import Meta from 'vue-meta'
import axios from "axios";
import apollo from './apollo'

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

window.$store = store;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;
Vue.use(Meta)
Vue.use(ElementUI, {
    size: 'small'
});

router.beforeEach((to, from, next) => {
    if (window.location.href.indexOf('code') >= 0) {
        // 如果url中包含code, 则保存到store中
        let code = window.location.href.split("?")[1];
        code = code.substring(5, code.indexOf('&'));
        if (code != null && "" != code && code != undefined) {
            console.log("开始执行微信登录")
            //向后台登录接口发送数据

        }
    }
    axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
        params: {
            appid: 'wxf545493f1fe9745c',
            secret: '24bc107650b7861f4ccaccccf718f537',
            code: '081EOz0w3VewOV2szs0w36JHn64EOz0c',
            grant_type: 'authorization_code'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
        });
    console.log(axios)
    next()
})

new Vue({
    router,
    store,
    apolloProvider: apollo,
    render: h => h(App)
}).$mount('#app');
