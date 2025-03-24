import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import SenderCode from '../pages/SenderCode.vue'
import ReceiverCode from '../pages/ReceiverCode.vue'
import CodeDemo from '../pages/CodeDemo.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/sender',
    name: 'sender',
    component: SenderCode
  },
  {
    path: '/receiver',
    name: 'receiver',
    component: ReceiverCode
  },
  {
    path: '/code-demo',
    name: 'code-demo',
    component: CodeDemo
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 