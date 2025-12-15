<template>
  <q-dialog v-model="mostrar">
    <q-card>
      <q-card-section>
        <div class="text-h2">{{ categoria.id === 0 ? 'Nova' : 'Editar' }} Categoria</div>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md">
          <div class="q-gutter-md" style="min-width: 400px">
            <q-input v-model="categoria.nome" ref="primeiroInput" outlined label="Nome" />
            <q-input v-model="categoria.imagem" outlined label="Imagem" />
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Salvar" color="primary" @click="salvar" />
        <q-btn flat label="Cancelar" color="amber" v-close-popup />
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
import { obterCategoria } from '@/http/cadastro';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { computed, nextTick, ref, watch } from 'vue';

const primeiroInput = ref();

const carregando = ref(true);
const categoria = ref({
  id: 0,
  nome: '',
} as ICategoria);

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  idCategoria: { type: Number, required: true }
})

const emit = defineEmits(['update:modelValue'])

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

const salvar = () => {
  console.log(categoria.value);
}
</script>
