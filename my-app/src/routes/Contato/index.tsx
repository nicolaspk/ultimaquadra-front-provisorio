import { useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container';
import TituloPagina from '../../components/TituloPagina/TituloPagina';

type Campo = 'nome' | 'email' | 'mensagem';
type DadosContato = Record<Campo, string>;
type ErrosContato = Partial<Record<Campo, string>>;

const camposIniciais: DadosContato = { nome: '', email: '', mensagem: '' };
const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Contato() {
  const [dados, setDados] = useState<DadosContato>(camposIniciais);
  const [erros, setErros] = useState<ErrosContato>({});
  const [mensagemValidada, setMensagemValidada] = useState(false);
  const nomeRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const mensagemRef = useRef<HTMLTextAreaElement>(null);

  function atualizar(evento: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const campo = evento.target.name as Campo;
    setDados((anterior) => ({ ...anterior, [campo]: evento.target.value }));
    setErros((anterior) => ({ ...anterior, [campo]: undefined }));
    setMensagemValidada(false);
  }

  function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    const novosErros: ErrosContato = {};
    if (dados.nome.trim().length < 2) novosErros.nome = 'Informe seu nome, com pelo menos 2 caracteres.';
    if (!emailValido.test(dados.email.trim())) novosErros.email = 'Informe um e-mail válido.';
    if (dados.mensagem.trim().length < 15) novosErros.mensagem = 'Escreva pelo menos 15 caracteres para explicar sua mensagem.';

    setErros(novosErros);
    setMensagemValidada(false);

    if (novosErros.nome) nomeRef.current?.focus();
    else if (novosErros.email) emailRef.current?.focus();
    else if (novosErros.mensagem) mensagemRef.current?.focus();
    else {
      // A página não tem serviço de envio de e-mail: nenhum dado é transmitido ou armazenado.
      setMensagemValidada(true);
      setDados(camposIniciais);
    }
  }

  const estiloCampo = (erro?: string) =>
    `mt-2 w-full rounded-xl border bg-[#f9fcfb] px-4 py-3.5 text-base text-[#0b2b3d] outline-none transition-colors placeholder:text-[#6d8383] focus-visible:ring-2 focus-visible:ring-[#168a80]/25 ${
      erro ? 'border-[#ad3551] focus:border-[#ad3551]' : 'border-[#bcd4ce] focus:border-[#0c7771]'
    }`;

  return (
    <>
      <TituloPagina
        etiqueta="Fale com a equipe"
        titulo="Sua mensagem também faz parte da conversa."
        descricao="Tem uma dúvida, sugestão ou comentário sobre o ÚltimaQuadra? Utilize o formulário abaixo para organizar sua mensagem."
      />

      <section aria-labelledby="titulo-formulario-contato" className="bg-[#f7f8f5] py-16 sm:py-20">
        <Container className="grid items-start gap-7 lg:grid-cols-[0.8fr_1.2fr] lg:gap-10">
          <aside className="relative overflow-hidden rounded-[1.8rem] bg-[#0b2b3d] p-7 text-white shadow-[0_18px_42px_-30px_#0b2b3d] sm:p-9">
            <div aria-hidden="true" className="padrao-calcada absolute inset-0 opacity-40" />
            <div className="relative">
              <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-[#ff8b63] text-[#092637]">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                  <path d="M3.5 6.5h17v11h-17z" /><path d="m4 7 8 6 8-6" />
                </svg>
              </span>
              <p className="mt-7 text-xs font-extrabold tracking-[0.15em] text-[#9ee2d7] uppercase">Contato e participação</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">Queremos ouvir suas ideias.</h2>
              <p className="mt-5 leading-8 text-[#d1e7e5]">Comentários sobre a proposta, dúvidas sobre a plataforma e sugestões de melhoria ajudam a enriquecer o diálogo sobre acessibilidade urbana.</p>
              <div className="mt-8 border-t border-white/20 pt-7">
                <h3 className="font-bold text-white">Encontrou uma barreira perto de uma UBS?</h3>
                <p className="mt-2 text-sm leading-7 text-[#d1e7e5]">Para compartilhar um obstáculo com a comunidade, utilize a página própria de registro de ocorrências.</p>
                <Link to="/registrar" className="botao-destaque mt-5 inline-flex min-h-11 items-center justify-center rounded-xl px-5 py-3 text-sm font-extrabold">Registrar ocorrência</Link>
              </div>
              <Link to="/faq" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-[#9ee2d7] underline underline-offset-4 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ff8b63]">
                Consultar perguntas frequentes
              </Link>
            </div>
          </aside>

          <div className="rounded-[1.8rem] border border-[#d7e4df] border-t-4 border-t-[#ff8b63] bg-white p-6 shadow-[0_18px_42px_-32px_#0b2b3d] sm:p-9">
            <p className="text-xs font-extrabold tracking-[0.15em] text-[#0c7771] uppercase">Formulário de contato</p>
            <h2 id="titulo-formulario-contato" className="mt-3 text-2xl font-extrabold tracking-tight text-[#0b2b3d] sm:text-3xl">Escreva para a equipe</h2>
            <p className="mt-3 text-sm leading-7 text-[#496666]">Preencha os campos abaixo. Nenhum dado de saúde ou outra informação sensível é necessário.</p>

            {mensagemValidada && (
              <div role="status" aria-live="polite" className="mt-7 flex items-center gap-4 rounded-2xl border-2 border-[#66bb9c] bg-[#e5f7ee] px-5 py-6 text-[#0a5c49] shadow-[0_12px_25px_-20px_#0b2b3d] sm:px-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#0b705a] text-white">
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-7">
                    <path d="m5 12 5 5L19 7" />
                  </svg>
                </span>
                <strong className="text-lg font-extrabold leading-7 sm:text-xl">Mensagem enviada com sucesso!</strong>
              </div>
            )}

            <form noValidate onSubmit={enviar} className="mt-7 space-y-5">
              <div>
                <label htmlFor="contato-nome" className="text-sm font-bold text-[#0b2b3d]">Nome completo <span aria-hidden="true" className="text-[#b34936]">*</span></label>
                <input
                  ref={nomeRef}
                  id="contato-nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  value={dados.nome}
                  onChange={atualizar}
                  aria-required="true"
                  aria-invalid={Boolean(erros.nome)}
                  aria-describedby={erros.nome ? 'erro-contato-nome' : undefined}
                  placeholder="Como podemos chamar você?"
                  className={estiloCampo(erros.nome)}
                />
                {erros.nome && <p id="erro-contato-nome" role="alert" className="mt-2 text-sm font-semibold text-[#a3314b]">{erros.nome}</p>}
              </div>

              <div>
                <label htmlFor="contato-email" className="text-sm font-bold text-[#0b2b3d]">E-mail <span aria-hidden="true" className="text-[#b34936]">*</span></label>
                <input
                  ref={emailRef}
                  id="contato-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={150}
                  value={dados.email}
                  onChange={atualizar}
                  aria-required="true"
                  aria-invalid={Boolean(erros.email)}
                  aria-describedby={erros.email ? 'erro-contato-email' : undefined}
                  placeholder="seuemail@exemplo.com"
                  className={estiloCampo(erros.email)}
                />
                {erros.email && <p id="erro-contato-email" role="alert" className="mt-2 text-sm font-semibold text-[#a3314b]">{erros.email}</p>}
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label htmlFor="contato-mensagem" className="text-sm font-bold text-[#0b2b3d]">Sua mensagem <span aria-hidden="true" className="text-[#b34936]">*</span></label>
                  <span className="text-xs text-[#5d7773]">{dados.mensagem.length}/1000</span>
                </div>
                <textarea
                  ref={mensagemRef}
                  id="contato-mensagem"
                  name="mensagem"
                  value={dados.mensagem}
                  onChange={atualizar}
                  rows={5}
                  maxLength={1000}
                  aria-required="true"
                  aria-invalid={Boolean(erros.mensagem)}
                  aria-describedby={erros.mensagem ? 'erro-contato-mensagem' : undefined}
                  placeholder="Conte sua dúvida, sugestão ou comentário."
                  className={`${estiloCampo(erros.mensagem)} resize-y`}
                />
                {erros.mensagem && <p id="erro-contato-mensagem" role="alert" className="mt-2 text-sm font-semibold text-[#a3314b]">{erros.mensagem}</p>}
              </div>

              <button type="submit" className="botao-primario inline-flex min-h-12 w-full items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold sm:w-auto">
                Enviar mensagem
              </button>
            </form>
          </div>
        </Container>
      </section>
    </>
  );
}
