<template>
  <CadPadrao
    ref="dialogoCadastro"
    :titulo="`Categoria (${props.modelValue === 0 ? 'nova' : 'editar'})`"
    :buscar="buscaCadastro"
    :salvar="salvarCadastro"
    @fechar="() => emit('update:modelValue', null)"
  >
    <q-input v-model="categoria.nome" :rules="validaNome" outlined label="Nome" />
    <q-input v-model="categoria.imagem" outlined label="Imagem" />
  </CadPadrao>
</template>

<script setup lang="ts">
import CadPadrao from './CadPadrao.vue';
import { atualizarCategoria, incluirCategoria, obterCategoria } from '@/http/cadastro';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { ref, watch } from 'vue';

const dialogoCadastro = ref<InstanceType<typeof CadPadrao>>();

const categoria = ref({
  id: 0,
  nome: '',
} as ICategoria);

const validaNome = [(valor: string) => !!valor || 'Obrigatório informar um nome'];

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
    categoria.value = { id: 0, nome: '' };
    return;
  }

  var dadosCategoria = await obterCategoria(props.modelValue);
  categoria.value = dadosCategoria;
}

async function salvarCadastro() {
  if (props.modelValue === null)
    return;

  if (props.modelValue === 0) {
    const dadosIncluso = await incluirCategoria(categoria.value);
    emit('incluso', dadosIncluso);
  } else {
    const dadosAlterado = await atualizarCategoria(categoria.value);
    emit('salvou', dadosAlterado);
  }
}
</script>
