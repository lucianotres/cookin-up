import { userManager } from "@/auth";
import type IOrdem from "@/interfaces/IOrdem";
import type IPage from "@/interfaces/IPage";
import type ICategoria from "@/interfaces/cadastro/ICategoria";
import type IIngrediente from "@/interfaces/cadastro/IIngrediente";
import { useEnvApiBaseUrl } from "@/utils/env-config";
import type IErro400 from "./IErro400";

const API_BASE_URL = useEnvApiBaseUrl();

export async function apiFetch(input: RequestInfo, init?: RequestInit) {
  const user = await userManager.getUser();

  const headers = new Headers(init?.headers || {});
  if (user && !user.expired) {
    headers.set("Authorization", `Bearer ${user.access_token}`);
  }

  return fetch(input, {
    ...init,
    headers,
  });
}

export interface IPaginacaoOrdenacao {
  page: number,
  size: number,
  sort: IOrdem[]
}

function uriComPaginacaoEOrdenacao(path: string, paginacao: IPaginacaoOrdenacao): string {
  let uri = `${API_BASE_URL}${path}?page=${paginacao.page}&size=${paginacao.size}`;

  if (paginacao.sort.length > 0)
  {
    uri += paginacao.sort.map((o) => {
      return o.decrescente ? `&sort=${o.campo},desc` : `&sort=${o.campo}`;
    })
  }

  return uri;
}

async function fechGetPagePadrao<T>(path: string, paginacao: IPaginacaoOrdenacao): Promise<IPage<T>> {
  const uri = uriComPaginacaoEOrdenacao(path, paginacao);
  const resposta = await apiFetch(uri);
  return await resposta.json() as IPage<T>;
}

async function fechGetPadrao<T>(path: string): Promise<T> {
  const resposta = await apiFetch(`${API_BASE_URL}${path}`);
  return await resposta.json() as T;
}

async function fechPostPadrao<TRetorno, TPost>(path: string, conteudo: TPost): Promise<TRetorno> {
  const resposta = await apiFetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conteudo)
  });

  if (resposta.status === 400) {
    const falha = await resposta.json() as IErro400;
    throw new Error(falha.mensagem);
  }

  if (resposta.status !== 201) {
    throw new Error("Falha desconhecida ao salvar!");
  }

  return await resposta.json() as TRetorno;
}

async function fechPutPadrao<T>(path: string, conteudo: T): Promise<T> {
  const resposta = await apiFetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(conteudo)
  });
  return await resposta.json() as T;
}

async function fechDeletePadrao(path: string): Promise<boolean> {
  const resposta = await apiFetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  return resposta.ok && resposta.status === 204;
}

// API para listar categorias
export const obterCategorias = async (paginacao: IPaginacaoOrdenacao): Promise<IPage<ICategoria>> =>
  fechGetPagePadrao('categorias', paginacao);

// API para pegar uma categoria
export const obterCategoria = async (id: number): Promise<ICategoria> =>
  fechGetPadrao(`categorias/${id}`);

// API para atualizar uma categoria
export const atualizarCategoria = async (categoria: ICategoria): Promise<ICategoria> =>
  fechPutPadrao('categorias', categoria);

// API para inclur uma categoria
export const incluirCategoria = async (categoria: ICategoria): Promise<ICategoria> =>
  fechPostPadrao('categorias', categoria);

// API para deletar categoria
export const removerCategoria = async (id: number): Promise<boolean> =>
  fechDeletePadrao(`categorias/${id}`);

// API para pegar lista de categoria filtradas
export const obterCategoriasFiltrada = async (termo: string): Promise<ICategoria[]> => {
  const termoEncoded = encodeURIComponent(termo);
  const resposta = await apiFetch(`${API_BASE_URL}categorias/filtrado?termo=${termoEncoded}`);
  return await resposta.json() as ICategoria[];
}


// API para listar ingredientes
export const obterIngredientes = async (paginacao: IPaginacaoOrdenacao): Promise<IPage<IIngrediente>> =>
  fechGetPagePadrao('ingredientes', paginacao);

// API para pegar um ingrediente
export const obterIngrediente = async (id: number): Promise<IIngrediente> =>
  fechGetPadrao(`ingredientes/${id}`);

// API para atualizar um ingrediente
export const atualizarIngrediente = async (ingrediente: IIngrediente): Promise<IIngrediente> =>
  fechPutPadrao('ingredientes', {
    id: ingrediente.id,
    nome: ingrediente.nome,
    id_categoria: ingrediente.categoria?.id
  });

// API para inclur um ingrediente
export const incluirIngrediente = async (ingrediente: IIngrediente): Promise<IIngrediente> =>
  fechPostPadrao('ingredientes', {
    nome: ingrediente.nome,
    id_categoria: ingrediente.categoria?.id
  });

// API para deletar ingrediente
export const removerIngrediente = async (id: number): Promise<boolean> =>
  fechDeletePadrao(`ingredientes/${id}`);
