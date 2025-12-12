<template>
  <button @click="aoClicar" class="ingrediente" :aria-pressed="selecionado">
    <Tag :texto="ingrediente" :ativa="selecionado" />
  </button>
</template>

<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import Tag from './Tag.vue';

defineComponent({
  name: 'IngredienteSelecionavel',
  components: { Tag }
});

const props = defineProps({
    ingrediente: { type: String, required: true },
    iniciaSelecionado: { type: Boolean, default: false }
});

const emit = defineEmits(['update:selecionado', 'adicionarIngrediente', 'removerIngrediente']);

const selecionado = ref(props.iniciaSelecionado);

function aoClicar() {
    selecionado.value = !selecionado.value;

    if (selecionado.value) {
      emit('adicionarIngrediente', props.ingrediente);
    } else {
      emit('removerIngrediente', props.ingrediente);
    }
}
</script>

<style scoped>
.ingrediente {
  cursor: pointer;
}

</style>
