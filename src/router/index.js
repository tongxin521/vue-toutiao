import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Home from '@/views/Home.vue'
import Ask from '@/components/home/Ask.vue'
import Page from '@/components/home/Page.vue'
import Video from '@/components/home/Video.vue'
import My from '@/components/home/My.vue'
import Search from '@/views/Search.vue'
import Article from '@/views/Article.vue'
import UpdataUser from '@/views/UpdataUser.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    redirect: '/page',
    children: [
      { path: '/ask', component: Ask },
      { path: '/page', component: Page },
      { path: '/video', component: Video },
      { path: '/my', component: My }
    ]
  },
  { path: '/search', component: Search },
  { path: '/article/:articleId', component: Article, props: true },
  { path: '/updata/user', component: UpdataUser }
]

const router = new VueRouter({
  routes
})

export default router
