<template>
  <q-btn color="primary" label="Cadastros">
    <q-menu :dark="true">
      <MenuCadastroOpcoes />
    </q-menu>
  </q-btn>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import MenuCadastroOpcoes from './MenuCadastroOpcoes.vue';

defineComponent({
  name: 'MenuCadastro',
  components: {
    MenuCadastroOpcoes,
  },
});
</script>
