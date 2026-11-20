// One-off plugin: brings the "Mark Cacay — Portfolio" Figma mockups in line with the live site.
// Built by build.mjs (injects the tool logos). Every step is isolated; a report shows at the end.
const TOOLS = __TOOLS__;
const HASH = {
  portrait: 'caf6d065173e518348f26ec5f468d2ee6afaff3c', pageant: 'da32c2b331c3664b863b252bd93a3c6e379cb794',
  vat: 'f1560902213afac329c3620b57de8d6dd3545122', mma: 'fda681b19a3a83c04ccef9067dcb6fd5301cd74e',
  getfishD: 'd095ab2627c17532c3c322790123338d08f32623', getfishM: '8437ba4f19ae962716ccfaa1e29c1bc8749a8256',
};
const UPLOADED = ['13:174', '13:175', '13:176', '13:177', '13:178', '13:179'];
const B = 'Bricolage Grotesque', P = 'Public Sans';
const report = [];
async function step(name, fn) {
  try { await fn(); report.push('OK   ' + name); }
  catch (e) { report.push('FAIL ' + name + ' — ' + (e && e.message ? e.message : e)); }
}

const COPY = {
  h1: 'I build fast websites, fix the broken ones, and connect them to the tools your business runs on.',
  lede: 'AI-driven web developer and problem-solver. WordPress and PHP since 2010, Laravel and Vue when a project needs more: new builds, debugging, site rescues and CRM integrations for businesses in Australia and the US.',
  servicesIntro: "Bring a Figma file, a site that's broken or slow, or a tool that won't talk to your website.",
  services: [
    ['Figma to WordPress', 'Pixel-accurate, responsive builds with Elementor Pro or a custom theme.'],
    ['Debugging and site rescues', 'Broken checkouts, plugin conflicts, slow pages, sites stuck on old PHP. I find the cause and fix it.'],
    ['WooCommerce stores', 'Wholesale pricing, delivery slots, order rules and abandoned-cart flows.'],
    ['CRM and marketing integrations', 'GoHighLevel, HubSpot, Klaviyo and Mailchimp, wired in with secure server-side code.'],
    ['Web apps with Laravel and Vue', "When WordPress isn't the right fit, like Pageant Poll."],
    ['Care plans', 'Updates, backups, speed and SEO so the site keeps working.'],
  ],
  homeAbout: "I'm a web developer in the Philippines. Since 2010 I've built and looked after websites for agencies and small businesses, including two years full-time with a Sydney agency. Most of my clients are in Australia and the US.",
  pageantSummary: 'A Laravel and Vue SaaS for online pageant voting, where fans sign in with Facebook and buy extra votes.',
  pageantStack: 'Laravel 10, Vue 3, Inertia.js, PrimeVue',
  aboutH1: "I'm Mark Cacay, a web developer and problem-solver who has been building websites since 2010.",
  aboutAI: "I work AI-driven: AI coding tools are part of my daily workflow, so I debug faster, test more and ship sooner. This site was built that way. A lot of my work is fixing things: finding why a checkout fails, a plugin clashes or a page is slow, then fixing the cause, not the symptom.",
  getfishClient: 'Getfish, seafood from the Sydney Fish Market (AU)',
  getfishResult: 'Customers only saw delivery times that actually reached them, and the team managed postcodes from the WordPress dashboard. Getfish has since moved to Shopify, so the screenshots are from the archived 2023 site.',
};

