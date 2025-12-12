<template>
  <nav class="menu">
    <RouterLink class="inicio" to="/">
      <q-icon :name="evaHome" size="sm" /> Início
    </RouterLink>
    <TopoLogin />
  </nav>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import TopoLogin from './TopoLogin.vue';
import { evaHome } from '@quasar/extras/eva-icons';

defineComponent({
  components: { TopoLogin },
})
</script>

<style lang="css">
  .menu {
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: end;
    height: 3rem;
    background-color: rgba(0, 40, 0, .3);
    color: white;
  }
  .menu a {
    cursor: pointer;
    user-select: none;
    color: white;
    text-decoration: none;
  }
  .menu > *:last-child {
    margin-right: 1em;
  }
  .inicio {
    margin-left: 1rem;
    margin-right: auto;
  }
</style>
