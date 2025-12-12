import { userManager } from "@/auth";
import type IPage from "@/interfaces/IPage";
import type ICategoria from "@/interfaces/cadastro/ICategoria";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export async function obterCategorias() {
  const resposta = await apiFetch(`${API_BASE_URL}categorias`);
  return await resposta.json() as IPage<ICategoria>;
}
