<template>
    <section>
        <h1 class="cabecalho titulo-ingredientes">Ingredientes</h1>
        <p class="paragrafo-lg instrucoes">
            Selecione abaixo os ingredientes que você quer usar nesta receita:
        </p>

        <ul class="categorias">
            <li v-for="categoria in categorias" :key="categoria.nome">
                <CardCategoria
                 :categoria="categoria"
                 @adicionarIngrediente="$emit('adicionarIngrediente', $event)"
                 @removerIngrediente="$emit('removerIngrediente', $event)"
                />
            </li>
        </ul>

        <p class="paragrafo dica">
            *Atenção: consideramos que você tem em casa sal, pimenta e água.
        </p>

        <BotaoPrincipal texto="Buscar receitas!" @click="$emit('buscarReceitas')" />
    </section>
</template>

<script lang="ts">
import { obterCategorias } from '@/http/index';
import type ICategorias from '@/interfaces/ICategorias';
import CardCategoria from './CardCategoria.vue';
import BotaoPrincipal from './BotaoPrincipal.vue';

export default {
    name: 'SelecionarIngredientes',

    components: { CardCategoria, BotaoPrincipal },

    data() {
        return {
            categorias: [] as ICategorias[]
        }
    },

    emits: ['adicionarIngrediente', 'removerIngrediente', 'buscarReceitas'],

    async created() {
      this.categorias = await obterCategorias();
      console.log(this.categorias);
    }
}
</script>

<style scoped>
.selecionar-ingredientes {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.titulo-ingredientes {
  color: var(--verde-medio, #3D6D4A);
  display: block;
  margin-bottom: 1.5rem;
}
.instrucoes {
  margin-bottom: 2rem;
}
.categorias {
  margin-bottom: 1rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.dica {
  align-self: flex-start;
  margin-bottom: 3.5rem;
}
@media only screen and (max-width: 767px) {
  .dica {
    margin-bottom: 2.5rem;
  }
}
</style>
