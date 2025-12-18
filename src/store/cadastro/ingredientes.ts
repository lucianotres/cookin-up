import { defineStore } from 'pinia';
import { obterIngredientes, removerIngrediente } from '@/http/cadastro';
import type IPage from '@/interfaces/IPage';
import type IOrdem from '@/interfaces/IOrdem';
import type IIngrediente from '@/interfaces/cadastro/IIngrediente';
import { ordensSaoIguais } from '@/utils/listas';

export const useIngredientesStore = defineStore('cadIngredientes', {
    state: () => ({
      paginas: [] as IPage<IIngrediente>[],
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
        return indicePagina >= 0 ? state.paginas[indicePagina].content : [] as IIngrediente[];
      }
    },

    actions: {
      async fetchIngredientes(pagina: number, ordem: IOrdem[], forcaReload: boolean = false): Promise<void> {
        //força reload ou se mudou ordenação, zera dados em cache
        if (forcaReload || !ordensSaoIguais(this.ordenarPor, ordem)) {
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
          var paginaRetornada = await obterIngredientes({
            page: pagina - 1,
            size: this.tamanhoPagina,
            sort: ordem
          });

          this.paginas.push(paginaRetornada);
          this.paginaAtual = pagina;
          this.ordenarPor = ordem;
          this.tamanhoTotal = paginaRetornada.totalElements;
        } catch (error: any) {
          this.falhaAoCarregar = true;
          this.erroAoCarregar = error.message || 'Erro desconhecido ao carregar ingredientes.';
        } finally {
          this.carregando = false;
        }
      },

      atualizaIngrediente(novoIngrediente: IIngrediente) {
        const paginaCom = this.paginas.find(p => p.content.findIndex(f => f.id === novoIngrediente.id) >= 0);

        if (paginaCom) {
          const novaLista = paginaCom.content.map(m => m.id === novoIngrediente.id ? novoIngrediente : m);
          paginaCom.content = novaLista;
        }
      },

      incluiIngrediente(novoIngrediente: IIngrediente) {
        const conteudoAtual = this.conteudoPaginaAtual;

        if (conteudoAtual.length === 0 || conteudoAtual.length === this.tamanhoPagina)
        {
          this.fetchIngredientes(this.paginaAtual, this.ordenarPor, true)
          return;
        }

        const pagina = this.paginas.find(f => f.pageable.pageNumber === (this.paginaAtual - 1));
        if (pagina)
          pagina.content = [novoIngrediente, ...pagina.content];
      },

      async removerIngrediente(id: number): Promise<boolean> {
        if (await removerIngrediente(id))
        {
          await this.fetchIngredientes(this.paginaAtual, this.ordenarPor, true);
          return true;
        } else
          return false;
      }
    }
});
