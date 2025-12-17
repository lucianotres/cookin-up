import type ICategorias from "@/interfaces/ICategorias";
import type IReceita from "@/interfaces/IReceita";
import { useEnvApiBaseUrl, useEnvConfig } from "@/utils/env-config";

const API_BASE_URL = useEnvApiBaseUrl();

export async function obterCategorias() {
  const resposta = await fetch(`${API_BASE_URL}publico/categorias`);
  const categorias: ICategorias[] = await resposta.json();
  return categorias;
}

export async function obterReceitas() {
  const resposta = await fetch(`${API_BASE_URL}publico/receitas`);
  const receitas: IReceita[] = await resposta.json();
  return receitas;
}
