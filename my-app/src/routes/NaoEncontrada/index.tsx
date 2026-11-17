import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container';

export default function NaoEncontrada() {
  return (
    <Container className="py-20 sm:py-28">
      <p className="mb-4 text-sm font-bold tracking-[0.16em] text-[#0c948a] uppercase">Página não encontrada</p>
      <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Não encontramos este endereço.</h1>
      <p className="mt-5 max-w-lg text-lg leading-8 text-[#4e6860]">
        A página pode ter sido removida ou o link pode estar incorreto.
      </p>
      <Link
        to="/"
        className="botao-primario mt-8 inline-flex rounded-xl bg-[#0b2b3d] px-6 py-3 font-semibold text-white hover:bg-[#194b59] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0c948a]"
      >
        Voltar ao início
      </Link>
    </Container>
  );
}
