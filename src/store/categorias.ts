import { defineStore } from 'pinia';
import type ICategorias from '@/interfaces/ICategorias';
import { obterCategorias } from '@/http';

export const useCategoriasStore = defineStore('categorias', {
    state: () => ({
      listaCategorias: [] as ICategorias[],
      carregando: false,
      falhaAoCarregar: false,
      erroAoCarregar: '' as string
    }),
    actions: {
      async fetchCategorias() {
        this.carregando = true;
        this.falhaAoCarregar = false;
        this.erroAoCarregar = '';
        try {
          this.listaCategorias = await obterCategorias();
        } catch (error: any) {
          this.falhaAoCarregar = true;
          this.erroAoCarregar = error.message || 'Erro desconhecido ao carregar categorias.';
        } finally {
          this.carregando = false;
        }
      }
    }
});
