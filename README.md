# ÚltimaQuadra — Acessibilidade começa antes da porta

Global Solution CitizenTech 2026/2 · Front-End Design Engineering · FIAP.

O ÚltimaQuadra organiza relatos sobre obstáculos físicos nos trechos de calçada de acesso a Unidades Básicas de Saúde. A plataforma apresenta UBS cadastradas, seus trechos e ocorrências relacionadas, permite enviar um relato, obter confirmação e consultá-lo posteriormente.

## Tecnologias

React, Vite, TypeScript, Tailwind CSS 4, React Router DOM e Fetch API nativa (sem Axios). A organização segue as aulas, com páginas em `routes`, componentes em `components`, tipos em `types` e requisições em `services`.

## Como executar

Pré-requisitos: Node.js compatível com a versão do Vite e npm.

```bash
cd my-app
npm install
npm run dev
```

Acesse a URL exibida pelo Vite (normalmente `http://localhost:5173/`). Para verificar compilação e pré-visualização:

```bash
npm run build
npm run preview
```

## Páginas

| Rota | Função |
| --- | --- |
| `/` | Home, proposta do ÚltimaQuadra e acesso aos fluxos principais |
| `/integrantes` | Identificação dos cinco integrantes e links públicos |
| `/sobre` | Apresentação aprofundada do problema, proposta, jornada do cidadão, públicos, limites e ODS |
| `/faq` | Perguntas e respostas |
| `/contato` | Formulário de contato com validações e feedback demonstrativo (sem envio ou armazenamento) |
| `/ocorrencias` | Consulta geral com busca, filtros de UBS, categoria, situação e ordenação; combinações compartilháveis pela URL |
| `/unidades` | Busca de UBS com estados de carregamento, erro e sem resultados |
| `/unidades/:id` | Trechos de acesso e ocorrências da UBS |
| `/ocorrencias/:id` | Detalhes e situação de uma ocorrência |
| `/registrar` | Formulário validado, pré-seleção de UBS/trecho e revisão |
| `/confirmacao/:id` | Confirmação e acesso ao relato recém-cadastrado |
| Outros endereços | Página não encontrada |


## Navegação

O menu apresenta primeiro as páginas de contextualização (`Início`, `Sobre`, `FAQ`, `Integrantes`, `Contato`) e depois o acesso às funcionalidades (`Unidades`, `Ocorrências`, `Registrar`). No celular, essas opções são apresentadas em dois grupos.

## Integração padrão: API Java + Oracle

A aplicação vem configurada para usar **somente a API Java** em `https://ultimaquadra-gs2.onrender.com` (sem `VITE_DATA_SOURCE=local`). As operações são feitas com `fetch` nativo e **não** misturam resultados remotos com dados locais. Os nomes e endereços exibidos em modo API são os que o Java devolve; a presença das sete UBS depende de executar o SQL do projeto Java no Oracle do Render.

A implantação na Vercel deve ter `VITE_DATA_SOURCE=api` e `VITE_API_URL=https://ultimaquadra-gs2.onrender.com` nas Environment Variables. Se existir um `.env.local` antigo contendo `VITE_DATA_SOURCE=local`, atualize-o ou remova-o antes dos testes de integração. Modificações nas variáveis de ambiente exigem novo build/deploy.

**Modo local opcional para desenvolvimento isolado:** ao definir expressamente `VITE_DATA_SOURCE=local`, o navegador usa as sete UBS cadastradas em `src/data/base.ts` e salva ocorrências apenas em `localStorage`. Este modo **não equivale à integração** e **não oferece a exclusão no Oracle**. O modo API é o padrão; falhas de GET não acionam fallback para dados locais.

### Origem das sete UBS reais

Nomes, endereços e CEPs foram conferidos na **Relação dos Estabelecimentos/Serviços da SMS-SP por Subprefeitura — setembro de 2026**, publicada pela Prefeitura de São Paulo. Os identificadores CNES constam da **Portaria SMS nº 609, de 16 de setembro de 2026**:

- Relação municipal (setembro/2026): https://smartsampa.prefeitura.sp.gov.br/documents/d/saude/unid_munic_saude_sub_setembro2026
- Portaria SMS nº 609/2026 (CNES): https://legislacao.prefeitura.sp.gov.br/portaria-secretaria-municipal-da-saude-sms-609-de-16-de-setembro-de-2026/consolidado

| UBS | Endereço cadastrado | CNES |
| --- | --- | --- |
| Bom Retiro — Dr. Octavio Augusto Rodovalho | Rua Tenente Pena, 8 — Bom Retiro | 2029618 |
| Boracea | Rua Boracea, 270 — Barra Funda | 6048633 |
| Cambuci | Avenida Lacerda Franco, 791 — Cambuci | 2786834 |
| Humaitá — Dr. João de Azevedo Lage | Rua Humaitá, 520 — Bela Vista | 2787113 |
| República — Fernanda Sante Limeira | Rua Líbero Badaró, 282 — Centro | 6090621 |
| Santa Cecília — Dr. Humberto Pascale | Rua Vitorino Carmilo, 599 — Campos Elíseos | 2752336 |
| Sé | Rua Frederico Alvarenga, 259 — Sé | 5975220 |

