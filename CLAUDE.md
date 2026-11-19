# ReportLAB — notas para o Claude Code

Editor de relatórios de análise de conjuntura do coLAB/UFF. App estático, sem build e sem servidor: `index.html` + `app.js` + `app.css` + `assets/`. Publicado pelo GitHub Pages a partir da raiz da branch `main` (domínio em `CNAME`: reports.colab.meme).

Origem: o app foi desenvolvido num artefato de design do Claude ("Template de relatório coLAB") e copiado para cá. A partir de agora, este repositório é a fonte de verdade.

## Rodar localmente

```sh
python3 -m http.server 8000   # depois abra http://localhost:8000
```

Abrir `index.html` direto via `file://` pode falhar (IndexedDB/crypto.subtle exigem contexto seguro; localhost serve).

## Estrutura de `app.js` (arquivo único, ~1.400 linhas, JS puro, sem módulos)

- Topo: constantes de marca (`PALETTE`, `ED_COLORS`), tipos de página (`TYPES`), bibliotecas carregadas sob demanda (`LIBS`: html2canvas, jsPDF, JSZip).
- `NEW` — fábricas de cada tipo de página; `ITEM` — fábricas dos itens de listas (temas, marcos, clusters, linhas de tabela etc.); `defaultDoc()` — documento inicial.
- Estado global: `state` (documento), lido/escrito por caminho com `get('pages.3.title')` / `set(...)`.
- Renderização: `R` (um renderizador por tipo de página) → `render()`; helpers de template `T` (texto editável), `S` (slot de imagem), `CAP`, `TABLE`, `LIST`, `RUN`, `FOOT`, `KICK`.
- Numeração automática de seções/figuras/tabelas (`computeSecs`, `figN`, `tabN`) e sumário (`tocHTML`).
- `checkOverflow`/`fitTables` — avisam quando a página excede o A4 e reduzem tabelas.
- `DB` — persistência em IndexedDB, criptografada com AES-GCM (chave via PBKDF2 a partir da senha do usuário).
- Exportações: PDF por impressão (regras `@media print` em `app.css`), PDF gerado no app (html2canvas + jsPDF) e Markdown (`.md` ou `.zip` com `imagens/`).

## Convenções

- **A cada mudança em `app.js` ou `app.css`, atualize o `?v=` dos dois em `index.html`.** O GitHub Pages manda guardar os arquivos em cache por 10 minutos; sem a versão nova na URL, o navegador pode juntar o `index.html` novo com o `app.js` antigo (botões sem ação).

- Interface e textos em português (pt-BR).
- Sem dependências locais nem etapa de build; bibliotecas externas só por CDN e sob demanda.
- Mudanças no formato de `state` precisam continuar abrindo documentos já salvos no IndexedDB dos usuários (migre campos ausentes ao carregar).
- Ao alterar layout das páginas, conferir a impressão em A4 sem margens.

## Material de referência

`reference/` guarda o que veio do artefato além do app (template de design do relatório, notas de sincronização). Não é servido pelo app.
