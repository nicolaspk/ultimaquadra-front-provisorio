import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import CartaoOcorrencia from '../../components/CartaoOcorrencia/CartaoOcorrencia';
import Container from '../../components/Container/Container';
import EstadoConsulta from '../../components/EstadoConsulta/EstadoConsulta';
import FonteDados from '../../components/EstadoConsulta/FonteDados';
import { listarOcorrencias, listarTrechos, listarUnidades, observarAlteracoes, trechoExigeReferencia } from '../../services/ocorrencias';
import type { Ocorrencia, Trecho, Unidade } from '../../types/estrutura';

export default function UnidadeDetalhe() {
  const { id = '' } = useParams();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [trechos, setTrechos] = useState<Trecho[]>([]);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    let ativo = true;
    const controle = new AbortController();
    setCarregando(true);
    setErro('');

    Promise.all([listarUnidades(controle.signal), listarTrechos(controle.signal), listarOcorrencias(controle.signal)])
      .then(([resultadoUnidades, resultadoTrechos, resultadoOcorrencias]) => {
        if (!ativo) return;
        setUnidades(resultadoUnidades);
        setTrechos(resultadoTrechos);
        setOcorrencias(resultadoOcorrencias);
      })
      .catch((falha: unknown) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Falha ao carregar a unidade.'); })
      .finally(() => { if (ativo) setCarregando(false); });

    const pararObservacao = observarAlteracoes(() => setTentativa((valor) => valor + 1));
    return () => { ativo = false; controle.abort(); pararObservacao(); };
  }, [id, tentativa]);

  const unidade = unidades.find((item) => String(item.id) === id);
  const trechosDaUnidade = useMemo(() => trechos.filter((trecho) => String(trecho.unidadeId) === id), [id, trechos]);
  const ocorrenciasDaUnidade = useMemo(() => ocorrencias.filter((item) => String(item.unidadeId) === id), [id, ocorrencias]);

  if (carregando) return <Container className="py-18"><EstadoConsulta tipo="carregando" mensagem="Carregando os trechos e relatos da unidade..." /></Container>;
  if (erro) return <Container className="py-18"><EstadoConsulta tipo="erro" mensagem={erro} tentarNovamente={() => setTentativa((valor) => valor + 1)} /></Container>;
  if (!unidade) return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-extrabold text-[#0b2b3d]">Unidade não encontrada</h1>
      <p className="mt-3 text-[#4c6869]">Esta UBS não consta na lista disponível.</p>
      <Link className="botao-primario mt-6 inline-flex rounded-xl px-6 py-3 font-bold" to="/unidades">Ver unidades</Link>
    </Container>
  );

  return (
    <>
      <section className="padrao-piso border-b border-[#d9e6e2] bg-[#edf5f3] py-14 sm:py-20">
        <Container className="text-center">
          <p className="text-xs font-black tracking-[0.18em] text-[#087f78] uppercase">Unidade de saúde</p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl leading-tight font-extrabold tracking-tight text-[#0b2b3d] sm:text-5xl">{unidade.nome}</h1>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-[#48686b] sm:text-lg">{unidade.bairro} · {unidade.referencia}</p>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-7 text-[#587477]">{unidade.endereco}</p>
          <p className="mx-auto mt-2 max-w-3xl text-sm leading-7 text-[#587477]">{unidade.descricao}{unidade.cnes ? ` · CNES ${unidade.cnes}` : ''}</p>
          <div className="mx-auto mt-8 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-2xl border border-[#d2e4de] bg-white p-4"><strong className="text-2xl text-[#0b2b3d]">{trechosDaUnidade.length}</strong><span className="mt-1 block text-sm text-[#527075]">Trechos</span></div>
            <div className="rounded-2xl border border-[#d2e4de] bg-white p-4"><strong className="text-2xl text-[#0b2b3d]">{ocorrenciasDaUnidade.length}</strong><span className="mt-1 block text-sm text-[#527075]">Relatos</span></div>
          </div>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <FonteDados />
          <div className="mt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div><p className="text-xs font-black tracking-widest text-[#087f78] uppercase">Trechos de acesso</p><h2 className="mt-2 text-3xl font-extrabold text-[#0b2b3d]">Relatos por local</h2></div>
            <div className="flex flex-wrap gap-3">
              <Link to={`/ocorrencias?unidade=${encodeURIComponent(id)}`} className="botao-destaque inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-extrabold">Ver relatos desta UBS</Link>
              {unidade.ativa !== false && trechosDaUnidade.some((trecho) => trecho.ativo !== false) ? (
                <Link to={`/registrar?unidade=${encodeURIComponent(id)}`} className="botao-primario inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-sm font-bold">Registrar nesta UBS</Link>
              ) : <span className="text-sm font-semibold text-[#537175]">Novos relatos indisponíveis nesta UBS</span>}
            </div>
          </div>
          {!trechosDaUnidade.length ? <div className="mt-8"><EstadoConsulta tipo="vazio" mensagem="Esta unidade ainda não possui trechos de acesso cadastrados." /></div> : null}
          <div className="mt-8 space-y-6">
            {trechosDaUnidade.map((trecho) => {
              const relatosDoTrecho = ocorrenciasDaUnidade.filter((item) => String(item.trechoId) === String(trecho.id));
              return (
                <section key={trecho.id} className="overflow-hidden rounded-[1.7rem] border border-[#d2e3e1] bg-white shadow-[0_16px_35px_-30px_#0b2b3d]" aria-labelledby={`titulo-${trecho.id}`}>
                  <div className="border-l-5 border-[#ff8b63] bg-[#f4f9f7] px-6 py-5 sm:px-8">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div><p className="text-xs font-black tracking-widest text-[#087f78] uppercase">Trecho de acesso</p><h3 id={`titulo-${trecho.id}`} className="mt-1 text-xl font-extrabold text-[#0b2b3d] sm:text-2xl">{trecho.nome}</h3><p className="mt-2 leading-7 text-[#48686b]">{trecho.descricao}</p>{trechoExigeReferencia(trecho) ? <p className="mt-2 text-sm font-semibold leading-6 text-[#35656b]">A localização aproximada de cada obstáculo depende do ponto de referência fornecido no relato.</p> : null}</div>
                      {unidade.ativa !== false && trecho.ativo !== false ? (
                        <Link to={`/registrar?unidade=${encodeURIComponent(id)}&trecho=${encodeURIComponent(String(trecho.id))}`} className="botao-secundario inline-flex min-h-11 shrink-0 items-center self-start rounded-xl px-4 py-2 text-sm font-bold">Relatar aqui</Link>
                      ) : <span className="text-sm font-semibold text-[#537175]">Área indisponível para novos relatos</span>}
                    </div>
                  </div>
                  <div className="grid gap-4 p-5 sm:p-7 lg:grid-cols-2">
                    {relatosDoTrecho.length ? relatosDoTrecho.map((relato) => (
                      <CartaoOcorrencia key={relato.id} ocorrencia={relato} nomeTrecho={trecho.nome} />
                    )) : <div className="lg:col-span-2"><EstadoConsulta tipo="vazio" mensagem="Nenhum obstáculo foi relatado neste trecho. Isso não significa que ele esteja livre de barreiras." /></div>}
                  </div>
                </section>
              );
            })}
          </div>
        </Container>
      </section>
    </>
  );
}
