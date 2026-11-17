import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Cabecalho from './components/Cabecalho/Cabecalho';
import Rodape from './components/Rodape/Rodape';

export default function App() {
  const localizacao = useLocation();

  useEffect(() => {
    if (!localizacao.hash) window.scrollTo(0, 0);

    const caminho = localizacao.pathname;
    const titulos: Record<string, string> = {
      '/': 'Início',
      '/ocorrencias': 'Consultar ocorrências',
      '/unidades': 'Unidades de saúde',
      '/registrar': 'Registrar obstáculo',
      '/sobre': 'Sobre',
      '/faq': 'Perguntas frequentes',
      '/integrantes': 'Integrantes',
      '/contato': 'Contato',
      '/confirmacao': 'Confirmação de registro',
    };
    const titulo = titulos[caminho]
      ?? (caminho.startsWith('/ocorrencias/') ? 'Detalhes da ocorrência'
        : caminho.startsWith('/unidades/') ? 'Detalhes da UBS'
          : caminho.startsWith('/confirmacao/') ? 'Confirmação de registro' : 'Página não encontrada');
    document.title = `${titulo} | ÚltimaQuadra`;
  }, [localizacao.pathname, localizacao.hash]);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f8f5] text-[#0b2b3d]">
      <a
        href="#conteudo-principal"
        className="sr-only fixed top-3 left-3 z-50 rounded-lg bg-[#0b2b3d] px-4 py-3 font-semibold text-white focus:not-sr-only"
      >
        Ir para o conteúdo principal
      </a>
      <Cabecalho />
      <main id="conteudo-principal" className="flex-1">
        <Outlet />
      </main>
      <Rodape />
    </div>
  );
}
