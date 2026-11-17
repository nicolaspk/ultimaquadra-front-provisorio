import { Link } from 'react-router-dom';
import type { Unidade } from '../../types/estrutura';

type CartaoUnidadeProps = {
  unidade: Unidade;
  totalTrechos: number;
  totalOcorrencias: number;
};

export default function CartaoUnidade({ unidade, totalTrechos, totalOcorrencias }: CartaoUnidadeProps) {
  return (
    <article className="group flex h-full flex-col rounded-[1.75rem] border border-[#d7e7dd] border-t-4 border-t-[#ff8b63] bg-white p-7 shadow-[0_16px_35px_-30px_#0b2b3d] transition-transform duration-200 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-extrabold tracking-[0.16em] text-[#0c7771] uppercase">Unidade cadastrada</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-[#0b2b3d]">{unidade.nome}</h2>
          <p className="mt-2 text-sm font-medium text-[#587267]">{unidade.bairro} · {unidade.endereco}</p>
        </div>
        <span className="inline-flex size-13 shrink-0 items-center justify-center rounded-2xl bg-[#0b2b3d] text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 21c-4-4.35-6-7.52-6-10.28A6 6 0 1 1 18 10.72C18 13.48 16 16.65 12 21Z" />
            <path d="M9.5 10h5M12 7.5v5" />
          </svg>
        </span>
      </div>

      <p className="mt-5 flex-1 text-base leading-7 text-[#49685e]">{unidade.descricao}</p>
      {unidade.cnes ? <p className="mt-3 text-xs font-semibold tracking-wide text-[#557378]">CNES {unidade.cnes} · Secretaria Municipal da Saúde</p> : null}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-[#eef6f3] p-4">
          <p className="text-xs font-bold tracking-wider text-[#567167] uppercase">Trechos</p>
          <p className="mt-2 text-2xl font-extrabold text-[#0b2b3d]">{totalTrechos}</p>
        </div>
        <div className="rounded-2xl bg-[#eef6f3] p-4">
          <p className="text-xs font-bold tracking-wider text-[#567167] uppercase">Ocorrências</p>
          <p className="mt-2 text-2xl font-extrabold text-[#0b2b3d]">{totalOcorrencias}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to={`/unidades/${unidade.id}`}
          className="botao-primario inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b2b3d] px-5 py-3 text-sm font-bold text-white hover:bg-[#194b59] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0c948a]"
        >
          Ver trechos e ocorrências
        </Link>
      </div>
    </article>
  );
}
