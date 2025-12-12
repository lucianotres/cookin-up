<template>
  <div class="logado" v-if="usuario">
    <div class="usuario">
      <span>Olá, {{ usuario.profile.name }}!</span>
      <span>{{ usuario.profile.email }}</span>
    </div>
    <button @click="sair">Sair <FontAwesomeIcon :icon="faRightToBracket" /></button>
  </div>
  <RouterLink v-else to="/seguro">Login <FontAwesomeIcon :icon="faRightToBracket" /></RouterLink>
</template>

<style lang="css" scoped>
.logado {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.logado button {
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
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref } from 'vue';
import type { User } from 'oidc-client-ts';
import { useRouter } from 'vue-router';

const usuario = ref<User | null>(null);
const router = useRouter();

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
