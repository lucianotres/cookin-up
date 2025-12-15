import { defineStore } from 'pinia';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { obterCategorias } from '@/http/cadastro';
import type IPage from '@/interfaces/IPage';

const tamanhoPagina = 50;

export const useCategoriasStore = defineStore('cadCategorias', {
    state: () => ({
      paginas: [] as IPage<ICategoria>[],
      carregando: false,
      falhaAoCarregar: false,
      erroAoCarregar: '' as string
    }),
    actions: {
      async fetchCategorias(pagina: number = 0): Promise<number> {
        if (pagina < 0)
          return -1;

        const indicePagina = this.paginas.findIndex(p => p.pageable.pageNumber === pagina);
        if (indicePagina >= 0) {
          return indicePagina;
        }

        this.carregando = true;
        this.falhaAoCarregar = false;
        this.erroAoCarregar = '';
        try {
          var paginaRetornada = await obterCategorias(pagina, tamanhoPagina);

          this.paginas.push(paginaRetornada);
          return this.paginas.length - 1;
        } catch (error: any) {
          this.falhaAoCarregar = true;
          this.erroAoCarregar = error.message || 'Erro desconhecido ao carregar categorias.';
          return -1;
        } finally {
          this.carregando = false;
        }
      }
    }
});
