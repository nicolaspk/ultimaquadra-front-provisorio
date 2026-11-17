import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Container from '../Container/Container';

const linksProjeto = [
  { destino: '/', texto: 'Início', exato: true },
  { destino: '/sobre', texto: 'Sobre' },
  { destino: '/faq', texto: 'FAQ' },
  { destino: '/integrantes', texto: 'Integrantes' },
  { destino: '/contato', texto: 'Contato' },
];

const linksPlataforma = [
  { destino: '/unidades', texto: 'Unidades' },
  { destino: '/ocorrencias', texto: 'Ocorrências' },
  { destino: '/registrar', texto: 'Registrar' },
];

export default function Cabecalho() {
  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const localizacao = useLocation();

  useEffect(() => { setMenuAberto(false); }, [localizacao.pathname]);

  useEffect(() => {
    if (!menuAberto) return;

    function fecharComEscape(evento: KeyboardEvent) {
      if (evento.key === 'Escape') {
        setMenuAberto(false);
        botaoMenu.current?.focus();
      }
    }

    document.addEventListener('keydown', fecharComEscape);
    return () => document.removeEventListener('keydown', fecharComEscape);
  }, [menuAberto]);

  const classeLink = ({ isActive }: { isActive: boolean }, destaque = false) => {
    if (destaque) {
      return `inline-flex min-h-10 items-center justify-center rounded-xl px-3.5 py-2 text-sm font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fff] ${
        isActive ? 'bg-white !text-[#0b2b3d]' : 'bg-[#ff8b63] !text-[#092637] hover:bg-[#ffae90]'
      }`;
    }

    return `rounded-xl px-2.5 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8b63] ${
      isActive ? 'bg-white/15 !text-white' : '!text-[#eef7f3] hover:bg-white/12 hover:!text-white'
    }`;
  };

  return (
    <header className="relative z-20 border-b-4 border-[#ff8b63] bg-[#0b2b3d] text-white">
      <Container className="flex min-h-23 items-center justify-between gap-3 py-3">
        <Link
          to="/"
          aria-label="ÚltimaQuadra, página inicial"
          className="flex min-w-0 shrink-0 items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ff8b63]"
        >
          <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-2xl bg-[#f1fbf7] shadow-[0_8px_20px_-12px_#000] sm:size-14">
            <img src="/assets/logo-ultimaquadra.png" alt="" width="48" height="48" className="size-11 object-contain sm:size-12" />
          </span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-lg leading-none font-extrabold tracking-[-0.05em] text-white sm:text-[1.4rem]">ÚltimaQuadra</span>
            <span className="max-w-40 text-[10px] leading-tight font-medium text-[#b5e7df] sm:max-w-none sm:text-xs">Acessibilidade começa antes da porta</span>
          </span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-1 xl:flex">
          <div role="group" aria-label="Conheça o projeto" className="flex items-center gap-0.5">
            {linksProjeto.map((link) => (
              <NavLink key={link.destino} to={link.destino} end={link.exato} className={(estado) => classeLink(estado)}>
                {link.texto}
              </NavLink>
            ))}
          </div>
          <span aria-hidden="true" className="mx-1.5 h-7 w-px bg-white/25" />
          <div role="group" aria-label="Explore a plataforma" className="flex items-center gap-0.5">
            {linksPlataforma.map((link) => (
              <NavLink
                key={link.destino}
                to={link.destino}
                className={(estado) => classeLink(estado, link.destino === '/registrar')}
              >
                {link.texto}
              </NavLink>
            ))}
          </div>
        </nav>

        <button
          ref={botaoMenu}
          type="button"
          aria-controls="navegacao-mobile"
          aria-expanded={menuAberto}
          aria-label={menuAberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setMenuAberto((aberto) => !aberto)}
          className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#81aeb2] !text-white hover:bg-white/12 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8b63] xl:hidden"
        >
          {menuAberto ? (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          ) : (
            <svg aria-hidden="true" viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
          )}
        </button>
      </Container>

      <nav
        id="navegacao-mobile"
        aria-label="Navegação em dispositivos móveis"
        className={`${menuAberto ? 'block' : 'hidden'} border-t border-white/15 bg-[#0b2b3d] xl:hidden`}
      >
        <Container className="flex flex-col gap-1 py-4">
          <p className="px-3 py-2 text-xs font-extrabold tracking-[0.16em] text-[#a7ddd3] uppercase">Conheça o projeto</p>
          {linksProjeto.map((link) => (
            <NavLink key={link.destino} to={link.destino} end={link.exato} className={(estado) => classeLink(estado)} onClick={() => setMenuAberto(false)}>
              {link.texto}
            </NavLink>
          ))}
          <div className="my-2 h-px bg-white/15" />
          <p className="px-3 py-2 text-xs font-extrabold tracking-[0.16em] text-[#a7ddd3] uppercase">Explore a plataforma</p>
          {linksPlataforma.map((link) => (
            <NavLink
              key={link.destino}
              to={link.destino}
              className={(estado) => classeLink(estado, link.destino === '/registrar')}
              onClick={() => setMenuAberto(false)}
            >
              {link.texto}
            </NavLink>
          ))}
        </Container>
      </nav>
    </header>
  );
}
