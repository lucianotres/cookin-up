<template>
  <q-dialog v-model="mostrar">
    <q-card>
      <q-card-section>
        <div class="text-h2">{{ ingrediente.id === 0 ? 'Novo' : 'Editar' }} Ingrediente</div>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md">
          <q-form ref="formulario" class="q-gutter-md" style="min-width: 400px">
            <q-input v-model="ingrediente.nome" :rules="validaNome" ref="primeiroInput" outlined label="Nome" />
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
import { atualizarIngrediente, incluirIngrediente, obterCategoriasFiltrada, obterIngrediente } from '@/http/cadastro';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import type IIngrediente from '@/interfaces/cadastro/IIngrediente';
import { evaCloseOutline, evaSaveOutline } from '@quasar/extras/eva-icons';
import { Notify } from 'quasar';
import { computed, nextTick, ref, watch } from 'vue';

const formulario = ref();
const primeiroInput = ref();

const carregando = ref(true);
const ingrediente = ref({
  id: 0,
  nome: '',
} as IIngrediente);

const validaNome = [(valor: string) => !!valor || 'Obrigatório informar um nome'];
const validaCategoria = [(valor: ICategoria | null) => !!valor || 'Obrigatório informar uma categoria'];

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  idIngrediente: { type: Number, required: true }
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
  if (props.idIngrediente === 0) {
    ingrediente.value = { id: 0, nome: '' };
    carregando.value = false;
    return;
  }

  carregando.value = true;
  try {
    var dadosCategoria = await obterIngrediente(props.idIngrediente);
    ingrediente.value = dadosCategoria;
  }
  catch (err) {
    console.log('Falha ao carregar ingrediente:', err);
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
    if (props.idIngrediente === 0) {
      const dadosAlterado = await incluirIngrediente(ingrediente.value);
      emit('incluso', dadosAlterado);
      mostrar.value = false;
    } else {
      const dadosAlterado = await atualizarIngrediente(ingrediente.value);
      emit('salvou', dadosAlterado);
      mostrar.value = false;
    }
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    Notify.create({
      message: '<b>Falha ao salvar!</b><br>' + errorMessage,
      html: true,
      color: 'red',
      position: 'top',
      timeout: 5000
    });

  }
  finally {
    carregando.value = false;
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
