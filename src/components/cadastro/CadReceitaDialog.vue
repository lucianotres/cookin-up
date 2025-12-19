<template>
  <CadPadrao
    ref="dialogoCadastro"
    :titulo="`Receita (${props.modelValue === 0 ? 'nova' : 'editar'})`"
    :buscar="buscaCadastro"
    :salvar="salvarCadastro"
    @fechar="() => emit('update:modelValue', null)"
  >
    <q-input v-model="receita.nome" :rules="validaNome" outlined label="Nome" />
    <q-select
      v-model="receita.ingredientes"
      :rules="validaIngrediente"
      outlined
      label="Ingredientes"
      use-input
      use-chips
      multiple
      :options="listaIngredientes"
      option-label="nome"
      option-value="nome"
      emit-value
      map-options
      @filter="filtraIngredientes"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            -- Ingrediente não encontrado -- (digite no mínimo 2 caracteres)
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input v-model="receita.imagem" outlined label="Imagem" />
  </CadPadrao>
</template>

<script setup lang="ts">
import CadPadrao from './CadPadrao.vue';
import { atualizarReceita, incluirReceita, obterIngredientesFiltrado, obterReceita } from '@/http/cadastro';
import type IIngrediente from '@/interfaces/cadastro/IIngrediente';
import type { IReceita } from '@/interfaces/cadastro/IReceita';
import { ref, watch } from 'vue';

const dialogoCadastro = ref<InstanceType<typeof CadPadrao>>();

const props = defineProps({
  modelValue: { type: [Number, null], required: true }
});

const emit = defineEmits(['update:modelValue', 'salvou', 'incluso']);

watch(() => props.modelValue, async (valor) => {
  if (valor === null)
    dialogoCadastro.value?.fechar();
  else
    dialogoCadastro.value?.mostrar();
});

const receita = ref({
  id: 0,
  nome: '',
  ingredientes: [] as string[],
  imagem: ''
} as IReceita);

const validaNome = [(valor: string) => !!valor || 'Obrigatório informar um nome'];
const validaIngrediente = [(valor: string[] | null) => !!valor?.length || 'Obrigatório informar ao menos um ingrediente'];

async function buscaCadastro() {
  if (props.modelValue === null)
    return;

  if (props.modelValue === 0) {
    receita.value = { id: 0, nome: '', ingredientes: [], imagem: '' };
    return;
  }

  var dadosCategoria = await obterReceita(props.modelValue);
  receita.value = dadosCategoria;
}

async function salvarCadastro() {
  if (props.modelValue === null)
    return;

  if (props.modelValue === 0) {
    const dadosIncluso = await incluirReceita(receita.value);
    emit('incluso', dadosIncluso);
  } else {
    const dadosAlterado = await atualizarReceita(receita.value);
    emit('salvou', dadosAlterado);
  }
}

const listaIngredientes = ref([] as IIngrediente[]);

const filtraIngredientes = async (
  val: string,
  update: (callback: () => void, after?: () => void) => void,
  abort: () => void
) => {
  if (val.length < 2) {
    update(() => listaIngredientes.value = []);
    return;
  }
  let ingredientesFiltrados = await obterIngredientesFiltrado(val);
  update(() => listaIngredientes.value = ingredientesFiltrados);
}
</script>
