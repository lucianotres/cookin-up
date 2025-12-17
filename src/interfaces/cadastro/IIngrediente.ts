export default interface IIngrediente {
  id: number;
  nome: string;
  categoria?: IIngredienteCategoria;
}

export interface IIngredienteCategoria {
  id: number;
  nome: string;
}
