import{ createWebHistory,createRouter } from 'vue-router'
import login from '../views/login.vue'
import analytics from '../views/analytics.vue'
import manageuser from '../views/manageuser.vue'
import waterlogs from '../views/waterlogs.vue'
import schedules from '../views/schedules.vue'
import user_anal from '../views/user_anal.vue'
import user_logs from '../views/user_logs.vue'
import user_sched from '../views/user_sched.vue'
import register from '../views/register.vue'

const routes = [
  { path: '/', 
    name: "login" ,
    component: login },

  { path: '/register', 
    name: "register" ,
    component: register },

  { path:'/analytics',
    name: "analytis",
    component: analytics },

  { path:'/manageuser',
    name: "manageuser",
    component: manageuser },

  { path:'/waterlogs',
    name: "waterlogs",
    component: waterlogs },

  { path:'/schedules',
    name: "schedules",
    component: schedules },

  { path:'/user_anal',
    name: "user_anal",
    component: user_anal },

  { path:'/user_sched',
    name: "user_sched",
    component: user_sched },

  { path:'/user_logs',
    name: "user_logs",
    component: user_logs },


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
export default router;
