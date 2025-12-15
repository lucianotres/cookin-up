<template>
  <p>Processando login, aguarde...</p>
</template>

<script setup lang="ts">
import { userManager } from '@/auth';
import { onMounted } from 'vue';

onMounted(async () => {
  await userManager.signinRedirectCallback();
  const user = await userManager.getUser();
  if (user) {
    // Redireciona para rota segura
    window.location.href = "/seguro";
  }
});

</script>

<style lang="css" scoped>
p {
  color: var(--creme);
  font-size: 1.25rem;
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 30rem;
}
</style>
