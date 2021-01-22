const router = [
    {
        path: '/index',
        component: () => import('../../components/page/Home/index.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/formwork',
        component: () => import('../../components/page/Home/formwork.vue'),
        meta: { title: '模板页' }
    },
    {
        path: '/homepage',
        component: () => import('../../components/page/Home/homepage.vue'),
        meta: { title: '个人主页' }
    },
    {
        path: '/personal-center',
        component: () => import('../../components/page/Home/personal.vue'),
        meta: { title: '个人主页' }
    }
]
export default router;