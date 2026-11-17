import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container';

const etapas = [
  {
    numero: '01',
    titulo: 'Encontre a UBS',
    descricao: 'Consulte as unidades que fazem parte da plataforma e escolha o local do seu interesse.',
  },
  {
    numero: '02',
    titulo: 'Identifique o acesso',
    descricao: 'Veja a área de acesso disponível e as referências aproximadas informadas nos relatos.',
  },
  {
    numero: '03',
    titulo: 'Consulte ou registre',
    descricao: 'Conheça ocorrências anteriores ou informe um novo obstáculo observado no caminho.',
  },
  {
    numero: '04',
    titulo: 'Acompanhe a situação',
    descricao: 'Consulte o relato por seu identificador e saiba se a informação já passou por verificação.',
  },
] as const;

const beneficios = [
  {
    titulo: 'Para quem precisa chegar',
    descricao: 'Pessoas com deficiência, idosos, pessoas com mobilidade reduzida e acompanhantes podem conhecer relatos sobre barreiras próximas à UBS.',
    numero: '01',
  },
  {
    titulo: 'Para quem observa e colabora',
    descricao: 'Qualquer cidadão pode registrar um obstáculo, descrevendo o local aproximado e como ele interfere na passagem.',
    numero: '02',
  },
  {
    titulo: 'Para a comunidade',
    descricao: 'Os relatos ficam organizados por unidade e área de acesso, facilitando a leitura coletiva de problemas recorrentes.',
    numero: '03',
  },
] as const;

const objetivos = [
  { sigla: '11', titulo: 'Cidades e comunidades sustentáveis', descricao: 'Visibilidade para a acessibilidade no espaço urbano.' },
  { sigla: '10', titulo: 'Redução das desigualdades', descricao: 'Atenção às barreiras que afetam a mobilidade.' },
  { sigla: '03', titulo: 'Saúde e bem-estar', descricao: 'O percurso também faz parte do acesso ao cuidado.' },
] as const;

