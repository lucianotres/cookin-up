import { defineStore } from 'pinia';
import type ICategoria from '@/interfaces/cadastro/ICategoria';
import { obterCategorias } from '@/http/cadastro';
import type IPage from '@/interfaces/IPage';
import type IOrdem from '@/interfaces/IOrdem';

function ordensSaoIguais(ordem1: IOrdem[], ordem2: IOrdem[]): boolean {
  if (ordem1.length !== ordem2.length)
    return false;

  return ordem1.reduce((anterior, atual, idx) => {
    return anterior
      && atual.campo === ordem2[idx].campo
      && atual.decrescente === ordem2[idx].decrescente;
  }, true);
}

export const useCategoriasStore = defineStore('cadCategorias', {
    state: () => ({
      paginas: [] as IPage<ICategoria>[],
      tamanhoPagina: 50,
      tamanhoTotal: 0,
      paginaAtual: 1,
      ordenarPor: [] as IOrdem[],
      carregando: false,
      falhaAoCarregar: false,
      erroAoCarregar: '' as string
    }),

    getters: {
      conteudoPaginaAtual: (state) => {
        const indicePagina = state.paginas.findIndex(p => p.pageable.pageNumber === (state.paginaAtual - 1));
        return indicePagina >= 0 ? state.paginas[indicePagina].content : [] as ICategoria[];
      }
    },

    actions: {
      async fetchCategorias(pagina: number, ordem: IOrdem[]): Promise<void> {
        //se mudou ordenação, zera dados em cache
        if (!ordensSaoIguais(this.ordenarPor, ordem)) {
          this.paginaAtual = 1;
          this.ordenarPor = ordem;
          this.tamanhoTotal = 0;
          this.paginas = [];
        }

        if (pagina <= 0)
          return;

        //ja tens a pagina em memoria
        const indicePagina = this.paginas.findIndex(p => p.pageable.pageNumber === (pagina - 1));
        if (indicePagina >= 0)
        {
          this.paginaAtual = pagina;
          return;
        }

        //carrega de fato do servidor
        this.carregando = true;
        this.falhaAoCarregar = false;
        this.erroAoCarregar = '';
        try {
          var paginaRetornada = await obterCategorias(pagina - 1, this.tamanhoPagina, ordem);

          this.paginas.push(paginaRetornada);
          this.paginaAtual = pagina;
          this.ordenarPor = ordem;
          this.tamanhoTotal = paginaRetornada.totalElements;
        } catch (error: any) {
          this.falhaAoCarregar = true;
          this.erroAoCarregar = error.message || 'Erro desconhecido ao carregar categorias.';
        } finally {
          this.carregando = false;
        }
      }
    }
});
