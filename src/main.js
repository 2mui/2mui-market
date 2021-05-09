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
import VueCookies from 'vue-cookies'

import md5 from 'js-md5';
Vue.prototype.$md5 = md5;

window.$store = store;
Vue.prototype.$axios = axios;
Vue.prototype.$cookies = VueCookies;
Vue.config.productionTip = false;

Vue.use(Meta)
Vue.use(ElementUI, {
    size: 'small'
});
router.afterEach((to, from, next) => {
    setTimeout(() => {
        //百度统计
        var _hmt = _hmt || [];
        (function () {
            // console.log(document.getElementById('baidu_tj'))
            //每次执行前，先移除上次插入的代码
            document.getElementById('baidu_tj') && document.getElementById('baidu_tj').remove();
            var hm = document.createElement("script");
            hm.src = "https://hm.baidu.com/hm.js?a12768aeadf95daef1bf330ea8d808f9";
            hm.id = "baidu_tj"
            var s = document.getElementsByTagName("script")[0];
            s.parentNode.insertBefore(hm, s);
        })();
    }, 0);
});

new Vue({
    router,
    store,
    apolloProvider: apollo,
    render: h => h(App)
}).$mount('#app');
