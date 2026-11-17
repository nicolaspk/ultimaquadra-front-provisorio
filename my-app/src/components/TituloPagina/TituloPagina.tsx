import Container from '../Container/Container';

type TituloPaginaProps = {
  etiqueta: string;
  titulo: string;
  descricao: string;
};

export default function TituloPagina({ etiqueta, titulo, descricao }: TituloPaginaProps) {
  return (
    <section className="relative isolate overflow-hidden border-b-4 border-[#ff8b63] bg-[#0b2b3d] py-14 text-white sm:py-18 lg:py-21">
      <div aria-hidden="true" className="padrao-calcada pointer-events-none absolute inset-0 opacity-60" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-25 bg-gradient-to-t from-[#087c76]/30 to-transparent" />
      <Container className="relative text-center">
        <p className="mx-auto inline-flex items-center gap-3 text-xs font-extrabold tracking-[0.19em] text-[#ffad8c] uppercase sm:text-sm">
          <span aria-hidden="true" className="h-1 w-8 rounded-full bg-[#ff8b63]" />
          {etiqueta}
          <span aria-hidden="true" className="h-1 w-8 rounded-full bg-[#ff8b63]" />
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl leading-[1.12] font-extrabold tracking-[-0.045em] text-white sm:text-5xl lg:text-[3.55rem]">{titulo}</h1>
        <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-[#d5ebe7] sm:text-lg">{descricao}</p>
        <div aria-hidden="true" className="mx-auto mt-8 flex w-fit gap-2">
          <span className="h-2 w-12 rounded-full bg-[#ff8b63]" /><span className="h-2 w-5 rounded-full bg-[#10bbaa]" /><span className="h-2 w-5 rounded-full bg-white/50" />
        </div>
      </Container>
    </section>
  );
}
