<template>
  <main class="conteudo-principal">
    <section>
      <h4>Área Administrativa</h4>
      <p>Bem-vindo {{ usuarioNome }} à área segura do aplicativo!</p>

      <q-card class="card" dark>
        <q-card-section>
          Está é a área de cadastros do aplicativo Cookin' Up. Aqui você pode gerenciar as categorias, ingredientes e receitas que irão aparecer no app.
        </q-card-section>
      </q-card>

      <MenuCadastroOpcoes :ver-horizontal="true" style="justify-content: center;" />
    </section>
  </main>
</template>

<script setup lang="ts">
import { userManager } from '@/auth';
import { defineComponent, onMounted, ref } from 'vue';
import MenuCadastroOpcoes from '@/components/MenuCadastroOpcoes.vue';

const usuarioNome = ref('');

defineComponent({
  components: {
    MenuCadastroOpcoes,
  },
});

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
.card {
  max-width: 600px;
  margin: 2rem auto;
  text-align: left;
  color: whitesmoke;
  font-size: 1.2em;
}
</style>
