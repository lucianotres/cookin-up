<script lang="ts">
import Banner from './components/Banner.vue';
import ConteudoPrincipal from './components/ConteudoPrincipal.vue';
import Rodape from './components/Rodape.vue';
import Topo from './components/Topo.vue';

export default {
  components: { Banner, ConteudoPrincipal, Rodape, Topo }
}
</script>

<template>
  <Topo />

  <Banner />

  <ConteudoPrincipal />

  <Rodape />
</template>

<style scoped>

</style>
