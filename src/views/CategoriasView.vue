<template>
  <main class="conteudo-principal">
    <section>
      <h4>Lista de Categorias</h4>
      <p>Cadastro das categorias que agrupam ingredientes</p>

      <q-table
        class="tabelaDados"
        :columns="colunas"
        :rows="storeCategorias.conteudoPaginaAtual"
        v-model:pagination="paginacao"
        :loading="storeCategorias.carregando"
        @request="onRequest"
        row-key="id"
        :rows-per-page-options="[]"
        bordered
        dense
        binary-state-sort
      >
        <template v-slot:no-data>
          Nenhuma categoria cadastrada.
        </template>
        <template v-slot:top-right>
          <q-btn color="primary" label="Adicionar" :icon-right="evaPlusOutline" @click="novo" />
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              :icon="evaEditOutline"
              @click="editar(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              :icon="evaTrashOutline"
              @click="deleteRow(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </section>
  </main>

  <CadCategoriaDialog
    v-model="verCadastro"
    :id-categoria="verCadastroId"
    @salvou="aoSalvar"
    @incluso="aoIncluir" />
</template>

<style lang="css" scoped>
section {
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 1rem;
}

.tabelaDados{
  min-width: 800px;
}
</style>

<script setup lang="ts">
import CadCategoriaDialog from '@/components/cadastro/CadCategoriaDialog.vue';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { useCategoriasStore } from '@/store/cadastro/categorias';
import { evaEditOutline, evaPlusOutline, evaTrashOutline } from '@quasar/extras/eva-icons';
import { computed, onMounted, ref } from 'vue';

const storeCategorias = useCategoriasStore();

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'imagem', label: 'Imagem', field: 'imagem', align: 'left', sortable: false },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
];

const paginacao = computed(() => {
  return {
    sortBy: storeCategorias.ordenarPor.length > 0 ? storeCategorias.ordenarPor[0].campo : '',
    descending: storeCategorias.ordenarPor.length > 0 ? storeCategorias.ordenarPor[0].decrescente : false,
    page: storeCategorias.paginaAtual,
    rowsPerPage: storeCategorias.tamanhoPagina,
    rowsNumber: storeCategorias.tamanhoTotal
  };
});

onMounted(async () => {
  await storeCategorias.fetchCategorias(1, []);
});

const onRequest = async (props) => {
  await storeCategorias.fetchCategorias(props.pagination.page, [{
    campo: props.pagination.sortBy,
    decrescente: props.pagination.descending
   }]);
}

const verCadastro = ref(false);
const verCadastroId = ref(0);

function abrirCadastro(id: number)
{
  verCadastroId.value = id;
  verCadastro.value = true;
}

const novo = () => {
  abrirCadastro(0);
}

const editar = (linha: ICategoria) => {
  abrirCadastro(linha.id);
}

const deleteRow = (row) => {
  console.log('Excluir:', row)
}

const aoSalvar = (novaCategoria: ICategoria) => {
  storeCategorias.atualizaCategoria(novaCategoria);
}
const aoIncluir = (novaCategoria: ICategoria) => {
  storeCategorias.incluiCategoria(novaCategoria);
}
</script>
