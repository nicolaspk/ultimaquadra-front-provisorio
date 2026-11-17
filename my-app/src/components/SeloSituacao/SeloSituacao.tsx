import type { SituacaoOcorrencia } from '../../types/estrutura';

type SeloSituacaoProps = {
  situacao: SituacaoOcorrencia;
};

const estilos: Record<SituacaoOcorrencia, string> = {
  Relatada: 'bg-[#edf6f0] text-[#0d6655] border-[#c9e2d6]',
  'Em verificação': 'bg-[#fff7e5] text-[#835400] border-[#efd49d]',
  Confirmada: 'bg-[#e8f3ec] text-[#0b5c4c] border-[#c2ddcf]',
  'Não confirmada': 'bg-[#f8ecef] text-[#8d2d42] border-[#eac3cd]',
  Resolvida: 'bg-[#e6f1fb] text-[#0f5d8e] border-[#bfdaef]',
};

export default function SeloSituacao({ situacao }: SeloSituacaoProps) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold tracking-wide ${estilos[situacao]}`}>
      {situacao}
    </span>
  );
}
