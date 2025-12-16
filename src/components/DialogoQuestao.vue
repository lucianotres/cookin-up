<template>
  <q-dialog v-model="verDialog">
      <q-card>
        <q-card-section>
          <div class="text-h2">{{ config.titulo }}</div>
        </q-card-section>

        <q-card-section class="q-pt-4 mensagem">
          {{ config.mensagem }}
        </q-card-section>

        <q-card-actions v-if="config.tipoSimNao" align="right">
          <q-btn label="Sim" color="primary" @click="confirmar" />
          <q-btn label="Não" color="amber" @click="cancelar" />
        </q-card-actions>
        <q-card-actions v-else align="right">
          <q-btn label="OK" color="primary" @click="confirmar" />
          <q-btn label="Cancelar" color="amber" @click="cancelar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<style lang="css" scoped>
.mensagem {
  min-width: 500px;
}
</style>

<script lang="ts">
export interface IDialogoQuestaoData {
  titulo: string;
  mensagem: string;
  tipoSimNao: boolean;
  aoConfirmar: () => Promise<boolean>;
  aoCancelear: () => void;
}
</script>

<script setup lang="ts">
import { provide, ref } from 'vue';

const verDialog = ref(false);
const config = ref({
  titulo: 'Confirmarção',
  mensagem: 'Confirma a ação?',
  tipoSimNao: true
} as IDialogoQuestaoData);

function mostrarQuestao(configuracao: IDialogoQuestaoData) {
  config.value = configuracao;
  verDialog.value = true;
}

defineExpose({ mostrarQuestao });

async function confirmar() {
  if (await config.value.aoConfirmar())
    verDialog.value = false;
}

function cancelar() {
  verDialog.value = false;
  config.value.aoCancelear();
}
</script>
