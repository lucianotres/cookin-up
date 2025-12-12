import { userManager } from '@/auth'
import HomeView from '@/views/HomeView.vue'
import CallbackView from '@/views/login/CallbackView.vue'
import SeguroView from '@/views/SeguroView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login/callback', component: CallbackView },
  {
    path: "/seguro",
    name: "Seguro",
    component: SeguroView,
    meta: { requiresAuth: true },
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const user = await userManager.getUser();
    if (!user || user.expired) {
      await userManager.signinRedirect();
      return;
    }
  }
  next();
});

export default router