O projeto **não inventa obstáculos em estabelecimentos reais**. As áreas intituladas **“Entorno imediato da UBS — local a indicar”** servem apenas para associar o relato ao entorno do endereço cadastrado. **Não são trechos vistoriados, georreferenciados ou delimitados como partes reais do caminho**. Os identificadores internos dessas áreas foram mantidos para preservar os vínculos dos relatos locais existentes. O formulário exige um **ponto de referência reconhecível**, informado pelo cidadão, enquanto a área não estiver individualizada. A validação mínima exige 15 caracteres e recusa algumas respostas vagas; ela **não verifica geograficamente** a informação fornecida. Trechos futuros somente devem ser individualizados após confirmação de suas referências. Até ocorrer o primeiro relato, as UBS e a página de ocorrências mostram estado vazio.

Os testes realizados com a versão anterior (UBS fictícias) permanecem na chave antiga `ultimaquadra:ocorrencias:v1` do navegador. A versão atual usa `ultimaquadra:ocorrencias:v2` para evitar que relatos antigos sejam associados incorretamente às UBS reais. Esses registros antigos **não são apagados**, mas não aparecem na consulta atual.

## Contrato Java confirmado nos arquivos da API

### Endpoints utilizados pelo React

| Método | Endpoint | Uso na interface |
|---|---|---|
| GET | `/api/unidades` | Busca de UBS e seleção no formulário |
| GET | `/api/trechos` | Trechos associados à UBS |
| GET | `/api/ocorrencias` | Listagem, contadores e filtros |
| GET | `/api/ocorrencias/{id}` | Detalhe e confirmação de cadastro |
| POST | `/api/ocorrencias` | Cadastro de relato (esperado HTTP **201**) |
| DELETE | `/api/ocorrencias/{id}` | Exclusão permanente (esperado HTTP **204**) |

O Java também oferece outros métodos CRUD para unidades, trechos e ocorrências. O Front-End **não** inclui controles de exclusão de UBS ou trechos.

### Campos de dados e regras

- `id`, `unidadeId` e `trechoId`: **Long** no Java/Oracle. O Front-End converte os números para strings durante a navegação e volta a converter `unidadeId` e `trechoId` para números seguros no POST. As strings locais antigas (como `ubs-bom-retiro`) **não** são enviadas ao Java.
- `GET /api/unidades`: objetos com `id`, `cnes`, `nome`, `bairro`, `endereco`, `referencia`, `descricao`, `ativa`.
- `GET /api/trechos`: objetos com `id`, `unidadeId`, `nome`, `descricao`, `distanciaMediaEntrada`, `ativo`.
- `GET /api/ocorrencias` e detalhe: `id`, `unidadeId`, `trechoId`, `categoria`, `descricao`, `referenciaLocal`, `passagem`, `situacao`, `dataRelato` (ISO `YYYY-MM-DD`) e campos complementares opcionais.
- `POST /api/ocorrencias`: JSON com `unidadeId`, `trechoId` numéricos, `categoria`, `descricao`, e opcionalmente `referenciaLocal`, `passagem`. Áreas genéricas exigem referência reconhecível de no mínimo 15 caracteres tanto no React como no Java.
- O Java atribui automaticamente a situação inicial **Relatada**, não a recebe do formulário. UBS e trecho desativados não são disponibilizados para novo registro no formulário React; o Java também os valida.
- O frontend interpreta os erros estruturados `ApiErro` (mensagem/detalhes) nos status 400/404/409. Erros 500 ou de rede são apresentados sem simular sucesso nem misturar com registros locais.

### Exclusão de ocorrências

Em `/ocorrencias/{id}`, o botão **Excluir ocorrência** abre uma confirmação acessível. **Cancelar** não envia nada. Somente após confirmar, o React chama DELETE; em caso de **204**, retorna para `/ocorrencias`, mostra o feedback e carrega novamente a lista por GET. Erros 404, 409, 500 e de rede mantêm a pessoa na confirmação e não declaram exclusão. O envio é protegido contra acionamentos duplicados enquanto a requisição está em andamento.

**Limite de segurança acadêmico:** o CRUD da API foi entregue **sem autenticação/autorização**. Portanto, a exclusão pela interface **não é restrita ao autor do relato**: qualquer pessoa com acesso ao sistema pode solicitar a remoção de qualquer ocorrência. Isso atende à demonstração do CRUD, mas impede considerar a versão pública pronta para produção cidadã sem controles adicionais. Essa limitação deve ser explicitada na apresentação e, se for disponibilizada a usuários reais, resolvida antes da abertura pública. **Não utilize relatos legítimos em testes de exclusão.**

### Como configurar

Copie `my-app/.env.example` para `my-app/.env.local`, ou configure as variáveis diretamente na Vercel. A URL e os caminhos já possuem os valores reais como padrão em `services/api.ts`:

