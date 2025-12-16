<script setup lang="ts">
import { RouterView } from 'vue-router';
import Rodape from './components/Rodape.vue';
import Topo from './components/Topo.vue';
import DialogoQuestao from './components/DialogoQuestao.vue';
import { defineComponent, onMounted, provide, ref } from 'vue';

defineComponent({ RouterView, Rodape, Topo, DialogoQuestao });

const dialogoQuestao = ref<InstanceType<typeof DialogoQuestao>>();

onMounted(() => {
  if (dialogoQuestao.value)
    provide('mostrarQuestao', dialogoQuestao.value.mostrarQuestao);
});
</script>

<template>
  <DialogoQuestao ref="dialogoQuestao" />
  <Topo />

  <RouterView />

  <Rodape />
</template>
