<template>
  <section>
    <h3>Acesso restrito</h3>
    <p>Bem-vindo {{ usuarioNome }} à área segura do aplicativo!</p>
  </section>
</template>

<script setup lang="ts">
import { userManager } from '@/auth';
import { onMounted, ref } from 'vue';

const usuarioNome = ref('');

onMounted(async () => {
  const user = await userManager.getUser();
  usuarioNome.value = user?.profile.name || '<anonimo>';
});
</script>

<style lang="css" scoped>
section {
  margin-top: 2rem;
  text-align: center;
  margin-bottom: 15rem;
}
</style>
