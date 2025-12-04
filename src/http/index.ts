import type ICategorias from "@/interfaces/ICategorias";
import type IReceita from "@/interfaces/IReceita";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function obterCategorias() {
  const resposta = await fetch(`${API_BASE_URL}categorias`);
  const categorias: ICategorias[] = await resposta.json();
  return categorias;
}

export async function obterReceitas() {
  const resposta = await fetch(`${API_BASE_URL}receitas`);
  const receitas: IReceita[] = await resposta.json();
  return receitas;
}
