import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import CartaoUnidade from '../../components/CartaoUnidade/CartaoUnidade';
import Container from '../../components/Container/Container';
import EstadoConsulta from '../../components/EstadoConsulta/EstadoConsulta';
import FonteDados from '../../components/EstadoConsulta/FonteDados';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { listarOcorrencias, listarTrechos, listarUnidades, observarAlteracoes } from '../../services/ocorrencias';
import type { Ocorrencia, Trecho, Unidade } from '../../types/estrutura';

export default function Unidades() {
  const [filtro, setFiltro] = useState('');
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

    Promise.all([
      listarUnidades(controle.signal),
      listarTrechos(controle.signal),
      listarOcorrencias(controle.signal),
    ])
      .then(([resultadoUnidades, resultadoTrechos, resultadoOcorrencias]) => {
        if (!ativo) return;
        setUnidades(resultadoUnidades);
        setTrechos(resultadoTrechos);
        setOcorrencias(resultadoOcorrencias);
      })
      .catch((falha: unknown) => {
        if (!ativo) return;
        setErro(falha instanceof Error ? falha.message : 'Não foi possível consultar as unidades.');
      })
      .finally(() => { if (ativo) setCarregando(false); });

    const pararObservacao = observarAlteracoes(() => setTentativa((valor) => valor + 1));
    return () => { ativo = false; controle.abort(); pararObservacao(); };
  }, [tentativa]);

  const unidadesFiltradas = useMemo(() => {
    const normalizar = (valor: string) => valor.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    const termo = normalizar(filtro);
    return unidades.filter((unidade) =>
      normalizar(`${unidade.nome} ${unidade.bairro} ${unidade.referencia} ${unidade.cnes ?? ''}`).includes(termo)
    );
  }, [filtro, unidades]);

  return (
    <>
      <TituloPagina etiqueta="Unidades de saúde" titulo="Encontre a UBS e conheça seu caminho de acesso."
        descricao="Escolha uma unidade cadastrada para visualizar os trechos próximos à entrada e os obstáculos relatados." />

      <section className="py-12 sm:py-16">
        <Container>
          <FonteDados />
          <div className="mt-6 flex flex-col gap-4 rounded-[1.5rem] border-l-5 border-[#ff8b63] bg-[#0b2b3d] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-black tracking-[0.14em] text-[#ffb99d] uppercase">Outra forma de consultar</p>
              <h2 className="mt-2 text-xl font-extrabold text-white">Ver todos os obstáculos relatados</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#d1e7e5]">Pesquise relatos de diferentes UBS por tipo, situação e trecho.</p>
            </div>
            <Link to="/ocorrencias" className="botao-destaque inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-xl px-5 py-3 text-sm font-extrabold sm:self-auto">Consultar ocorrências</Link>
          </div>
          <div className="mt-6 rounded-[1.75rem] border border-[#d5e3e0] bg-white p-6 shadow-[0_16px_32px_-29px_#0b2b3d] sm:p-7">
            <label htmlFor="filtro-unidade" className="text-sm font-extrabold tracking-[0.1em] text-[#0b555e] uppercase">Buscar unidade</label>
            <input id="filtro-unidade" type="search" value={filtro} onChange={(evento) => setFiltro(evento.target.value)}
              placeholder="Nome ou bairro da UBS" className="mt-3 block min-h-12 w-full rounded-xl border border-[#bcd2d0] bg-[#fafdfc] px-4 text-base text-[#0b2b3d] outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#a3e2db]" />
            <p className="mt-3 text-sm text-[#526e70]">O piloto reúne sete UBS reais na região central de São Paulo. Os endereços podem ser consultados na <a href="https://smartsampa.prefeitura.sp.gov.br/documents/d/saude/unid_munic_saude_sub_setembro2026" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#087f78] underline underline-offset-4">relação municipal de setembro de 2026</a>.</p>
          </div>

          {carregando ? <div className="mt-8"><EstadoConsulta tipo="carregando" mensagem="Consultando as unidades e ocorrências..." /></div> : null}
          {!carregando && erro ? <div className="mt-8"><EstadoConsulta tipo="erro" mensagem={erro} tentarNovamente={() => setTentativa((valor) => valor + 1)} /></div> : null}
          {!carregando && !erro && unidades.length === 0 ? <div className="mt-8"><EstadoConsulta tipo="vazio" mensagem="Nenhuma UBS foi cadastrada para consulta até o momento." /></div> : null}

          {!carregando && !erro && unidades.length > 0 ? (
            <>
              <p role="status" className="mt-9 text-sm font-bold text-[#315c63]">
                {unidadesFiltradas.length} {unidadesFiltradas.length === 1 ? 'unidade encontrada' : 'unidades encontradas'}
              </p>
              {unidadesFiltradas.length ? (
                <div className="mt-5 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
                  {unidadesFiltradas.map((unidade) => (
                    <CartaoUnidade key={unidade.id} unidade={unidade}
                      totalTrechos={trechos.filter((trecho) => trecho.unidadeId === unidade.id).length}
                      totalOcorrencias={ocorrencias.filter((ocorrencia) => ocorrencia.unidadeId === unidade.id).length} />
                  ))}
                </div>
              ) : (
                <div className="mt-5"><EstadoConsulta tipo="vazio" mensagem="Não encontramos essa UBS entre as unidades cadastradas. Tente outro nome ou bairro." /></div>
              )}
            </>
          ) : null}
        </Container>
      </section>
    </>
  );
}
