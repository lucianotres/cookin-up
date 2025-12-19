<template>
  <q-dialog v-model="mostrarDialog" @hide="() => emit('fechar')">
    <q-card>
      <q-card-section>
        <div class="text-h2">{{ titulo }}</div>
      </q-card-section>

      <q-card-section>
        <div class="q-pa-md">
          <q-form ref="formulario" class="q-gutter-md" style="min-width: 400px">
            <slot />
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
import { Notify } from 'quasar';
import { evaCloseOutline, evaSaveOutline } from '@quasar/extras/eva-icons';
import { ref } from 'vue';

const mostrarDialog = ref(false);
const formulario = ref();
const carregando = ref(true);

const props = defineProps({
  titulo: { type: String, required: true },
  buscar: { type: Function, required: true },
  salvar: { type: Function, required: true }
})

const emit = defineEmits(['buscar', 'salvar', 'fechar'])

function mostrar() {
  if (mostrarDialog.value)
    return;

  mostrarDialog.value = true;
  ExecutaBusca();
}

function fechar() {
  if (!mostrarDialog.value)
    return;

  mostrarDialog.value = false;
}

defineExpose({ mostrar, fechar });

async function ExecutaBusca() {
  carregando.value = true;
  try {
    await props.buscar();
  }
  catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
    Notify.create({
      message: '<b>Falha ao buscar cadastro!</b><br>' + errorMessage,
      html: true,
      color: 'red',
      position: 'top',
      timeout: 5000
    });
    mostrarDialog.value = false;
  }
  finally {
    carregando.value = false;
  }
}

async function salvar() {
  if (!(await formulario.value.validate()))
    return;

  carregando.value = true;
  try {
    await props.salvar();
    mostrarDialog.value = false;
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
</script>
