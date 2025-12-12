<template>
  <div class="logado" v-if="usuario">
    Olá, {{ usuario.profile.name }}!
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
