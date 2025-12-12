<template>
  <nav class="menu">
    <TopoLogin />
  </nav>
</template>

<script setup lang="ts">
import { defineComponent } from 'vue';
import TopoLogin from './TopoLogin.vue';

defineComponent({
  components: { TopoLogin },
})
</script>

<style lang="css">
  .menu {
    display: flex;
    flex-flow: column;
    align-items: end;
    justify-content: center;
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
</style>
