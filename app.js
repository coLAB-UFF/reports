'use strict';
/* ReportLAB — editor de relatórios de análise de conjuntura do coLAB/UFF */

const PALETTE = ['#0088b0', '#d6006c', '#edbb00', '#004961', '#ffc0d0', '#9b9797', '#006786', '#aa0b56'];
const ED_COLORS = [['#d6006c', 'Magenta'], ['#0088b0', 'Ciano'], ['#edbb00', 'Amarelo'], ['#201e1d', 'Preto']];
const TYPES = {
  capa: 'Capa',
  episodio: 'Episódio (texto + imagem-chave)',
  figura: 'Figura larga',
  mapa: 'Figura + legenda',
  clusters: 'Múltiplas figuras',
  clusters4: 'Múltiplas figuras (4)',
  mapaQ: 'Figura quadrada + legenda',
  compose: 'Síntese',
  imagem169: 'Texto + imagem 16:9',
  imagem45: 'Texto + imagem 4:5',
  duas45: 'Texto + duas imagens 4:5',
  tres: 'Texto + 3 imagens',
  tresL: 'Texto + 3 imagens (largura total)',
  quatro: 'Texto + 4 imagens',
  oito: 'Texto + 8 imagens',
  tabelaH: 'Texto + tabela horizontal',
  tabelaV: 'Texto + tabela vertical',
  texto: 'Texto corrido',
  expediente: 'Expediente'
};
const LIBS = {
  h2c: 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js',
  jspdf: 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js',
  jszip: 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js'
};
const L1 = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet.';
const L2 = 'Duis sagittis ipsum. Praesent mauris fusce nec tellus sed augue semper porta.';

const img = (fit = 'cover') => ({ src: '', fit });
const letter = n => String.fromCharCode(65 + (n % 26));

