import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import EstadoConsulta from '../../components/EstadoConsulta/EstadoConsulta';
import { buscarOcorrencia, usandoApi } from '../../services/ocorrencias';
import type { Ocorrencia, ResultadoCadastro } from '../../types/estrutura';

type EstadoNavegacao = ResultadoCadastro | null;

export default function Confirmacao() {
  const { id } = useParams();
  const localizacao = useLocation();
  const resultado = localizacao.state as EstadoNavegacao;
  const [ocorrencia, setOcorrencia] = useState<Ocorrencia>();
  const [carregando, setCarregando] = useState(Boolean(id));
  const [erro, setErro] = useState('');
  const [tentativa, setTentativa] = useState(0);

  useEffect(() => {
    if (!id) { setCarregando(false); return; }
    let ativo = true;
    const controle = new AbortController();
    setCarregando(true);
    setErro('');
    buscarOcorrencia(id, controle.signal)
      .then((item) => { if (ativo) setOcorrencia(item); })
      .catch((falha: unknown) => { if (ativo) setErro(falha instanceof Error ? falha.message : 'Falha ao buscar o relato.'); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; controle.abort(); };
  }, [id, tentativa]);

  const origemConfirmada = resultado?.destino;
  const comprovado = origemConfirmada || (id && ocorrencia ? (usandoApi ? 'api' : 'local') : undefined);

  if (!comprovado && carregando) return (
    <Container className="py-20"><EstadoConsulta tipo="carregando" mensagem="Buscando o registro solicitado..." /></Container>
  );
  if (!comprovado && erro) return (
    <Container className="py-20"><EstadoConsulta tipo="erro" mensagem={erro} tentarNovamente={() => setTentativa((valor) => valor + 1)} /></Container>
  );
  if (!comprovado) return (
    <Container className="py-20 text-center">
      <h1 className="text-3xl font-extrabold text-[#0b2b3d]">Confirmação indisponível</h1>
      <p className="mt-3 text-[#48686b]">Abra a listagem para consultar os registros cadastrados.</p>
      <Link className="botao-primario mt-6 inline-flex rounded-xl px-6 py-3 font-bold" to="/ocorrencias">Consultar ocorrências</Link>
    </Container>
  );

  return (
    <section className="padrao-piso bg-[#f5f9f7] py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="rounded-[2rem] border border-[#d4e3df] bg-white px-6 py-10 text-center shadow-[0_22px_55px_-40px_#0b2b3d] sm:px-12">
          <span aria-hidden="true" className="mx-auto flex size-18 items-center justify-center rounded-full bg-[#e2f4ed] text-[#087f78]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="size-9" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 4 4L19 6" /></svg>
          </span>
          <p className="mt-6 text-xs font-extrabold tracking-[0.17em] text-[#087f78] uppercase">Confirmação de envio</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b2b3d] sm:text-4xl">{!origemConfirmada ? 'Relato disponível para consulta.' : comprovado === 'local' ? 'Seu relato foi salvo.' : 'Seu relato foi recebido.'}</h1>
          {!origemConfirmada ? (
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#48686b]">Este registro foi localizado entre as ocorrências disponíveis. Você pode abrir os detalhes ou explorar outros relatos.</p>
          ) : comprovado === 'local' ? (
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#48686b]">O registro foi salvo neste navegador. Ele aparecerá nas consultas realizadas aqui, mas não está disponível para outras pessoas.</p>
          ) : (
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-[#48686b]">O serviço confirmou o recebimento do registro. Consulte a unidade para acompanhar os relatos.</p>
          )}
          {id ? <p className="mt-4 break-all text-sm font-semibold text-[#446569]">Identificador: {id}</p> : null}
          {carregando ? <div className="mt-7"><EstadoConsulta tipo="carregando" mensagem="Buscando o novo relato..." /></div> : null}
          {erro ? <div className="mt-7"><EstadoConsulta tipo="erro" mensagem={erro} tentarNovamente={() => setTentativa((valor) => valor + 1)} /></div> : null}
          {!carregando && !erro && !ocorrencia && id ? <p className="mt-5 text-sm leading-7 text-[#49686b]">O relato foi recebido, mas ainda não está disponível para consulta. Atualize a listagem mais tarde.</p> : null}
          {ocorrencia ? (
            <div className="mt-7 rounded-2xl bg-[#f2f8f6] p-5 text-left">
              <p className="text-xs font-black tracking-wider text-[#087f78] uppercase">Relato cadastrado</p>
              <p className="mt-2 font-bold text-[#0b2b3d]">{ocorrencia.categoria}</p>
              <p className="mt-2 text-sm leading-7 text-[#49686b]">{ocorrencia.descricao}</p>
              <p className="mt-3 break-words text-sm leading-7 text-[#315c63]"><strong>Ponto aproximado:</strong> {ocorrencia.referenciaLocal?.trim() || 'não informado neste relato'}</p>
            </div>
          ) : null}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {id && ocorrencia ? <Link to={`/ocorrencias/${encodeURIComponent(id)}`} className="botao-primario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Ver detalhes do relato</Link> : null}
            <Link to="/ocorrencias" className="botao-secundario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Consultar todas as ocorrências</Link>
            <Link to="/registrar" className="botao-secundario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Fazer outro relato</Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
