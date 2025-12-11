<script lang="ts">
import { RouterView } from 'vue-router';
import Rodape from './components/Rodape.vue';
import Topo from './components/Topo.vue';

export default {
  components: { RouterView, Rodape, Topo }
}
</script>

<template>
  <Topo />

  <RouterView />

  <Rodape />
</template>
