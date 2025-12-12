import { userManager } from '@/auth'
import HomeView from '@/views/HomeView.vue'
import CallbackView from '@/views/login/CallbackView.vue'
import SeguroView from '@/views/SeguroView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CategoriasView from '@/views/CategoriasView.vue'
import NotFoundView from '@/views/NotFoundView.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/login/callback', component: CallbackView },
  {
    path: "/seguro",
    name: "Seguro",
    component: SeguroView,
    meta: { requiresAuth: true },
  },
  {
    path: '/categorias',
    name: 'Categorias',
    component: CategoriasView,
    meta: { requiresAuth: true },
  },
  {path: '/:pathMatch(.*)*', component: NotFoundView }
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
