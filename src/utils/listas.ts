import type IOrdem from "@/interfaces/IOrdem";

export function intensDeLista1EstaoEmList2(lista1: unknown[], lista2: unknown[])
{
  return lista1.every(item => lista2.includes(item));
}

export function ordensSaoIguais(ordem1: IOrdem[], ordem2: IOrdem[]): boolean {
  if (ordem1.length !== ordem2.length)
    return false;

  return ordem1.reduce((anterior, atual, idx) => {
    return anterior
      && atual.campo === ordem2[idx].campo
      && atual.decrescente === ordem2[idx].decrescente;
  }, true);
}
