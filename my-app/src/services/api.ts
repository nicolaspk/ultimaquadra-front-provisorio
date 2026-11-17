import type { CategoriaObstaculo, NovoRelato, Ocorrencia, SituacaoOcorrencia, Trecho, Unidade } from '../types/estrutura';

// Endpoints verificados nos controllers Java. Podem ser substituídos nas variáveis Vite.
const baseUrl = (import.meta.env.VITE_API_URL || 'https://ultimaquadra-gs2.onrender.com').replace(/\/+$/, '');
const caminhoUnidades = import.meta.env.VITE_API_UNIDADES_PATH || '/api/unidades';
const caminhoTrechos = import.meta.env.VITE_API_TRECHOS_PATH || '/api/trechos';
const caminhoOcorrencias = import.meta.env.VITE_API_OCORRENCIAS_PATH || '/api/ocorrencias';

export class ErroApi extends Error {
  constructor(mensagem: string, public readonly status?: number) {
    super(mensagem);
    this.name = 'ErroApi';
  }
}

function urlRecurso(caminho: string): string {
  if (!baseUrl || !caminho.startsWith('/')) {
    throw new ErroApi('A URL da API Java não está configurada corretamente.');
  }
  return `${baseUrl}${caminho}`;
}

function idNumerico(valor: string): number {
  // O Java usa Long; uma string local como "ubs-bom-retiro" não pode ir para o Oracle.
  if (!/^[1-9]\d*$/.test(valor)) {
    throw new ErroApi('Identificador inválido. Atualize a página e selecione um registro da API Java.');
  }
  const numero = Number(valor);
  if (!Number.isSafeInteger(numero)) {
    throw new ErroApi('Identificador fora do intervalo permitido pelo navegador.');
  }
  return numero;
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function ehIdentificador(valor: unknown): valor is string | number {
  return (typeof valor === 'string' && valor.length > 0) ||
    (typeof valor === 'number' && Number.isSafeInteger(valor));
}

async function requisitar(caminho: string, init: RequestInit = {}): Promise<Response> {
  let resposta: Response;
  try {
    resposta = await fetch(urlRecurso(caminho), {
      cache: 'no-store',
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...init.headers,
      },
    });
  } catch (falha) {
    if (falha instanceof ErroApi) throw falha;
    if (falha instanceof DOMException && falha.name === 'AbortError') throw falha;
    throw new ErroApi('Não foi possível conectar à API Java. Verifique sua conexão e tente novamente.');
  }

  if (!resposta.ok) {
    let mensagemServidor = '';
    let detalhes: string[] = [];
    try {
      const corpo: unknown = await resposta.json();
      if (ehObjeto(corpo)) {
        if (typeof corpo.mensagem === 'string') mensagemServidor = corpo.mensagem.trim();
        if (Array.isArray(corpo.detalhes)) {
          detalhes = corpo.detalhes.filter((item): item is string => typeof item === 'string').slice(0, 3);
        }
      }
    } catch { /* Erros HTTP também podem não ter corpo JSON. */ }

    const padrao = resposta.status === 400 ? 'Revise os dados informados.'
      : resposta.status === 404 ? 'Este registro não foi encontrado. Ele pode ter sido removido.'
      : resposta.status === 409 ? 'A operação não pôde ser concluída por conflito com os dados atuais.'
      : resposta.status === 405 ? 'Esta operação não está disponível no serviço.'
      : resposta.status >= 500 ? 'O servidor não conseguiu concluir a operação. Tente novamente mais tarde.'
      : `Não foi possível concluir a operação (HTTP ${resposta.status}).`;
    // Exibe mensagens da validação e das regras Java, sem propagar detalhes internos do servidor.
    const mensagem = [400, 404, 409].includes(resposta.status) && mensagemServidor
      ? `${mensagemServidor.slice(0, 250)}${detalhes.length ? ` ${detalhes.join(' · ').slice(0, 300)}` : ''}`
      : padrao;
    throw new ErroApi(mensagem, resposta.status);
  }
  return resposta;
}

async function lerJson(resposta: Response): Promise<unknown> {
  try { return await resposta.json(); }
  catch { throw new ErroApi('O serviço retornou uma resposta JSON inválida.'); }
}

async function obterLista<T>(caminho: string, converter: (valor: unknown) => T, signal?: AbortSignal): Promise<T[]> {
  const dados = await lerJson(await requisitar(caminho, { signal }));
  if (!Array.isArray(dados)) throw new ErroApi('O serviço enviou uma lista em formato inesperado.');
  return dados.map(converter);
}

function converterUnidade(valor: unknown): Unidade {
  if (!ehObjeto(valor) || !ehIdentificador(valor.id) || typeof valor.nome !== 'string') {
    throw new ErroApi('Formato de UBS incompatível com a API Java.');
  }
  return {
    id: String(valor.id), nome: valor.nome,
    cnes: typeof valor.cnes === 'string' ? valor.cnes : undefined,
    bairro: typeof valor.bairro === 'string' ? valor.bairro : '',
    referencia: typeof valor.referencia === 'string' ? valor.referencia : '',
    descricao: typeof valor.descricao === 'string' ? valor.descricao : '',
    endereco: typeof valor.endereco === 'string' ? valor.endereco : '',
    ativa: valor.ativa === true,
  };
}

