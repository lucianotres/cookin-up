<template>
<section>
    <span class="subtitulo-lg sua-lista-texto">
        Sua lista:
    </span>

    <ul v-if="receitasStore.filtroIngredientes.length" class="ingredientes-sua-lista">
        <li v-for="ingrediente in receitasStore.filtroIngredientes" :key="ingrediente">
            <Tag :texto="ingrediente" ativa />
        </li>
    </ul>

    <p v-else class="paragrafo lista-vazia">
        <img src="../assets/images/icones/lista-vazia.svg" alt="Ícone de uma lista vazia" />
        Sua lista está vazia, selecione algum ingrediente!
    </p>
</section>
</template>

<script setup lang="ts">
import { defineComponent, type PropType } from 'vue';
import Tag from './Tag.vue';
import { useReceitasStore } from '@/store/receitas';

const receitasStore = useReceitasStore();

defineComponent({
  name: 'SuaLista',
  components: { Tag }
});
</script>

<style scoped>
.sua-lista-texto {
  color: var(--coral, #F0633C);
  display: block;
  text-align: center;
  margin-bottom: 1.5rem;
}
.ingredientes-sua-lista {
  display: flex;
  justify-content: center;
  gap: 1rem 1.5rem;
  flex-wrap: wrap;
}
.lista-vazia {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;

  color: var(--coral, #F0633C);
  text-align: center;
}
</style>
