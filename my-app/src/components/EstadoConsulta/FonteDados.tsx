import { usandoApi } from '../../services/ocorrencias';

export default function FonteDados() {
  if (usandoApi) return null;
  return (
    <p className="rounded-xl border border-[#e6d6c8] bg-[#fff7f0] px-4 py-3 text-sm leading-6 text-[#6d4c39]">
      As UBS e seus endereços constam em registros oficiais municipais. Os setores de acesso ainda não foram vistoriados, e os relatos feitos aqui ficam somente neste navegador.
    </p>
  );
}
