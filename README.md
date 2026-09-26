# ReportLAB

Editor de relatórios de análise de conjuntura do [coLAB/UFF](https://colab.meme). Roda inteiramente no navegador, sem servidor e sem instalação.

## O que faz

- Abre o modelo do relatório (capa + páginas internas + expediente) em A4.
- Edita diretamente qualquer texto da página, clicando sobre ele.
- Troca imagens arrastando arquivos para as áreas de figura (ou clicando nelas). Cada imagem pode ser ajustada (inteira) ou preencher a área.
- Muda a cor da edição (capa e detalhes internos), o número, a data, o DOI, o ISBN (opcional) e demais metadados no painel lateral.
- Adiciona, duplica, exclui e reordena páginas (arrastando na lista ou com as setas).
- Adiciona e remove itens: temas, dados do corpus, marcos da linha do tempo, leituras, grupos da legenda, clusters, imagens compostas, linhas da tabela, créditos.
- Numera automaticamente seções, figuras e páginas, e monta o sumário.
- Avisa quando o conteúdo de uma página excede o espaço A4.
- Salva automaticamente no navegador (IndexedDB). O documento não sai do computador do usuário.
- Pede senha de acesso. No primeiro acesso em cada navegador, o usuário cria a senha; o documento é salvo criptografado com ela (AES-GCM, chave derivada por PBKDF2). A senha pode ser alterada em Configurações (ícone de engrenagem), onde também há a opção de sair e bloquear. Sem a senha, o documento salvo não pode ser recuperado: “Esqueci a senha” apaga o documento deste navegador e permite criar outra.
- Exporta:
  - **PDF pela impressão** — vetorial, texto selecionável. Na janela de impressão: “Salvar como PDF”, papel A4, margens “Nenhuma”, “Gráficos de plano de fundo” ativado.
  - **PDF gerado no app** — idêntico em qualquer navegador (páginas rasterizadas em alta resolução).
  - **Markdown** — `.md`; se houver imagens, um `.zip` com o `.md` e a pasta `imagens/`.

## Publicar no GitHub Pages

1. Copie o conteúdo desta pasta para a raiz do repositório `coLAB-UFF/reports` (branch `main`): `index.html`, `app.js`, `app.css`, `assets/`, `.nojekyll`.
2. Em **Settings → Pages**, escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
3. O app ficará em `https://colab-uff.github.io/reports/`.

## Arquivos

- `index.html` — estrutura do editor.
- `app.css` — estilos do editor e das páginas (inclui as regras de impressão A4 sem margens).
- `app.js` — modelo de dados, tipos de página, edição, persistência e exportações.
- `assets/logo-white.svg`, `assets/logo-black.svg` — logotipo do coLAB.

Dependências carregadas sob demanda por CDN: html2canvas e jsPDF (PDF gerado no app), JSZip (Markdown com imagens). Fontes: Open Sans e Source Serif 4 (Google Fonts). Ícones: Phosphor.

## Como citar

CHAGAS, V. et al. ReportLAB (Software). Niterói: coLAB/UFF, 2026. Disponível em: https://colab-uff.github.io/reports/.
