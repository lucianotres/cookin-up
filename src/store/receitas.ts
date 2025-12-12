import { obterReceitas } from "@/http";
import type IReceita from "@/interfaces/IReceita";
import { intensDeLista1EstaoEmList2 } from "@/utils/listas";
import { defineStore } from "pinia";

export const useReceitasStore = defineStore('receitas', {
    state: () => ({
      listaReceitas: [] as IReceita[],
      carregandoReceitas: false,
      falhaAoCarregarReceitas: false,
      erroAoCarregarReceitas: '' as string,
      filtroIngredientes: [] as string[]
    }),

    getters: {
      receitasFiltradas: (state) => {
        if (state.filtroIngredientes.length === 0) {
          return state.listaReceitas;
        }
        return state.listaReceitas.filter(receita => intensDeLista1EstaoEmList2(receita.ingredientes, state.filtroIngredientes));
      }
    },

    actions: {
      async fetchReceitas() {
        try {
          this.carregandoReceitas = true;
          this.falhaAoCarregarReceitas = false;
          this.erroAoCarregarReceitas = '';
          this.listaReceitas = await obterReceitas();
        } catch (error: any) {
          this.falhaAoCarregarReceitas = true;
          this.erroAoCarregarReceitas = error.message || 'Erro desconhecido ao carregar receitas.';
        } finally {
          this.carregandoReceitas = false;
        }
      },

      adicionarIngrediente(ingrediente: string) {
        if (!this.filtroIngredientes.includes(ingrediente)) {
          this.filtroIngredientes.push(ingrediente);
        }
      },

      removerIngrediente(ingrediente: string) {
        this.filtroIngredientes = this.filtroIngredientes.filter(i => i !== ingrediente);
      },

      ingredienteEstaNoFiltro(ingrediente: string): boolean {
        return this.filtroIngredientes.includes(ingrediente);
      }
    }
});