export default function Sobre() {
  return (
    <>
      <section aria-labelledby="titulo-sobre" className="relative overflow-hidden bg-[#0b2b3d] py-17 text-white sm:py-21 lg:py-27">
        <div aria-hidden="true" className="padrao-calcada absolute inset-0 opacity-35" />
        <div aria-hidden="true" className="absolute -right-25 -top-20 size-80 rounded-full bg-[#0c7771]/20 blur-3xl" />
        <Container className="relative grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#6a9d9d] bg-white/8 px-4 py-2 text-xs font-extrabold tracking-[0.13em] text-[#b3ede3] uppercase">
              <span aria-hidden="true" className="size-2 rounded-full bg-[#ff8b63]" />
              Conheça o ÚltimaQuadra
            </span>
            <h1 id="titulo-sobre" className="mt-7 max-w-3xl text-[clamp(2.6rem,5vw,4.7rem)] leading-[1.05] font-extrabold tracking-[-0.055em] text-white">
              O acesso à saúde não começa <span className="text-[#ffad88]">na recepção.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#d8eeea] sm:text-lg">
              Antes de entrar em uma Unidade Básica de Saúde, existe um caminho. Para quem enfrenta barreiras de mobilidade, as condições desse último trecho podem fazer toda a diferença.
            </p>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#d8eeea] sm:text-lg">
              O ÚltimaQuadra reúne relatos comunitários sobre obstáculos próximos às UBS e organiza essas informações para consulta e acompanhamento.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#como-funciona" className="botao-destaque inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold">Entenda como funciona</a>
              <Link to="/ocorrencias" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#91bab8] px-6 py-3 text-sm font-extrabold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8b63]">Consultar relatos</Link>
            </div>
          </div>

          <aside aria-label="Como unidade, área de acesso e ocorrência se relacionam" className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/16 bg-white/8 p-5 shadow-[0_28px_65px_-40px_#000] backdrop-blur-sm sm:p-7">
            <div aria-hidden="true" className="absolute -right-14 -top-14 size-48 rounded-full border-[18px] border-[#ff8b63]/10" />
            <div className="relative rounded-[1.5rem] bg-[#12394a] p-5 sm:p-6">
              <div className="flex items-center gap-3 border-b border-white/15 pb-5">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#d7f5e9]">
                  <img src="/assets/logo-ultimaquadra.png" alt="" width="40" height="40" className="size-10 object-contain" />
                </span>
                <div>
                  <p className="text-xs font-extrabold tracking-[0.13em] text-[#91d9d0] uppercase">Um relato, um contexto</p>
                  <p className="mt-1 text-sm font-semibold text-white">Da unidade ao ponto observado</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-4 rounded-2xl border border-[#3f7680] bg-[#1d4a58] p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/12 text-xl font-black text-[#ffb296]">01</span>
                <div><p className="text-xs font-bold tracking-wider text-[#a7dfdc] uppercase">UBS</p><p className="mt-1 font-bold text-white">Qual unidade?</p></div>
              </div>
              <div aria-hidden="true" className="ml-9 h-6 w-0.5 bg-[#58a5a0]" />
              <div className="flex items-center gap-4 rounded-2xl border border-[#3f7680] bg-[#1d4a58] p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-white/12 text-xl font-black text-[#ffb296]">02</span>
                <div><p className="text-xs font-bold tracking-wider text-[#a7dfdc] uppercase">Área de acesso</p><p className="mt-1 font-bold text-white">Onde no entorno?</p></div>
              </div>
              <div aria-hidden="true" className="ml-9 h-6 w-0.5 bg-[#58a5a0]" />
              <div className="flex items-center gap-4 rounded-2xl border border-[#ff9a75] bg-[#235b61] p-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#ff8b63] text-xl font-black text-[#092637]">03</span>
                <div><p className="text-xs font-bold tracking-wider text-[#c8f4e6] uppercase">Ocorrência</p><p className="mt-1 font-bold text-white">O que foi observado?</p></div>
              </div>
            </div>
            <p className="relative mt-4 px-2 text-sm leading-6 text-[#d8eeea]">Cada obstáculo é apresentado com uma referência de localização e uma situação de acompanhamento.</p>
          </aside>
        </Container>
      </section>

      <section aria-labelledby="sobre-problema" className="border-b border-[#dce8e2] bg-[#fffdf9] py-17 sm:py-21">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-18">
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#0c7771] uppercase">O problema que queremos enfrentar</p>
            <h2 id="sobre-problema" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0b2b3d] sm:text-4xl lg:text-[2.7rem]">
              Uma UBS acessível por dentro ainda pode ser difícil de alcançar.
            </h2>
            <div aria-hidden="true" className="mt-6 h-1.5 w-24 rounded-full bg-[#ff8b63]" />
          </div>
          <div className="space-y-5 text-base leading-8 text-[#466361] sm:text-lg">
            <p>Buracos, desníveis, pisos irregulares e passagens estreitas são barreiras que podem dificultar o deslocamento de pessoas com deficiência, idosos e outras pessoas com mobilidade reduzida.</p>
            <p>O impacto muda de pessoa para pessoa. Uma passagem que parece simples para alguns pode exigir mais esforço, ajuda ou até impedir o deslocamento de outros.</p>
            <div className="rounded-2xl border-l-4 border-[#ff8b63] bg-[#f0f7f4] px-6 py-5">
              <p className="font-bold leading-7 text-[#0b2b3d]">O desafio é transformar observações isoladas sobre esse caminho em informações organizadas e consultáveis pela comunidade.</p>
            </div>
          </div>
        </Container>
      </section>

      <section aria-labelledby="sobre-solucao" className="bg-white py-17 sm:py-21">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#0c7771] uppercase">Nossa proposta</p>
            <h2 id="sobre-solucao" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0b2b3d] sm:text-4xl">Mais clareza sobre o último trecho.</h2>
            <p className="mt-5 text-base leading-8 text-[#466361] sm:text-lg">A plataforma organiza o que foi relatado em três níveis, para que o obstáculo não apareça solto, sem referência de localização.</p>
          </div>

          <div className="mt-11 grid gap-5 md:grid-cols-3">
            <article className="rounded-[1.7rem] border border-[#d9e8df] bg-[#f6faf7] p-7">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#0b2b3d] text-lg font-black text-white">01</span>
              <h3 className="mt-5 text-xl font-extrabold text-[#0b2b3d]">Unidade de saúde</h3>
              <p className="mt-3 leading-7 text-[#486561]">Identificação da UBS, bairro e endereço para iniciar a consulta.</p>
            </article>
            <article className="rounded-[1.7rem] border border-[#d9e8df] bg-[#f6faf7] p-7">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#0b2b3d] text-lg font-black text-white">02</span>
              <h3 className="mt-5 text-xl font-extrabold text-[#0b2b3d]">Trecho de acesso</h3>
              <p className="mt-3 leading-7 text-[#486561]">A área do entorno relacionada ao relato, complementada por uma referência que ajude a localizar o ponto.</p>
            </article>
            <article className="rounded-[1.7rem] border border-[#f0c4b0] bg-[#fff4ed] p-7">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#ff8b63] text-lg font-black text-[#092637]">03</span>
              <h3 className="mt-5 text-xl font-extrabold text-[#0b2b3d]">Relato do obstáculo</h3>
              <p className="mt-3 leading-7 text-[#486561]">Categoria, descrição, localização aproximada, data e situação do registro.</p>
            </article>
          </div>
        </Container>
      </section>

      <section id="como-funciona" aria-labelledby="sobre-jornada" className="scroll-mt-8 border-y border-[#d7e6e0] bg-[#eef6f2] py-17 sm:py-21">
        <Container>
          <div className="grid items-end gap-6 md:grid-cols-[1fr_0.8fr] md:gap-10">
            <div>
              <p className="text-xs font-extrabold tracking-[0.16em] text-[#0c7771] uppercase">A jornada do cidadão</p>
              <h2 id="sobre-jornada" className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#0b2b3d] sm:text-4xl">Do que foi observado ao que pode ser consultado.</h2>
            </div>
            <p className="text-base leading-8 text-[#466361]">A consulta é pública. Para contribuir, basta descrever o obstáculo observado, sem enviar informações pessoais ou medições técnicas.</p>
          </div>
          <ol className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {etapas.map((etapa) => (
              <li key={etapa.numero} className="rounded-2xl border border-[#d4e5de] bg-white p-6 shadow-[0_16px_30px_-28px_#0b2b3d]">
                <span className="text-3xl font-black tracking-tight text-[#0c7771]">{etapa.numero}</span>
                <h3 className="mt-5 text-lg font-extrabold text-[#0b2b3d]">{etapa.titulo}</h3>
                <p className="mt-3 text-sm leading-7 text-[#496666]">{etapa.descricao}</p>
              </li>
            ))}
          </ol>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/unidades" className="botao-primario inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold">Conhecer unidades</Link>
            <Link to="/registrar" className="botao-secundario inline-flex min-h-12 items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold">Registrar ocorrência</Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="sobre-beneficios" className="bg-[#fffdf9] py-17 sm:py-21">
        <Container>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#0c7771] uppercase">Para quem é o ÚltimaQuadra</p>
          <h2 id="sobre-beneficios" className="mt-4 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-[#0b2b3d] sm:text-4xl">Informação útil para diferentes pessoas.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {beneficios.map((item) => (
              <article key={item.numero} className="rounded-[1.7rem] border border-[#dde8e2] bg-white p-7 shadow-[0_12px_35px_-30px_#0b2b3d]">
                <span className="text-sm font-black tracking-[0.12em] text-[#d56a47]">{item.numero}</span>
                <h3 className="mt-5 text-xl font-extrabold leading-snug text-[#0b2b3d]">{item.titulo}</h3>
                <p className="mt-4 leading-7 text-[#496666]">{item.descricao}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section aria-labelledby="sobre-limites" className="bg-[#0b2b3d] py-17 text-white sm:py-21">
        <Container className="grid items-start gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div>
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#98e3d6] uppercase">Transparência em primeiro lugar</p>
            <h2 id="sobre-limites" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Um relato não é um laudo.</h2>
            <p className="mt-5 leading-8 text-[#d8eeea]">A plataforma dá visibilidade a observações comunitárias. Ela não certifica acessibilidade, não garante caminhos seguros e não funciona como canal oficial de solicitação de obras.</p>
          </div>
          <div className="rounded-[1.75rem] border border-white/18 bg-white/8 p-6 sm:p-8">
            <span className="inline-flex items-center rounded-full border border-[#7aaca3] bg-[#24655f] px-4 py-2 text-xs font-extrabold text-white">Situação: Relatada</span>
            <h3 className="mt-5 text-xl font-bold text-white">O que isso significa?</h3>
            <p className="mt-3 leading-8 text-[#d8eeea]">A informação foi enviada por um cidadão e ainda não passou por verificação independente. Outros estados só fazem sentido quando houver um procedimento efetivo de acompanhamento.</p>
            <div className="mt-6 border-t border-white/20 pt-5">
              <p className="text-sm leading-7 text-[#d8eeea]">A ausência de relatos não significa que uma calçada seja acessível. Da mesma forma, o registro de um obstáculo não substitui uma avaliação técnica do local.</p>
            </div>
            <Link to="/faq" className="mt-6 inline-flex min-h-11 items-center font-bold text-[#a5ece0] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8b63]">Leia as perguntas frequentes</Link>
          </div>
        </Container>
      </section>

      <section aria-labelledby="sobre-ods" className="bg-white py-17 sm:py-21">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold tracking-[0.16em] text-[#0c7771] uppercase">Impacto que buscamos</p>
            <h2 id="sobre-ods" className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-[#0b2b3d] sm:text-4xl">Uma proposta conectada aos ODS.</h2>
            <p className="mt-4 leading-8 text-[#496666]">O ÚltimaQuadra aproxima inclusão, mobilidade urbana e acesso a serviços de saúde.</p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {objetivos.map((objetivo) => (
              <article key={objetivo.sigla} className="flex gap-4 rounded-2xl border border-[#d9e8df] bg-[#f7faf7] p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#0b2b3d] text-xl font-extrabold text-white">{Number(objetivo.sigla)}</span>
                <div>
                  <h3 className="font-bold leading-6 text-[#0b2b3d]">ODS {Number(objetivo.sigla)} — {objetivo.titulo}</h3>
                  <p className="mt-2 text-sm leading-7 text-[#496666]">{objetivo.descricao}</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-[1.75rem] bg-[#ffede2] px-7 py-9 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-9">
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-[#0b2b3d]">Conheça os relatos disponíveis.</h3>
              <p className="mt-2 max-w-2xl leading-7 text-[#47645f]">Consulte as informações associadas às unidades do piloto e descubra como os registros são apresentados.</p>
            </div>
            <Link to="/ocorrencias" className="botao-primario mt-6 inline-flex min-h-12 shrink-0 items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold sm:mt-0">Consultar ocorrências</Link>
          </div>
        </Container>
      </section>
    </>
  );
}