```dotenv
VITE_DATA_SOURCE=api
VITE_API_URL=https://ultimaquadra-gs2.onrender.com
VITE_API_UNIDADES_PATH=/api/unidades
VITE_API_TRECHOS_PATH=/api/trechos
VITE_API_OCORRENCIAS_PATH=/api/ocorrencias
```

O CORS na versão Java analisada (`config/WebConfig.java`) declara `GET`, `POST`, `PUT`, `DELETE` e `OPTIONS`, permite `Content-Type`/`Accept` e expõe `Location`. **O código é compatível com o preflight**, mas a resposta HTTP real no Render e o funcionamento no navegador ainda precisam de verificação.

### Teste ponta a ponta (somente com dados controlados)

1. Execute as consultas GET e confirme os sete CNES e sete áreas de acesso realmente existentes no Oracle publicado.
2. Em ambiente de teste isolado, registre uma ocorrência identificada como teste; confirme o POST 201 e o ID recebido.
3. Consulte `/api/ocorrencias/{id}` por GET e atualize `/ocorrencias` no navegador; confirme a persistência no banco compartilhado.
4. Abra os detalhes, cancele uma exclusão (não deve haver chamada DELETE), depois confirme; o Java deve retornar 204.
5. Atualize a lista por GET e confirme que o ID foi removido; novo GET do ID deve retornar 404.
6. Teste erros 404, 409, 500, falha de rede e CORS no navegador. Nunca exclua relatos legítimos ou associe obstáculos fictícios a UBS reais na base pública.

Não confunda testes simulados de `fetch` com testes efetivos contra o Render ou Oracle. A integração remota só estará aprovada após executar esse roteiro com os serviços disponíveis.

## Estrutura

```text
ultimaquadra/
├── README.md
└── my-app/
    ├── .env.example
    ├── public/assets/
    ├── src/
    │   ├── components/
    │   ├── data/
    │   ├── routes/
    │   ├── services/
    │   ├── types/
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    ├── vite.config.ts
    └── vercel.json
```

## Experiência de consulta

A consulta de ocorrências está acessível diretamente na navegação, na Home, na página de UBS, nos detalhes de cada unidade e na confirmação de cadastro. Os filtros são combináveis e ficam registrados na URL (por exemplo, `?unidade=...`), permitindo abrir uma consulta específica. A listagem trata carregamento, erro de rede, ausência total de relatos e ausência de resultados após filtragem como estados diferentes. Os dados são ordenados localmente após a consulta.

## Responsividade e acessibilidade

Projeto adaptado para mobile (390 × 844), tablet (768 × 1024) e desktop (1440 × 900). O menu para telas menores suporta Escape, as rotas têm navegação acessível, os formulários associam `label`/`input`, sinalizam campos inválidos e as mensagens de operação usam regiões de status/alerta. A validação visual final nessas resoluções deve ocorrer com a versão executável no navegador.

## Integrantes

| Integrante | RM | Turma |
| --- | --- | --- |
| Maria Eduarda Escandor | 568216 | 1TDSPO |
| Erick Menezes | 570325 | 1TDSPF |
| Maria Eduarda Lopes de Lima | 572425 | 1TDSPO |
| Matheus Yudi | 571245 | 1TDSPF |
| Nicolas Sousa | 574141 | 1TDSPH |

Os nomes, RMs, turmas e links da página foram reaproveitados como **informações da equipe** do repositório ECOUP; confirmar a composição desta GS. As cinco fotografias estão em `my-app/public/assets/equipe/`, reaproveitadas dos arquivos do projeto ECOUP fornecidos como referência. Para substituí-las pelas fotos finais, mantenha os mesmos nomes de arquivo, extensões e caminhos. Confirmar a composição desta GS antes da entrega.

## Publicação e entregáveis

- **GitHub do Front-End:** adicionar URL definitiva.
- **Vercel:** adicionar URL definitiva. Configurar Root Directory = `my-app`, Framework Preset = Vite; o `vercel.json` contém rewrite para navegação SPA.
- **API Java remota:** https://ultimaquadra-gs2.onrender.com — validação de GET/POST/DELETE no ambiente publicado pendente.
- **Vídeo YouTube (máximo 3 minutos):** adicionar URL pública ou não listada.
- **Contato:** a página `/contato` valida o preenchimento no navegador, mas **não envia ou armazena mensagens**; os links públicos de GitHub/LinkedIn estão na página `/integrantes`.

O repositório deve ser público com, no mínimo, cinco commits de cada integrante e quinze no total. A entrega é um ZIP de até 50 MB enviado pelo representante no Portal do Aluno, **sem `node_modules`**.

## Uso de inteligência artificial

O desenvolvimento do Front-End contou com apoio do ChatGPT na estruturação, explicação, revisão e geração de código. A equipe deve revisar, compreender, testar e documentar as decisões e o uso de IA conforme a exigência acadêmica.
