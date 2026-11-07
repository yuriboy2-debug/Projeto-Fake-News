# CHECA AI — Front-end

Interface da plataforma **CHECA AI**, que verifica textos, links e imagens e ajuda as pessoas a reconhecer desinformação. Este módulo mostra os resultados do back-end, o histórico, o ranking de denúncias, a trilha educativa e o chatbot.

> Este README concentra a documentação do projeto: front-end, integração com o back-end, design e chatbot.

## Tecnologias

- React 18 + Vite
- React Router 6
- CSS puro (`src/styles.css`), sem biblioteca de componentes
- Sem dependência de banco ou servidor próprio: tudo vem do back-end via `fetch`

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

Variáveis em `.env`:

| Variável | Padrão | Descrição |
|---|---|---|
| `VITE_API_URL` | `http://localhost:3000` | URL do back-end |
| `VITE_USE_MOCK` | `true` no `.env.example` | `true` usa dados falsos em memória (não precisa do back-end) |

Para falar com o back-end real, suba o servidor (`npm start` na pasta do back) e use `VITE_USE_MOCK=false`. O back-end já libera o front com `cors`.

Build de produção: `npm run build` (saída em `dist/`).

## Telas

| Rota | Tela | O que faz |
|---|---|---|
| `/` | Início | Hero, verificador (abas **Texto ou link** e **Imagem**) e "como funciona" |
| `/historico` | Histórico | Consultas mais recentes, com veredito e paginação |
| `/ranking` | Mais denunciadas | Ranking com filtro de período (todo, 7 ou 30 dias) |
| `/aprender` | Aprenda a verificar | Trilha por faixa etária, método em 4 passos, propostas e FAQ |
| (global) | Chatbot | Botão "Tirar dúvida" no canto da tela; responde dúvidas e também verifica links e textos colados |

## Estrutura

```
src/
  main.jsx, App.jsx          # entrada e rotas
  styles.css                 # estilos (tokens no :root)
  services/
    api.js                   # ÚNICO arquivo que conhece as rotas do back-end
    mock.js                  # back-end falso para desenvolver sem servidor
  hooks/
    useChecagem.js           # envia, espera o veredito (polling) e controla os estados
    useFetch.js              # carregamento simples para histórico e ranking
  components/
    Checker.jsx              # abas + formulário de texto/link
    ImageChecker.jsx         # upload, arrastar e soltar, pré-visualização
    ResultCard.jsx           # veredito, fonte, orientações e denúncia
    Chatbot.jsx, Header.jsx, Footer.jsx
  pages/                     # Home, Historico, Ranking, Aprender
  data/                      # conteúdo (trilha educativa, respostas do chatbot)
  utils/                     # vereditos, sinais de alerta, formatação de datas
```

## Integração com o back-end

Usado hoje (README do back-end "Checa Aí"):

| Ação no front | Rota |
|---|---|
| Verificar texto ou link | `POST /noticias` (só uma URL colada vai em `link`; o resto em `conteudo`) |
| Acompanhar o veredito | `GET /noticias/:id` |
| Histórico | `GET /historico?pagina=&limite=` |
| Ranking | `GET /ranking?limite=&dias=` (usa o campo `denuncias`) |
| Denunciar | `POST /noticias/:id/denunciar` com `{ "motivo": "..." }` |
| Verificar imagem | `POST /imagens` — **proposta, ainda não existe** (ver abaixo) |

### Como o veredito chega

`POST /noticias` devolve `veredito: null` na primeira consulta, porque a integração com a Google Fact Check salva o resultado depois, via `PATCH /noticias/:id/resultado`. Por isso o hook `useChecagem`:

1. envia o conteúdo;
2. se `veredito` vier `null`, consulta `GET /noticias/:id` a cada 3 s, por até ~30 s;
3. se acabar o tempo, mostra "A análise está demorando" e manda a pessoa ao Histórico. **Não** assume que não há checagem.

Estados da interface: `enviando` → `analisando` → `pronto` (ou `demorando` / `erro`).

### Vereditos

| Valor do back-end | Rótulo no front |
|---|---|
| `falso` | Falso |
| `enganoso` | Enganoso |
| `verdadeiro` | Verdadeiro |
| `sem_checagem` | Sem checagem encontrada |

Regra do projeto: **"sem checagem" nunca é exibido como falso nem como verdadeiro.** Nesse caso (e no "enganoso") a tela mostra os 4 passos de investigação.

## Checagem de imagem

Hoje nenhum endpoint do back-end recebe imagem, e o chatbot informa que não analisa imagens. O front já está pronto para o fluxo abaixo; falta o back-end.

