import Container from '../../components/Container/Container';
import TituloPagina from '../../components/TituloPagina/TituloPagina';

type Integrante = {
  nome: string;
  rm: string;
  turma: string;
  github: string;
  linkedin: string;
  iniciais: string;
  foto?: string;
};

const integrantes: Integrante[] = [
  {
    nome: 'Maria Eduarda Escandor', foto: '/assets/equipe/foto-maria1.jpeg', rm: '568216', turma: '1TDSPO', iniciais: 'ME',
    github: 'https://github.com/mariabatistaescandor-gif',
    linkedin: 'https://www.linkedin.com/in/maria-eduarda-escandor-5b1587359/',
  },
  {
    nome: 'Erick Menezes', foto: '/assets/equipe/foto-erick.jpeg', rm: '570325', turma: '1TDSPF', iniciais: 'EM',
    github: 'https://github.com/DevErick-658',
    linkedin: 'https://www.linkedin.com/in/erick-menezes-b53009232/',
  },
  {
    nome: 'Maria Eduarda Lopes de Lima', foto: '/assets/equipe/foto-maria2.png', rm: '572425', turma: '1TDSPO', iniciais: 'ML',
    github: 'https://github.com/mariaeduardaalima',
    linkedin: 'https://www.linkedin.com/in/maria-eduarda-lopes-de-lima-1291b6289/',
  },
  {
    nome: 'Matheus Yudi', foto: '/assets/equipe/matheus.png', rm: '571245', turma: '1TDSPF', iniciais: 'MY',
    github: 'https://github.com/ogmatheus7',
    linkedin: 'https://www.linkedin.com/in/matheus-yudi7/',
  },
  {
    nome: 'Nicolas Sousa', foto: '/assets/equipe/foto-nicolas.jpg', rm: '574141', turma: '1TDSPH', iniciais: 'NS',
    github: 'https://github.com/nicolaspk',
    linkedin: 'https://www.linkedin.com/in/nicolas-sousaa/',
  },
];

export default function Integrantes() {
  return (
    <>
      <TituloPagina
        etiqueta="Nossa equipe"
        titulo="Cinco pessoas, um propósito compartilhado."
        descricao="Conheça quem desenvolve o ÚltimaQuadra e saiba como acompanhar o trabalho de cada integrante."
      />

      <section aria-labelledby="titulo-equipe" className="bg-[#f7f8f5] py-14 sm:py-18 lg:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-extrabold tracking-[0.17em] text-[#0a7774] uppercase">Equipe de desenvolvimento</p>
            <h2 id="titulo-equipe" className="mt-3 text-3xl font-extrabold tracking-tight text-[#0b2b3d] sm:text-4xl">
              Quem faz o ÚltimaQuadra acontecer
            </h2>
            <p className="mt-4 text-base leading-7 text-[#486665]">
              Uma equipe unida para transformar informação em participação cidadã.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-5 lg:gap-6">
            {integrantes.map((integrante) => (
              <article
                key={integrante.rm}
                className="flex w-full min-w-0 flex-col overflow-hidden rounded-[1.65rem] border border-[#d8e4e1] bg-white shadow-[0_18px_32px_-28px_#0b2b3d] transition-shadow hover:shadow-[0_20px_40px_-25px_#0b2b3d] sm:w-[calc(50%-10px)] lg:w-[calc(33.333%-16px)]"
              >
                <div className="padrao-calcada h-22 bg-[#0b2b3d]" aria-hidden="true" />
                <div className="relative mx-auto -mt-12 flex size-27 items-center justify-center overflow-hidden rounded-[1.45rem] border-4 border-white bg-[#dff1e7] shadow-[0_14px_26px_-18px_#0b2b3d] sm:size-29">
                  {integrante.foto ? (
                    <img
                      src={integrante.foto}
                      alt={`Foto de ${integrante.nome}`}
                      className="h-full w-full object-cover object-center"
                      loading="lazy"
                      width="116"
                      height="116"
                    />
                  ) : (
                    <span className="text-2xl font-extrabold text-[#0b2b3d]" aria-label={`Iniciais de ${integrante.nome}`}>
                      {integrante.iniciais}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col px-5 pb-6 pt-4 text-center sm:px-6">
                  <h3 className="flex min-h-14 items-center justify-center text-lg font-extrabold leading-snug tracking-tight text-[#0b2b3d] sm:text-xl">
                    {integrante.nome}
                  </h3>
                  <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-bold sm:text-sm">
                    <span className="rounded-full bg-[#e9f5f1] px-3 py-2 text-[#0b605a]">RM {integrante.rm}</span>
                    <span className="rounded-full bg-[#fff0e9] px-3 py-2 text-[#9b4e35]">{integrante.turma}</span>
                  </div>

                  <div className="mt-auto grid grid-cols-2 gap-3 pt-7">
                    <a
                      href={integrante.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub de ${integrante.nome}`}
                      className="botao-primario inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-bold"
                    >
                      GitHub
                    </a>
                    <a
                      href={integrante.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`LinkedIn de ${integrante.nome}`}
                      className="botao-secundario inline-flex min-h-11 items-center justify-center rounded-xl px-3 py-2.5 text-sm font-bold"
                    >
                      LinkedIn
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
