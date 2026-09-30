# ONG Solidariedade em Acao - Projeto Interativo

Projeto academico ficticio desenvolvido para praticar HTML, CSS e JavaScript com foco em interatividade e Single Page Application (SPA).

## Estrutura

```text
projeto_ong_solidariedade_em_acao_interativa/
|-- html/
|   |-- index.html
|   |-- projetos.html
|   |-- voluntariado.html
|   |-- contato.html
|   `-- doacoes.html
|-- css/
|   |-- variables.css
|   |-- layout.css
|   |-- components.css
|   `-- style.css
|-- images/
|-- js/
|   |-- main.js
|   |-- routes.js
|   |-- storage.js
|   `-- templates.js
`-- README.md
```


## Estratégia de versionamento

O projeto utiliza uma estratégia baseada em GitFlow:

- `main`: versão estável e pronta para produção;
- `develop`: integração das alterações em desenvolvimento;
- `feature/*`: desenvolvimento isolado de novas funcionalidades.

Os commits seguem o padrão Conventional Commits, utilizando prefixos como `feat`, `fix`, `docs`, `refactor` e `chore`.

## Navegacao SPA

O documento principal e `html/index.html`. O arquivo `js/routes.js` implementa roteamento por hash, com rotas como:

- `#inicio`
- `#projetos`
- `#projetos/educacao`
- `#voluntariado`
- `#contato`
- `#doacoes`

Ao navegar, o documento nao e recarregado. O roteador busca o conteudo da pagina correspondente, extrai o elemento `#conteudo` e injeta o fragmento na area principal da aplicacao.

## Execucao

Como a navegacao usa `fetch()`, abra o projeto por um servidor HTTP local, por exemplo com a extensao Live Server do VS Code. Nao abra `index.html` diretamente pelo protocolo `file://`.

O ponto de entrada e:

```text
html/index.html
```


## Templates dinâmicos

Os cards de projetos e os indicadores de impacto são gerados a partir de arrays em `js/templates.js`. O script usa Template Literals e `map()` para transformar os dados em HTML e preencher os contêineres identificados por `data-template`. O roteador chama novamente a renderização após cada troca de conteúdo da SPA.

## Etapa 3 - Interatividade com eventos

A aplicacao monitora eventos de clique, digitacao, alteracao, envio e reset de formularios. A delegacao de eventos no `document` mantem as interacoes funcionando mesmo quando a SPA substitui o conteudo de `#conteudo`.

- `click`: controla modal, fechamento de notificacoes e navegacao SPA.
- `input` e `change`: atualizam em tempo real o estado visual dos campos.
- `submit`: usa `preventDefault()`, valida os dados e exibe feedback ao usuario.
- `reset`: remove estados visuais de validacao.
- `keydown`: fecha menu/modal com a tecla Escape.

## Verificacao de consistencia em formularios

Os formularios utilizam validacao nativa do HTML5 combinada com JavaScript. Campos obrigatorios, tamanho minimo, formato de e-mail, telefone e selecoes sao verificados durante `input`, `change` e `submit`. O script aplica classes `is-valid`/`is-invalid`, cria mensagens de feedback no DOM e direciona o foco para o primeiro campo invalido antes de permitir o envio.


## Persistencia no navegador

O arquivo `js/storage.js` centraliza o uso do `localStorage`. Os formularios de contato e voluntariado salvam rascunhos automaticamente, a ultima rota visitada e um historico simples dos envios. Os dados estruturados sao serializados com `JSON.stringify()` e recuperados com `JSON.parse()`. Apos um envio valido, o rascunho e removido.


## Biblioteca externa - SweetAlert2

A aplicacao integra o SweetAlert2 via CDN do jsDelivr. A biblioteca e usada para exibir notificacoes de sucesso, erro, aviso e informacao. O metodo global `showToast()` verifica se `window.Swal` esta disponivel; quando a biblioteca carrega, usa `Swal.fire()` no modo toast. Caso o recurso externo falhe, o projeto mantem como fallback o componente de toast criado em JavaScript puro, evitando que a interface dependa totalmente do CDN.

Importacao utilizada:

```html
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11.26.25"></script>
```

## Modularizacao ES Modules

O JavaScript foi reorganizado por responsabilidade utilizando `import` e `export`:

- `main.js`: ponto de entrada e inicializacao da aplicacao.
- `events.js`: eventos, menu, modal e envio de formularios.
- `validation.js`: regras e feedback de validacao.
- `notifications.js`: SweetAlert2 e fallback de notificacoes.
- `storage.js`: persistencia com localStorage.
- `templates.js`: geracao de componentes dinamicos.
- `routes.js`: navegacao SPA e renderizacao de rotas.

As paginas carregam somente `main.js` como modulo. As dependencias internas sao resolvidas pelos imports do proprio JavaScript.
