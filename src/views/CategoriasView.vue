<template>
  <main class="conteudo-principal">
    <section>
      <h4>Lista de Categorias</h4>
      <p>Cadastro das categorias que agrupam ingredientes</p>

      <q-table
        class="tabelaDados"
        :columns="colunas"
        :rows="dadosAtuais"
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
          <q-btn color="primary" label="Adicionar" :icon-right="evaPlusOutline" @click="addRow" />
        </template>
        <template v-slot:body-cell-acoes="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              :icon="evaEditOutline"
              @click="editRow(props.row)"
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
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { useCategoriasStore } from '@/store/cadastro/categorias';
import { evaEditOutline, evaPlusOutline, evaTrashOutline } from '@quasar/extras/eva-icons';
import { onMounted, ref } from 'vue';

const storeCategorias = useCategoriasStore();

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left', sortable: true },
  { name: 'imagem', label: 'Imagem', field: 'imagem', align: 'left', sortable: false },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' }
];

const paginacao = ref({
  sortBy: 'nome',
  descending: false,
  page: 1,
  rowsPerPage: 50,
  rowsNumber: 12
})

const dadosAtuais = ref([] as ICategoria[]);

onMounted(async () => {
  await BuscaDados(1);
});

const onRequest = async (props) => {
  await BuscaDados(props.pagination.page);
}

async function BuscaDados(pagina: number)
{
  const paginaIndex = await storeCategorias.fetchCategorias(pagina - 1);

  if (paginaIndex >= 0) {
    const paginaDados = storeCategorias.paginas[paginaIndex];

    dadosAtuais.value = paginaDados.content;
    paginacao.value.rowsNumber = paginaDados.totalElements;
    paginacao.value.page = pagina;
  } else {
    dadosAtuais.value = [];
    paginacao.value.rowsNumber = 0;
    paginacao.value.page = 1;
  }
}

const addRow = () => {
  console.log('Adicionar:')
}

const editRow = (row) => {
  console.log('Editar:', row)
}

const deleteRow = (row) => {
  console.log('Excluir:', row)
}
</script>
