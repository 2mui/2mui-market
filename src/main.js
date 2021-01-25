import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './assets/css/main.scss';
import 'babel-polyfill';
import Meta from 'vue-meta'
import apollo from './apollo'

Vue.config.productionTip = false;
Vue.use(Meta)
Vue.use(ElementUI, {
    size: 'small'
});

new Vue({
    router,
    apolloProvider: apollo,
    render: h => h(App)
}).$mount('#app');
