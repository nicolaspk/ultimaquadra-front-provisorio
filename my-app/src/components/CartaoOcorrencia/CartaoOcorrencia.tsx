import { Link } from 'react-router-dom';
import type { Ocorrencia } from '../../types/estrutura';
import SeloSituacao from '../SeloSituacao/SeloSituacao';

type CartaoOcorrenciaProps = {
  ocorrencia: Ocorrencia;
  nomeTrecho?: string;
  nomeUnidade?: string;
};

export default function CartaoOcorrencia({ ocorrencia, nomeTrecho, nomeUnidade }: CartaoOcorrenciaProps) {
  const data = new Date(`${ocorrencia.dataRelato}T12:00:00`);
  const dataFormatada = Number.isNaN(data.getTime()) ? ocorrencia.dataRelato : data.toLocaleDateString('pt-BR');

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-[1.5rem] border border-[#d4e3df] bg-white shadow-[0_16px_30px_-30px_#0b2b3d] transition-all duration-200 hover:border-[#87bdb3] hover:shadow-[0_22px_34px_-28px_#0b2b3d]">
      <div className="h-1.5 bg-gradient-to-r from-[#ff8b63] via-[#19a99b] to-[#0b2b3d]" aria-hidden="true" />
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-extrabold tracking-[0.12em] text-[#3b666d] uppercase">{String(ocorrencia.id).toUpperCase()}</p>
          <SeloSituacao situacao={ocorrencia.situacao} />
        </div>
        <div className="mt-5 flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#e8f5f1] text-[#087f78]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m4 19 5-14 5 8 5-8 1 14H4Z" />
              <path d="M9 5v14M14 13v6" />
            </svg>
          </span>
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold leading-snug tracking-tight text-[#0b2b3d] sm:text-xl">{ocorrencia.categoria}</h3>
            {nomeUnidade ? <p className="mt-2 break-words text-sm font-semibold text-[#315c63]">{nomeUnidade}</p> : null}
            {nomeTrecho ? <p className="mt-1 break-words text-sm leading-6 text-[#5a7073]">{nomeTrecho}</p> : null}
          </div>
        </div>
        <p className="mt-5 flex-1 break-words text-sm leading-7 text-[#47666a] sm:text-base">{ocorrencia.descricao}</p>
        <p className="mt-3 break-words text-sm leading-6 text-[#315c63]">
          <span className="font-extrabold">Ponto aproximado:</span> {ocorrencia.referenciaLocal?.trim() || 'não informado neste relato'}
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#527075]">
          <time dateTime={ocorrencia.dataRelato} className="rounded-full bg-[#f2f7f5] px-3 py-2">Relatado em {dataFormatada}</time>
          {ocorrencia.passagem && ocorrencia.passagem !== 'Não sei informar' ? (
            <span className="rounded-full bg-[#f2f7f5] px-3 py-2">Passagem: {ocorrencia.passagem.toLowerCase()}</span>
          ) : null}
        </div>
        <Link to={`/ocorrencias/${encodeURIComponent(String(ocorrencia.id))}`}
          className="mt-6 inline-flex min-h-11 items-center justify-between gap-3 rounded-xl bg-[#edf7f3] px-4 py-3 text-sm font-extrabold text-[#0b555e] transition-colors hover:bg-[#d9eee7] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#087f78]">
          Ver detalhes do relato
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
        </Link>
      </div>
    </article>
  );
}
