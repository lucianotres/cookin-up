<template>
    <main class="conteudo-principal">
        <SuaLista />

        <SelecionarIngredientes
          v-if="conteudo === 'SelecionarIngredientes'"
          @buscarReceitas="navegar('MostrarReceitas')"
        />

        <MostrarReceitas
          v-else-if="conteudo === 'MostrarReceitas'"
          @editarReceitas="navegar('SelecionarIngredientes')"
        />
    </main>

</template>

<script lang="ts">
import MostrarReceitas from './MostrarReceitas.vue';
import SelecionarIngredientes from './SelecionarIngredientes.vue';
import SuaLista from './SuaLista.vue';

type Pagina = 'SelecionarIngredientes' | 'MostrarReceitas';

export default {
    components: { SelecionarIngredientes, SuaLista, MostrarReceitas },

    data() {
        return {
        conteudo: 'SelecionarIngredientes' as Pagina
    }},

    methods: {
        navegar(pagina: Pagina)
        {
          this.conteudo = pagina;
        }
    }
}
</script>
