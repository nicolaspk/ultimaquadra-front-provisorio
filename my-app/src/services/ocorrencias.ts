import { ocorrencias as exemplosOcorrencias, trechos as exemplosTrechos, unidades as exemplosUnidades } from '../data/base';
import type { NovoRelato, Ocorrencia, ResultadoCadastro, Trecho, Unidade } from '../types/estrutura';
import { ErroApi, cadastrarOcorrenciaApi, consultarOcorrenciaApi, consultarOcorrenciasApi, consultarTrechosApi, consultarUnidadesApi, excluirOcorrenciaApi } from './api';

// Uma nova chave separa relatos do piloto real dos testes antigos com UBS fictícias.
// Dados de testes anteriores permanecem intactos na chave v1.
const CHAVE_LOCAL = 'ultimaquadra:ocorrencias:v2';
const EVENTO_REGISTRO = 'ultimaquadra:registro';

// Integração Java/Oracle é o padrão. O modo local só é ativado explicitamente para testes isolados.
export const usandoApi = import.meta.env.VITE_DATA_SOURCE !== 'local';

// O rótulo provisório pertence à interface atual. Não exige novo campo no DTO Java.
// O nome anterior permanece reconhecido por compatibilidade com dados existentes.
export function trechoExigeReferencia(trecho: Trecho | undefined): boolean {
  return Boolean(trecho && (
    trecho.nome === 'Entorno imediato da UBS — local a indicar' ||
    trecho.nome === 'Calçada de acesso à UBS'
  ));
}

export function referenciaLocalClara(valor: string): boolean {
  const texto = valor.trim().replace(/\s+/g, ' ');
  if (texto.length < 15) return false;

  // Alguns preenchimentos genéricos não permitem reconhecer o ponto aproximado.
  // É uma orientação mínima, não uma verificação geográfica automática.
  const normalizado = texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[.,!?;:]/g, '').trim();
  const respostasVagas = [
    'na calcada', 'na calcada da ubs', 'na calcada perto da ubs',
    'perto da ubs', 'proximo a ubs', 'proximo da ubs', 'ao lado da ubs',
    'em frente a ubs', 'na frente da ubs', 'na entrada da ubs',
    'perto da entrada', 'perto da unidade', 'na frente da unidade',
    'em frente a unidade', 'na frente do posto', 'na calcada do posto',
    'na rua', 'na esquina',
    'no caminho', 'no entorno da ubs', 'na area da ubs',
    'nao sei', 'nao sei informar', 'nao lembro onde',
  ];
  return !respostasVagas.includes(normalizado);
}

function lerRegistrosLocais(): Ocorrencia[] {
  const texto = window.localStorage.getItem(CHAVE_LOCAL);
  if (!texto) return [];
  try {
    const dados: unknown = JSON.parse(texto);
    if (!Array.isArray(dados)) throw new Error('Formato inválido');
    return dados.filter((item): item is Ocorrencia =>
      item !== null && typeof item === 'object' &&
      typeof item.id === 'string' && typeof item.unidadeId === 'string' &&
      typeof item.trechoId === 'string' && typeof item.descricao === 'string'
    );
  } catch {
    throw new Error('Não foi possível ler os relatos guardados neste navegador.');
  }
}

export async function listarUnidades(signal?: AbortSignal): Promise<Unidade[]> {
  return usandoApi ? consultarUnidadesApi(signal) : [...exemplosUnidades];
}

export async function listarTrechos(signal?: AbortSignal): Promise<Trecho[]> {
  return usandoApi ? consultarTrechosApi(signal) : [...exemplosTrechos];
}

export async function listarOcorrencias(signal?: AbortSignal): Promise<Ocorrencia[]> {
  return usandoApi ? consultarOcorrenciasApi(signal) : [...lerRegistrosLocais(), ...exemplosOcorrencias];
}

export async function buscarOcorrencia(id: string, signal?: AbortSignal): Promise<Ocorrencia | undefined> {
  if (usandoApi) {
    try {
      return await consultarOcorrenciaApi(id, signal);
    } catch (falha) {
      // 404 representa registro inexistente; falhas de rede e 500 continuam sendo erros.
      if (falha instanceof ErroApi && falha.status === 404) return undefined;
      throw falha;
    }
  }
  const ocorrencias = await listarOcorrencias(signal);
  return ocorrencias.find((ocorrencia) => String(ocorrencia.id) === id);
}

export async function cadastrarOcorrencia(dados: NovoRelato): Promise<ResultadoCadastro> {
  if (usandoApi) {
    const resultado = await cadastrarOcorrenciaApi(dados);
    return { id: resultado.id, destino: 'api' };
  }

  // Modo local: persistência apenas no navegador, nunca apresentada como envio ao Java.
  const unidade = exemplosUnidades.find((item) => item.id === dados.unidadeId);
  const trecho = exemplosTrechos.find((item) => item.id === dados.trechoId && item.unidadeId === dados.unidadeId);
  if (!unidade || !trecho) throw new Error('Selecione uma UBS e um trecho válidos.');
  if (trechoExigeReferencia(trecho) && !referenciaLocalClara(dados.referenciaLocal ?? '')) {
    throw new Error('Informe um ponto de referência reconhecível para localizar o obstáculo.');
  }

  const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const novo: Ocorrencia = {
    ...dados,
    id,
    situacao: 'Relatada',
    dataRelato: new Date().toISOString().slice(0, 10),
  };
  try {
    const anteriores = lerRegistrosLocais();
    window.localStorage.setItem(CHAVE_LOCAL, JSON.stringify([novo, ...anteriores]));
    window.dispatchEvent(new Event(EVENTO_REGISTRO));
  } catch {
    throw new Error('Não foi possível guardar o relato neste navegador. Verifique o espaço e as permissões de armazenamento.');
  }
  return { id, destino: 'local' };
}

export async function excluirOcorrencia(id: string): Promise<void> {
  // A exclusão só é oferecida no modo API, para ter efeito real no banco Oracle.
  if (!usandoApi) throw new Error('A exclusão só está disponível com a API Java conectada.');
  await excluirOcorrenciaApi(id);
}

export function observarAlteracoes(aoAlterar: () => void): () => void {
  window.addEventListener(EVENTO_REGISTRO, aoAlterar);
  window.addEventListener('storage', aoAlterar);
  return () => {
    window.removeEventListener(EVENTO_REGISTRO, aoAlterar);
    window.removeEventListener('storage', aoAlterar);
  };
}
