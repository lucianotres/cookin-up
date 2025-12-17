<template>
  <q-dialog v-model="mostrar">
    <q-card>
      <q-card-section>
        <div class="text-h2">{{ categoria.id === 0 ? 'Nova' : 'Editar' }} Categoria</div>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md">
          <q-form ref="formulario" class="q-gutter-md" style="min-width: 400px">
            <q-input v-model="categoria.nome" :rules="validaNome" ref="primeiroInput" outlined label="Nome" />
            <q-input v-model="categoria.imagem" outlined label="Imagem" />
          </q-form>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Salvar" color="primary" @click="salvar" :icon="evaSaveOutline" />
        <q-btn label="Cancelar" color="amber" v-close-popup :icon="evaCloseOutline" />
      </q-card-actions>

      <q-inner-loading
          :showing="carregando"
          label="Carregando..."
          label-class="text-teal"
          label-style="font-size: 1.1em"
        />
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { atualizarCategoria, incluirCategoria, obterCategoria } from '@/http/cadastro';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { evaCloseOutline, evaSaveOutline } from '@quasar/extras/eva-icons';
import { computed, nextTick, ref, watch } from 'vue';

const formulario = ref();
const primeiroInput = ref();

const carregando = ref(true);
const categoria = ref({
  id: 0,
  nome: '',
} as ICategoria);

const validaNome = [(valor: string) => !!valor || 'Obrigatório informar um nome'];

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  idCategoria: { type: Number, required: true }
})

const emit = defineEmits(['update:modelValue', 'salvou', 'incluso'])

const mostrar = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val)
})

watch(() => props.modelValue, async (valor) => {
  if (valor === true) {
    await buscaCadastro();
    await nextTick();
    primeiroInput.value.focus();
  }
});

async function buscaCadastro() {
  if (props.idCategoria === 0) {
    categoria.value = { id: 0, nome: '' };
    carregando.value = false;
    return;
  }

  carregando.value = true;
  try {
    var dadosCategoria = await obterCategoria(props.idCategoria);
    categoria.value = dadosCategoria;
  }
  catch (err) {
    console.log('Falha ao carregar categoria:', err);
    mostrar.value = false;
  }
  finally {
    carregando.value = false;
  }
}

const salvar = async () => {
  if (!(await formulario.value.validate()))
    return;

  carregando.value = true;
  try {
    if (props.idCategoria === 0) {
      var dadosIncluso = await incluirCategoria(categoria.value);
      emit('incluso', dadosIncluso);
      mostrar.value = false;
    } else {
      var dadosIncluso = await atualizarCategoria(categoria.value);
      emit('salvou', dadosIncluso);
      mostrar.value = false;
    }
  }
  catch (err) {
    console.log('Falha ao salvar categoria:', err);
    mostrar.value = false;
  }
  finally {
    carregando.value = false;
  }
}
</script>
