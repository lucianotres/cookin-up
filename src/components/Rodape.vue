<template>
  <footer class="rodape paragrafo">
    Desenvolvido por LTres | 2025 - Projeto fictício sem fins comerciais.&nbsp;&nbsp;
    Versão:&nbsp;<strong>{{ version }}</strong>
  </footer>
</template>

<script setup lang="ts">
const version = import.meta.env.VITE_APP_VERSION || '(dev)';
</script>

<style scoped>
.rodape {
  color: var(--creme);
  background: var(--verde-escuro, #263A29);
  padding: 1.5rem 7.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media only screen and (max-width: 1300px) {
  .rodape {
    padding: 1.5rem 3.75rem;
  }
}

@media only screen and (max-width: 767px) {
  .rodape {
    padding: 1.5rem;
  }
}
</style>
