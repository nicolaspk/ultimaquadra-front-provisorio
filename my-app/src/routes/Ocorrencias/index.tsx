import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import CartaoOcorrencia from '../../components/CartaoOcorrencia/CartaoOcorrencia';
import Container from '../../components/Container/Container';
import EstadoConsulta from '../../components/EstadoConsulta/EstadoConsulta';
import FonteDados from '../../components/EstadoConsulta/FonteDados';
import { listarOcorrencias, listarTrechos, listarUnidades, observarAlteracoes } from '../../services/ocorrencias';
import type { CategoriaObstaculo, Ocorrencia, SituacaoOcorrencia, Trecho, Unidade } from '../../types/estrutura';

const categorias: CategoriaObstaculo[] = [
  'Buraco', 'Desnível', 'Passagem estreita', 'Obstáculo fixo',
  'Obstáculo temporário', 'Pavimentação irregular', 'Ausência de rebaixamento', 'Outros',
];

const situacoes: SituacaoOcorrencia[] = [
  'Relatada', 'Em verificação', 'Confirmada', 'Não confirmada', 'Resolvida',
];

type Ordenacao = 'recentes' | 'antigos' | 'categoria';

function normalizar(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export default function Ocorrencias() {
  const [parametros, definirParametros] = useSearchParams();
  const localizacao = useLocation();
  const navegar = useNavigate();
  const exclusaoConcluida = Boolean((localizacao.state as { exclusaoConcluida?: boolean } | null)?.exclusaoConcluida);

  function dispensarConfirmacao() {
    navegar(`${localizacao.pathname}${localizacao.search}`, { replace: true, state: null, preventScrollReset: true });
  }
  const [unidades, definirUnidades] = useState<Unidade[]>([]);
  const [trechos, definirTrechos] = useState<Trecho[]>([]);
  const [ocorrencias, definirOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, definirCarregando] = useState(true);
  const [erro, definirErro] = useState('');
  const [tentativa, definirTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    const controle = new AbortController();
    definirCarregando(true);
    definirErro('');

    Promise.all([
      listarUnidades(controle.signal),
      listarTrechos(controle.signal),
      listarOcorrencias(controle.signal),
    ])
      .then(([listaUnidades, listaTrechos, listaOcorrencias]) => {
        if (!ativo) return;
        definirUnidades(listaUnidades);
        definirTrechos(listaTrechos);
        definirOcorrencias(listaOcorrencias);
      })
      .catch((falha: unknown) => {
        if (!ativo) return;
        definirErro(falha instanceof Error ? falha.message : 'Não foi possível carregar as ocorrências.');
      })
      .finally(() => { if (ativo) definirCarregando(false); });

    const pararObservacao = observarAlteracoes(() => definirTentativa((numero) => numero + 1));
    return () => { ativo = false; controle.abort(); pararObservacao(); };
  }, [tentativa]);

  const busca = parametros.get('busca') ?? '';
  const unidadeId = parametros.get('unidade') ?? '';
  const categoria = parametros.get('categoria') ?? '';
  const situacao = parametros.get('situacao') ?? '';
  const ordenacao = (['recentes', 'antigos', 'categoria'].includes(parametros.get('ordem') ?? '')
    ? parametros.get('ordem') : 'recentes') as Ordenacao;

  function atualizarFiltro(nome: string, valor: string) {
    const novos = new URLSearchParams(parametros);
    if (valor) novos.set(nome, valor);
    else novos.delete(nome);
    definirParametros(novos, { replace: true, preventScrollReset: true });
  }

  function limparFiltros() {
    definirParametros(new URLSearchParams(), { replace: true, preventScrollReset: true });
    document.getElementById('busca-ocorrencias')?.focus();
  }

  const filtradas = useMemo(() => {
    const termo = normalizar(busca);
    const nomes = new Map(unidades.map((unidade) => [String(unidade.id), unidade.nome]));
    const locais = new Map(trechos.map((trecho) => [String(trecho.id), trecho.nome]));

    return ocorrencias
      .filter((item) => {
        if (unidadeId && String(item.unidadeId) !== unidadeId) return false;
        if (categoria && item.categoria !== categoria) return false;
        if (situacao && item.situacao !== situacao) return false;
        if (!termo) return true;

        const texto = [item.id, item.categoria, item.descricao, item.referenciaLocal,
          nomes.get(String(item.unidadeId)), locais.get(String(item.trechoId))].join(' ');
        return normalizar(texto).includes(termo);
      })
      .sort((a, b) => {
        if (ordenacao === 'categoria') return a.categoria.localeCompare(b.categoria, 'pt-BR');
        const diferenca = b.dataRelato.localeCompare(a.dataRelato);
        if (diferenca !== 0) return ordenacao === 'antigos' ? -diferenca : diferenca;
        return String(b.id).localeCompare(String(a.id));
      });
  }, [ocorrencias, unidades, trechos, busca, unidadeId, categoria, situacao, ordenacao]);

  const filtrosAtivos = Boolean(busca || unidadeId || categoria || situacao || ordenacao !== 'recentes');
  const unidadesConhecidas = new Set(unidades.map((item) => String(item.id)));
  const unidadesComRelatos = new Set(ocorrencias.filter((item) => unidadesConhecidas.has(String(item.unidadeId))).map((item) => String(item.unidadeId))).size;
  const tiposRelatados = new Set(ocorrencias.map((item) => item.categoria)).size;
  // Campos com largura controlada para evitar que opções longas das UBS alarguem a tela no celular.
  const classeCampo = 'campo-consulta mt-2 max-sm:block max-sm:w-full max-sm:min-w-0 max-sm:max-w-full max-sm:rounded-xl max-sm:border max-sm:border-[#bdd8d1] max-sm:bg-[#fafffd] max-sm:px-4 max-sm:py-3 max-sm:text-base max-sm:text-[#0b2b3d] max-sm:shadow-sm max-sm:outline-none max-sm:focus:border-[#087f78] max-sm:focus:ring-2 max-sm:focus:ring-[#b0e4db]';

  return (
    <>
      <section className="relative isolate overflow-hidden border-b-4 border-[#ff8b63] bg-[#0b2b3d] py-16 text-white sm:py-20">
        <div className="padrao-calcada pointer-events-none absolute inset-0 opacity-55" aria-hidden="true" />
        <Container className="relative grid min-w-0 grid-cols-1 items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-3 text-xs font-extrabold tracking-[0.19em] text-[#ffb99d] uppercase sm:text-sm">
              <span aria-hidden="true" className="h-1 w-9 rounded-full bg-[#ff8b63]" /> Consulta cidadã
            </p>
            <h1 className="mt-6 max-w-3xl text-4xl leading-[1.09] font-extrabold tracking-[-0.05em] text-white sm:text-5xl lg:text-[3.5rem]">
              Veja os obstáculos relatados perto das UBS.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d4e9e7] sm:text-lg">
              Pesquise por unidade, local ou tipo de barreira. Consulte os detalhes e saiba a situação de cada relato.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/registrar" className="botao-destaque inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold">
                Registrar um obstáculo
              </Link>
              <Link to="/unidades" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#8db7b8] px-6 py-3 text-sm font-bold !text-white hover:bg-white/10 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffb99d]">
                Encontrar minha UBS
              </Link>
            </div>
          </div>

          <div className="relative mx-auto hidden w-full max-w-sm rounded-[2rem] border border-[#4e858b] bg-[#164355] p-6 shadow-[0_28px_60px_-42px_#000] lg:block" aria-hidden="true">
            <p className="text-xs font-black tracking-[0.15em] text-[#b6e9df] uppercase">Um caminho, vários relatos</p>
            <div className="mt-6 flex flex-col items-center gap-0">
              <div className="flex w-full items-center gap-3 rounded-xl border border-[#568c90] bg-[#205666] px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#dcf5ed] font-black text-[#0b2b3d]">01</span>
                <span className="font-bold text-white">UBS cadastrada</span>
              </div>
              <div className="h-7 w-1 rounded-full bg-[#ff8b63]" />
              <div className="flex w-[91%] items-center gap-3 rounded-xl border border-[#568c90] bg-[#205666] px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#dcf5ed] font-black text-[#0b2b3d]">02</span>
                <span className="font-bold text-white">Trecho de acesso</span>
              </div>
              <div className="h-7 w-1 rounded-full bg-[#ff8b63]" />
              <div className="flex w-[82%] items-center gap-3 rounded-xl border border-[#ff8b63] bg-[#296877] px-5 py-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ff8b63] font-black text-[#0b2b3d]">03</span>
                <span className="font-bold text-white">Ocorrência relatada</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-[#f7f8f5] py-12 sm:py-16" aria-labelledby="titulo-resultados">
        <Container>
          {exclusaoConcluida ? (
            <div role="status" aria-live="polite" className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border-2 border-[#76bda9] bg-[#e7f7ef] px-6 py-5">
              <p className="flex items-center gap-3 text-base font-extrabold text-[#0a5d4e]">
                <span aria-hidden="true" className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#0a6c58] text-xl !text-white">✓</span>
                Ocorrência excluída com sucesso.
              </p>
              <button type="button" onClick={dispensarConfirmacao} className="text-sm font-bold text-[#0a5d4e] underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0a5d4e]">
                Dispensar
              </button>
            </div>
          ) : null}
          <FonteDados />
          {!carregando && !erro ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#d1e5df] bg-white px-6 py-5">
                <p className="text-xs font-extrabold tracking-wider text-[#4b686b] uppercase">Relatos disponíveis</p>
                <p className="mt-1 text-3xl font-extrabold text-[#0b2b3d]">{ocorrencias.length}</p>
              </div>
              <div className="rounded-2xl border border-[#d1e5df] bg-white px-6 py-5">
                <p className="text-xs font-extrabold tracking-wider text-[#4b686b] uppercase">UBS com relatos</p>
                <p className="mt-1 text-3xl font-extrabold text-[#0b2b3d]">{unidadesComRelatos}</p>
              </div>
              <div className="rounded-2xl border border-[#d1e5df] bg-white px-6 py-5">
                <p className="text-xs font-extrabold tracking-wider text-[#4b686b] uppercase">Tipos relatados</p>
                <p className="mt-1 text-3xl font-extrabold text-[#0b2b3d]">{tiposRelatados}</p>
              </div>
            </div>
          ) : null}

          <div className="mt-8 grid min-w-0 grid-cols-1 items-start gap-7 lg:grid-cols-[18rem_minmax(0,1fr)]">
            <aside className="min-w-0 max-w-full rounded-[1.65rem] border border-[#cfdfdc] bg-white p-5 sm:p-6 shadow-[0_18px_36px_-33px_#0b2b3d]" aria-labelledby="titulo-filtros">
              <div className="flex items-center justify-between gap-3">
                <h2 id="titulo-filtros" className="text-xl font-extrabold text-[#0b2b3d]">Refinar consulta</h2>
                {filtrosAtivos ? <button type="button" onClick={limparFiltros} className="text-sm font-bold text-[#086e69] underline underline-offset-4 hover:text-[#0b2b3d] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f78]">Limpar</button> : null}
              </div>
              <p className="mt-2 text-sm leading-6 text-[#516e70]">Encontre os relatos mais relevantes para o seu trajeto.</p>
              <div className="mt-7 min-w-0 space-y-5">
                <div>
                  <label htmlFor="busca-ocorrencias" className="block text-sm font-bold text-[#0b2b3d]">Buscar nos relatos</label>
                  <input id="busca-ocorrencias" type="search" value={busca} onChange={(e) => atualizarFiltro('busca', e.target.value)} placeholder="Problema, trecho ou UBS" className={classeCampo} />
                </div>
                <div>
                  <label htmlFor="filtro-ubs" className="block text-sm font-bold text-[#0b2b3d]">Unidade de saúde</label>
                  <select id="filtro-ubs" value={unidadeId} onChange={(e) => atualizarFiltro('unidade', e.target.value)} className={classeCampo}>
                    <option value="">Todas as UBS</option>
                    {unidades.map((unidade) => <option key={unidade.id} value={String(unidade.id)}>{unidade.nome}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="filtro-categoria" className="block text-sm font-bold text-[#0b2b3d]">Tipo de obstáculo</label>
                  <select id="filtro-categoria" value={categoria} onChange={(e) => atualizarFiltro('categoria', e.target.value)} className={classeCampo}>
                    <option value="">Todos os tipos</option>
                    {categorias.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="filtro-situacao" className="block text-sm font-bold text-[#0b2b3d]">Situação do relato</label>
                  <select id="filtro-situacao" value={situacao} onChange={(e) => atualizarFiltro('situacao', e.target.value)} className={classeCampo}>
                    <option value="">Todas as situações</option>
                    {situacoes.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="filtro-ordenacao" className="block text-sm font-bold text-[#0b2b3d]">Ordenar por</label>
                  <select id="filtro-ordenacao" value={ordenacao} onChange={(e) => atualizarFiltro('ordem', e.target.value === 'recentes' ? '' : e.target.value)} className={classeCampo}>
                    <option value="recentes">Mais recentes</option>
                    <option value="antigos">Mais antigos</option>
                    <option value="categoria">Tipo de obstáculo (A–Z)</option>
                  </select>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-black tracking-[0.14em] text-[#087f78] uppercase">Consulta pública</p>
                  <h2 id="titulo-resultados" className="mt-1 text-2xl font-extrabold text-[#0b2b3d] sm:text-3xl">Ocorrências</h2>
                </div>
                {!carregando && !erro ? (
                  <p role="status" className="inline-flex w-fit items-center rounded-full border border-[#c7ddd5] bg-white px-4 py-2 text-sm font-bold text-[#0b555e]" aria-live="polite">
                    {filtradas.length} {filtradas.length === 1 ? 'relato encontrado' : 'relatos encontrados'}
                  </p>
                ) : null}
              </div>

              {carregando ? <div className="mt-6"><EstadoConsulta tipo="carregando" mensagem="Buscando as ocorrências cadastradas..." /></div> : null}
              {!carregando && erro ? <div className="mt-6"><EstadoConsulta tipo="erro" mensagem={erro} tentarNovamente={() => definirTentativa((n) => n + 1)} /></div> : null}
              {!carregando && !erro && ocorrencias.length === 0 ? (
                <div className="mt-6"><EstadoConsulta tipo="vazio" mensagem="Nenhuma ocorrência foi registrada nas unidades cadastradas. A ausência de relatos não garante que o caminho esteja livre de obstáculos." /></div>
              ) : null}
              {!carregando && !erro && ocorrencias.length > 0 && filtradas.length === 0 ? (
                <div className="mt-6 rounded-[1.5rem] border border-[#d5e5e2] bg-white px-6 py-10 text-center">
                  <p className="text-xl font-extrabold text-[#0b2b3d]">Nenhum resultado para esses filtros.</p>
                  <p className="mt-3 text-sm leading-7 text-[#526e70]">Tente outra UBS, palavra ou categoria para ampliar sua consulta.</p>
                  <button type="button" onClick={limparFiltros} className="botao-secundario mt-5 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2 text-sm font-bold">Limpar filtros</button>
                </div>
              ) : null}
              {!carregando && !erro && filtradas.length > 0 ? (
                <div className="mt-6 grid gap-5 xl:grid-cols-2">
                  {filtradas.map((ocorrencia) => {
                    const unidade = unidades.find((item) => String(item.id) === String(ocorrencia.unidadeId));
                    const trecho = trechos.find((item) => String(item.id) === String(ocorrencia.trechoId));
                    return (
                      <CartaoOcorrencia
                        key={String(ocorrencia.id)}
                        ocorrencia={ocorrencia}
                        nomeUnidade={unidade?.nome ?? 'UBS não identificada'}
                        nomeTrecho={trecho?.nome ?? 'Trecho não identificado'}
                      />
                    );
                  })}
                </div>
              ) : null}
              <p className="mt-8 text-sm leading-7 text-[#536f71]">Os registros representam observações sobre um trecho, não uma avaliação completa de acessibilidade da unidade.</p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
