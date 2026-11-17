import type { Ocorrencia, Trecho, Unidade } from '../types/estrutura';

// UBS reais da cidade de São Paulo, verificadas em fontes oficiais.
// Estabelecimentos da SMS-SP por Subprefeitura (setembro/2026):
// https://smartsampa.prefeitura.sp.gov.br/documents/d/saude/unid_munic_saude_sub_setembro2026
// Códigos CNES: Portaria SMS 609/2026.
// https://legislacao.prefeitura.sp.gov.br/portaria-secretaria-municipal-da-saude-sms-609-de-16-de-setembro-de-2026/consolidado
// Atenção: a existência da UBS não é comprovação das condições de sua calçada.
export const unidades: Unidade[] = [
  {
    id: 'ubs-bom-retiro',
    cnes: '2029618',
    nome: 'UBS Bom Retiro — Dr. Octavio Augusto Rodovalho',
    bairro: 'Bom Retiro',
    endereco: 'Rua Tenente Pena, 8 — Bom Retiro, São Paulo — SP, CEP 01127-020',
    referencia: 'Rua Tenente Pena, 8',
    descricao: 'Unidade Básica de Saúde da rede municipal no bairro Bom Retiro.',
  },
  {
    id: 'ubs-boracea',
    cnes: '6048633',
    nome: 'UBS Boracea',
    bairro: 'Barra Funda',
    endereco: 'Rua Boracea, 270 — Barra Funda, São Paulo — SP, CEP 01135-010',
    referencia: 'Rua Boracea, 270',
    descricao: 'Unidade Básica de Saúde da rede municipal na região da Barra Funda.',
  },
  {
    id: 'ubs-cambuci',
    cnes: '2786834',
    nome: 'UBS Cambuci',
    bairro: 'Cambuci',
    endereco: 'Avenida Lacerda Franco, 791 — Cambuci, São Paulo — SP, CEP 01536-000',
    referencia: 'Avenida Lacerda Franco, 791',
    descricao: 'Unidade Básica de Saúde da rede municipal no bairro Cambuci.',
  },
  {
    id: 'ubs-humaita',
    cnes: '2787113',
    nome: 'UBS Humaitá — Dr. João de Azevedo Lage',
    bairro: 'Bela Vista',
    endereco: 'Rua Humaitá, 520 — Bela Vista, São Paulo — SP, CEP 01321-010',
    referencia: 'Rua Humaitá, 520',
    descricao: 'Unidade Básica de Saúde da rede municipal na Bela Vista.',
  },
  {
    id: 'ubs-republica',
    cnes: '6090621',
    nome: 'UBS República — Fernanda Sante Limeira',
    bairro: 'Centro',
    endereco: 'Rua Líbero Badaró, 282 — Centro, São Paulo — SP, CEP 01008-000',
    referencia: 'Rua Líbero Badaró, 282',
    descricao: 'Unidade Básica de Saúde da rede municipal na região central de São Paulo.',
  },
  {
    id: 'ubs-santa-cecilia',
    cnes: '2752336',
    nome: 'UBS Santa Cecília — Dr. Humberto Pascale',
    bairro: 'Campos Elíseos',
    endereco: 'Rua Vitorino Carmilo, 599 — Campos Elíseos, São Paulo — SP, CEP 01153-000',
    referencia: 'Rua Vitorino Carmilo, 599',
    descricao: 'Unidade Básica de Saúde da rede municipal na região de Campos Elíseos.',
  },
  {
    id: 'ubs-se',
    cnes: '5975220',
    nome: 'UBS Sé',
    bairro: 'Sé',
    endereco: 'Rua Frederico Alvarenga, 259, térreo — Sé, São Paulo — SP, CEP 01020-030',
    referencia: 'Rua Frederico Alvarenga, 259',
    descricao: 'Unidade Básica de Saúde da rede municipal no distrito da Sé.',
  },
];

// Uma área provisória por UBS, sem afirmar a existência de entradas, lados ou
// calçadas específicas não verificadas. IDs preservados para manter os relatos locais.
// O cidadão informa o ponto aproximado em referenciaLocal.
// Trechos individualizados somente após confirmação de suas referências.
export const trechos: Trecho[] = unidades.map((unidade) => ({
  id: `acesso-${unidade.id}`,
  unidadeId: unidade.id,
  nome: 'Entorno imediato da UBS — local a indicar',
  descricao: `Área de acesso próxima ao endereço ${unidade.referencia}, ainda sem divisão em trechos identificados. Ao relatar uma barreira, informe um ponto reconhecível próximo ao obstáculo.`,
  distanciaMediaEntrada: 'Área sem delimitação específica',
}));

// Nenhum obstáculo é atribuído a UBS reais sem relato recebido.
export const ocorrencias: Ocorrencia[] = [];
