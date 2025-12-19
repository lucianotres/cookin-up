<template>
  <q-dialog v-model="mostrar">
    <q-card>
      <q-card-section>
        <div class="text-h2">{{ receita.id === 0 ? 'Nova' : 'Editar' }} Receita</div>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md">
          <q-form ref="formulario" class="q-gutter-md" style="min-width: 400px">
            <q-input v-model="receita.nome" :rules="validaNome" ref="primeiroInput" outlined label="Nome" />
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
import { atualizarReceita, incluirReceita, obterIngredientesFiltrado, obterReceita } from '@/http/cadastro';
import type IIngrediente from '@/interfaces/cadastro/IIngrediente';
import type { IReceita } from '@/interfaces/cadastro/IReceita';
import { evaCloseOutline, evaSaveOutline } from '@quasar/extras/eva-icons';
import { Notify } from 'quasar';
import { computed, nextTick, ref, watch } from 'vue';

const formulario = ref();
const primeiroInput = ref();

const carregando = ref(true);
const receita = ref({
  id: 0,
  nome: '',
  ingredientes: [] as string[],
  imagem: ''
} as IReceita);

const validaNome = [(valor: string) => !!valor || 'Obrigatório informar um nome'];
const validaIngrediente = [(valor: string[] | null) => !!valor?.length || 'Obrigatório informar ao menos um ingrediente'];

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  idReceita: { type: Number, required: true }
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
  if (props.idReceita === 0) {
    receita.value = { id: 0, nome: '', ingredientes: [], imagem: '' };
    carregando.value = false;
    return;
  }

  carregando.value = true;
  try {
    var dadosCategoria = await obterReceita(props.idReceita);
    receita.value = dadosCategoria;
  }
  catch (err) {
    console.log('Falha ao carregar receita:', err);
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
    if (props.idReceita === 0) {
      const dadosIncluso = await incluirReceita(receita.value);
      emit('incluso', dadosIncluso);
      mostrar.value = false;
    } else {
      const dadosAlterado = await atualizarReceita(receita.value);
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
