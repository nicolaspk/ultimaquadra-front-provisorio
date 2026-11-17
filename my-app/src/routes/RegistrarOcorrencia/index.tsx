import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Container from '../../components/Container/Container';
import EstadoConsulta from '../../components/EstadoConsulta/EstadoConsulta';
import FonteDados from '../../components/EstadoConsulta/FonteDados';
import TituloPagina from '../../components/TituloPagina/TituloPagina';
import { cadastrarOcorrencia, listarTrechos, listarUnidades, referenciaLocalClara, trechoExigeReferencia } from '../../services/ocorrencias';
import { ErroApi } from '../../services/api';
import type { CategoriaObstaculo, NovoRelato, Ocorrencia, Trecho, Unidade } from '../../types/estrutura';

type DadosFormulario = {
  unidadeId: string;
  trechoId: string;
  categoria: string;
  descricao: string;
  referenciaLocal: string;
  passagem: string;
};

type CampoObrigatorio = 'unidadeId' | 'trechoId' | 'categoria' | 'descricao' | 'referenciaLocal';
type ErrosFormulario = Partial<Record<CampoObrigatorio, string>>;

const categorias: CategoriaObstaculo[] = [
  'Buraco', 'Desnível', 'Passagem estreita', 'Obstáculo fixo', 'Obstáculo temporário',
  'Pavimentação irregular', 'Ausência de rebaixamento', 'Outros',
];

const estadoInicial: DadosFormulario = {
  unidadeId: '', trechoId: '', categoria: '', descricao: '', referenciaLocal: '', passagem: '',
};

