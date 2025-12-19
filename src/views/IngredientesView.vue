<template>
  <main class="conteudo-principal">
    <section>
      <h4>Lista de Ingredientes</h4>
      <p>Cadastro de ingredientes e suas respectivas categorias</p>

      <q-table
        class="tabelaDados"
        :columns="colunas"
        :rows="storeIngredientes.conteudoPaginaAtual"
        v-model:pagination="paginacao"
        :loading="storeIngredientes.carregando"
        @request="onRequest"
        row-key="id"
        :rows-per-page-options="[]"
        bordered
        dense
        binary-state-sort
      >
        <template v-slot:no-data>
          Nenhum ingrediente cadastrado.
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
              @click="excluir(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </section>
  </main>

  <CadIngredienteDialog
    v-model="verCadastroId"
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
import CadIngredienteDialog from '@/components/cadastro/CadIngredienteDialog.vue';
import type { IDialogoQuestaoData } from '@/components/DialogoQuestao.vue';
import type IIngrediente from '@/interfaces/cadastro/IIngrediente';
import { useIngredientesStore } from '@/store/cadastro/ingredientes';
import { evaEditOutline, evaPlusOutline, evaTrashOutline } from '@quasar/extras/eva-icons';
import { computed, inject, onMounted, ref } from 'vue';

const storeIngredientes = useIngredientesStore();

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const, sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' as const, sortable: true },
  { name: 'categoria', label: 'Categoria', field: (r: IIngrediente) => r.categoria?.nome, align: 'left' as const, sortable: true },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' as const, sortable: false }
];

const paginacao = computed(() => {
  return {
    sortBy: storeIngredientes.ordenarPor.length > 0 ? storeIngredientes.ordenarPor[0].campo : '',
    descending: storeIngredientes.ordenarPor.length > 0 ? storeIngredientes.ordenarPor[0].decrescente : false,
    page: storeIngredientes.paginaAtual,
    rowsPerPage: storeIngredientes.tamanhoPagina,
    rowsNumber: storeIngredientes.tamanhoTotal
  };
});

onMounted(async () => {
  await storeIngredientes.fetchIngredientes(1, []);
});

const onRequest = async (props: any) => {
  await storeIngredientes.fetchIngredientes(props.pagination.page, [{
    campo: props.pagination.sortBy,
    decrescente: props.pagination.descending
   }]);
}

const verCadastroId = ref(null as number | null);
const mostrarQuestao = inject<(a: IDialogoQuestaoData) => void>('mostrarQuestao');

function abrirCadastro(id: number)
{
  verCadastroId.value = id;
}

const novo = () => {
  abrirCadastro(0);
}

const editar = (linha: IIngrediente) => {
  abrirCadastro(linha.id);
}

const excluir = (linha: IIngrediente) => {
  if (!mostrarQuestao)
    return;

  mostrarQuestao({
    titulo: 'Cadastro de Categoria',
    mensagem: `Confirma exclusão da categoria "${linha.nome}"?`,
    tipoSimNao: true,
    aoCancelear: () => {},
    aoConfirmar: () => fazExclusao(linha)
  });
}

async function fazExclusao(linha: IIngrediente): Promise<boolean> {
  return await storeIngredientes.removerIngrediente(linha.id);
}

const aoSalvar = (novaCategoria: IIngrediente) => {
  storeIngredientes.atualizaIngrediente(novaCategoria);
}
const aoIncluir = (novaCategoria: IIngrediente) => {
  storeIngredientes.incluiIngrediente(novaCategoria);
}
</script>