### O que o front faz

- Aceita **JPG, PNG e WebP, até 5 MB**, por clique ou arrastar e soltar, com pré-visualização.
- Aceita também o **endereço da imagem** (alternativa ao upload).
- Valida formato e tamanho antes de enviar e mostra o motivo em caso de recusa.
- Mostra o resultado no mesmo `ResultCard` do texto, mais a lista de `correspondencias`, se vier.

### Contrato proposto (para o back-end)

`POST /imagens` com `multipart/form-data`:

| Campo | Tipo | Observação |
|---|---|---|
| `imagem` | arquivo | opcional se houver `link` |
| `link` | texto | URL pública da imagem; opcional se houver `imagem` |

Resposta: **o mesmo formato de `POST /noticias`**, para o front reaproveitar o polling em `GET /noticias/:id`, com dois acréscimos:

```json
{
  "id": 7,
  "tipo": "imagem",
  "titulo": "Imagem: foto.jpg",
  "veredito": null,
  "fonte_checagem": null,
  "url_checagem": null,
  "total_consultas": 1,
  "ja_consultada_antes": false,
  "correspondencias": [
    { "texto": "Foto antiga usada como se fosse de hoje", "quem_afirmou": "Nome de quem divulgou" }
  ]
}
```

Erros no formato de sempre: `{ "erro": "mensagem" }` (400 para formato ou tamanho inválido).

### Sugestão de implementação no back-end

A Google Fact Check Tools tem um método de busca por imagem: `GET https://factchecktools.googleapis.com/v1alpha1/claims:imageSearch`. Pontos de atenção:

- Ele recebe o parâmetro `imageUri`, que **precisa ser uma URL pública** (http/https). Um arquivo enviado pelo usuário não serve direto: o back-end teria que servir o arquivo temporariamente numa URL pública e apagá-lo depois, ou o usuário usar a opção de colar o endereço.
- A documentação não garante que a requisição seja concluída (pode falhar por limitação do site de origem) e desaconselha depender de imagens hospedadas fora em produção.
- É uma API `v1alpha1`, então o formato pode mudar.
- Um resultado vazio deve virar `sem_checagem`, nunca `falso`.

Cuidados de segurança no upload: validar o tipo pelo conteúdo do arquivo (não só pela extensão), limitar tamanho, não usar o nome enviado pelo usuário e apagar o arquivo depois da consulta.

## Divergências entre os READMEs do back-end

Recebemos dois back-ends com rotas diferentes para denúncia e ranking. O front foi feito sobre o README "Checa Aí", que é o principal. Se o outro for mesclado, só `src/services/api.js` muda:

| | README "Checa Aí" (usado) | README "API de Denúncias" |
|---|---|---|
| Denunciar | `POST /noticias/:id/denunciar` com `motivo` livre | `POST /noticias/:id/denuncias` com `denunciante`, `motivo` fixo e `descricao`; responde `409` se repetir |
| Ranking | `?limite&dias`, campo `denuncias` | `?ordem&limite&pagina&minimo`, campo `total_denuncias` |

Hoje o front envia os motivos `boato`, `golpe`, `enganoso` e `outro`. Se adotarem os motivos fixos do outro README (`fake_news`, `spam`...), basta trocar a lista `MOTIVOS` em `ResultCard.jsx`.

## Design

Material recebido do design (README "Projeto de Design — Fake News"):

- **Mensagem principal:** "Antes de compartilhar, verifique a informação." (usada no topo do site)
- **Restrição de cor:** nada de azul nem tons azulados. O front respeita isso: vermelho, amarelo, preto, verde e cinzas quentes. Por isso o emoji 💙 da planilha do chatbot foi trocado por 💛.
- **Tipografia:** sem serifa, contraste adequado, poucas famílias. Hoje usamos Arial (do protótipo).
- **Materiais previstos que tocam o site:** tela final com fontes e orientações (seção "Fontes de checagem" em `/aprender`) e versões para diferentes tamanhos de tela (layout responsivo).

**A paleta e as fontes definitivas ainda não foram definidas.** No README do design, todos os HEX estão como `#000000` e os nomes de fonte estão em branco. Enquanto isso, o front usa as cores do protótipo `checa_ai.html`, que estão centralizadas no `:root` de `src/styles.css`:

| Token | Valor | Uso |
|---|---|---|
| `--red` | `#d71920` | ação principal, marca, "falso" |
| `--yellow` | `#ffd329` | destaque, bordas, "enganoso" |
| `--black` | `#151515` | topo, hero, rodapé |
| `--paper` | `#f6f5f1` | fundo |
| `--green` | `#16794a` | "verdadeiro" |

