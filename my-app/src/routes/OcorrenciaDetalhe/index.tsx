import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import EstadoConsulta from '../../components/EstadoConsulta/EstadoConsulta';
import FonteDados from '../../components/EstadoConsulta/FonteDados';
import SeloSituacao from '../../components/SeloSituacao/SeloSituacao';
import { buscarOcorrencia, excluirOcorrencia, listarTrechos, listarUnidades, observarAlteracoes, usandoApi } from '../../services/ocorrencias';
import type { Ocorrencia, Trecho, Unidade } from '../../types/estrutura';

export default function OcorrenciaDetalhe() {
  const { id = '' } = useParams();
  const navegar = useNavigate();
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia>();
  const [unidade, setUnidade] = useState<Unidade>();
  const [trecho, setTrecho] = useState<Trecho>();
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erroExclusao, setErroExclusao] = useState('');
  const requisicaoEmAndamento = useRef(false);
  const botaoExcluir = useRef<HTMLButtonElement>(null);
  const botaoCancelar = useRef<HTMLButtonElement>(null);
  const dialogo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ativo = true;
    const controle = new AbortController();
    setCarregando(true);
    setErro('');
    Promise.all([buscarOcorrencia(id, controle.signal), listarUnidades(controle.signal), listarTrechos(controle.signal)])
      .then(([registro, unidades, trechos]) => {
        if (!ativo) return;
        setOcorrencia(registro);
        setUnidade(unidades.find((item) => String(item.id) === String(registro?.unidadeId)));
        setTrecho(trechos.find((item) => String(item.id) === String(registro?.trechoId)));
      })
      .catch((falha: unknown) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Falha na consulta da ocorrência.'); })
      .finally(() => { if (ativo) setCarregando(false); });
    const pararObservacao = observarAlteracoes(() => setTentativa((valor) => valor + 1));
    return () => { ativo = false; controle.abort(); pararObservacao(); };
  }, [id, tentativa]);

  // A caixa de confirmação retém o foco e aceita Escape enquanto não há exclusão em andamento.
  useEffect(() => {
    if (!confirmandoExclusao) return;
    if (excluindo) dialogo.current?.focus();
    else botaoCancelar.current?.focus();
    const rolagemAnterior = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    function teclado(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        if (!excluindo) fecharConfirmacao();
      }
      if (evento.key !== 'Tab') return;
      const botoes = Array.from(dialogo.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);
      if (!botoes.length) {
        evento.preventDefault();
        return;
      }
      const primeiro = botoes[0];
      const ultimo = botoes[botoes.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }
    document.addEventListener('keydown', teclado);
    return () => {
      document.removeEventListener('keydown', teclado);
      document.body.style.overflow = rolagemAnterior;
    };
  }, [confirmandoExclusao, excluindo]);

  function fecharConfirmacao() {
    if (requisicaoEmAndamento.current) return;
    setConfirmandoExclusao(false);
    setErroExclusao('');
    botaoExcluir.current?.focus();
  }

  async function confirmarExclusao() {
    if (requisicaoEmAndamento.current || !usandoApi) return;
    requisicaoEmAndamento.current = true;
    setExcluindo(true);
    setErroExclusao('');
    try {
      await excluirOcorrencia(id);
      // O servidor confirmou o DELETE (204). A listagem fará novo GET, sem cache local.
      navegar('/ocorrencias', { replace: true, state: { exclusaoConcluida: true } });
    } catch (falha) {
      setErroExclusao(falha instanceof Error ? falha.message : 'Não foi possível excluir a ocorrência.');
    } finally {
      requisicaoEmAndamento.current = false;
      setExcluindo(false);
    }
  }

  if (carregando) return <Container className="py-18"><EstadoConsulta tipo="carregando" mensagem="Buscando informações da ocorrência..." /></Container>;
  if (erro) return <Container className="py-18"><EstadoConsulta tipo="erro" mensagem={erro} tentarNovamente={() => setTentativa((valor) => valor + 1)} /></Container>;
  if (!ocorrencia) return (
    <Container className="py-20 text-center"><h1 className="text-3xl font-extrabold text-[#0b2b3d]">Ocorrência não encontrada</h1>
      <p className="mt-3 text-[#48686b]">Não há relato com este identificador.</p>
      <Link to="/ocorrencias" className="botao-primario mt-6 inline-flex rounded-xl px-6 py-3 font-bold">Consultar outras ocorrências</Link></Container>
  );

  const detalhes = [
    { titulo: 'Categoria', valor: ocorrencia.categoria },
    { titulo: 'Condição da passagem', valor: ocorrencia.passagem },
    { titulo: 'Largura livre informada', valor: ocorrencia.larguraLivre },
    { titulo: 'Altura do desnível informada', valor: ocorrencia.alturaDesnivel },
    { titulo: 'Distância informada', valor: ocorrencia.distanciaEntrada },
    { titulo: 'Impedimento', valor: ocorrencia.impedimento },
  ].filter((item) => Boolean(item.valor));

  return (
    <>
      <section className="padrao-piso border-b border-[#d9e5e1] bg-[#eef5f3] py-14 sm:py-20">
        <Container className="text-center">
          <p className="text-xs font-black tracking-[0.18em] text-[#087f78] uppercase">Ocorrência {String(ocorrencia.id).toUpperCase()}</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-[#0b2b3d] sm:text-5xl">{ocorrencia.categoria}</h1>
          <p className="mt-4 text-base text-[#48686b] sm:text-lg">{unidade?.nome ?? 'Unidade não identificada'} · {trecho?.nome ?? 'Trecho não identificado'}</p>
          <div className="mt-6 flex justify-center"><SeloSituacao situacao={ocorrencia.situacao} /></div>
        </Container>
      </section>
      <section className="py-12 sm:py-16">
        <Container>
          <FonteDados />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[1.6rem] border border-[#d7e4e1] bg-white p-6 sm:p-8">
              <p className="text-xs font-black tracking-[0.14em] text-[#087f78] uppercase">Descrição enviada</p>
              <h2 className="mt-2 text-2xl font-extrabold text-[#0b2b3d]">O que foi observado</h2>
              <p className="mt-5 whitespace-pre-wrap break-words text-base leading-8 text-[#48686b]">{ocorrencia.descricao}</p>
              {ocorrencia.situacao === 'Relatada' ? (
                <p className="mt-7 rounded-xl border border-[#dbdfca] bg-[#fffbf1] px-4 py-3 text-sm leading-7 text-[#67563e]">Este registro é um relato comunitário e ainda não foi verificado de forma independente.</p>
              ) : null}
            </article>
            <aside className="rounded-[1.6rem] bg-[#0b2b3d] p-6 text-white sm:p-8">
              <p className="text-xs font-black tracking-[0.14em] text-[#ffb69a] uppercase">Local e registro</p>
              <dl className="mt-6 space-y-5">
                <div><dt className="text-sm text-[#bcdad9]">UBS</dt><dd className="mt-1 font-bold text-white">{unidade?.nome ?? 'Não identificada'}</dd></div>
                <div><dt className="text-sm text-[#bcdad9]">Trecho de acesso</dt><dd className="mt-1 font-bold text-white">{trecho?.nome ?? 'Não identificado'}</dd></div>
                <div><dt className="text-sm text-[#bcdad9]">Ponto aproximado informado pelo cidadão</dt><dd className="mt-1 break-words font-bold text-white">{ocorrencia.referenciaLocal?.trim() || 'Não informado neste relato'}</dd></div>
                <div><dt className="text-sm text-[#bcdad9]">Data do relato</dt><dd className="mt-1 font-bold text-white">{new Date(`${ocorrencia.dataRelato}T00:00:00`).toLocaleDateString('pt-BR')}</dd></div>
              </dl>
            </aside>
          </div>
          {detalhes.length ? (
            <section className="mt-6 rounded-[1.6rem] border border-[#d7e4e1] bg-white p-6 sm:p-8" aria-labelledby="detalhes-relato">
              <h2 id="detalhes-relato" className="text-xl font-extrabold text-[#0b2b3d]">Informações complementares</h2>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {detalhes.map((item) => <div key={item.titulo} className="rounded-xl bg-[#f2f8f6] p-4"><dt className="text-xs font-extrabold tracking-wider text-[#4c696e] uppercase">{item.titulo}</dt><dd className="mt-2 break-words font-semibold text-[#0b2b3d]">{item.valor}</dd></div>)}
              </dl>
            </section>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/ocorrencias" className="botao-destaque inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-extrabold">Ver outras ocorrências</Link>
            <Link to={unidade ? `/unidades/${unidade.id}` : '/unidades'} className="botao-primario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Ver unidade de saúde</Link>
            <Link to={`/registrar${unidade ? `?unidade=${encodeURIComponent(String(unidade.id))}` : ''}`} className="botao-secundario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Informar outro obstáculo</Link>
            {usandoApi ? (
              <button ref={botaoExcluir} type="button" onClick={() => { setErroExclusao(''); setConfirmandoExclusao(true); }}
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#b94e58] bg-white px-6 py-3 text-sm font-extrabold !text-[#9b243b] transition-colors hover:bg-[#fff1f2] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#9b243b]">
                Excluir ocorrência
              </button>
            ) : null}
          </div>
          {confirmandoExclusao && usandoApi ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#061c29]/75 p-4" role="presentation">
              <div ref={dialogo} role="alertdialog" tabIndex={-1} aria-modal="true" aria-labelledby="titulo-exclusao" aria-describedby="descricao-exclusao"
                className="w-full max-w-lg rounded-[1.6rem] border border-[#e8d8d8] bg-white p-6 shadow-2xl sm:p-8">
                <p className="text-xs font-extrabold tracking-[0.15em] text-[#9b243b] uppercase">Ação irreversível</p>
                <h2 id="titulo-exclusao" className="mt-3 text-2xl font-extrabold text-[#0b2b3d]">Excluir esta ocorrência?</h2>
                <p id="descricao-exclusao" className="mt-4 text-base leading-7 text-[#476467]">
                  O relato <strong>{ocorrencia.id}</strong> será excluído definitivamente do banco de dados.
                  Esta ação não remove a UBS nem o trecho associado.
                </p>
                {erroExclusao ? (
                  <p role="alert" className="mt-5 rounded-xl border border-[#edc5ca] bg-[#fff4f5] px-4 py-3 text-sm leading-7 font-semibold text-[#8f3048]">{erroExclusao}</p>
                ) : null}
                <div className="mt-7 flex flex-wrap gap-3">
                  <button ref={botaoCancelar} type="button" disabled={excluindo} onClick={fecharConfirmacao}
                    className="botao-secundario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-60">Cancelar</button>
                  <button type="button" disabled={excluindo} onClick={confirmarExclusao}
                    className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#a52b43] px-6 py-3 text-sm font-extrabold !text-white transition-colors hover:bg-[#822035] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#a52b43] disabled:cursor-wait disabled:opacity-60">
                    {excluindo ? 'Excluindo...' : 'Excluir definitivamente'}
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
