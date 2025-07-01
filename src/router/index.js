import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/Home.vue'
import Menu from '../views/Menu.vue'
import Cart from '../views/Cart.vue'
import Orders from '../views/Orders.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'

import AdminDashboard from '../views/admin/AdminDashboard.vue'
import ManageFoods from '../views/admin/ManageFoods.vue'
import ManageOrders from '../views/admin/ManageOrders.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/menu', name: 'Menu', component: Menu },
  { path: '/cart', name: 'Cart', component: Cart },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  {
    path: '/admin',
    component: AdminDashboard,
    children: [
      { path: 'foods', name: 'ManageFoods', component: ManageFoods },
      { path: 'orders', name: 'ManageOrders', component: ManageOrders },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router