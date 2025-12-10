<template>
  <nav class="menu">
    <a>Login <FontAwesomeIcon :icon="faRightToBracket" /></a>
  </nav>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';
</script>

<style lang="css" scoped>
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
  }
  .menu a:last-child {
    margin-right: 1em;
  }
</style>
