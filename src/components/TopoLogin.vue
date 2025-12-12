<template>
  <div class="logado" v-if="usuario">
    <MenuCadastro />
    <div class="usuario">
      <span>Olá, {{ usuario.profile.name }}!</span>
      <span>{{ usuario.profile.email }}</span>
    </div>
    <button class="sair" @click="sair">Sair <q-icon :name="evaLogOut" size="sm" /></button>
  </div>
  <RouterLink v-else to="/seguro">Login <q-icon :name="evaLogIn" size="sm" /></RouterLink>
</template>

<style lang="css" scoped>
.logado {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.sair {
  cursor: pointer;
  user-select: none;
  background: none;
  border: none;
  color: white;
}
div.usuario {
  display: flex;
  flex-direction: column;
  align-items: end;
}
div.usuario span {
  line-height: 1;
}
div.usuario span:last-child {
  font-size: 0.85rem;
  opacity: 0.8;
}
</style>

<script setup lang="ts">
import { userManager } from '@/auth';
import { defineComponent, onMounted, ref } from 'vue';
import type { User } from 'oidc-client-ts';
import { useRouter } from 'vue-router';
import { evaLogIn, evaLogOut } from '@quasar/extras/eva-icons';
import MenuCadastro from './MenuCadastro.vue';

const usuario = ref<User | null>(null);
const router = useRouter();

defineComponent({
  components: {
    MenuCadastro,
  },
});

onMounted(async () => {
  usuario.value = await userManager.getUser();
})

async function sair() {
  //await userManager.signoutRedirect();

  userManager.removeUser();
  usuario.value = null;
  router.push('/');
}
</script>
