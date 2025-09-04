export interface Prefeitura {
  id: number;
  name: string;
  logoPrefeitura: string;
  logoCMDCA: string;
}

export interface Proposta {
  id: number;
  titulo: string;
  plano: Plano;
  eixo: Eixo;
  categoria: Categoria;
  orgaoGestor: OrgaoGestor; 
  status: string;
  meta: string;
  motivo: string;
  metaPermanente: boolean;
  ativa: boolean;
  prefeituraId: number;
}

export interface PropostaSnapshot {
  id: number;
  titulo: string;
  meta: string;
  planoTitulo: string;
  eixoTitulo: string;
  categoriaTitulo: string;
  orgaoGestorTitulo: string;
  status: string;
  motivo: string;
  modificadoPor: string;
  dataModificacao: string;
  metaPermanente: boolean;
}

export interface Plano {
  titulo: string;
  id: number;
}
export interface Eixo {
  titulo: string;
  id: number;
}
export interface Categoria {
  titulo: string;
  id: number;
}
export interface OrgaoGestor {
  titulo: string;
  id: number;
}