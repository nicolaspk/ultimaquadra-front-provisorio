type EstadoConsultaProps = {
  tipo: 'carregando' | 'erro' | 'vazio';
  mensagem?: string;
  tentarNovamente?: () => void;
};

export default function EstadoConsulta({ tipo, mensagem, tentarNovamente }: EstadoConsultaProps) {
  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      aria-live={tipo === 'erro' ? 'assertive' : 'polite'}
      className="rounded-[1.5rem] border border-[#d5e5e2] bg-white px-6 py-9 text-center shadow-[0_12px_30px_-28px_#0b2b3d]"
    >
      {tipo === 'carregando' ? <span aria-hidden="true" className="mx-auto mb-4 block size-7 animate-spin rounded-full border-3 border-[#a9d4cf] border-t-[#087f78]" /> : null}
      <p className="mx-auto max-w-xl text-base font-semibold leading-7 text-[#0b2b3d]">
        {mensagem ?? (tipo === 'carregando' ? 'Carregando informações...' : tipo === 'vazio' ? 'Ainda não há registros para mostrar.' : 'Não foi possível carregar as informações.')}
      </p>
      {tipo === 'erro' && tentarNovamente ? (
        <button type="button" onClick={tentarNovamente} className="botao-secundario mt-5 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-2 text-sm font-bold">
          Tentar novamente
        </button>
      ) : null}
    </div>
  );
}
