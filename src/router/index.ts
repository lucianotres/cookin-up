import { userManager } from '@/auth'
import HomeView from '@/views/HomeView.vue'
import CallbackView from '@/views/login/CallbackView.vue'
import SeguroView from '@/views/SeguroView.vue'
import { createRouter, createWebHistory } from 'vue-router'
import CategoriasView from '@/views/CategoriasView.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useEnvConfig } from '@/utils/env-config'
import IngredientesView from '@/views/IngredientesView.vue'
import ReceitasView from '@/views/ReceitasView.vue'

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
  {
    path: '/ingredientes',
    name: 'Ingredientes',
    component: IngredientesView,
    meta: { requiresAuth: true },
  },
  {
    path: '/receitas',
    name: 'Receitas',
    component: ReceitasView,
    meta: { requiresAuth: true },
  },
  {path: '/:pathMatch(.*)*', component: NotFoundView }
]

const env = useEnvConfig();

const router = createRouter({
  history: createWebHistory(env.APP_BASE_URL || '/'),
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
