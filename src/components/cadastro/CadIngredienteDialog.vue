<template>
  <CadPadrao
    ref="dialogoCadastro"
    :titulo="`Ingrediente (${props.modelValue === 0 ? 'novo' : 'editar'})`"
    :buscar="buscaCadastro"
    :salvar="salvarCadastro"
    @fechar="() => emit('update:modelValue', null)"
  >
    <q-input v-model="ingrediente.nome" :rules="validaNome" outlined label="Nome" />
    <q-select
      v-model="ingrediente.categoria"
      :rules="validaCategoria"
      outlined
      label="Categoria"
      use-input
      clearable
      :options="listaCategorias"
      option-label="nome"
      @filter="filtraCategoria"
    >
      <template v-slot:no-option>
        <q-item>
          <q-item-section class="text-grey">
            -- Categoria não encontrada -- (digite no mínimo 2 caracteres)
          </q-item-section>
        </q-item>
      </template>
    </q-select>
  </CadPadrao>
</template>

<script setup lang="ts">
import CadPadrao from './CadPadrao.vue';
import { atualizarIngrediente, incluirIngrediente, obterCategoriasFiltrada, obterIngrediente } from '@/http/cadastro';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import type IIngrediente from '@/interfaces/cadastro/IIngrediente';
import { ref, watch } from 'vue';

const dialogoCadastro = ref<InstanceType<typeof CadPadrao>>();

const ingrediente = ref({
  id: 0,
  nome: '',
} as IIngrediente);

const validaNome = [(valor: string) => !!valor || 'Obrigatório informar um nome'];
const validaCategoria = [(valor: ICategoria | null) => !!valor || 'Obrigatório informar uma categoria'];

const props = defineProps({
  modelValue: { type: [Number, null], required: true }
})

const emit = defineEmits(['update:modelValue', 'salvou', 'incluso'])

watch(() => props.modelValue, async (valor) => {
  if (valor === null)
    dialogoCadastro.value?.fechar();
  else
    dialogoCadastro.value?.mostrar();
});

async function buscaCadastro() {
  if (props.modelValue === null)
    return;

  if (props.modelValue === 0) {
    ingrediente.value = { id: 0, nome: '' };
    return;
  }

  var dadosCategoria = await obterIngrediente(props.modelValue);
  ingrediente.value = dadosCategoria;
}

async function salvarCadastro() {
  if (props.modelValue === null)
    return;

  if (props.modelValue === 0) {
    const dadoIncluso = await incluirIngrediente(ingrediente.value);
    emit('incluso', dadoIncluso);
  } else {
    const dadosAlterado = await atualizarIngrediente(ingrediente.value);
    emit('salvou', dadosAlterado);
  }
}

const listaCategorias = ref([] as ICategoria[]);

const filtraCategoria = async (
  val: string,
  update: (callback: () => void, after?: () => void) => void,
  abort: () => void
) => {
  if (val.length < 2) {
    update(() => listaCategorias.value = []);
    return;
  }
  const categoriasFiltradas = await obterCategoriasFiltrada(val);
  update(() => listaCategorias.value = categoriasFiltradas);
}
</script>
