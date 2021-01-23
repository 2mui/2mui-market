import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
import home from "./Home"; //system

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index'
        },
        {
            path: '/',
            component: () => import('../components/common/Home.vue'),
            meta: { title: '骨架' },
            children: [
                ...home,
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/Login/Login.vue'),
            meta: { title: '登录' }
        }
    ],
    scrollBehavior (to, from, savedPosition) {
        return { x: 0, y: 0 }
    }
});
