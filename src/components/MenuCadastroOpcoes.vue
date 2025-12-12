<template>
  <q-list :class="{ 'lista': true, 'horizontal': props.verHorizontal }">
    <q-item to="/categorias" clickable v-close-popup>
      <q-item-section>
        <RouterLink class="rLink" to="/categorias">Categorias</RouterLink>
      </q-item-section>
    </q-item>
    <q-item to="/ingredientes" clickable v-close-popup>
      <q-item-section>
        <RouterLink class="rLink" to="/ingredientes">Ingredientes</RouterLink>
      </q-item-section>
    </q-item>
    <q-item to="/receitas" clickable v-close-popup>
      <q-item-section>
        <RouterLink class="rLink" to="/receitas">Receitas</RouterLink>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<style lang="css" scoped>
.lista {
  display: flex;
  flex-direction: column;
  min-width: 200px;
}
.horizontal {
  flex-direction: row;
}
.rLink {
  text-decoration: none;
  color: white;
}
</style>

<script setup lang="ts">
const props = defineProps({
  verHorizontal: {
    type: Boolean,
    default: false,
  },
})
</script>
