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
        path: '/personal',
        component: () => import('../../components/page/Home/personal.vue'),
        meta: { title: '个人主页' }
    },
    {
        path: '/collection_details',
        component: () => import('../../components/page/Home/collectionDetails.vue'),
        meta: { title: '个人主页' }
    },
    {
        path: '/search',
        component: () => import('../../components/page/Home/search.vue'),
        meta: { title: '搜索结果页' }
    },
    {
        path: '/copyright',
        component: () => import('../../components/page/Home/copyright.vue'),
        meta: { title: '版权声明' }
    },
    {
        path: '/privacy',
        component: () => import('../../components/page/Home/privacy.vue'),
        meta: { title: '隐私政策' }
    }
]
export default router;