function converterTrecho(valor: unknown): Trecho {
  if (!ehObjeto(valor) || !ehIdentificador(valor.id) || !ehIdentificador(valor.unidadeId) || typeof valor.nome !== 'string') {
    throw new ErroApi('Formato de trecho incompatível com a API Java.');
  }
  return {
    id: String(valor.id), unidadeId: String(valor.unidadeId), nome: valor.nome,
    descricao: typeof valor.descricao === 'string' ? valor.descricao : '',
    distanciaMediaEntrada: typeof valor.distanciaMediaEntrada === 'string' ? valor.distanciaMediaEntrada : '',
    ativo: valor.ativo === true,
  };
}

const categoriasAceitas: CategoriaObstaculo[] = [
  'Buraco', 'Desnível', 'Passagem estreita', 'Obstáculo fixo',
  'Obstáculo temporário', 'Pavimentação irregular', 'Ausência de rebaixamento', 'Outros',
];
const situacoesAceitas: SituacaoOcorrencia[] = [
  'Relatada', 'Em verificação', 'Confirmada', 'Não confirmada', 'Resolvida',
];

function converterOcorrencia(valor: unknown): Ocorrencia {
  if (!ehObjeto(valor) || !ehIdentificador(valor.id) || !ehIdentificador(valor.unidadeId) ||
    !ehIdentificador(valor.trechoId) || !categoriasAceitas.includes(valor.categoria as CategoriaObstaculo) ||
    typeof valor.descricao !== 'string' || typeof valor.dataRelato !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}/.test(valor.dataRelato) ||
    !situacoesAceitas.includes(valor.situacao as SituacaoOcorrencia)) {
    throw new ErroApi('Formato da ocorrência incompatível com a API Java.');
  }
  return {
    id: String(valor.id), unidadeId: String(valor.unidadeId), trechoId: String(valor.trechoId),
    categoria: valor.categoria as CategoriaObstaculo,
    situacao: valor.situacao as SituacaoOcorrencia,
    descricao: valor.descricao,
    dataRelato: valor.dataRelato.slice(0, 10),
    referenciaLocal: typeof valor.referenciaLocal === 'string' ? valor.referenciaLocal : undefined,
    passagem: ['Dificultada', 'Bloqueada', 'Livre', 'Não sei informar'].includes(String(valor.passagem))
      ? valor.passagem as Ocorrencia['passagem'] : undefined,
    larguraLivre: typeof valor.larguraLivre === 'string' ? valor.larguraLivre : undefined,
    alturaDesnivel: typeof valor.alturaDesnivel === 'string' ? valor.alturaDesnivel : undefined,
    distanciaEntrada: typeof valor.distanciaEntrada === 'string' ? valor.distanciaEntrada : undefined,
    impedimento: valor.impedimento === 'Parcial' || valor.impedimento === 'Total' ? valor.impedimento : undefined,
  };
}

export function consultarUnidadesApi(signal?: AbortSignal): Promise<Unidade[]> {
  return obterLista(caminhoUnidades, converterUnidade, signal);
}

export function consultarTrechosApi(signal?: AbortSignal): Promise<Trecho[]> {
  return obterLista(caminhoTrechos, converterTrecho, signal);
}

export function consultarOcorrenciasApi(signal?: AbortSignal): Promise<Ocorrencia[]> {
  return obterLista(caminhoOcorrencias, converterOcorrencia, signal);
}

export async function consultarOcorrenciaApi(id: string, signal?: AbortSignal): Promise<Ocorrencia> {
  const dados = await lerJson(await requisitar(`${caminhoOcorrencias}/${idNumerico(id)}`, { signal }));
  return converterOcorrencia(dados);
}

export async function cadastrarOcorrenciaApi(dados: NovoRelato): Promise<{ id: string }> {
  const corpo = {
    unidadeId: idNumerico(dados.unidadeId),
    trechoId: idNumerico(dados.trechoId),
    categoria: dados.categoria,
    descricao: dados.descricao,
    ...(dados.referenciaLocal ? { referenciaLocal: dados.referenciaLocal } : {}),
    ...(dados.passagem ? { passagem: dados.passagem } : {}),
  };
  const resposta = await requisitar(caminhoOcorrencias, { method: 'POST', body: JSON.stringify(corpo) });
  if (resposta.status !== 201) {
    throw new ErroApi('O serviço não retornou a confirmação esperada (HTTP 201). Verifique a listagem antes de tentar novamente.');
  }
  // O Java atual devolve JSON, mas a confirmação 201 também pode trazer um Location.
  let registro: unknown;
  try { registro = await resposta.json(); }
  catch { registro = undefined; }
  if (ehObjeto(registro) && ehIdentificador(registro.id)) return { id: String(registro.id) };

  const localizacao = resposta.headers.get('Location');
  const identificador = localizacao?.split('?')[0].split('/').filter(Boolean).at(-1);
  if (identificador && /^[1-9]\d*$/.test(identificador)) return { id: identificador };
  throw new ErroApi('O serviço recebeu o registro, mas não retornou seu identificador. Confira a listagem antes de reenviar.');
}

export async function excluirOcorrenciaApi(id: string): Promise<void> {
  const resposta = await requisitar(`${caminhoOcorrencias}/${idNumerico(id)}`, { method: 'DELETE' });
  if (resposta.status !== 204) {
    throw new ErroApi('O serviço não retornou a confirmação esperada da exclusão (HTTP 204). Atualize a consulta antes de repetir.');
  }
}
