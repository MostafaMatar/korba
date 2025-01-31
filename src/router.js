import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './components/LandingPage.vue'
import CreateList from './components/CreateList.vue'
import ViewList from './components/ViewList.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: LandingPage
  },
  {
    path: '/create-list',
    name: 'create-list',
    component: CreateList
  },
  {
    path: '/view-list/:id',
    name: 'view-list',
    component: ViewList,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