async function main() {
  await Promise.all([[B, 'ExtraBold'], [B, 'Bold'], [B, 'SemiBold'], [P, 'Regular'], [P, 'Medium']].map(([family, style]) => figma.loadFontAsync({ family, style })));
  await figma.setCurrentPageAsync(await figma.getNodeByIdAsync('0:1'));
  const V = Object.fromEntries((await figma.variables.getLocalVariablesAsync()).map((v) => [v.name, v]));
  const T = Object.fromEntries((await figma.getLocalTextStylesAsync()).map((s) => [s.name, s]));
  const get = async (id) => { const n = await figma.getNodeByIdAsync(id); if (!n) throw new Error('node ' + id + ' not found'); return n; };
  const paint = (name) => figma.variables.setBoundVariableForPaint({ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }, 'color', V[name]);
  const solid = (hex) => ({ type: 'SOLID', color: { r: parseInt(hex.slice(1, 3), 16) / 255, g: parseInt(hex.slice(3, 5), 16) / 255, b: parseInt(hex.slice(5, 7), 16) / 255 } });
  const img = (hash) => [{ type: 'IMAGE', imageHash: hash, scaleMode: 'FILL' }];
  const AL = (dir, props = {}) => { const f = figma.createFrame(); f.layoutMode = dir; f.primaryAxisSizingMode = 'AUTO'; f.counterAxisSizingMode = 'AUTO'; f.fills = []; Object.assign(f, props); return f; };
  const text = async (str, style, color, width) => {
    const t = figma.createText(); await t.setTextStyleIdAsync(T[style].id); t.characters = str;
    t.fills = [color.startsWith('#') ? solid(color) : paint(color)];
    if (width) { t.resize(width, t.height); t.textAutoResize = 'HEIGHT'; }
    return t;
  };
  const markSvg = (fg, dot) => `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="M12 52V28a10 10 0 0 1 20 0v24M32 28a10 10 0 0 1 20 0v10" fill="none" stroke="${fg}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="52" cy="51" r="5.5" fill="${dot}"/></svg>`;
  const mark = (fg, dot, size) => { const n = figma.createNodeFromSvg(markSvg(fg, dot)); n.name = 'Logo mark'; n.fills = []; n.rescale(size / 64); return n; };
  const label = (inst, value) => { const k = Object.keys(inst.componentProperties).find((x) => x.startsWith('Label')); if (k) inst.setProperties({ [k]: value }); };
  const props = (inst, map) => { const o = {}; for (const k of Object.keys(inst.componentProperties)) { const b = k.split('#')[0]; if (map[b] !== undefined) o[k] = map[b]; } inst.setProperties(o); };
  const findText = (root, starts) => { const t = root.findOne((n) => n.type === 'TEXT' && n.characters.startsWith(starts)); if (!t) throw new Error('text "' + starts + '" not found'); return t; };
  const darkNav = (inst) => {
    inst.fills = [paint('color/ink')];
    for (const t of inst.findAll((n) => n.type === 'TEXT')) if (t.characters !== 'Start a project') t.fills = [paint('color/white')];
    const m = inst.findOne((n) => n.name === 'Logo mark');
    if (m) for (const v of m.findAll(() => true)) {
      if ('strokes' in v && v.strokes.length) v.strokes = [solid('#FFFFFF')];
      else if ('fills' in v && Array.isArray(v.fills) && v.fills.length) v.fills = [solid('#5B7CFF')];
    }
    for (const f of inst.findAll((n) => n.type === 'FRAME' && n.strokes && n.strokes.length)) f.strokes = [solid('#E8EDF1')];
  };
  const toolChip = async (tool) => {
    const chip = AL('HORIZONTAL', { name: tool.name, itemSpacing: 10, counterAxisAlignItems: 'CENTER' });
    const svg = tool.path
      ? `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="${tool.path}" fill="#5E6B78"/></svg>`
      : '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="5" fill="#2F5BFF"/></svg>';
    const icon = figma.createNodeFromSvg(svg); icon.fills = []; icon.rescale(22 / 24); chip.appendChild(icon);
    chip.appendChild(await text(tool.name, 'Heading/H4', 'color/ink'));
    return chip;
  };
  const serviceRows = async (list, mobile) => {
    for (const [h, d] of COPY.services) {
      const row = mobile ? AL('VERTICAL', { itemSpacing: 4, paddingTop: 14 }) : AL('HORIZONTAL', { paddingTop: 22, paddingBottom: 22, itemSpacing: 32 });
      row.strokes = [paint('color/paper-deep')]; row.strokeTopWeight = 1; row.strokeBottomWeight = 0; row.strokeLeftWeight = 0; row.strokeRightWeight = 0;
      list.appendChild(row); row.layoutSizingHorizontal = 'FILL';
      const ht = await text(h, 'Heading/H4', 'color/ink', mobile ? 350 : 340); row.appendChild(ht); if (mobile) ht.layoutSizingHorizontal = 'FILL';
      const dt = await text(d, mobile ? 'Body/S' : 'Body/M', 'color/slate', mobile ? 350 : 400); row.appendChild(dt); dt.layoutSizingHorizontal = 'FILL';
    }
  };

  // 1. Components: logo in navs and footers (every frame using them updates).
  await step('Logo in Nav/Desktop and Nav/Mobile', async () => {
    for (const [compId, textId, size] of [['2:33', '2:34', 32], ['2:41', '2:42', 28]]) {
      const comp = await get(compId), t = await get(textId);
      if (comp.findOne((n) => n.name === 'Logo mark')) continue; // already done
      const lock = AL('HORIZONTAL', { name: 'Logo', itemSpacing: 10, counterAxisAlignItems: 'CENTER' });
      comp.insertChild(0, lock); lock.appendChild(mark('#18212B', '#2F5BFF', size)); lock.appendChild(t);
      t.fontName = { family: B, style: 'Bold' };
    }
  });
  await step('Logo mark in Footer/Desktop and Footer/Mobile', async () => {
    for (const id of ['2:51', '4:39']) { const f = await get(id); if (!f.findOne((n) => n.name === 'Logo mark')) f.insertChild(0, mark('#FFFFFF', '#5B7CFF', 44)); }
  });

  // 2. Home / Desktop
  await step('Home desktop: dark header', async () => darkNav(await get('3:6')));
  await step('Home desktop: dark hero, new copy, particle portrait', async () => {
    const hero = await get('3:14'); hero.fills = [paint('color/ink')]; hero.paddingBottom = 0; hero.counterAxisAlignItems = 'MAX';
    const intro = await get('3:15'); intro.paddingBottom = 72;
    const [h1, lede, ctas] = intro.children;
    h1.characters = COPY.h1; h1.fills = [paint('color/white')];
    lede.characters = COPY.lede; lede.fills = [solid('#AEB9C4')];
    const sec = ctas.children[1]; sec.swapComponent(await get('2:30')); label(sec, 'Download CV');
    const map = await figma.getNodeByIdAsync('3:23'); if (map) map.remove();
    if (!hero.findOne((n) => n.name.startsWith('Particle portrait'))) {
      const p = figma.createFrame(); p.name = 'Particle portrait (live 3D on the site)'; p.resize(544, 780); p.fills = img(HASH.portrait); hero.appendChild(p);
    }
  });
  await step('Home desktop: real screenshots in featured cards', async () => {
    const shots = [['3:62', HASH.pageant], ['3:68', HASH.vat], ['3:74', HASH.mma]];
    for (const [id, h] of shots) { const inst = await get(id); inst.findOne((n) => n.name === 'Screenshot').fills = img(h); }
    props(await get('3:62'), { Summary: COPY.pageantSummary, Stack: COPY.pageantStack });
  });
  await step('Home desktop: services with debugging', async () => {
    const left = await get('3:81'); left.children[1].characters = COPY.servicesIntro;
    const list = await get('3:84'); for (const c of [...list.children]) c.remove(); await serviceRows(list, false);
  });
  await step('Home desktop: "Tools I use" logo strip', async () => {
    const tools = await get('3:100'); (await get('3:101')).characters = 'Tools I use';
    const old = await figma.getNodeByIdAsync('3:102'); if (old) old.remove();
    for (const row of TOOLS) {
      const r = AL('HORIZONTAL', { name: 'Logo row (scrolls on the site)', itemSpacing: 44, clipsContent: true });
      tools.appendChild(r); r.layoutSizingHorizontal = 'FILL';
      for (const t of row) r.appendChild(await toolChip(t));
    }
    tools.appendChild(await text('Both rows scroll continuously on the site, in opposite directions; they pause on hover.', 'Body/S', 'color/slate'));
  });
  await step('Home desktop: about blurb', async () => { findText(await get('3:103'), 'I\'m a web developer').characters = COPY.homeAbout; });

  // 3. Home / Mobile
  await step('Home mobile: dark header', async () => darkNav(await get('4:50')));
  await step('Home mobile: dark hero, new copy, particle portrait', async () => {
    const hero = await get('4:54'); hero.fills = [paint('color/ink')]; hero.paddingBottom = 0;
    const h1 = await get('4:55'); h1.characters = COPY.h1; h1.fills = [paint('color/white')];
    const lede = await get('4:56'); lede.characters = COPY.lede; lede.fills = [solid('#AEB9C4')];
    const ctas = await get('4:57'); const sec = ctas.children[1]; sec.swapComponent(await get('2:30')); label(sec, 'Download CV'); sec.layoutSizingHorizontal = 'FILL';
    for (const id of ['4:62', '4:83']) { const n = await figma.getNodeByIdAsync(id); if (n) n.remove(); }
    if (!hero.findOne((n) => n.name.startsWith('Particle portrait'))) {
      const p = figma.createFrame(); p.name = 'Particle portrait (live 3D on the site)'; p.resize(350, 500); p.fills = img(HASH.portrait); hero.appendChild(p); p.layoutSizingHorizontal = 'FILL';
    }
  });
  await step('Home mobile: real screenshots in cards', async () => {
    for (const [id, h] of [['4:86', HASH.pageant], ['4:92', HASH.vat], ['4:98', HASH.mma]]) (await get(id)).findOne((n) => n.name === 'Screenshot').fills = img(h);
    props(await get('4:86'), { Summary: COPY.pageantSummary, Stack: COPY.pageantStack });
  });
  await step('Home mobile: services with debugging', async () => {
    const s = await get('4:105'); for (const c of s.children.slice(1)) c.remove(); await serviceRows(s, true);
  });
  await step('Home mobile: "Tools I use" section', async () => {
    const home = await get('4:49'), services = await get('4:105');
    if (home.findOne((n) => n.name === 'Tools')) return;
    const sec = AL('VERTICAL', { name: 'Tools', paddingLeft: 20, paddingRight: 20, paddingTop: 40, paddingBottom: 48, itemSpacing: 16 }); sec.fills = [paint('color/white')];
    home.insertChild(home.children.indexOf(services) + 1, sec); sec.layoutSizingHorizontal = 'FILL';
    sec.appendChild(await text('Tools I use', 'Label', 'color/slate'));
    const wrap = AL('HORIZONTAL', { itemSpacing: 20, counterAxisSpacing: 12 }); sec.appendChild(wrap); wrap.layoutSizingHorizontal = 'FILL'; wrap.layoutWrap = 'WRAP';
    for (const t of TOOLS.flat()) wrap.appendChild(await toolChip(t));
  });
  await step('Home mobile: about blurb', async () => { (await get('4:125')).characters = COPY.homeAbout; });

  // 4. Case study (Getfish)
  await step('Case study desktop: screenshots, client, no live link', async () => {
    (await get('4:159')).fills = img(HASH.getfishD);
    const checkout = await figma.getNodeByIdAsync('4:172'); if (checkout) checkout.remove();
    (await get('4:173')).fills = img(HASH.getfishM);
    const live = await figma.getNodeByIdAsync('4:175'); if (live) live.remove();
    findText(await get('4:149'), 'Getfish,').characters = COPY.getfishClient;
    findText(await get('4:161'), 'Customers only').characters = COPY.getfishResult;
  });
  await step('Case study mobile: screenshot, client, no live link', async () => {
    (await get('6:113')).fills = img(HASH.getfishM);
    const live = await figma.getNodeByIdAsync('6:125'); if (live) live.remove();
    findText(await get('6:100'), 'Getfish,').characters = COPY.getfishClient;
    findText(await get('6:114'), 'Customers only').characters = COPY.getfishResult;
  });

  // 5. About
  await step('About: problem-solver headline, AI-driven paragraph, Pageant Poll as client work', async () => {
    const col = await get('6:148');
    findText(col, "I'm Mark Cacay").characters = COPY.aboutH1;
    const bio = findText(col, 'I work from the Philippines');
    bio.characters = bio.characters.replace('as I did for my own product, Pageant Poll.', 'as I did for Pageant Poll.');
    if (!col.findOne((n) => n.type === 'TEXT' && n.characters.startsWith('I work AI-driven'))) {
      const ai = bio.clone(); col.insertChild(col.children.indexOf(bio) + 1, ai); ai.characters = COPY.aboutAI;
    }
  });

  // 6. Tidy: the uploaded image frames are no longer needed (fills keep the images).
  await step('Remove the loose uploaded image frames', async () => { for (const id of UPLOADED) { const n = await figma.getNodeByIdAsync(id); if (n) n.remove(); } });
}

main().catch((e) => report.push('FAIL main — ' + (e && e.message ? e.message : e))).then(() => {
  const ok = report.filter((r) => r.startsWith('OK')).length;
  const html = `<div style="font:13px/1.5 system-ui;padding:12px"><b>Portfolio sync: ${ok} of ${report.length} steps done</b><p>Copy this report back to Claude, then close the window.</p><textarea readonly style="width:100%;height:300px;font:12px ui-monospace,monospace">${report.join('\n').replace(/</g, '&lt;')}</textarea></div>`;
  figma.showUI(html, { width: 460, height: 420, title: 'Portfolio sync report' });
});