const NEW = {
  capa: () => ({ type: 'capa', tags: ['Desinformação', 'Humor político', 'Extremismo online'],
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    subtitle: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation.', img: img() }),
  episodio: () => ({ type: 'episodio', sec: 'O episódio', tocLabel: 'Nesta edição', statsLabel: 'Corpus', tlLabel: 'Linha do tempo',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed do eiusmod',
    lede: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam. Sed nisi, nulla quis sem at nibh elementum imperdiet.',
    body: 'Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.\n\nCurabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.',
    stats: [{ v: '0.000', l: 'imagens coletadas' }, { v: '00 dias', l: '00/00 a 00/00/2026' }, { v: '0', l: 'plataformas: X, Instagram, TikTok, Telegram' }],
    tl: [{ d: '00 set.', t: 'Lorem ipsum dolor sit amet consectetur.' }, { d: '00 set.', t: 'Sed do eiusmod tempor incididunt ut labore.' },
      { d: '00 set.', t: 'Ut enim ad minim veniam, quis nostrud.' }, { d: '00 set.', t: 'Duis aute irure dolor in reprehenderit.' }],
    fig: { img: img(), cap: 'Lorem ipsum dolor sit amet. Fonte: plataforma, 00/00/2026.' } }),
  figura: () => ({ type: 'figura', sec: 'Metapicturing', title: 'Lorem ipsum dolor sit amet consectetur',
    intro: 'Praesent libero sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet, duis sagittis ipsum praesent mauris.',
    fig: { img: img(), cap: 'Metapicturing de 0.000 imagens ordenadas por lorem ipsum. Cada célula corresponde a uma imagem do corpus.' },
    reads: [{ l: 'A', t: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit integer nec odio.' },
      { l: 'B', t: 'Sed cursus ante dapibus diam, sed nisi nulla quis sem at nibh elementum.' },
      { l: 'C', t: 'Duis sagittis ipsum praesent mauris, fusce nec tellus sed augue semper porta.' }] }),
  mapa: () => ({ type: 'mapa', sec: 'Embeddings', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing', legLabel: 'Agrupamentos',
    fig: { img: img('contain'), cap: 'Projeção UMAP de embeddings visuais (modelo) de 0.000 imagens. Proximidade indica semelhança visual.' },
    leg: ['Lorem ipsum', 'Dolor sit', 'Amet consectetur', 'Adipiscing', 'Elit sed', 'Outros'].map((l, j) => ({ c: PALETTE[j], l, v: '00%' })),
    body: L1 + '\n\n' + L2 }),
  clusters: () => ({ type: 'clusters', sec: 'Clusters hierárquicos', title: 'Lorem ipsum dolor sit amet elit',
    intro: 'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc, curabitur tortor pellentesque nibh aenean quam.',
    fig: { img: img('contain'), cap: 'Dendrograma (método de ligação lorem ipsum). O corte em k = 6 define os grupos abaixo.' },
    cls: ['Lorem ipsum', 'Dolor sit', 'Amet', 'Adipiscing', 'Elit sed', 'Outros'].map((name, j) => ({ c: PALETTE[j], name, n: 'n = 000', img: img() })) }),
  clusters4: () => ({ type: 'clusters4', sec: 'Clusters hierárquicos', title: 'Lorem ipsum dolor sit amet elit',
    intro: 'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc, curabitur tortor pellentesque nibh aenean quam.',
    fig: { img: img('contain'), cap: 'Dendrograma (método de ligação lorem ipsum). O corte em k = 4 define os grupos abaixo.' },
    cls: ['Lorem ipsum', 'Dolor sit', 'Amet', 'Adipiscing'].map((name, j) => ({ c: PALETTE[j], name, n: 'n = 000', img: img() })) }),
  mapaQ: () => ({ type: 'mapaQ', sec: 'Embeddings', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing', legLabel: 'Agrupamentos',
    fig: { img: img('contain'), cap: 'Projeção UMAP de embeddings visuais (modelo) de 0.000 imagens. Proximidade indica semelhança visual.' },
    leg: ['Lorem ipsum', 'Dolor sit', 'Amet consectetur', 'Adipiscing', 'Elit sed', 'Outros'].map((l, j) => ({ c: PALETTE[j], l, v: '00%' })),
    body: L1 + '\n\n' + L2 }),
  compose: () => ({ type: 'compose', sec: 'Compose e síntese', title: 'Lorem ipsum dolor sit amet',
    cmps: [['A', 'Lorem ipsum'], ['B', 'Dolor sit'], ['C', 'Amet elit']].map(([l, name]) => ({ l, name, n: 'n = 000', img: img() })),
    cap: 'Compose: sobreposição de todas as imagens de cada grupo, alinhadas e com opacidade igual.',
    synLabel: 'Síntese', syn: L1 + ' Duis sagittis ipsum.',
    methLabel: 'Nota metodológica', meth: 'Coleta via lorem ipsum entre 00/00 e 00/00/2026. Embeddings extraídos com modelo dolor sit; redução por UMAP; clusterização aglomerativa (ligação de Ward). Dados e código no repositório indicado no expediente.',
    th: ['Plataforma', 'Imagens', 'Coleta'], rows: [['Lorem', '0.000', 'API'], ['Ipsum', '0.000', 'Raspagem'], ['Dolor', '000', 'Manual']] }),
  imagem169: () => ({ type: 'imagem169', sec: 'Imagem em destaque', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    lede: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam.',
    fig: { img: img(), cap: 'Lorem ipsum dolor sit amet. Fonte: plataforma, 00/00/2026.' }, body: [L1, L2].join('\n\n') }),
  imagem45: () => ({ type: 'imagem45', sec: 'Imagem em destaque', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    lede: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam.',
    fig: { img: img(), cap: 'Lorem ipsum dolor sit amet. Fonte: plataforma, 00/00/2026.' }, body: [L1, L2, L1].join('\n\n') }),
  duas45: () => ({ type: 'duas45', sec: 'Comparação', title: 'Lorem ipsum dolor sit amet consectetur',
    intro: 'Praesent libero sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet, duis sagittis ipsum praesent mauris.',
    figs: [{ img: img(), cap: 'Lorem ipsum dolor sit amet. Fonte: plataforma, 00/00/2026.' }, { img: img(), cap: 'Sed cursus ante dapibus diam. Fonte: plataforma, 00/00/2026.' }],
    body: [L1, L2].join('\n\n') }),
  tres: () => ({ type: 'tres', sec: 'Sequência', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    lede: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam.',
    figs: [0, 1, 2].map(() => ({ img: img(), cap: 'Lorem ipsum dolor sit amet. Fonte: plataforma, 00/00/2026.' })),
    body: [L1, L2].join('\n\n') }),
  tresL: () => ({ type: 'tresL', sec: 'Sequência', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    figs: [0, 1, 2].map(() => ({ img: img(), cap: 'Lorem ipsum dolor sit amet. Fonte: plataforma, 00/00/2026.' })) }),
  oito: () => ({ type: 'oito', sec: 'Comparação', title: 'Lorem ipsum dolor sit amet consectetur',
    intro: 'Praesent libero sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet, duis sagittis ipsum praesent mauris.',
    figs: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map(l => ({ img: img(), cap: l + ' · Lorem ipsum dolor sit amet.' })),
    body: [L1, L2].join('\n\n') }),
  quatro: () => ({ type: 'quatro', sec: 'Comparação', title: 'Lorem ipsum dolor sit amet consectetur',
    intro: 'Praesent libero sed cursus ante dapibus diam. Sed nisi nulla quis sem at nibh elementum imperdiet, duis sagittis ipsum praesent mauris.',
    figs: ['A', 'B', 'C', 'D'].map(l => ({ img: img(), cap: l + ' · Lorem ipsum dolor sit amet.' })),
    body: [L1, L2, L1].join('\n\n') }),
  tabelaH: () => ({ type: 'tabelaH', sec: 'Tabela de contingência', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    lede: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio praesent libero, sed cursus ante dapibus diam.',
    tbl: { title: 'Distribuição das imagens por cluster visual e plataforma', corner: 'Cluster',
      cols: ['X', 'Instagram', 'TikTok', 'Telegram', 'Total'],
      rows: [['C1 · Lorem ipsum', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000'],
        ['C2 · Dolor sit', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000'],
        ['C3 · Amet', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000'],
        ['C4 · Adipiscing', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000 (00,0%)', '000'],
        ['Total', '000', '000', '000', '000', '0.000']].map(([h, ...c]) => ({ h, c })),
      foot: [],
      note: 'Frequências absolutas; percentuais por linha entre parênteses. χ² = 00,00; gl = 0; p < 0,001; V de Cramér = 0,00. Fonte: elaboração própria a partir de dados coletados em plataforma, 00/00 a 00/00/2026.' },
    body: [L1, L2, L1, L2].join('\n\n') }),
  tabelaV: () => ({ type: 'tabelaV', sec: 'Regressão linear múltipla', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
    tbl: { title: 'Modelos de regressão linear múltipla para o engajamento (log) das imagens', corner: 'Variável',
      cols: ['Modelo 1', 'Modelo 2', 'Modelo 3'],
      rows: [['Intercepto', '0,000***\n(0,000)', '0,000***\n(0,000)', '0,000***\n(0,000)'],
        ['Presença de rosto', '0,000**\n(0,000)', '0,000**\n(0,000)', '0,000*\n(0,000)'],
        ['Texto sobreposto', '', '0,000***\n(0,000)', '0,000***\n(0,000)'],
        ['Saturação média', '', '−0,000\n(0,000)', '−0,000\n(0,000)'],
        ['Cluster C2 (ref.: C1)', '', '', '0,000*\n(0,000)'],
        ['Cluster C3 (ref.: C1)', '', '', '−0,000\n(0,000)'],
        ['Seguidores (log)', '0,000***\n(0,000)', '0,000***\n(0,000)', '0,000***\n(0,000)']].map(([h, ...c]) => ({ h, c })),
      foot: [['N', '0.000', '0.000', '0.000'], ['R²', '0,00', '0,00', '0,00'], ['R² ajustado', '0,00', '0,00', '0,00'], ['F', '00,00***', '00,00***', '00,00***']].map(([h, ...c]) => ({ h, c })),
      note: 'Coeficientes não padronizados; erros-padrão entre parênteses. *** p < 0,001; ** p < 0,01; * p < 0,05. Fonte: elaboração própria a partir de dados coletados em plataforma, 00/00 a 00/00/2026.' },
    body: [L1, L2, 'Curabitur sodales ligula in libero. Sed dignissim lacinia nunc, curabitur tortor pellentesque nibh aenean quam. In scelerisque sem at dolor.', L2].join('\n\n') }),
  texto: () => ({ type: 'texto', sec: 'Discussão', title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
    lede: L1, body: [L1, L2, L1, L2].join('\n\n') }),
  expediente: () => ({ type: 'expediente', title: 'Expediente',
    methLabel: 'Nota metodológica', meth: 'Coleta via lorem ipsum entre 00/00 e 00/00/2026. Embeddings extraídos com modelo dolor sit; redução por UMAP; clusterização aglomerativa (ligação de Ward). Imagens duplicadas removidas por hash perceptual.',
    credits: [['Coordenação', 'Nome Sobrenome'], ['Pesquisa e redação', 'Nome Sobrenome\nNome Sobrenome\nNome Sobrenome'],
      ['Coleta e análise de dados', 'Nome Sobrenome\nNome Sobrenome'], ['Visualizações', 'Nome Sobrenome'],
      ['Projeto gráfico e diagramação', 'Nome Sobrenome'], ['Revisão', 'Nome Sobrenome']].map(([r, n]) => ({ r, n })),
    info: [['Como citar', 'SOBRENOME, Nome; SOBRENOME, Nome. Lorem ipsum dolor sit amet. Análise de Conjuntura coLAB, Niterói, n. 7, set. 2026. DOI: 10.0000/colab.conj.2026.07.'],
      ['DOI', 'doi.org/10.0000/colab.conj.2026.07'],
      ['Links', 'colab.meme\nDados e código: repositorio.org/colab/conj-07\nMaterial suplementar: colab.meme/conjuntura/07'],
      ['Contato', 'contato@colab.meme'],
      ['Licença', 'Creative Commons Atribuição 4.0 Internacional (CC BY 4.0). Imagens de terceiros reproduzidas para fins de análise.'],
      ['Apoio', 'Agência de fomento · Programa · Processo nº 000000']].map(([l, t]) => ({ l, t })),
    about: 'A Análise de Conjuntura é uma publicação do coLAB sobre episódios de controvérsia pública em ambientes digitais: democracia digital, humor, desinformação, extremismo online e discurso de ódio.' })
};

const ITEM = {
  tag: () => 'Tema',
  stat: () => ({ v: '0', l: 'Descrição' }),
  tl: () => ({ d: '00 set.', t: 'Acontecimento.' }),
  read: a => ({ l: letter(a.length), t: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' }),
  leg: a => ({ c: PALETTE[a.length % PALETTE.length], l: 'Novo grupo', v: '00%' }),
  cl: a => ({ c: PALETTE[a.length % PALETTE.length], name: 'Lorem', n: 'n = 000', img: img() }),
  cmp: a => ({ l: letter(a.length), name: 'Lorem', n: 'n = 000', img: img() }),
  row: a => Array((a[0] || [0, 0, 0]).length).fill('—'),
  credit: () => ({ r: 'Função', n: 'Nome Sobrenome' }),
  info: () => ({ l: 'Rótulo', t: 'Texto' })
};

const defaultDoc = () => ({
  v: 1,
  meta: { serie: 'Análise de Conjuntura', numero: '07', data: 'Setembro 2026', doi: '10.0000/colab.conj.2026.07', isbn: '000-00-00000-00-0', showIsbn: true,
    site: 'colab.meme', inst: 'Universidade Federal Fluminense', cor: '#d6006c', capaImagem: false },
  pages: ['capa', 'episodio', 'figura', 'mapa', 'clusters', 'compose', 'expediente'].map(t => NEW[t]())
});

/* ——— utilidades ——— */
const $ = s => document.querySelector(s);
const E = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LOGO = { white: 'assets/logo-white.svg', black: 'assets/logo-black.svg' };
async function rasterLogos() {
  for (const k of ['white', 'black']) {
    try {
      const im = await loadImg(LOGO[k]);
      const c = document.createElement('canvas'); c.width = 1200; c.height = 320;
      c.getContext('2d').drawImage(im, 0, 0, 1200, 320);
      LOGO[k] = c.toDataURL('image/png');
    } catch { /* mantém o SVG */ }
  }
}
const siteHref = () => { const s = String(state.meta.site || '').trim(); return !s ? '#' : /^https?:\/\//i.test(s) ? s : 'https://' + s; };
const pad = n => String(n).padStart(2, '0');
const clone = o => JSON.parse(JSON.stringify(o));
let state = defaultDoc();
let SEC = [];
let figN = 0;
let tabN = 0;
const get = p => p.split('.').reduce((o, k) => (o == null ? o : o[k]), state);
const set = (p, v) => { const ks = p.split('.'); const last = ks.pop(); ks.reduce((o, k) => o[k], state)[last] = v; };
const CE = (() => { try { const d = document.createElement('div'); d.contentEditable = 'plaintext-only'; return d.contentEditable === 'plaintext-only' ? 'plaintext-only' : 'true'; } catch { return 'true'; } })();

const urlCache = new Map();
function dataToBlob(d) {
  const [h, b] = d.split(','); const mime = h.slice(5).split(';')[0];
  const bin = atob(b); const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}
function urlFor(d) {
  if (!d || !d.startsWith('data:')) return d;
  let u = urlCache.get(d);
  if (!u) { u = URL.createObjectURL(dataToBlob(d)); urlCache.set(d, u); }
  return u;
}
const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const libP = {};
const loadScript = src => libP[src] ||= new Promise((res, rej) => {
  const s = document.createElement('script'); s.src = src; s.onload = res;
  s.onerror = () => { delete libP[src]; rej(new Error('Não foi possível carregar ' + src)); };
  document.head.appendChild(s);
});

function hexRgb(h) { h = h.replace('#', ''); if (h.length === 3) h = h.split('').map(c => c + c).join(''); return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16)); }
function lum(hex) { return hexRgb(hex).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((a, v, i) => a + v * [0.2126, 0.7152, 0.0722][i], 0); }
function darken(hex, f) { return '#' + hexRgb(hex).map(v => Math.round(v * (1 - f)).toString(16).padStart(2, '0')).join(''); }
function edColors() {
  const c = (state.meta.cor || '#d6006c').toLowerCase();
  const light = lum(c) > 0.3;
  const known = { '#d6006c': '#aa0b56', '#0088b0': '#006786', '#201e1d': '#201e1d' };
  return { ed: c, ink: light ? '#201e1d' : '#f3f2f2', deep: known[c] || (light ? '#201e1d' : darken(c, 0.2)), light };
}

/* ——— componentes de template ——— */
function T(path, o = {}) {
  const tag = o.tag || 'div';
  return `<${tag} class="ed ${o.cls || ''}" data-k="${path}"${o.single ? ' data-single' : ''} contenteditable="${CE}" spellcheck="true" data-ph="${E(o.ph || 'Digite…')}">${E(get(path))}</${tag}>`;
}
const M = f => `<span data-m="${f}">${E(state.meta[f])}</span>`;
const RUN = () => `<div class="run"><span class="run-l"><i class="sq"></i><span>coLAB · ${M('serie')}</span></span><span>Nº ${M('numero')} · ${M('data')}</span></div>`;
const FOOT = i => `<div class="foot"><span>doi.org/${M('doi')}</span><b>${pad(i + 1)}</b></div>`;
const KICK = (i, k) => `<div class="kick"><span class="kn">${pad(SEC[i])}</span>${T(k + '.sec', { tag: 'span', cls: 'kl', single: true, ph: 'Seção' })}</div>`;
const CAP = (k, tag = 'figcaption', cls = '') => `<${tag} class="${cls}"><b>Fig. ${++figN}</b> ${T(k, { tag: 'span', ph: 'Legenda da figura' })}</${tag}>`;
function TABLE(k, t, cls) {
  const n = t.cols.length;
  const isTot = s => /^\s*total\s*$/i.test(s || '');
  const totCol = t.cols.map(isTot);
  const cell = (path, j) => `<td class="${totCol[j] ? 'tot' : ''}">${T(path, { tag: 'span', ph: '—' })}</td>`;
  const row = (list, r, j, extra = '') => `<tr class="${isTot(r.h) ? 'tot-row' : ''}${extra}"><th scope="row">${T(`${k}.${list}.${j}.h`, { tag: 'span', single: true, ph: 'Linha' })}</th>${r.c.map((_, m) => cell(`${k}.${list}.${j}.c.${m}`, m)).join('')}<td class="rowx ui"><button class="x" data-act="delrow" data-t="${k}" data-list="${list}" data-j="${j}" title="Remover linha" aria-label="Remover linha">×</button></td></tr>`;
  return `<div class="dtab ${cls}" data-fit>
    <p class="dtab-cap"><b>Tabela ${++tabN}</b> ${T(k + '.title', { tag: 'span', ph: 'Título da tabela' })}</p>
    <div class="dtab-w">
      <table class="dt">
        <thead><tr><th scope="col" class="corner">${T(k + '.corner', { tag: 'span', single: true, ph: '' })}</th>${t.cols.map((c, j) => `<th scope="col" class="${totCol[j] ? 'tot' : ''}"><span class="colh">${T(`${k}.cols.${j}`, { tag: 'span', single: true, ph: 'Coluna' })}<button class="x ui colx" data-act="delcol" data-t="${k}" data-j="${j}" title="Remover coluna" aria-label="Remover coluna">×</button></span></th>`).join('')}<th class="rowx ui"></th></tr></thead>
        <tbody>${t.rows.map((r, j) => row('rows', r, j)).join('')}</tbody>
        ${t.foot.length ? `<tbody class="dt-foot">${t.foot.map((r, j) => row('foot', r, j, j === 0 ? ' first' : '')).join('')}</tbody>` : ''}
      </table>
    </div>
      <div class="dtab-ctl ui">
        <button data-act="addrow" data-t="${k}" data-list="rows">+ Linha</button>
        ${cls === 'v' ? `<button data-act="addrow" data-t="${k}" data-list="foot">+ Estatística do modelo</button>` : ''}
        <button data-act="addcol" data-t="${k}">+ Coluna</button>
      </div>
    ${T(k + '.note', { tag: 'p', cls: 'dtab-note', ph: 'Nota e fonte dos dados' })}
  </div>`;
}
function LIST(k, arr, fn, o = {}) {
  return `<div class="list ${o.cls || ''}"${o.style ? ` style="${o.style}"` : ''}>${arr.map((it, j) =>
    `<div class="item">${fn(`${k}.${j}`, it, j)}<button class="x ui" data-act="del" data-list="${k}" data-j="${j}" title="Remover" aria-label="Remover">×</button></div>`).join('')
  }<button class="add ui" data-act="add" data-list="${k}" data-tpl="${o.tpl}">+ ${E(o.add || 'Adicionar')}</button></div>`;
}
function S(path, ph, o = {}) {
  const im = get(path) || {};
  const has = !!im.src;
  const fit = im.fit === 'contain' ? 'contain' : 'cover';
  const bg = has && !o.tint ? `background-image:url('${urlFor(im.src)}');background-size:${fit};` : '';
  const ctl = has
    ? `<button data-act="pick">Trocar</button>${o.tint ? '' : `<button data-act="fit">${fit === 'contain' ? 'Preencher' : 'Ajustar'}</button>`}<button data-act="rmimg">Remover</button>`
    : `<button data-act="pick">Escolher imagem</button>`;
  return `<div class="slot ${has ? 'has' : ''}" data-img="${path}"${o.tint && has ? ' data-tint="1"' : ''}${bg ? ` style="${bg}"` : ''}>${has ? '' : `<span class="slot-ph">${E(ph)}</span>`}<div class="ctl ui">${ctl}</div></div>`;
}
const hex2rgb = h => { const m = /^#?([0-9a-f]{6})$/i.exec(h || ''); if (!m) return null; const n = parseInt(m[1], 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
const rgb2hex = (r, g, b) => '#' + [r, g, b].map(v => Math.max(0, Math.min(255, +v || 0)).toString(16).padStart(2, '0')).join('');
function closeColorPop() { const p = document.getElementById('cpop'); if (p) p.remove(); document.removeEventListener('pointerdown', cpopOutside, true); document.removeEventListener('keydown', cpopKey, true); }
function cpopOutside(e) { if (!e.target.closest('#cpop') && !e.target.closest('.dot')) closeColorPop(); }
function cpopKey(e) { if (e.key === 'Escape') closeColorPop(); }
function openColorPop(dot) {
  closeColorPop();
  const k = dot.dataset.k2, cur = (get(k) || '#000000').toLowerCase(), [r, g, b] = hex2rgb(cur) || [0, 0, 0];
  const pop = document.createElement('div');
  pop.id = 'cpop'; pop.className = 'cpop ui';
  pop.innerHTML = `<div class="cpop-sw">${PALETTE.map(c => `<button class="sw" data-c="${c}" style="background:${c}" aria-pressed="${c === cur}" aria-label="${c}"></button>`).join('')}</div>
    <label class="cpop-row"><span>Escala</span><input type="color" id="cp-pick" value="${cur}"></label>
    <div class="cpop-row"><span>RGB</span><div class="cpop-rgb">${[r, g, b].map((v, j) => `<input class="input" type="number" min="0" max="255" data-ch="${j}" value="${v}" aria-label="${'RGB'[j]}">`).join('')}</div></div>
    <label class="cpop-row"><span>HEX</span><input class="input" id="cp-hex" value="${cur}" maxlength="7" spellcheck="false"></label>`;
  document.body.appendChild(pop);
  const rc = dot.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
  pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, rc.left - 8)) + 'px';
  pop.style.top = (rc.bottom + h + 8 > innerHeight ? rc.top - h - 8 : rc.bottom + 8) + 'px';
  const apply = (c, from) => {
    c = c.toLowerCase(); set(k, c); dot.style.background = c; save();
    const rgb = hex2rgb(c);
    if (from !== 'pick') pop.querySelector('#cp-pick').value = c;
    if (from !== 'hex') pop.querySelector('#cp-hex').value = c;
    if (from !== 'rgb') pop.querySelectorAll('[data-ch]').forEach((el, j) => { el.value = rgb[j]; });
    pop.querySelectorAll('[data-c]').forEach(el => el.setAttribute('aria-pressed', el.dataset.c === c));
  };
  pop.addEventListener('click', e => { const s = e.target.closest('[data-c]'); if (s) apply(s.dataset.c); });
  pop.querySelector('#cp-pick').addEventListener('input', e => apply(e.target.value, 'pick'));
  pop.querySelector('#cp-hex').addEventListener('input', e => { let v = e.target.value.trim(); if (!v.startsWith('#')) v = '#' + v; if (hex2rgb(v)) apply(v, 'hex'); });
  pop.querySelectorAll('[data-ch]').forEach(el => el.addEventListener('input', () => { const v = [...pop.querySelectorAll('[data-ch]')].map(i => i.value); apply(rgb2hex(...v), 'rgb'); }));
  setTimeout(() => { document.addEventListener('pointerdown', cpopOutside, true); document.addEventListener('keydown', cpopKey, true); });
}
const dotBtn = (k, c) => `<button class="dot" data-act="cycle" data-k2="${k}" style="background:${c}" title="Trocar cor" aria-label="Trocar cor"></button>`;
function tocHTML() {
  const rows = state.pages.map((p, i) => SEC[i] ? `<b>${pad(SEC[i])}</b><span>${E(p.sec)}</span>` : '').join('');
  const ex = state.pages.find(p => p.type === 'expediente');
  return rows + (ex ? `<b>—</b><span>${E(ex.title)}</span>` : '');
}

/* ——— páginas ——— */
const R = {
  capa: (p, i, k) => `<div class="inner cv">
    <div class="cv-head">
      <div class="cv-hl"><img class="cv-logo" src="${edColors().light ? LOGO.black : LOGO.white}" alt="coLAB"><span>${M('inst')}</span></div>
      <div class="cv-hr"><b>${M('serie')}</b><span class="cv-doi">DOI ${M('doi')}</span></div>
    </div>
    ${state.meta.capaImagem ? `<div class="cv-img">${S(k + '.img', 'Imagem da capa (impressa nos tons da cor da edição)', { tint: true })}</div>` : '<div class="cv-sp"></div>'}
    <div class="cv-num"><span class="cv-no">Nº</span>${T('meta.numero', { tag: 'span', cls: 'cv-big', single: true, ph: '00' })}</div>
    <div class="cv-txt">
      ${LIST(k + '.tags', p.tags, kk => T(kk, { tag: 'span', cls: 'tag', single: true, ph: 'Tema' }), { cls: 'tags', tpl: 'tag', add: 'Tema' })}
      ${T(k + '.title', { tag: 'h1', cls: 'cv-title', ph: 'Título da edição' })}
      ${T(k + '.subtitle', { tag: 'p', cls: 'cv-sub', ph: 'Subtítulo' })}
    </div>
    <div class="cv-foot">${T('meta.data', { tag: 'b', single: true, ph: 'Data' })}${state.meta.showIsbn ? `<span class="item cv-isbn">ISBN ${M('isbn')}<button class="x ui" data-act="hideisbn" title="Remover ISBN" aria-label="Remover ISBN">×</button></span>` : ''}<a class="cv-site" href="${E(siteHref())}" target="_blank" rel="noopener"><i class="fa-solid fa-globe" aria-hidden="true"></i>${M('site')}</a></div>
  </div>`,

  episodio: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main ep">
      <div class="ep-side">
        <div class="blk">${T(k + '.tocLabel', { cls: 'lbl', single: true })}<div class="toc" data-toc>${tocHTML()}</div></div>
        <div class="blk">${T(k + '.statsLabel', { cls: 'lbl', single: true })}${LIST(k + '.stats', p.stats, kk => T(kk + '.v', { cls: 'stat-v', single: true, ph: '0' }) + T(kk + '.l', { cls: 'stat-l', ph: 'Descrição' }), { cls: 'stats', tpl: 'stat', add: 'Dado' })}</div>
        <div class="blk">${T(k + '.tlLabel', { cls: 'lbl', single: true })}${LIST(k + '.tl', p.tl, kk => T(kk + '.d', { cls: 'tl-d', single: true, ph: 'Data' }) + T(kk + '.t', { cls: 'tl-t', ph: 'Acontecimento' }), { cls: 'tl', tpl: 'tl', add: 'Marco' })}</div>
      </div>
      <div class="ep-main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.lede', { tag: 'p', cls: 'lede', ph: 'Parágrafo de abertura' })}${T(k + '.body', { cls: 'body cols', ph: 'Texto' })}
        <figure class="fig">${S(k + '.fig.img', 'Imagem-chave do episódio (post, print ou meme de origem)')}${CAP(k + '.fig.cap')}</figure>
      </div>
    </div>${FOOT(i)}</div>`,

  figura: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}
      <div class="two">${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.intro', { tag: 'p', cls: 'small', ph: 'Introdução' })}</div>
      <figure class="fig bleed">${S(k + '.fig.img', 'Metapicturing: mosaico do corpus ordenado (matiz, data ou cluster)')}${CAP(k + '.fig.cap')}</figure>
      ${LIST(k + '.reads', p.reads, kk => T(kk + '.l', { cls: 'read-l', single: true, ph: 'A' }) + T(kk + '.t', { ph: 'Leitura' }), { cls: 'reads', tpl: 'read', add: 'Leitura' })}
    </div>${FOOT(i)}</div>`,

  mapa: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="map">
        <figure class="fig">${S(k + '.fig.img', 'Mapa de embeddings (UMAP / t-SNE) com imagens ou pontos coloridos por cluster')}${CAP(k + '.fig.cap')}</figure>
        <div class="map-side">
          <div class="blk">${T(k + '.legLabel', { cls: 'lbl', single: true })}${LIST(k + '.leg', p.leg, (kk, it) => dotBtn(kk + '.c', it.c) + T(kk + '.l', { tag: 'span', single: true, ph: 'Grupo' }) + T(kk + '.v', { tag: 'span', cls: 'mut', single: true, ph: '00%' }), { cls: 'legend', tpl: 'leg', add: 'Grupo' })}</div>
          ${T(k + '.body', { cls: 'small', ph: 'Análise' })}
        </div>
      </div>
    </div>${FOOT(i)}</div>`,

  clusters: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}
      <div class="two">${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.intro', { tag: 'p', cls: 'small', ph: 'Introdução' })}</div>
      <figure class="fig">${S(k + '.fig.img', 'Dendrograma da clusterização hierárquica, com corte indicado')}${CAP(k + '.fig.cap')}</figure>
      ${LIST(k + '.cls', p.cls, (kk, it, j) => `<div class="cl-img">${S(kk + '.img', 'Exemplares C' + (j + 1))}</div><div class="cl-meta">${dotBtn(kk + '.c', it.c)}<b>C${j + 1}</b>${T(kk + '.name', { tag: 'span', single: true, ph: 'Nome' })}${T(kk + '.n', { tag: 'span', cls: 'mut ml', single: true, ph: 'n = 000' })}</div>`, { cls: 'cls', tpl: 'cl', add: 'Cluster' })}
    </div>${FOOT(i)}</div>`,

  clusters4: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}
      <div class="two">${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.intro', { tag: 'p', cls: 'small', ph: 'Introdução' })}</div>
      <figure class="fig">${S(k + '.fig.img', 'Dendrograma da clusterização hierárquica, com corte indicado')}${CAP(k + '.fig.cap')}</figure>
      ${LIST(k + '.cls', p.cls, (kk, it, j) => `<div class="cl-img">${S(kk + '.img', 'Exemplares C' + (j + 1))}</div><div class="cl-meta">${dotBtn(kk + '.c', it.c)}<b>C${j + 1}</b>${T(kk + '.name', { tag: 'span', single: true, ph: 'Nome' })}${T(kk + '.n', { tag: 'span', cls: 'mut ml', single: true, ph: 'n = 000' })}</div>`, { cls: 'cls cls4', tpl: 'cl', add: 'Cluster' })}
    </div>${FOOT(i)}</div>`,

  mapaQ: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="map map-sq">
        <figure class="fig-ar"><div class="ar r11">${S(k + '.fig.img', 'Mapa de embeddings quadrado (1:1)')}</div>${CAP(k + '.fig.cap')}</figure>
        <div class="map-side">
          <div class="blk">${T(k + '.legLabel', { cls: 'lbl', single: true })}${LIST(k + '.leg', p.leg, (kk, it) => dotBtn(kk + '.c', it.c) + T(kk + '.l', { tag: 'span', single: true, ph: 'Grupo' }) + T(kk + '.v', { tag: 'span', cls: 'mut', single: true, ph: '00%' }), { cls: 'legend', tpl: 'leg', add: 'Grupo' })}</div>
          ${T(k + '.body', { cls: 'small', ph: 'Análise' })}
        </div>
      </div>
    </div>${FOOT(i)}</div>`,

  compose: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="cmps-wrap">${LIST(k + '.cmps', p.cmps, kk => `<div class="cmp-img">${S(kk + '.img', 'Imagem composta (média) do grupo ou período')}</div><div class="cmp-cap">${T(kk + '.l', { tag: 'b', single: true, ph: 'A' })}<span>·</span>${T(kk + '.name', { tag: 'span', single: true, ph: 'Grupo' })}<span>·</span>${T(kk + '.n', { tag: 'span', single: true, ph: 'n = 000' })}</div>`,
        { cls: 'cmps', tpl: 'cmp', add: 'Imagem composta', style: `grid-template-columns:repeat(${Math.max(1, Math.min(p.cmps.length, 4))},minmax(0,1fr))` })}</div>
      ${CAP(k + '.cap', 'p', 'figcap')}
      <div class="blk">${T(k + '.synLabel', { cls: 'lbl', single: true })}${T(k + '.syn', { tag: 'p', cls: 'syn', ph: 'Síntese' })}</div>
      <div class="two b">
        <div class="blk">${T(k + '.methLabel', { cls: 'lbl', single: true })}${T(k + '.meth', { tag: 'p', cls: 'small2', ph: 'Nota metodológica' })}</div>
        <div class="tblw"><table class="tbl"><thead><tr>${p.th.map((h, j) => `<th>${T(`${k}.th.${j}`, { tag: 'span', single: true, ph: 'Coluna' })}</th>`).join('')}<th class="rowx ui"></th></tr></thead>
          <tbody>${p.rows.map((r, j) => `<tr>${r.map((c, m) => `<td>${T(`${k}.rows.${j}.${m}`, { tag: 'span', single: true, ph: '—' })}</td>`).join('')}<td class="rowx ui"><button class="x" data-act="del" data-list="${k}.rows" data-j="${j}" title="Remover linha" aria-label="Remover linha">×</button></td></tr>`).join('')}</tbody></table>
          <button class="add ui" data-act="add" data-list="${k}.rows" data-tpl="row">+ Linha</button></div>
      </div>
    </div>${FOOT(i)}</div>`,

  imagem169: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}${T(k + '.lede', { tag: 'p', cls: 'lede', ph: 'Parágrafo de abertura' })}
      <figure class="fig-ar"><div class="ar r169">${S(k + '.fig.img', 'Imagem em formato paisagem (16:9)')}</div>${CAP(k + '.fig.cap')}</figure>
      ${T(k + '.body', { cls: 'body cols', ph: 'Texto' })}
    </div>${FOOT(i)}</div>`,

  imagem45: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="split">
        <figure class="fig-ar"><div class="ar r45">${S(k + '.fig.img', 'Imagem em formato retrato (4:5)')}</div>${CAP(k + '.fig.cap')}</figure>
        <div class="split-txt">${T(k + '.lede', { tag: 'p', cls: 'lede', ph: 'Parágrafo de abertura' })}${T(k + '.body', { cls: 'body', ph: 'Texto' })}</div>
      </div>
    </div>${FOOT(i)}</div>`,

  duas45: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}
      <div class="two">${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.intro', { tag: 'p', cls: 'small', ph: 'Introdução' })}</div>
      <div class="pair">${p.figs.map((f, j) => `<figure class="fig-ar"><div class="ar r45">${S(`${k}.figs.${j}.img`, 'Imagem em formato retrato (4:5)')}</div>${CAP(`${k}.figs.${j}.cap`)}</figure>`).join('')}</div>
      ${T(k + '.body', { cls: 'body cols', ph: 'Texto' })}
    </div>${FOOT(i)}</div>`,

  tres: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="split">
        <div class="stack">${p.figs.map((f, j) => `<figure class="fig-ar"><div class="ar rwide">${S(`${k}.figs.${j}.img`, 'Imagem horizontal (5386 × 2370)')}</div>${CAP(`${k}.figs.${j}.cap`)}</figure>`).join('')}</div>
        <div class="split-txt">${T(k + '.lede', { tag: 'p', cls: 'lede', ph: 'Parágrafo de abertura' })}${T(k + '.body', { cls: 'body', ph: 'Texto' })}</div>
      </div>
    </div>${FOOT(i)}</div>`,

  tresL: (p, i, k) => `<div class="inner tight">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="trio-stack">${p.figs.map((f, j) => `<figure class="fig-ar"><div class="ar rwide">${S(`${k}.figs.${j}.img`, 'Imagem horizontal (5386 × 2370)')}</div>${CAP(`${k}.figs.${j}.cap`)}</figure>`).join('')}</div>
    </div>${FOOT(i)}</div>`,

  oito: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}
      <div class="two">${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.intro', { tag: 'p', cls: 'small', ph: 'Introdução' })}</div>
      <div class="quad">${p.figs.map((f, j) => `<figure class="fig-ar"><div class="ar r11">${S(`${k}.figs.${j}.img`, 'Imagem quadrada (1:1)')}</div>${CAP(`${k}.figs.${j}.cap`)}</figure>`).join('')}</div>
      ${T(k + '.body', { cls: 'body cols', ph: 'Texto' })}
    </div>${FOOT(i)}</div>`,

  quatro: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}
      <div class="two">${T(k + '.title', { tag: 'h2', cls: 'h2', ph: 'Título' })}${T(k + '.intro', { tag: 'p', cls: 'small', ph: 'Introdução' })}</div>
      <div class="quad">${p.figs.map((f, j) => `<figure class="fig-ar"><div class="ar r11">${S(`${k}.figs.${j}.img`, 'Imagem quadrada (1:1)')}</div>${CAP(`${k}.figs.${j}.cap`)}</figure>`).join('')}</div>
      ${T(k + '.body', { cls: 'body cols', ph: 'Texto' })}
    </div>${FOOT(i)}</div>`,

  tabelaH: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main fitmain">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}${T(k + '.lede', { tag: 'p', cls: 'lede fz', ph: 'Parágrafo de abertura' })}
      ${TABLE(k + '.tbl', p.tbl, 'h')}
      ${T(k + '.body', { cls: 'body cols fz', ph: 'Texto' })}
    </div>${FOOT(i)}</div>`,

  tabelaV: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main fitmain">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}
      <div class="tv">
        ${TABLE(k + '.tbl', p.tbl, 'v')}
        ${T(k + '.body', { cls: 'body fz', ph: 'Texto' })}
      </div>
    </div>${FOOT(i)}</div>`,

  texto: (p, i, k) => `<div class="inner">${RUN()}
    <div class="main">${KICK(i, k)}${T(k + '.title', { tag: 'h2', cls: 'h2 narrow', ph: 'Título' })}${T(k + '.lede', { tag: 'p', cls: 'lede', ph: 'Parágrafo de abertura' })}${T(k + '.body', { cls: 'body cols', ph: 'Texto' })}</div>
    ${FOOT(i)}</div>`,

  expediente: (p, i, k) => `<div class="inner exp">${RUN()}
    ${T(k + '.title', { tag: 'h2', cls: 'h2', single: true, ph: 'Expediente' })}
    <div class="exp-g">
      ${LIST(k + '.credits', p.credits, kk => T(kk + '.r', { cls: 'lbl', single: true, ph: 'Função' }) + T(kk + '.n', { ph: 'Nomes' }), { cls: 'exp-col', tpl: 'credit', add: 'Crédito' })}
      ${LIST(k + '.info', p.info, kk => T(kk + '.l', { cls: 'lbl', single: true, ph: 'Rótulo' }) + T(kk + '.t', { ph: 'Texto' }), { cls: 'exp-col', tpl: 'info', add: 'Informação' })}
    </div>
    <div class="blk exp-meth">${T(k + '.methLabel', { cls: 'lbl', single: true, ph: 'Nota metodológica' })}${T(k + '.meth', { tag: 'p', cls: 'small2', ph: 'Descreva procedimentos de coleta e análise (opcional)' })}</div>
    <div class="grow"></div>
    <div class="exp-foot">${T(k + '.about', { tag: 'p', cls: 'about', ph: 'Sobre a publicação' })}<div class="exp-logo"><img src="${LOGO.black}" alt="coLAB"><span>${M('inst')}</span></div></div>
  </div>`
};

/* ——— render ——— */
const doc = $('#doc');
const stage = $('#stage');
function computeSecs() { let n = 0; SEC = state.pages.map(p => (p.type === 'capa' || p.type === 'expediente') ? 0 : ++n); }
function pageLabel(p) { return p.type === 'capa' ? 'Capa' : p.type === 'expediente' ? (p.title || 'Expediente') : (p.sec || TYPES[p.type]); }

function render() {
  computeSecs(); figN = 0; tabN = 0;
  const c = edColors();
  doc.style.setProperty('--ed', c.ed); doc.style.setProperty('--ed-ink', c.ink); doc.style.setProperty('--ed-deep', c.deep);
  doc.innerHTML = state.pages.map((p, i) => `<section class="page pg-${p.type}" data-i="${i}" data-screen-label="${pad(i + 1)} ${E(pageLabel(p))}">${R[p.type](p, i, 'pages.' + i)}</section>`).join('');
  renderPageList(); syncPanel(); applyTints();
  requestAnimationFrame(checkOverflow);
  doc.querySelectorAll('img').forEach(im => im.complete || im.addEventListener('load', checkOverflow, { once: true }));
}
function renderPageList() {
  $('#pagelist').innerHTML = state.pages.map((p, i) => `<li draggable="true" data-i="${i}" tabindex="0">
    <span class="pl-n">${pad(i + 1)}</span><span class="pl-t">${E(pageLabel(p))}</span>
    <span class="pl-a"><button class="ib" data-pl="up" title="Mover para cima" aria-label="Mover para cima"><i class="ph-duotone ph-arrow-up"></i></button><button class="ib" data-pl="down" title="Mover para baixo" aria-label="Mover para baixo"><i class="ph-duotone ph-arrow-down"></i></button><button class="ib" data-pl="dup" title="Duplicar" aria-label="Duplicar"><i class="ph-duotone ph-copy"></i></button><button class="ib" data-pl="del" title="Excluir" aria-label="Excluir"><i class="ph-duotone ph-trash"></i></button></span></li>`).join('');
  markActive();
}
function syncPanel() {
  document.querySelectorAll('[data-meta]').forEach(el => { if (el !== document.activeElement) { el.value = state.meta[el.dataset.meta] ?? ''; el.setAttribute('value', el.value); } });
  $('#m-capaImagem').checked = !!state.meta.capaImagem;
  $('#m-showIsbn').checked = !!state.meta.showIsbn;
  const cur = (state.meta.cor || '').toLowerCase();
  $('#swatches').innerHTML = ED_COLORS.map(([c, n]) => `<button class="sw" style="background:${c}" data-color="${c}" aria-pressed="${cur === c}" title="${n}" aria-label="${n}"></button>`).join('')
    + `<label class="sw sw-custom" title="Outra cor" aria-pressed="${!ED_COLORS.some(([c]) => c === cur)}" ${!ED_COLORS.some(([c]) => c === cur) ? `style="background:${cur};color:${edColors().ink}"` : ''}><i class="ph-duotone ph-eyedropper"></i><input type="color" id="customColor" value="${cur || '#d6006c'}" aria-label="Outra cor"></label>`;
}
function refreshMeta(f, src) {
  const v = state.meta[f] ?? '';
  document.querySelectorAll(`[data-m="${f}"]`).forEach(el => { el.textContent = v; });
  document.querySelectorAll(`[data-k="meta.${f}"]`).forEach(el => { if (el !== src) el.textContent = v; });
  document.querySelectorAll(`[data-meta="${f}"]`).forEach(el => { if (el !== src) el.value = v; });
  if (f === 'site') document.querySelectorAll('.cv-site').forEach(a => { a.href = siteHref(); });
}
function refreshToc() { computeSecs(); document.querySelectorAll('[data-toc]').forEach(el => { el.innerHTML = tocHTML(); }); }

/* capa: imagem impressa nos tons da cor da edição */
const tintCache = new Map();
async function tint(src, color) {
  const key = color + '|' + src.length + '|' + src.slice(-48);
  if (tintCache.has(key)) return tintCache.get(key);
  const im = await loadImg(urlFor(src));
  const w = Math.min(im.naturalWidth, 4500), h = Math.round(im.naturalHeight * w / im.naturalWidth);
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const x = cv.getContext('2d'); x.drawImage(im, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h), a = d.data, [cr, cg, cb] = hexRgb(color);
  for (let i = 0; i < a.length; i += 4) {
    let g = (0.3 * a[i] + 0.59 * a[i + 1] + 0.11 * a[i + 2]) / 255;
    g = Math.min(1, Math.max(0, (g - 0.5) * 1.15 + 0.5));
    a[i] = cr * g; a[i + 1] = cg * g; a[i + 2] = cb * g; a[i + 3] = 255;
  }
  x.putImageData(d, 0, 0);
  const out = await new Promise(r => cv.toBlob(b => r(URL.createObjectURL(b)), 'image/jpeg', 0.9));
  tintCache.set(key, out);
  return out;
}
function applyTints() {
  doc.querySelectorAll('.slot[data-tint]').forEach(async el => {
    const im = get(el.dataset.img); if (!im || !im.src) return;
    try { const u = await tint(im.src, edColors().ed); el.style.backgroundImage = `url('${u}')`; el.style.backgroundSize = 'cover'; } catch { /* imagem inválida */ }
  });
}

/* aviso de conteúdo que excede a página */
let ovT;
/* páginas com tabela: reduz texto e tabela até caberem na página */
function fitTables() {
  doc.querySelectorAll('.fitmain').forEach(m => {
    const pg = m.closest('.page');
    const wraps = [...m.querySelectorAll('.dtab-w')];
    const over = () => m.scrollHeight > m.clientHeight + 1 || wraps.some(w => w.scrollWidth > w.clientWidth + 1);
    let k = 1; pg.style.setProperty('--k', k);
    while (over() && k > 0.56) { k = +(k - 0.04).toFixed(2); pg.style.setProperty('--k', k); }
  });
}
function checkOverflow() {
  fitTables();
  doc.querySelectorAll('.page').forEach(pg => {
    let over = false;
    pg.querySelectorAll('.inner, .main').forEach(el => { if (el.scrollHeight > el.clientHeight + 2) over = true; });
    pg.classList.toggle('over', over);
  });
}
const scheduleOverflow = () => { clearTimeout(ovT); ovT = setTimeout(checkOverflow, 150); };

/* ——— persistência criptografada (IndexedDB, com localStorage como alternativa) ——— */
const DB = {
  db: null,
  open() {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((res, rej) => {
      const r = indexedDB.open('reportlab', 1);
      r.onupgradeneeded = () => r.result.createObjectStore('kv');
      r.onsuccess = () => { this.db = r.result; res(r.result); };
      r.onerror = () => rej(r.error);
    });
  },
  async get(k) { const db = await this.open(); return new Promise((res, rej) => { const q = db.transaction('kv').objectStore('kv').get(k); q.onsuccess = () => res(q.result); q.onerror = () => rej(q.error); }); },
  async setMany(obj) { const db = await this.open(); return new Promise((res, rej) => { const t = db.transaction('kv', 'readwrite'); const s = t.objectStore('kv'); Object.entries(obj).forEach(([k, v]) => v === undefined ? s.delete(k) : s.put(v, k)); t.oncomplete = res; t.onerror = () => rej(t.error); }); }
};
async function kvGet(k) {
  try { const v = await DB.get(k); if (v !== undefined) return v; } catch { /* sem IndexedDB */ }
  try { const s = localStorage.getItem('reportlab-' + k); return s == null ? undefined : JSON.parse(s); } catch { return undefined; }
}
async function kvSet(obj) {
  try { await DB.setMany(obj); return; } catch { /* tenta localStorage */ }
  Object.entries(obj).forEach(([k, v]) => v === undefined ? localStorage.removeItem('reportlab-' + k) : localStorage.setItem('reportlab-' + k, JSON.stringify(v)));
}
async function kvWipe() {
  try { await DB.setMany({ auth: undefined, doc: undefined }); } catch { /* */ }
  try { ['auth', 'doc'].forEach(k => localStorage.removeItem('reportlab-' + k)); } catch { /* */ }
}

const ITER = 250000;
const toB64 = buf => { const u = new Uint8Array(buf); let s = ''; for (let i = 0; i < u.length; i += 0x8000) s += String.fromCharCode.apply(null, u.subarray(i, i + 0x8000)); return btoa(s); };
const fromB64 = b => { const s = atob(b); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return u; };
async function deriveKey(pw, salt, iter = ITER) {
  const base = await crypto.subtle.importKey('raw', new TextEncoder().encode(pw), 'PBKDF2', false, ['deriveKey']);
  return crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: iter, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
}
async function encrypt(key, text) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(text));
  return { iv: toB64(iv), data: toB64(ct) };
}
async function decrypt(key, o) { return new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromB64(o.iv) }, key, fromB64(o.data))); }
async function newAuth(pw) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(pw, salt);
  return { key, auth: { v: 1, salt: toB64(salt), iter: ITER, check: await encrypt(key, 'reportlab-ok') } };
}
async function unlock(pw, auth) {
  const key = await deriveKey(pw, fromB64(auth.salt), auth.iter || ITER);
  try { await decrypt(key, auth.check); return key; } catch { return null; }
}
const SESSION = 'reportlab-session';
async function keepSession(key) { try { sessionStorage.setItem(SESSION, toB64(await crypto.subtle.exportKey('raw', key))); } catch { /* */ } }
async function restoreSession(auth) {
  try {
    const raw = sessionStorage.getItem(SESSION); if (!raw) return null;
    const key = await crypto.subtle.importKey('raw', fromB64(raw), 'AES-GCM', true, ['encrypt', 'decrypt']);
    await decrypt(key, auth.check); return key;
  } catch { return null; }
}

let KEY = null;
const setStatus = t => { $('#status').textContent = t; };
const hhmm = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
let saveT;
function save() { if (!KEY) return; setStatus('Salvando…'); clearTimeout(saveT); saveT = setTimeout(persist, 500); }
async function persist() {
  clearTimeout(saveT); saveT = null;
  if (!KEY) return;
  try { await kvSet({ doc: await encrypt(KEY, JSON.stringify(state)) }); setStatus('Salvo neste navegador às ' + hhmm() + '.'); }
  catch { setStatus('Não foi possível salvar: o armazenamento do navegador está cheio.'); }
}
function upgrade(o) {
  if (!o || o.v !== 1 || !Array.isArray(o.pages)) return null;
  if (o.meta.isbn === undefined) o.meta.isbn = '000-00-00000-00-0';
  if (o.meta.showIsbn === undefined) o.meta.showIsbn = true;
  delete o.meta.issn;
  o.pages.forEach(p => { if (p.type === 'expediente' && p.meth === undefined) { p.methLabel = 'Nota metodológica'; p.meth = ''; } });
  return o;
}
async function load() {
  const s = await kvGet('doc');
  if (s && s.iv) { try { return upgrade(JSON.parse(await decrypt(KEY, s))) || defaultDoc(); } catch { setStatus('Não foi possível abrir o documento salvo.'); return defaultDoc(); } }
  let legacy = typeof s === 'string' ? s : null;
  if (!legacy) { try { legacy = localStorage.getItem('reportlab-doc'); } catch { /* */ } }
  if (legacy) { try { const o = upgrade(JSON.parse(legacy)); try { localStorage.removeItem('reportlab-doc'); } catch { /* */ } if (o) return o; } catch { /* */ } }
  return defaultDoc();
}
const commit = () => { render(); save(); };

/* ——— imagens ——— */
const readAsDataURL = f => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(f); });
async function importFile(file) {
  const url = await readAsDataURL(file);
  const im = await loadImg(url);
  const max = 5000, w = im.naturalWidth, h = im.naturalHeight;
  if (w <= max && h <= max && file.size < 8e6) return url;
  const s = Math.min(1, max / Math.max(w, h));
  const cv = document.createElement('canvas'); cv.width = Math.round(w * s); cv.height = Math.round(h * s);
  cv.getContext('2d').drawImage(im, 0, 0, cv.width, cv.height);
  return file.type === 'image/png' ? cv.toDataURL('image/png') : cv.toDataURL('image/jpeg', 0.9);
}
async function setImage(k, file) {
  if (!file || !file.type.startsWith('image/')) { setStatus('Arquivo não reconhecido como imagem.'); return; }
  setStatus('Importando imagem…');
  try { const d = await importFile(file); const im = get(k); im.src = d; commit(); }
  catch { setStatus('Não foi possível abrir esta imagem.'); }
}
const fileInput = $('#file');
function pickImage(k) { fileInput.dataset.k = k; fileInput.value = ''; fileInput.click(); }
fileInput.addEventListener('change', () => { const f = fileInput.files[0]; if (f) setImage(fileInput.dataset.k, f); });

/* ——— eventos no documento ——— */
doc.addEventListener('input', e => {
  const el = e.target.closest('[data-k]'); if (!el) return;
  let v = el.innerText.replace(/\n+$/, '');
  if (el.hasAttribute('data-single')) v = v.replace(/\n/g, ' ');
  if (v === '' && el.innerHTML !== '') el.innerHTML = '';
  const k = el.dataset.k;
  set(k, v);
  if (k.startsWith('meta.')) refreshMeta(k.slice(5), el);
  if (k.endsWith('.sec') || /^pages\.\d+\.title$/.test(k) && get(k.replace(/\.title$/, '.type')) === 'expediente') { refreshToc(); renderPageList(); }
  save(); if (el.closest('.fitmain')) { clearTimeout(ovT); ovT = setTimeout(checkOverflow, 250); } else scheduleOverflow();
});
doc.addEventListener('keydown', e => {
  const el = e.target.closest('[data-k]');
  if (el && e.key === 'Enter' && el.hasAttribute('data-single')) { e.preventDefault(); el.blur(); }
});
doc.addEventListener('paste', e => {
  const el = e.target.closest('[data-k]'); if (!el) return;
  e.preventDefault();
  let t = (e.clipboardData || window.clipboardData).getData('text/plain');
  if (el.hasAttribute('data-single')) t = t.replace(/\s*\n\s*/g, ' ');
  document.execCommand('insertText', false, t);
});
doc.addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (b) {
    e.preventDefault();
    const act = b.dataset.act;
    if (act === 'addrow') { const t = get(b.dataset.t); t[b.dataset.list].push({ h: b.dataset.list === 'foot' ? 'Estatística' : 'Nova linha', c: Array(t.cols.length).fill('') }); commit(); return; }
    if (act === 'delrow') { get(b.dataset.t)[b.dataset.list].splice(+b.dataset.j, 1); commit(); return; }
    if (act === 'addcol') {
      const t = get(b.dataset.t);
      const at = /^\s*total\s*$/i.test(t.cols[t.cols.length - 1] || '') ? t.cols.length - 1 : t.cols.length;
      t.cols.splice(at, 0, 'Nova coluna'); [...t.rows, ...t.foot].forEach(r => r.c.splice(at, 0, '')); commit(); return;
    }
    if (act === 'delcol') {
      const t = get(b.dataset.t);
      if (t.cols.length <= 1) { setStatus('A tabela precisa de ao menos uma coluna.'); return; }
      const j = +b.dataset.j; t.cols.splice(j, 1); [...t.rows, ...t.foot].forEach(r => r.c.splice(j, 1)); commit(); return;
    }
    if (act === 'add') { const arr = get(b.dataset.list); arr.push(ITEM[b.dataset.tpl](arr)); commit(); return; }
    if (act === 'del') { get(b.dataset.list).splice(+b.dataset.j, 1); commit(); return; }
    if (act === 'hideisbn') { state.meta.showIsbn = false; commit(); return; }
    if (act === 'cycle') { openColorPop(b); return; }
    const slot = b.closest('.slot'); if (!slot) return;
    const k = slot.dataset.img, im = get(k);
    if (act === 'pick') pickImage(k);
    if (act === 'fit') { im.fit = im.fit === 'contain' ? 'cover' : 'contain'; commit(); }
    if (act === 'rmimg') { im.src = ''; commit(); }
    return;
  }
  const s = e.target.closest('.slot:not(.has)');
  if (s) pickImage(s.dataset.img);
});
const hasFiles = e => [...(e.dataTransfer?.types || [])].includes('Files');
doc.addEventListener('dragover', e => { const s = e.target.closest('.slot'); if (s && hasFiles(e)) { e.preventDefault(); s.classList.add('drop'); } });
doc.addEventListener('dragleave', e => { const s = e.target.closest('.slot'); if (s && !s.contains(e.relatedTarget)) s.classList.remove('drop'); });
doc.addEventListener('drop', e => {
  const s = e.target.closest('.slot'); if (!s || !hasFiles(e)) return;
  e.preventDefault(); s.classList.remove('drop');
  setImage(s.dataset.img, e.dataTransfer.files[0]);
});
window.addEventListener('dragover', e => { if (hasFiles(e)) e.preventDefault(); });
window.addEventListener('drop', e => { if (hasFiles(e)) e.preventDefault(); });

/* ——— painel ——— */
document.querySelectorAll('[data-meta]').forEach(el => el.addEventListener('input', () => {
  state.meta[el.dataset.meta] = el.value; refreshMeta(el.dataset.meta, el); save(); scheduleOverflow();
}));
$('#m-capaImagem').addEventListener('change', e => { state.meta.capaImagem = e.target.checked; commit(); });
$('#m-showIsbn').addEventListener('change', e => { state.meta.showIsbn = e.target.checked; commit(); });
$('#swatches').addEventListener('click', e => { const b = e.target.closest('[data-color]'); if (b) { state.meta.cor = b.dataset.color; commit(); } });
$('#swatches').addEventListener('change', e => { if (e.target.id === 'customColor') { state.meta.cor = e.target.value; commit(); } });

$('#newType').innerHTML = Object.entries(TYPES).map(([k, v]) => `<option value="${k}">${v}</option>`).join('');
$('#newType').value = 'texto';
$('#addPage').addEventListener('click', () => {
  const t = $('#newType').value;
  const last = state.pages.length - 1;
  const at = state.pages[last]?.type === 'expediente' && t !== 'expediente' ? last : state.pages.length;
  state.pages.splice(at, 0, NEW[t]());
  commit(); scrollToPage(at);
});
const list = $('#pagelist');
list.addEventListener('click', e => {
  const li = e.target.closest('li'); if (!li) return;
  const i = +li.dataset.i, b = e.target.closest('[data-pl]');
  if (!b) { scrollToPage(i); return; }
  const a = b.dataset.pl, P = state.pages;
  if (a === 'up' && i > 0) { [P[i - 1], P[i]] = [P[i], P[i - 1]]; commit(); scrollToPage(i - 1); }
  if (a === 'down' && i < P.length - 1) { [P[i + 1], P[i]] = [P[i], P[i + 1]]; commit(); scrollToPage(i + 1); }
  if (a === 'dup') { P.splice(i + 1, 0, clone(P[i])); commit(); scrollToPage(i + 1); }
  if (a === 'del') {
    if (P.length === 1) { setStatus('O documento precisa de ao menos uma página.'); return; }
    if (confirm(`Excluir a página ${pad(i + 1)} (${pageLabel(P[i])})?`)) { P.splice(i, 1); commit(); }
  }
});
list.addEventListener('keydown', e => { const li = e.target.closest('li'); if (li && e.target === li && e.key === 'Enter') scrollToPage(+li.dataset.i); });
let dragI = null;
list.addEventListener('dragstart', e => { const li = e.target.closest('li'); if (!li) return; dragI = +li.dataset.i; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(dragI)); });
list.addEventListener('dragover', e => { const li = e.target.closest('li'); if (li && dragI !== null) { e.preventDefault(); list.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over')); li.classList.add('drag-over'); } });
list.addEventListener('dragleave', e => { const li = e.target.closest('li'); if (li && !li.contains(e.relatedTarget)) li.classList.remove('drag-over'); });
list.addEventListener('drop', e => {
  const li = e.target.closest('li'); if (!li || dragI === null) return;
  e.preventDefault();
  const to = +li.dataset.i; const [pg] = state.pages.splice(dragI, 1); state.pages.splice(to, 0, pg);
  dragI = null; commit(); scrollToPage(to);
});
list.addEventListener('dragend', () => { dragI = null; list.querySelectorAll('.drag-over').forEach(x => x.classList.remove('drag-over')); });

function scrollToPage(i) {
  requestAnimationFrame(() => {
    const pg = doc.querySelectorAll('.page')[i]; if (!pg) return;
    stage.scrollTo({ top: stage.scrollTop + pg.getBoundingClientRect().top - stage.getBoundingClientRect().top - 24, behavior: 'smooth' });
  });
}
function markActive() {
  const top = stage.getBoundingClientRect().top + stage.clientHeight / 3;
  let act = 0;
  doc.querySelectorAll('.page').forEach((pg, i) => { if (pg.getBoundingClientRect().top <= top) act = i; });
  list.querySelectorAll('li').forEach((li, i) => li.classList.toggle('active', i === act));
}
let scT; stage.addEventListener('scroll', () => { clearTimeout(scT); scT = setTimeout(markActive, 60); });

/* zoom */
const zoomEl = $('#zoom');
function setZoom(z) { z = Math.max(30, Math.min(150, Math.round(z))); doc.style.zoom = z / 100; zoomEl.value = z; $('#zoomVal').textContent = z + '%'; try { localStorage.setItem('reportlab-zoom', z); } catch { /* */ } }
const fitZoom = () => setZoom(((stage.clientWidth - 80) / (210 * 96 / 25.4)) * 100);
zoomEl.addEventListener('input', () => setZoom(+zoomEl.value));
$('#zoomFit').addEventListener('click', fitZoom);

/* restaurar */
$('#reset').addEventListener('click', () => {
  if (confirm('Restaurar o modelo original? Todo o conteúdo e as imagens deste documento serão apagados.')) { state = defaultDoc(); commit(); stage.scrollTo({ top: 0 }); }
});

/* ——— exportação ——— */
const fname = () => 'colab-conjuntura-' + (String(state.meta.numero || 'relatorio').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\w-]+/g, '-').toLowerCase());
function download(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
}
const exportBtns = ['#pdfPrint', '#pdfApp', '#mdExport'].map(s => $(s));
const busy = on => exportBtns.forEach(b => { b.disabled = on; });

$('#pdfPrint').addEventListener('click', async () => {
  document.activeElement?.blur?.();
  await persist(); await document.fonts.ready;
  closeColorPop();
  window.print();
});

$('#pdfApp').addEventListener('click', async () => {
  document.activeElement?.blur?.();
  busy(true); setStatus('Preparando PDF…');
  try {
    await Promise.all([loadScript(LIBS.h2c), loadScript(LIBS.jspdf)]);
    await document.fonts.ready;
    document.body.classList.add('exporting');
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    await bakeSlots(3);
    const pdf = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4', compress: true });
    const pages = [...doc.querySelectorAll('.page')];
    for (let i = 0; i < pages.length; i++) {
      setStatus(`Gerando PDF… página ${i + 1} de ${pages.length}`);
      const cv = await window.html2canvas(pages[i], { scale: 3, useCORS: true, backgroundColor: null, logging: false });
      if (i) pdf.addPage();
      pdf.addImage(cv.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      await hiresLayer(pages[i], pdf, cv);
      const pr = pages[i].getBoundingClientRect(), f = 210 / pr.width;
      pages[i].querySelectorAll('a[href^="http"]').forEach(a => {
        const r = a.getBoundingClientRect();
        pdf.link((r.left - pr.left) * f, (r.top - pr.top) * f, r.width * f, r.height * f, { url: a.href });
      });
    }
    pdf.setProperties({ title: `${state.meta.serie} nº ${state.meta.numero}`, author: 'coLAB/UFF', subject: state.pages.find(p => p.type === 'capa')?.title || '' });
    pdf.save(fname() + '.pdf');
    setStatus('PDF gerado.');
  } catch (err) {
    console.error(err); setStatus('Não foi possível gerar o PDF. Verifique a conexão ou use “PDF pela impressão”.');
  } finally { document.body.classList.remove('exporting'); render(); busy(false); }
});

/* sobrepõe cada imagem na resolução original (até 4500 px no lado maior), recortada como na página;
   elementos posicionados sobre as imagens (ex.: legendas sobrepostas) são reaplicados por cima */
async function hiresLayer(page, pdf, cv) {
  const pr = page.getBoundingClientRect(), f = 210 / pr.width, px = cv.width / pr.width;
  const hit = (a, b) => a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;
  const absEls = [...page.querySelectorAll('*')].filter(e => !e.closest('.ui') && getComputedStyle(e).position === 'absolute' && e.offsetWidth);
  const over = new Set();
  for (const el of page.querySelectorAll('.slot.has')) {
    const src = el.dataset.src; if (!src) continue;
    let im; try { im = await loadImg(src); } catch { continue; }
    const r = el.getBoundingClientRect(); if (!r.width || !r.height) continue;
    const iw = im.naturalWidth, ih = im.naturalHeight, contain = el.dataset.fit === 'contain';
    let x = r.left, y = r.top, w = r.width, h = r.height, sx = 0, sy = 0, sw = iw, sh = ih;
    if (contain) { const s = Math.min(w / iw, h / ih); x += (w - iw * s) / 2; y += (h - ih * s) / 2; w = iw * s; h = ih * s; }
    else { const s = Math.max(w / iw, h / ih); sw = w / s; sh = h / s; sx = (iw - sw) / 2; sy = (ih - sh) / 2; }
    const L = Math.max(x, pr.left), T = Math.max(y, pr.top), R = Math.min(x + w, pr.right), B = Math.min(y + h, pr.bottom);
    if (R <= L || B <= T) continue;
    const kx = sw / w, ky = sh / h;
    sx += (L - x) * kx; sy += (T - y) * ky; sw = (R - L) * kx; sh = (B - T) * ky;
    const k = Math.min(1, 4500 / Math.max(sw, sh));
    const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(sw * k)); c.height = Math.max(1, Math.round(sh * k));
    const g = c.getContext('2d');
    let type = ''; try { type = /^data:([^;,]+)/.exec(src)?.[1] || (await (await fetch(src)).blob()).type; } catch { /* assume JPEG */ }
    const png = /png|gif|webp|svg/.test(type);
    if (!png) { g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); }
    g.drawImage(im, sx, sy, sw, sh, 0, 0, c.width, c.height);
    pdf.addImage(png ? c.toDataURL('image/png') : c.toDataURL('image/jpeg', 0.95), png ? 'PNG' : 'JPEG', (L - pr.left) * f, (T - pr.top) * f, (R - L) * f, (B - T) * f, undefined, 'MEDIUM');
    absEls.forEach(e => { if (e !== el && !e.contains(el) && hit(e.getBoundingClientRect(), { left: L, top: T, right: R, bottom: B })) over.add(e); });
  }
  for (const e of over) {
    const r = e.getBoundingClientRect(), c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(r.width * px)); c.height = Math.max(1, Math.round(r.height * px));
    c.getContext('2d').drawImage(cv, (r.left - pr.left) * px, (r.top - pr.top) * px, c.width, c.height, 0, 0, c.width, c.height);
    pdf.addImage(c.toDataURL('image/png'), 'PNG', (r.left - pr.left) * f, (r.top - pr.top) * f, r.width * f, r.height * f, undefined, 'FAST');
  }
}

/* recorta cada imagem no tamanho exato da área, para que a captura não dependa de background-size */
async function bakeSlots(scale) {
  await Promise.all([...doc.querySelectorAll('.slot.has')].map(async el => {
    const m = /url\(["']?(.*?)["']?\)/.exec(el.style.backgroundImage); if (!m) return;
    el.dataset.src = m[1]; el.dataset.fit = el.style.backgroundSize === 'contain' ? 'contain' : 'cover';
    try {
      const im = await loadImg(m[1]);
      const w = Math.max(1, Math.round(el.clientWidth * scale)), h = Math.max(1, Math.round(el.clientHeight * scale));
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const contain = el.style.backgroundSize === 'contain';
      const s = contain ? Math.min(w / im.naturalWidth, h / im.naturalHeight) : Math.max(w / im.naturalWidth, h / im.naturalHeight);
      const dw = im.naturalWidth * s, dh = im.naturalHeight * s;
      c.getContext('2d').drawImage(im, (w - dw) / 2, (h - dh) / 2, dw, dh);
      el.style.backgroundImage = `url('${c.toDataURL(contain ? 'image/png' : 'image/jpeg', 0.92)}')`;
      el.style.backgroundSize = '100% 100%';
    } catch { /* mantém a imagem original */ }
  }));
}

function toMarkdown() {
  computeSecs();
  const m = state.meta, out = [], files = [];
  let fig = 0;
  const ext = s => /^data:image\/png/.test(s) ? 'png' : /^data:image\/gif/.test(s) ? 'gif' : /^data:image\/webp/.test(s) ? 'webp' : 'jpg';
  const imgRef = (im, name, alt) => {
    if (!im || !im.src) return `*[imagem pendente: ${alt}]*`;
    const f = `imagens/${name}.${ext(im.src)}`; files.push([f, im.src]); return `![${alt}](${f})`;
  };
  const figMd = (im, cap) => { fig++; return `${imgRef(im, 'fig-' + pad(fig), 'Fig. ' + fig)}\n\n*Fig. ${fig}. ${cap}*`; };
  const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
  let tab = 0;
  const tabMd = t => {
    tab++;
    const line = r => `| ${[r.h, ...r.c].map(cell).join(' | ')} |`;
    return [`**Tabela ${tab}.** ${t.title}`,
      [`| ${[t.corner, ...t.cols].map(cell).join(' | ')} |`, `| --- | ${t.cols.map(() => '---:').join(' | ')} |`, ...t.rows.map(line), ...t.foot.map(line)].join('\n'),
      `*${t.note}*`].join('\n\n');
  };
  const br = s => String(s).split('\n').join('  \n');
  state.pages.forEach((p, i) => {
    const h = SEC[i] ? `## ${pad(SEC[i])} · ${p.sec}` : '';
    switch (p.type) {
      case 'capa':
        out.push(`# ${p.title}`, p.subtitle,
          `**${m.serie} · coLAB** — Nº ${m.numero} · ${m.data}  \nDOI: [${m.doi}](https://doi.org/${m.doi})${m.showIsbn && m.isbn ? ' · ISBN ' + m.isbn : ''} · [${m.site}](${siteHref()})`,
          p.tags.length ? `Temas: ${p.tags.join(' · ')}` : '');
        if (m.capaImagem && p.img.src) out.push(imgRef(p.img, 'capa', 'Imagem da capa'));
        break;
      case 'episodio':
        out.push(h, `### ${p.title}`, p.lede, p.body,
          `**${p.statsLabel}**\n\n` + p.stats.map(s => `- **${s.v}** ${s.l}`).join('\n'),
          `**${p.tlLabel}**\n\n` + p.tl.map(t => `- **${t.d}** — ${t.t}`).join('\n'),
          figMd(p.fig.img, p.fig.cap));
        break;
      case 'figura':
        out.push(h, `### ${p.title}`, p.intro, figMd(p.fig.img, p.fig.cap), p.reads.map(r => `- **${r.l}** ${r.t}`).join('\n'));
        break;
      case 'mapa':
      case 'mapaQ':
        out.push(h, `### ${p.title}`, figMd(p.fig.img, p.fig.cap), `**${p.legLabel}**\n\n` + p.leg.map(l => `- ${l.l}: ${l.v}`).join('\n'), p.body);
        break;
      case 'clusters':
      case 'clusters4':
        out.push(h, `### ${p.title}`, p.intro, figMd(p.fig.img, p.fig.cap),
          p.cls.map((c, j) => `**C${j + 1} · ${c.name}** (${c.n})\n\n${imgRef(c.img, `pg${pad(i + 1)}-cluster-c${j + 1}`, 'Exemplares C' + (j + 1))}`).join('\n\n'));
        break;
      case 'compose':
        fig++;
        out.push(h, `### ${p.title}`,
          p.cmps.map((c, j) => `**${c.l}** · ${c.name} · ${c.n}\n\n${imgRef(c.img, `fig-${pad(fig)}-${j + 1}`, `Fig. ${fig} ${c.l}`)}`).join('\n\n'),
          `*Fig. ${fig}. ${p.cap}*`, `**${p.synLabel}**\n\n${p.syn}`, `**${p.methLabel}**\n\n${p.meth}`,
          `| ${p.th.map(cell).join(' | ')} |\n| ${p.th.map(() => '---').join(' | ')} |\n` + p.rows.map(r => `| ${r.map(cell).join(' | ')} |`).join('\n'));
        break;
      case 'imagem169':
        out.push(h, `### ${p.title}`, p.lede, figMd(p.fig.img, p.fig.cap), p.body);
        break;
      case 'imagem45':
        out.push(h, `### ${p.title}`, figMd(p.fig.img, p.fig.cap), p.lede, p.body);
        break;
      case 'tresL':
        out.push(h, `### ${p.title}`, ...p.figs.map(f => figMd(f.img, f.cap)));
        break;
      case 'tres':
        out.push(h, `### ${p.title}`, p.lede, ...p.figs.map(f => figMd(f.img, f.cap)), p.body);
        break;
      case 'quatro':
      case 'oito':
        out.push(h, `### ${p.title}`, p.intro, ...p.figs.map(f => figMd(f.img, f.cap)), p.body);
        break;
      case 'tabelaH':
        out.push(h, `### ${p.title}`, p.lede, tabMd(p.tbl), p.body);
        break;
      case 'tabelaV':
        out.push(h, `### ${p.title}`, tabMd(p.tbl), p.body);
        break;
      case 'texto':
        out.push(h, `### ${p.title}`, p.lede, p.body);
        break;
      case 'expediente':
        out.push(`## ${p.title}`, p.credits.map(c => `**${c.r}**  \n${br(c.n)}`).join('\n\n'), p.info.map(x => `**${x.l}**  \n${br(x.t)}`).join('\n\n'), ...(p.meth ? [`**${p.methLabel}**  \n${p.meth}`] : []), `*${p.about}*`);
        break;
    }
    if (i < state.pages.length - 1) out.push('---');
  });
  return { md: out.filter(s => s && String(s).trim()).join('\n\n') + '\n', files };
}
$('#mdExport').addEventListener('click', async () => {
  busy(true);
  try {
    const { md, files } = toMarkdown();
    if (!files.length) { download(new Blob([md], { type: 'text/markdown;charset=utf-8' }), fname() + '.md'); setStatus('Markdown exportado.'); return; }
    setStatus('Compactando Markdown e imagens…');
    await loadScript(LIBS.jszip);
    const zip = new window.JSZip();
    zip.file(fname() + '.md', md);
    files.forEach(([f, d]) => zip.file(f, dataToBlob(d)));
    download(await zip.generateAsync({ type: 'blob' }), fname() + '-markdown.zip');
    setStatus('Markdown exportado com imagens (.zip).');
  } catch (err) { console.error(err); setStatus('Não foi possível exportar o Markdown.'); }
  finally { busy(false); }
});

window.addEventListener('beforeunload', () => { if (saveT) persist(); });
window.addEventListener('pagehide', () => { if (saveT) persist(); });
window.addEventListener('resize', () => { markActive(); });

/* ——— acesso por senha ——— */
const gate = $('#gate'), gateForm = $('#gateForm'), gErr = $('#gateErr');
let AUTH = null;
function showGate(mode) {
  document.body.classList.add('locked');
  gate.hidden = false; gErr.textContent = '';
  gateForm.dataset.mode = mode;
  const setup = mode === 'setup';
  $('#gateTitle').textContent = setup ? 'Crie a senha de acesso' : 'Entrar';
  $('#gateText').textContent = setup
    ? 'Primeiro acesso neste navegador. Defina a senha que será pedida para abrir o ReportLAB. O documento fica salvo criptografado com ela.'
    : 'Digite a senha de acesso ao ReportLAB.';
  $('#pw1Label').textContent = setup ? 'Nova senha (mínimo de 6 caracteres)' : 'Senha';
  $('#pw1').autocomplete = setup ? 'new-password' : 'current-password';
  $('#pw2Field').hidden = !setup; $('#pw2').required = setup;
  $('#gateBtn').textContent = setup ? 'Criar senha e entrar' : 'Entrar';
  $('#forgot').hidden = setup;
  $('#pw1').value = ''; $('#pw2').value = '';
  setTimeout(() => $('#pw1').focus(), 50);
}
async function start(key) {
  KEY = key; await keepSession(key);
  state = await load();
  let z = null; try { z = +localStorage.getItem('reportlab-zoom'); } catch { /* */ }
  gate.hidden = true; document.body.classList.remove('locked');
  render();
  if (z) setZoom(z); else fitZoom();
  document.fonts?.ready.then(checkOverflow);
  await persist();
  setStatus('Salvo automaticamente neste navegador.');
}
gateForm.addEventListener('submit', async e => {
  e.preventDefault();
  const pw = $('#pw1').value, btn = $('#gateBtn');
  gErr.textContent = ''; btn.disabled = true;
  try {
    if (gateForm.dataset.mode === 'setup') {
      if (pw.length < 6) { gErr.textContent = 'A senha precisa ter ao menos 6 caracteres.'; return; }
      if (pw !== $('#pw2').value) { gErr.textContent = 'As senhas não coincidem.'; return; }
      const { key, auth } = await newAuth(pw);
      await kvSet({ auth }); AUTH = auth;
      await start(key);
    } else {
      const key = await unlock(pw, AUTH);
      if (!key) { gErr.textContent = 'Senha incorreta.'; $('#pw1').select(); return; }
      await start(key);
    }
  } catch (err) { console.error(err); gErr.textContent = 'Não foi possível concluir. Abra o app por um endereço https.'; }
  finally { btn.disabled = false; }
});
$('#forgot').addEventListener('click', async () => {
  if (!confirm('Sem a senha não é possível abrir o documento salvo. Apagar o documento deste navegador e criar uma nova senha?')) return;
  await kvWipe(); AUTH = null;
  try { sessionStorage.removeItem(SESSION); } catch { /* */ }
  showGate('setup');
});

/* configurações */
const dlg = $('#settings'), pwErr = $('#pwErr');
$('#openSettings').addEventListener('click', () => { $('#pwForm').reset(); pwErr.textContent = ''; pwErr.classList.remove('ok'); dlg.showModal(); });
$('#closeSettings').addEventListener('click', () => dlg.close());
$('#pwForm').addEventListener('submit', async e => {
  e.preventDefault();
  pwErr.classList.remove('ok'); pwErr.textContent = '';
  const cur = $('#pwCur').value, nw = $('#pwNew').value, nw2 = $('#pwNew2').value;
  if (nw.length < 6) { pwErr.textContent = 'A nova senha precisa ter ao menos 6 caracteres.'; return; }
  if (nw !== nw2) { pwErr.textContent = 'As novas senhas não coincidem.'; return; }
  try {
    if (!(await unlock(cur, AUTH))) { pwErr.textContent = 'A senha atual está incorreta.'; return; }
    const { key, auth } = await newAuth(nw);
    await kvSet({ auth, doc: await encrypt(key, JSON.stringify(state)) });
    AUTH = auth; KEY = key; await keepSession(key);
    $('#pwForm').reset();
    pwErr.classList.add('ok'); pwErr.textContent = 'Senha alterada.';
    setStatus('Senha alterada às ' + hhmm() + '.');
  } catch (err) { console.error(err); pwErr.textContent = 'Não foi possível alterar a senha.'; }
});
$('#logout').addEventListener('click', async () => {
  await persist();
  try { sessionStorage.removeItem(SESSION); } catch { /* */ }
  KEY = null; dlg.close(); doc.innerHTML = ''; state = defaultDoc();
  showGate('login');
});

(async function init() {
  if (!window.crypto?.subtle) { showGate('setup'); gErr.textContent = 'Este navegador não permite criptografia neste endereço. Abra o app por https.'; $('#gateBtn').disabled = true; return; }
  await rasterLogos();
  AUTH = await kvGet('auth');
  if (AUTH) { const key = await restoreSession(AUTH); if (key) return start(key); showGate('login'); }
  else showGate('setup');
})();
