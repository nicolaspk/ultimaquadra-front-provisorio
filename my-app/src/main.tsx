import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Home from './routes/Home';
import Integrantes from './routes/Integrantes';
import Sobre from './routes/Sobre';
import Faq from './routes/Faq';
import Contato from './routes/Contato';
import Unidades from './routes/Unidades';
import UnidadeDetalhe from './routes/UnidadeDetalhe';
import OcorrenciaDetalhe from './routes/OcorrenciaDetalhe';
import Ocorrencias from './routes/Ocorrencias';
import RegistrarOcorrencia from './routes/RegistrarOcorrencia';
import Confirmacao from './routes/Confirmacao';
import NaoEncontrada from './routes/NaoEncontrada';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'unidades', element: <Unidades /> },
      { path: 'unidades/:id', element: <UnidadeDetalhe /> },
      { path: 'ocorrencias', element: <Ocorrencias /> },
      { path: 'ocorrencias/:id', element: <OcorrenciaDetalhe /> },
      { path: 'registrar', element: <RegistrarOcorrencia /> },
      { path: 'confirmacao/:id', element: <Confirmacao /> },
      { path: 'confirmacao', element: <Confirmacao /> },
      { path: 'integrantes', element: <Integrantes /> },
      { path: 'sobre', element: <Sobre /> },
      { path: 'faq', element: <Faq /> },
      { path: 'contato', element: <Contato /> },
      { path: '*', element: <NaoEncontrada /> },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
