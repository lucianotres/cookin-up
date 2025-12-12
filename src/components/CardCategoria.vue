<template>
    <article class="categoria">
        <header class="categoria__cabecalho">
            <img :src="`imagens/icones/categorias_ingredientes/${categoria.imagem}`" :alt="categoria.nome" class="categoria__imagem" />
            <h2 class="categoria__nome">{{ categoria.nome }}</h2>
        </header>

        <ul class="categoria__ingredientes">
            <li v-for="ingrediente in categoria.ingredientes" :key="ingrediente">
                <IngredienteSelecionavel
                  :ingrediente="ingrediente"
                  :iniciaSelecionado="receitasStore.ingredienteEstaNoFiltro(ingrediente)"
                  @adicionarIngrediente="adicionarIngrediente"
                  @removerIngrediente="removerIngrediente"
                />
            </li>
        </ul>
    </article>
</template>

<script setup lang="ts">
import { defineComponent, type PropType } from 'vue';
import type ICategoria from '@/interfaces/ICategorias';
import Tag from './Tag.vue';
import IngredienteSelecionavel from './IngredienteSelecionavel.vue';
import { useReceitasStore } from '@/store/receitas';

const receitasStore = useReceitasStore();

defineComponent({
  name: 'CardCategoria',
  components: { Tag, IngredienteSelecionavel }
});

defineProps({
    categoria: { type: Object as PropType<ICategoria>, required: true }
});

function adicionarIngrediente(ingrediente: string) {
    receitasStore.adicionarIngrediente(ingrediente);
};

function removerIngrediente(ingrediente: string) {
    receitasStore.removerIngrediente(ingrediente);
};
</script>

<style scoped>
.categoria {
  width: 19.5rem;
  padding: 1rem;
  border-radius: 1rem;
  background: var(--branco, #FFF);
  box-shadow: 4px 4px 10px 0px rgba(68, 68, 68, 0.05);
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}
.categoria__cabecalho {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.categoria__imagem {
  width: 3.5rem;
}
.categoria__nome {
  text-align: center;
  color: var(--verde-medio, #3D6D4A);
  font-weight: 700;
}

.categoria__ingredientes {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