Quando a paleta sair, basta trocar esses valores. Acessibilidade já considerada: foco visível, teclado nas abas e no upload, `aria-live` nos resultados, `prefers-reduced-motion`. Do protótipo, ainda faltam letras ajustáveis, alto contraste e áudio de apoio.

## Chatbot

O widget (`Chatbot.jsx`) roda **no front**, sem endpoint. As 35 respostas vêm da planilha `CHATBOT.xlsx` (aba `PERGUNTAS`) e estão em `src/data/chatbot.js`. A pergunta é comparada com as da planilha por similaridade de palavras (sem acento, sem plural), e abaixo de um limite o bot usa uma resposta padrão.

Fluxo de verificação no chat (categoria "Verificação de notícias" da aba `NECESSARIOS`): se a pessoa cola um **link** ou um **texto com 120 caracteres ou mais**, o chat chama `POST /noticias`, aguarda o veredito e responde com o resultado e o link da fonte. Falso, enganoso, verdadeiro e "sem checagem" correspondem às categorias de notícia falsa, verdadeira e informação duvidosa.

### Ajustes feitos no texto da planilha

Para a equipe do chatbot aprovar ou reverter:

1. Corrigidos erros de digitação (ex.: "confiaveis", "brasileir os", aspas soltas, e a despedida "Até aproxima. Prescisar prescicar" virou "Até a próxima. Precisando, é só chamar.").
2. **Resposta sobre imagens reescrita.** A original dizia que o bot não analisa imagens, o que contradiz a aba "Imagem". Agora ela aponta para a aba e explica que a busca é por checagens que já usaram a mesma imagem.
3. **Removido o exemplo da capa falsa da IstoÉ** (com nome de político). Não consegui verificar e o design exige que todo dado tenha fonte confiável. Se for mantido, é preciso incluir a fonte.
4. Removido "milhares de verificações" da resposta "Como funciona?", por ser um número sem comprovação.
5. Emoji 💙 trocado por 💛 (restrição de cor do design).

## Pendências

**Back-end e integração**
- [ ] Endpoint `POST /imagens` (contrato na seção "Checagem de imagem")
- [ ] Definir quem dispara a integração com a Google Fact Check e salva o resultado via `PATCH` (hoje o front só aguarda)
- [ ] Unificar denúncias e ranking dos dois back-ends
- [ ] Nome: o README do back-end ainda diz "Checa Aí" (o oficial é CHECA AI), e os dois READMEs de back-end pedem versões diferentes do Node (18 e 22.13)
- [ ] **Privacidade do histórico:** `GET /historico` é global, então a página mostra para qualquer visitante o título/link do que *outras pessoas* verificaram, e o título nasce do começo do texto enviado. Decidir: histórico por sessão/dispositivo, ou mostrar só links públicos

**Design**
- [ ] Paleta definitiva (HEX) e fontes definitivas
- [ ] Confirmar se as cores do protótipo HTML são a "referência visual" citada no README do design
- [ ] Créditos de imagens, ícones e fontes (campos ainda vazios no README do design)
- [ ] Opcional: tópicos do design que ainda não têm tela ("Por que as pessoas compartilham desinformação?" e "Quais são os impactos?")

**Chatbot**
- [ ] A planilha diz que a base são sites como Aos Fatos, Boatos.org e G1 Fato ou Fake, mas o back-end usa a Google Fact Check Tools. Alinhar o que o bot diz com o que o sistema faz
- [ ] Aba `NECESSARIOS`: a linha "Informação duvidosa" diz "Quando o usuário iniciar a conversa", igual à de Boas-vindas, provavelmente por engano
- [ ] Frases de fechamento diferentes: "Antes de compartilhar, cheque!" (chatbot) e "Antes de compartilhar, verifique a informação." (design). Escolher uma

**Qualidade e entrega**
- [ ] Nenhum teste automatizado
- [ ] O projeto ainda não foi compilado nem testado no navegador (só validei a sintaxe e a busca do chatbot); rodar `npm install && npm run dev` e revisar as telas
- [ ] Hospedagem não definida (com `BrowserRouter`, o servidor precisa devolver `index.html` nas rotas internas)
- [ ] Conferir os endereços das agências em `FONTES` antes de publicar

## Equipe

| Parte | Responsáveis |
|---|---|
| Back-end | Lino e Murilo |
| API (Google Fact Check Tools) | Patrick e colega |
| Chatbot | Júlia |
| Front-end | Yuri e João Vitor |
| Design | Fernanda |
| README | Armando e Otávio |
