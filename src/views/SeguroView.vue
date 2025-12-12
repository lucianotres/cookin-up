<template>
  <section>
    <h3>Acesso restrito</h3>
    <p>Bem-vindo {{ usuarioNome }} à área segura do aplicativo!</p>

    <div>
      TESTANDO

      <div v-for="categoria in categorias" :key="categoria.id">
        {{ categoria.nome }}
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { userManager } from '@/auth';
import { onMounted, ref } from 'vue';
import type ICategoria  from '@/interfaces/cadastro/ICategoria';
import { obterCategorias } from '@/http/cadastro';

const usuarioNome = ref('');
const categorias = ref([] as ICategoria[]);

onMounted(async () => {
  const user = await userManager.getUser();
  usuarioNome.value = user?.profile.name || '<anonimo>';

  await buscarCategorias();
});

async function buscarCategorias() {
  try {
    const paginaRetornada = await obterCategorias();
    categorias.value = paginaRetornada.content;
  }
  catch (error) {
    console.error('Erro ao obter categorias:', error);
  }
}
</script>

<style lang="css" scoped>
section {
  margin-top: 2rem;
  text-align: center;
  margin-bottom: 15rem;
}
</style>
