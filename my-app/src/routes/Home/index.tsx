import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container';

const etapas = [
  {
    numero: '01',
    titulo: 'Consulte os relatos',
    descricao: 'Pesquise as ocorrências por UBS, tipo de obstáculo ou situação.',
  },
  {
    numero: '02',
    titulo: 'Entenda o local',
    descricao: 'Veja a descrição, a data e o trecho de acesso relacionado ao registro.',
  },
  {
    numero: '03',
    titulo: 'Contribua com um relato',
    descricao: 'Informe uma barreira observada para ajudar a tornar o problema mais visível.',
  },
] as const;

const destaques = [
  'Identificação de unidades e trechos de acesso',
  'Busca de relatos por unidade, categoria e situação',
  'Informação contextualizada por trecho de acesso',
] as const;

export default function Home() {
  return (
    <>
      <section aria-labelledby="titulo-home" className="padrao-piso overflow-hidden bg-gradient-to-br from-[#fff8f3] via-[#f7f8f5] to-[#eaf4f1] py-16 sm:py-20 lg:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#f3bd9f] bg-[#fff0e7] px-4 py-2 text-xs font-bold tracking-[0.09em] text-[#97472f] uppercase sm:text-sm">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#e77852]" />
              CitizenTech · Acessibilidade urbana
            </p>
            <h1 id="titulo-home" className="max-w-2xl text-[clamp(2.5rem,5vw,4.8rem)] leading-[1.04] font-extrabold tracking-[-0.06em] text-[#0b2b3d]">
              A saúde começa no <span className="text-[#087f78]">caminho até ela.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-[#3d5e55] sm:text-lg">
              O ÚltimaQuadra organiza informações sobre obstáculos nas calçadas que dão acesso às Unidades Básicas de Saúde, valorizando o percurso como parte do acesso ao cuidado.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/ocorrencias"
                className="botao-destaque inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold"
              >
                Consultar ocorrências
              </Link>
              <Link
                to="/registrar"
                className="botao-secundario inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-bold"
              >
                Registrar ocorrência
              </Link>
            </div>
            <Link to="/unidades" className="mt-5 inline-flex min-h-10 items-center gap-2 text-sm font-extrabold text-[#0b555e] underline underline-offset-4 hover:text-[#087f78] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#087f78]">
              Prefere começar pela UBS? Ver unidades cadastradas
              <span aria-hidden="true">→</span>
            </Link>

            <ul className="mt-8 space-y-3">
              {destaques.map((destaque) => (
                <li key={destaque} className="flex items-start gap-3 text-sm leading-7 text-[#3d5e55] sm:text-base">
                  <span className="mt-1 inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[#dff1e7] text-[#0c7771]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {destaque}
                </li>
              ))}
            </ul>
          </div>

          <aside aria-label="Relação entre unidade de saúde, trecho e ocorrência" className="padrao-calcada relative min-w-0 overflow-hidden rounded-[2rem] border-t-8 border-[#ff8b63] bg-[#0b2b3d] p-5 text-white shadow-[0_24px_70px_-40px_#0b2b3d] sm:p-8">

            <div className="relative">
              <div className="flex items-center gap-4 border-b border-white/20 pb-5">
                <span className="inline-flex size-15 items-center justify-center rounded-2xl bg-white ring-1 ring-white/15">
                  <img src="/assets/logo-ultimaquadra.png" alt="" width="42" height="42" className="size-13 object-contain" />
                </span>
                <span className="text-xs font-bold tracking-[0.13em] text-[#ffb99c] uppercase">Estrutura central do projeto</span>
              </div>
              <div className="mt-6 space-y-3">
                <div className="rounded-2xl border border-[#357f84] bg-[#164355] p-5">
                  <p className="text-xs font-bold tracking-wider text-[#c2f1e7] uppercase">Unidade de saúde</p>
                  <p className="mt-2 text-lg font-bold">Onde o cidadão precisa chegar</p>
                </div>
                <div aria-hidden="true" className="mx-auto h-7 w-1 rounded-full bg-[#ff8b63]" />
                <div className="rounded-2xl border border-[#357f84] bg-[#164355] p-5">
                  <p className="text-xs font-bold tracking-wider text-[#c2f1e7] uppercase">Trecho de acesso</p>
                  <p className="mt-2 text-lg font-bold">Por onde a pessoa passa</p>
                </div>
                <div aria-hidden="true" className="mx-auto h-7 w-1 rounded-full bg-[#ff8b63]" />
                <div className="rounded-2xl border border-[#ff8b63] bg-[#1b6170] p-5">
                  <p className="text-xs font-bold tracking-wider text-[#ffb99c] uppercase">Ocorrência</p>
                  <p className="mt-2 text-lg font-bold">O obstáculo que foi relatado</p>
                </div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      <section id="proposta" aria-labelledby="titulo-proposta" className="border-y border-[#dce8e1] bg-[#fffaf6] py-16 sm:py-20">
        <Container className="grid gap-6 lg:grid-cols-[0.7fr_1fr] lg:gap-16">
          <div>
            <p className="text-sm font-bold tracking-[0.14em] text-[#0c7771] uppercase">A proposta</p>
            <h2 id="titulo-proposta" className="mt-3 text-3xl leading-tight font-bold tracking-tight text-[#0b2b3d] sm:text-4xl">Acessibilidade começa antes da entrada.</h2>
          </div>
          <div className="space-y-4 text-base leading-8 text-[#3d5e55] sm:text-lg">
            <p>Buracos, desníveis, passagens estreitas e pavimentação irregular podem comprometer a chegada de pessoas com deficiência, idosos e cidadãos com mobilidade reduzida.</p>
            <p>O ÚltimaQuadra reúne informações sobre unidades, trechos e ocorrências em uma interface clara, conectando participação comunitária, acessibilidade e tecnologia.</p>
          </div>
        </Container>
      </section>

      <section id="como-funciona" aria-labelledby="titulo-como-funciona" className="scroll-mt-8 py-16 sm:py-20">
        <Container>
          <p className="text-sm font-bold tracking-[0.14em] text-[#0c7771] uppercase">Como funciona</p>
          <h2 id="titulo-como-funciona" className="mt-3 max-w-2xl text-3xl leading-tight font-bold tracking-tight text-[#0b2b3d] sm:text-4xl">Três passos para tornar obstáculos mais visíveis.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {etapas.map((etapa) => (
              <article key={etapa.numero} className="rounded-2xl border border-[#dce8e1] border-t-4 border-t-[#ff8b63] bg-white p-7 shadow-[0_10px_24px_-22px_#0b2b3d]">
                <span className="text-sm font-extrabold tracking-[0.1em] text-[#0c8b82]">{etapa.numero}</span>
                <h3 className="mt-5 text-xl font-bold tracking-tight text-[#0b2b3d]">{etapa.titulo}</h3>
                <p className="mt-3 text-sm leading-7 text-[#47675d] sm:text-base">{etapa.descricao}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