export default function RegistrarOcorrencia() {
  const navegar = useNavigate();
  const [parametros] = useSearchParams();
  const [unidades, setUnidades] = useState<Unidade[]>([]);
  const [trechos, setTrechos] = useState<Trecho[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erroConsulta, setErroConsulta] = useState('');
  const [tentativa, setTentativa] = useState(0);
  const [dados, setDados] = useState<DadosFormulario>({
    ...estadoInicial,
    unidadeId: parametros.get('unidade') ?? '',
    trechoId: parametros.get('trecho') ?? '',
  });
  const [erros, setErros] = useState<ErrosFormulario>({});
  const [revisando, setRevisando] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState('');
  const painelRevisao = useRef<HTMLDivElement>(null);
  const formulario = useRef<HTMLFormElement>(null);
  const [focarPrimeiroErro, setFocarPrimeiroErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    const controle = new AbortController();
    setCarregando(true);
    setErroConsulta('');
    Promise.all([listarUnidades(controle.signal), listarTrechos(controle.signal)])
      .then(([resultadoUnidades, resultadoTrechos]) => {
        if (!ativo) return;
        setUnidades(resultadoUnidades);
        setTrechos(resultadoTrechos);
      })
      .catch((falha: unknown) => { if (ativo) setErroConsulta(falha instanceof Error ? falha.message : 'Não foi possível carregar as UBS.'); })
      .finally(() => { if (ativo) setCarregando(false); });
    return () => { ativo = false; controle.abort(); };
  }, [tentativa]);

  useEffect(() => { if (revisando) painelRevisao.current?.focus(); }, [revisando]);

  useEffect(() => {
    if (!focarPrimeiroErro) return;
    formulario.current?.querySelector<HTMLElement>('[aria-invalid="true"]:not(:disabled)')?.focus();
    setFocarPrimeiroErro(false);
  }, [erros, focarPrimeiroErro]);

  const unidadeDaUrl = parametros.get('unidade') ?? '';
  const trechoDaUrl = parametros.get('trecho') ?? '';
  useEffect(() => {
    setDados((anterior) => ({ ...anterior, unidadeId: unidadeDaUrl, trechoId: trechoDaUrl }));
    setErros({});
    setRevisando(false);
  }, [unidadeDaUrl, trechoDaUrl]);

  const unidadesDisponiveis = useMemo(() => unidades.filter((item) => item.ativa !== false), [unidades]);
  const trechosDisponiveis = useMemo(() => trechos.filter((item) =>
    String(item.unidadeId) === dados.unidadeId && item.ativo !== false
  ), [dados.unidadeId, trechos]);
  const unidadeSelecionada = unidadesDisponiveis.find((item) => String(item.id) === dados.unidadeId);
  const trechoSelecionado = trechosDisponiveis.find((item) => String(item.id) === dados.trechoId);
  const referenciaObrigatoria = trechoExigeReferencia(trechoSelecionado);

  // Se o piloto possui um único setor de acesso para a UBS, não exige uma escolha redundante.
  useEffect(() => {
    if (!dados.trechoId && trechosDisponiveis.length === 1) {
      setDados((anterior) => ({ ...anterior, trechoId: String(trechosDisponiveis[0].id) }));
    }
  }, [dados.trechoId, trechosDisponiveis]);

  function atualizarCampo(evento: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = evento.target;
    setDados((anterior) => ({
      ...anterior,
      [name]: value,
      ...(name === 'unidadeId' ? { trechoId: '' } : {}),
    }));
    setErros((anterior) => ({ ...anterior, [name]: undefined, ...(name === 'unidadeId' ? { trechoId: undefined } : {}) }));
    setRevisando(false);
    setErroEnvio('');
  }

  function validarFormulario(): boolean {
    const proximosErros: ErrosFormulario = {};
    if (!unidadeSelecionada) proximosErros.unidadeId = 'Selecione uma UBS ativa e disponível para novos relatos.';
    if (!trechoSelecionado) proximosErros.trechoId = 'Selecione a área de acesso em que está o obstáculo.';
    if (!categorias.includes(dados.categoria as CategoriaObstaculo)) proximosErros.categoria = 'Selecione o tipo de obstáculo.';
    if (dados.descricao.trim().length < 15) proximosErros.descricao = 'Descreva o problema com pelo menos 15 caracteres.';
    if (referenciaObrigatoria && !referenciaLocalClara(dados.referenciaLocal)) {
      proximosErros.referenciaLocal = dados.referenciaLocal.trim()
        ? 'A referência está vaga. Cite um ponto observável, como um portão, poste, lixeira ou número do imóvel.'
        : 'Informe onde está a barreira, usando um ponto de referência próximo ao obstáculo.';
    }
    setErros(proximosErros);
    return Object.keys(proximosErros).length === 0;
  }

  function revisarFormulario(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (carregando || erroConsulta) return;
    if (!validarFormulario()) {
      setFocarPrimeiroErro(true);
      return;
    }
    setRevisando(true);
    setErroEnvio('');
  }

  async function confirmarCadastro() {
    if (salvando || !validarFormulario()) return;
    setSalvando(true);
    setErroEnvio('');
    const novo: NovoRelato = {
      unidadeId: dados.unidadeId,
      trechoId: dados.trechoId,
      categoria: dados.categoria as CategoriaObstaculo,
      descricao: dados.descricao.trim(),
      ...(dados.referenciaLocal.trim() ? { referenciaLocal: dados.referenciaLocal.trim() } : {}),
      ...(dados.passagem ? { passagem: dados.passagem as Ocorrencia['passagem'] } : {}),
    };

    try {
      const resultado = await cadastrarOcorrencia(novo);
      const destino = resultado.id ? `/confirmacao/${encodeURIComponent(resultado.id)}` : '/confirmacao';
      navegar(destino, { state: resultado });
    } catch (falha) {
      const motivo = falha instanceof Error ? falha.message : 'Não foi possível concluir o envio.';
      const complementar = falha instanceof ErroApi && falha.status
        ? ''
        : ' Se a conexão foi interrompida, confira a listagem antes de tentar novamente para evitar duplicidade.';
      setErroEnvio(`${motivo}${complementar}`);
    } finally {
      setSalvando(false);
    }
  }

  function limpar() {
    setDados(estadoInicial);
    setErros({});
    setRevisando(false);
    setErroEnvio('');
  }

  const classeCampo = 'mt-2 block min-h-12 w-full rounded-xl border border-[#bad2d0] bg-[#fbfdfc] px-4 py-3 text-base text-[#0b2b3d] outline-none focus:border-[#087f78] focus:ring-2 focus:ring-[#9adbd1]';
  const classeRotulo = 'block text-sm font-bold text-[#0b2b3d]';
  const classeErro = 'mt-2 text-sm font-semibold text-[#a62e4a]';

  return (
    <>
      <TituloPagina etiqueta="Registro cidadão" titulo="Encontrou uma barreira no acesso à saúde?"
        descricao="Escolha a UBS, identifique o trecho e conte o que observou. Não é necessário fazer medições." />
      <section className="py-12 sm:py-16">
        <Container>
          <FonteDados />
          <div className="mt-6 space-y-7">
            <aside aria-labelledby="como-colaborar" className="padrao-calcada overflow-hidden rounded-[1.8rem] border-t-7 border-[#ff8b63] bg-[#0b2b3d] p-6 text-white shadow-[0_18px_35px_-30px_#0b2b3d] sm:p-8 lg:p-9">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-black tracking-[0.15em] text-[#ffb99d] uppercase">Como colaborar</p>
                  <h2 id="como-colaborar" className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl">Compartilhe o que você observou.</h2>
                  <p className="mt-3 max-w-2xl text-sm leading-7 text-[#d2e6e6] sm:text-base">Quatro passos simples para relacionar um obstáculo à UBS e ao ponto de acesso.</p>
                </div>
                <Link to="/ocorrencias" className="inline-flex min-h-11 shrink-0 items-center self-start rounded-xl border border-[#80c8bd] px-4 py-2.5 text-sm font-bold !text-[#c6f4e9] hover:bg-white/10 hover:!text-white focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#ff8b63] lg:self-auto">
                  Consultar ocorrências
                </Link>
              </div>

              <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <li className="rounded-2xl border border-white/20 bg-[#174252]/90 p-4">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#ff8b63] text-sm font-extrabold text-[#092637]">01</span>
                  <p className="mt-3 text-sm leading-6 font-semibold text-white">Escolha a UBS cadastrada.</p>
                </li>
                <li className="rounded-2xl border border-white/20 bg-[#174252]/90 p-4">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#ff8b63] text-sm font-extrabold text-[#092637]">02</span>
                  <p className="mt-3 text-sm leading-6 font-semibold text-white">Indique a área e o ponto de referência.</p>
                </li>
                <li className="rounded-2xl border border-white/20 bg-[#174252]/90 p-4">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#ff8b63] text-sm font-extrabold text-[#092637]">03</span>
                  <p className="mt-3 text-sm leading-6 font-semibold text-white">Descreva o obstáculo com suas palavras.</p>
                </li>
                <li className="rounded-2xl border border-white/20 bg-[#174252]/90 p-4">
                  <span className="inline-flex size-9 items-center justify-center rounded-xl bg-[#ff8b63] text-sm font-extrabold text-[#092637]">04</span>
                  <p className="mt-3 text-sm leading-6 font-semibold text-white">Revise as informações e confirme.</p>
                </li>
              </ol>

              <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-7 text-[#d2e6e6]">
                Sua UBS não está disponível? <Link to="/unidades" className="font-bold text-white underline underline-offset-4 hover:text-[#ffb99d]">Veja as unidades do piloto.</Link>
              </p>
            </aside>

            <div className="mx-auto w-full max-w-5xl rounded-[1.8rem] border border-[#d2e4df] bg-white p-6 shadow-[0_22px_42px_-36px_#0b2b3d] sm:p-8 lg:p-10">
              {carregando ? <EstadoConsulta tipo="carregando" mensagem="Carregando as UBS e trechos cadastrados..." /> : null}
              {!carregando && erroConsulta ? <EstadoConsulta tipo="erro" mensagem={erroConsulta} tentarNovamente={() => setTentativa((valor) => valor + 1)} /> : null}
              {!carregando && !erroConsulta && unidadesDisponiveis.length === 0 ? <EstadoConsulta tipo="vazio" mensagem="Nenhuma UBS está disponível para novos relatos no momento." /> : null}
              {!carregando && !erroConsulta && unidadesDisponiveis.length > 0 ? (
                revisando ? (
                  <div ref={painelRevisao} tabIndex={-1} aria-live="polite" className="outline-none">
                    <span className="rounded-full bg-[#e8f5f0] px-4 py-2 text-xs font-black tracking-widest text-[#08776f] uppercase">Revisão do relato</span>
                    <h2 className="mt-6 text-2xl font-extrabold text-[#0b2b3d] sm:text-3xl">Confira antes de registrar</h2>
                    <dl className="mt-7 space-y-4">
                      {[
                        ['UBS', unidadeSelecionada?.nome],
                        ['Trecho', trechoSelecionado?.nome],
                        ['Obstáculo', dados.categoria],
                        ['Descrição', dados.descricao.trim()],
                        ['Referência aproximada do local', dados.referenciaLocal.trim() || 'Não informada'],
                        ['Passagem', dados.passagem || 'Não sei informar'],
                      ].map(([rotulo, valor]) => (
                        <div key={rotulo} className="border-b border-[#e4eeeb] pb-4 last:border-b-0">
                          <dt className="text-xs font-extrabold tracking-wider text-[#487071] uppercase">{rotulo}</dt>
                          <dd className="mt-2 whitespace-pre-wrap break-words font-semibold leading-7 text-[#0b2b3d]">{valor}</dd>
                        </div>
                      ))}
                    </dl>
                    {erroEnvio ? <p role="alert" className="mt-6 rounded-xl border border-[#edc5ca] bg-[#fff5f6] px-4 py-3 text-sm leading-7 font-semibold text-[#8f3048]">{erroEnvio}</p> : null}
                    <div className="mt-7 flex flex-wrap gap-3">
                      <button type="button" onClick={confirmarCadastro} disabled={salvando} className="botao-primario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold disabled:cursor-wait disabled:opacity-60">
                        {salvando ? 'Enviando relato...' : 'Confirmar registro'}
                      </button>
                      <button type="button" onClick={() => setRevisando(false)} disabled={salvando} className="botao-secundario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold disabled:opacity-60">Editar informações</button>
                    </div>
                  </div>
                ) : (
                  <form ref={formulario} noValidate onSubmit={revisarFormulario}>
                    <p className="text-xs font-black tracking-[0.14em] text-[#087f78] uppercase">Informações do relato</p>
                    <h2 className="mt-2 text-2xl font-extrabold text-[#0b2b3d] sm:text-3xl">Descreva o obstáculo</h2>
                    <div className="mt-7 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="unidadeId" className={classeRotulo}>UBS <span className="text-[#b04c36]">*</span></label>
                        <select id="unidadeId" name="unidadeId" value={dados.unidadeId} onChange={atualizarCampo} className={classeCampo} aria-invalid={Boolean(erros.unidadeId)} aria-describedby={erros.unidadeId ? 'erro-unidade' : undefined}>
                          <option value="">Selecione uma UBS</option>
                          {unidadesDisponiveis.map((unidade) => <option key={unidade.id} value={unidade.id}>{unidade.nome}</option>)}
                        </select>
                        {erros.unidadeId ? <p role="alert" id="erro-unidade" className={classeErro}>{erros.unidadeId}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="trechoId" className={classeRotulo}>Área de acesso <span className="text-[#b04c36]">*</span></label>
                        <select id="trechoId" name="trechoId" value={dados.trechoId} onChange={atualizarCampo} disabled={!unidadeSelecionada} className={`${classeCampo} disabled:cursor-not-allowed disabled:opacity-60`} aria-invalid={Boolean(erros.trechoId)} aria-describedby={erros.trechoId ? 'erro-trecho' : undefined}>
                          <option value="">{unidadeSelecionada ? 'Selecione a área' : 'Selecione a UBS antes'}</option>
                          {trechosDisponiveis.map((trecho) => <option key={trecho.id} value={trecho.id}>{trecho.nome}</option>)}
                        </select>
                        {erros.trechoId ? <p role="alert" id="erro-trecho" className={classeErro}>{erros.trechoId}</p> : null}
                        {unidadeSelecionada && !trechosDisponiveis.length ? <p className="mt-2 text-sm text-[#526f70]">Nenhuma área de acesso cadastrada para esta UBS.</p> : null}
                      </div>
                    </div>
                    <div className="mt-5">
                      <label htmlFor="categoria" className={classeRotulo}>Tipo de obstáculo <span className="text-[#b04c36]">*</span></label>
                      <select id="categoria" name="categoria" value={dados.categoria} onChange={atualizarCampo} className={classeCampo} aria-invalid={Boolean(erros.categoria)} aria-describedby={erros.categoria ? 'erro-categoria' : undefined}>
                        <option value="">Selecione uma categoria</option>
                        {categorias.map((categoria) => <option key={categoria} value={categoria}>{categoria}</option>)}
                      </select>
                      {erros.categoria ? <p role="alert" id="erro-categoria" className={classeErro}>{erros.categoria}</p> : null}
                    </div>
                    <div className="mt-5">
                      <label htmlFor="descricao" className={classeRotulo}>O que você observou? <span className="text-[#b04c36]">*</span></label>
                      <p className="mt-1 text-sm leading-6 text-[#4e6e71]">Descreva o obstáculo e como ele afeta a passagem. Evite nomes de pessoas ou dados de saúde.</p>
                      <textarea id="descricao" name="descricao" value={dados.descricao} onChange={atualizarCampo} rows={6} maxLength={600} className={`${classeCampo} min-h-43 resize-y`} placeholder="Ex.: uma lixeira dificulta a passagem e obriga as pessoas a desviar pela rua." aria-invalid={Boolean(erros.descricao)} aria-describedby={erros.descricao ? 'erro-descricao' : undefined} />
                      <div className="mt-2 flex justify-between gap-3 text-xs text-[#557477]">
                        <span>{erros.descricao ? <span id="erro-descricao" role="alert" className="font-semibold text-[#a62e4a]">{erros.descricao}</span> : 'Mínimo de 15 caracteres'}</span>
                        <span>{dados.descricao.length}/600</span>
                      </div>
                    </div>
                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="referenciaLocal" className={classeRotulo}>
                          Em que ponto você observou o obstáculo? {referenciaObrigatoria
                            ? <span className="text-[#b04c36]">*</span>
                            : <span className="font-normal text-[#567477]">(opcional)</span>}
                        </label>
                        <p id="ajuda-referencia" className="mt-1 text-sm leading-6 text-[#4e6e71]">
                          {referenciaObrigatoria
                            ? 'Esta área ainda não possui trechos delimitados. Indique um ponto fácil de reconhecer: lado de um portão, poste, lixeira ou número próximo.'
                            : 'Se possível, indique um ponto observável que ajude a encontrar o obstáculo.'}
                        </p>
                        <input id="referenciaLocal" name="referenciaLocal" value={dados.referenciaLocal} onChange={atualizarCampo}
                          maxLength={120} required={referenciaObrigatoria} aria-invalid={Boolean(erros.referenciaLocal)}
                          aria-describedby={erros.referenciaLocal ? 'ajuda-referencia erro-referencia' : 'ajuda-referencia'}
                          className={classeCampo} placeholder="Ex.: ao lado do portão, junto à lixeira" />
                        {erros.referenciaLocal ? <p role="alert" id="erro-referencia" className={classeErro}>{erros.referenciaLocal}</p> : null}
                      </div>
                      <div>
                        <label htmlFor="passagem" className={classeRotulo}>Como está a passagem? <span className="font-normal text-[#567477]">(opcional)</span></label>
                        <select id="passagem" name="passagem" value={dados.passagem} onChange={atualizarCampo} className={classeCampo}>
                          <option value="">Não sei informar</option>
                          <option value="Dificultada">Ainda é possível passar, mas com dificuldade</option>
                          <option value="Bloqueada">Passagem bloqueada</option>
                          <option value="Livre">Não parece impedir a passagem</option>
                        </select>
                      </div>
                    </div>
                    <p className="mt-6 text-sm leading-7 text-[#567477]">* Campos obrigatórios. Em áreas sem trecho delimitado, o ponto de referência também é necessário. Os relatos são informações comunitárias, não avaliações técnicas.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <button type="submit" className="botao-primario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Revisar relato</button>
                      <button type="button" onClick={limpar} className="botao-secundario inline-flex min-h-12 items-center rounded-xl px-6 py-3 text-sm font-bold">Limpar campos</button>
                    </div>
                  </form>
                )
              ) : null}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
