import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: 'home' */ '@/views/Home/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: 'login' */ '@/views/Login/index.vue')
  },
  ,
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/Category/index.vue')
  },
  {
    path: '/category-detail/:categoryId',
    name: 'category-detail',
    component: () => import('@/views/CategoryDetail/index.vue'),
    props: true
  },
  {
    path: '/address/:cardId',
    name: 'address',
    component: () => import('@/views/Address/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  {
    path: '/order-confirm/:cardId',
    name: 'order-confirm',
    component: () => import('@/views/OrderConfirm/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/order-detail/:orderId',
    name: 'order-detail',
    component: () => import('@/views/OrderDetail/index.vue'),
    props: true,
    meta: { requireAuth: true }
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import('@/views/Product/index.vue'),
    props: true
  },
  {
    path: '/comment/:productId',
    name: 'comment',
    component: () => import(/* webpackChunkName: 'comment' */ '@/views/Comment/index.vue'),
    props: true
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/Recommend/index.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: { requireAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import(/* webpackChunkName: 'NotFound' */ '@/views/NotFound/index.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(to => {
  if(!to.meta.requireAuth){
    return true
  }
  if (!store.state.user && !window.localStorage.getItem('USER_TOKEN')) {
    console.log('没有找到登录信息')
    console.log(store.state.user)
    console.log(window.localStorage.getItem('USER_TOKEN'))

    return {
      name: 'login',
      query: {
        redirect: to.fullPath
      }
    }
  }
})

export default router
