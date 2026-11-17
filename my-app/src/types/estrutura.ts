export type CategoriaObstaculo =
  | 'Buraco'
  | 'Desnível'
  | 'Passagem estreita'
  | 'Obstáculo fixo'
  | 'Obstáculo temporário'
  | 'Pavimentação irregular'
  | 'Ausência de rebaixamento'
  | 'Outros';

export type SituacaoOcorrencia =
  | 'Relatada'
  | 'Em verificação'
  | 'Confirmada'
  | 'Não confirmada'
  | 'Resolvida';

export type Unidade = {
  id: string;
  cnes?: string;
  nome: string;
  bairro: string;
  referencia: string;
  descricao: string;
  endereco: string;
  ativa?: boolean;
};

export type Trecho = {
  id: string;
  unidadeId: string;
  nome: string;
  descricao: string;
  distanciaMediaEntrada: string;
  ativo?: boolean;
};

export type Ocorrencia = {
  id: string;
  unidadeId: string;
  trechoId: string;
  categoria: CategoriaObstaculo;
  situacao: SituacaoOcorrencia;
  descricao: string;
  dataRelato: string;
  larguraLivre?: string;
  alturaDesnivel?: string;
  distanciaEntrada?: string;
  impedimento?: 'Parcial' | 'Total';
  referenciaLocal?: string;
  passagem?: 'Dificultada' | 'Bloqueada' | 'Livre' | 'Não sei informar';
};

export type NovoRelato = Pick<Ocorrencia, 'unidadeId' | 'trechoId' | 'categoria' | 'descricao'> & {
  referenciaLocal?: string;
  passagem?: Ocorrencia['passagem'];
};

export type ResultadoCadastro = {
  id?: string;
  destino: 'local' | 'api';
};
