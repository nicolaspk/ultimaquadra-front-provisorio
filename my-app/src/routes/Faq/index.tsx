import { Link } from 'react-router-dom';
import Container from '../../components/Container/Container';
import TituloPagina from '../../components/TituloPagina/TituloPagina';

const perguntas = [
  {
    pergunta: 'O que é o ÚltimaQuadra?',
    resposta: 'É uma plataforma colaborativa para registrar, consultar e organizar informações sobre obstáculos físicos em trechos de calçadas que dão acesso às Unidades Básicas de Saúde.',
  },
  {
    pergunta: 'As unidades de saúde cadastradas existem de verdade?',
    resposta: 'Sim. O piloto utiliza sete UBS da região central de São Paulo com nome, endereço e CNES verificados em cadastros oficiais municipais. As áreas de acesso são referências para organizar relatos, não locais inspecionados pela equipe. A existência de uma UBS não comprova as condições de suas calçadas.',
  },
  {
    pergunta: 'Quais tipos de obstáculos podem ser relatados?',
    resposta: 'Entre as categorias previstas estão buracos, desníveis, passagem estreita, obstáculos fixos ou temporários, pavimentação irregular e ausência de rebaixamento.',
  },
  {
    pergunta: 'O que significa uma ocorrência relatada?',
    resposta: 'Significa que a informação foi enviada por um colaborador e ainda não passou por verificação independente. Um relato não deve ser tratado como constatação oficial.',
  },
  {
    pergunta: 'Preciso de cadastro para consultar informações?',
    resposta: 'A proposta prevê consulta pública sem a necessidade de criar uma conta ou informar dados pessoais.',
  },
  {
    pergunta: 'Onde encontro um obstáculo depois de registrá-lo?',
    resposta: 'Depois de confirmar o envio, o site mostra uma confirmação e, quando houver identificador, um link direto para o relato. Todas as ocorrências disponíveis também podem ser pesquisadas na página Ocorrências, inclusive por UBS e categoria. No modo local, os registros novos ficam guardados somente neste navegador.',
  },
  {
    pergunta: 'E se minha UBS não aparecer na busca?',
    resposta: 'A cobertura começa pelas unidades cadastradas na plataforma. Se a sua UBS não estiver na lista, não associe o relato a outra unidade. Consulte novamente quando a cobertura for ampliada.',
  },
  {
    pergunta: 'Uma unidade sem relatos tem acesso garantido?',
    resposta: 'Não. A ausência de ocorrências cadastradas não comprova que a calçada esteja livre de obstáculos ou que o trajeto seja acessível.',
  },
  {
    pergunta: 'O registro substitui uma solicitação à prefeitura?',
    resposta: 'Não. O ÚltimaQuadra organiza relatos comunitários; o envio de uma ocorrência não equivale à abertura de um protocolo em um serviço público oficial.',
  },
  {
    pergunta: 'O ÚltimaQuadra indica rotas seguras ou faz avaliações técnicas?',
    resposta: 'Não. A plataforma concentra informações sobre trechos de acesso. Ela não certifica condições de segurança, não fornece laudos técnicos e não garante que um caminho possa ser percorrido sem dificuldades.',
  },
] as const;

export default function Faq() {
  return (
    <>
      <TituloPagina
        etiqueta="Perguntas frequentes"
        titulo="Entenda a proposta e como as informações são utilizadas."
        descricao="Reunimos as principais dúvidas sobre o ÚltimaQuadra, os relatos comunitários e os cuidados no uso das informações."
      />

      <section aria-labelledby="faq-perguntas" className="py-14 sm:py-20">
        <Container className="max-w-4xl">
          <h2 id="faq-perguntas" className="mb-8 text-2xl font-bold tracking-tight text-[#0b2b3d] sm:text-3xl">
            O que você gostaria de saber?
          </h2>
          <div className="space-y-3">
            {perguntas.map((item) => (
              <details key={item.pergunta} className="group rounded-2xl border border-[#d9e8de] bg-white px-5 py-1 shadow-[0_8px_24px_-24px_#0b2b3d] open:border-[#92c5ad] sm:px-7">
                <summary className="flex min-h-18 cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-base font-bold text-[#0b2b3d] focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0c948a] sm:text-lg [&::-webkit-details-marker]:hidden">
                  <span>{item.pergunta}</span>
                  <span aria-hidden="true" className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#e9f3ec] text-xl font-medium text-[#0c7771] transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="max-w-3xl border-t border-[#edf3ef] py-5 text-base leading-8 text-[#49685e]">
                  {item.resposta}
                </p>
              </details>
            ))}
          </div>
          <div className="mt-12 rounded-2xl bg-[#e7f2e9] p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[#0b2b3d]">Conheça a motivação do projeto</h2>
            <p className="mt-3 max-w-2xl leading-7 text-[#49685e]">Saiba por que decidimos olhar para os caminhos de acesso às unidades de saúde.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/ocorrencias" className="botao-primario inline-flex min-h-11 items-center rounded-xl px-5 py-3 text-sm font-bold">Consultar ocorrências</Link>
              <Link to="/sobre" className="botao-secundario inline-flex min-h-11 items-center rounded-xl px-5 py-3 text-sm font-bold">Conhecer o ÚltimaQuadra</Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
