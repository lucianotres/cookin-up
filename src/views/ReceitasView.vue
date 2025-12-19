<template>
  <main class="conteudo-principal">
    <section>
      <h4>Lista de Receitas</h4>
      <p>Cadastro de geral de receitas</p>

      <q-table
        class="tabelaDados"
        :columns="colunas"
        :rows="storeReceitas.conteudoPaginaAtual"
        v-model:pagination="paginacao"
        :loading="storeReceitas.carregando"
        @request="onRequest"
        row-key="id"
        :rows-per-page-options="[]"
        bordered
        dense
        binary-state-sort
      >
        <template v-slot:no-data>
          Nenhuma receita encontrada no cadastrado.
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

  <CadReceitaDialog
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
import CadReceitaDialog from '@/components/cadastro/CadReceitaDialog.vue';
import type { IDialogoQuestaoData } from '@/components/DialogoQuestao.vue';
import type { IReceita } from '@/interfaces/cadastro/IReceita';
import { useReceitasStore } from '@/store/cadastro/receitas';
import { evaEditOutline, evaPlusOutline, evaTrashOutline } from '@quasar/extras/eva-icons';
import { computed, inject, onMounted, ref } from 'vue';

const storeReceitas = useReceitasStore();

function lePrimeirosIngredientes(receita: IReceita): string {
  if (!receita.ingredientes)
    return '(sem ingredientes)';

  const resultado = receita.ingredientes.reduce((prev, curr, index) => {
    if (index > 5)
      return prev;
    prev += (index > 0 ? ', ' : '') + curr;
    return prev;
  }, '');

  return resultado.length > 20 ? resultado.substring(0, 20) + '...' : resultado;
}

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' as const, sortable: true },
  { name: 'nome', label: 'Nome', field: 'nome', align: 'left' as const, sortable: true },
  { name: 'ingredientes', label: 'Ingredientes', field: (r: IReceita) => lePrimeirosIngredientes(r), align: 'left' as const, sortable: false },
  { name: 'imagem', label: 'Imagem', field: 'imagem', align: 'left' as const, sortable: false },
  { name: 'acoes', label: 'Ações', field: 'acoes', align: 'center' as const, sortable: false }
];

const paginacao = computed(() => {
  return {
    sortBy: storeReceitas.ordenarPor.length > 0 ? storeReceitas.ordenarPor[0].campo : '',
    descending: storeReceitas.ordenarPor.length > 0 ? storeReceitas.ordenarPor[0].decrescente : false,
    page: storeReceitas.paginaAtual,
    rowsPerPage: storeReceitas.tamanhoPagina,
    rowsNumber: storeReceitas.tamanhoTotal
  };
});

onMounted(async () => {
  await storeReceitas.fetchReceitas(1, []);
});

const onRequest = async (props: any) => {
  await storeReceitas.fetchReceitas(props.pagination.page, [{
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

const editar = (linha: IReceita) => {
  abrirCadastro(linha.id);
}

const excluir = (linha: IReceita) => {
  if (!mostrarQuestao)
    return;

  mostrarQuestao({
    titulo: 'Cadastro de Receita',
    mensagem: `Confirma exclusão da receita "${linha.nome}"?`,
    tipoSimNao: true,
    aoCancelear: () => {},
    aoConfirmar: () => fazExclusao(linha)
  });
}

async function fazExclusao(linha: IReceita): Promise<boolean> {
  return await storeReceitas.removerReceita(linha.id);
}

const aoSalvar = (novaCategoria: IReceita) => {
  storeReceitas.atualizaReceita(novaCategoria);
}
const aoIncluir = (novaCategoria: IReceita) => {
  storeReceitas.incluiReceita(novaCategoria);
}
</script>
