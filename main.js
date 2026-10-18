/* casperjuel.dk — vanilla JS. No build step. */
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- year ---------- */
  $('#year').textContent = new Date().getFullYear();

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const themeBtn = $('#theme');
  const applyTheme = (t) => {
    if (t) root.dataset.theme = t; else delete root.dataset.theme;
    const dark = t === 'dark' || (!t && matchMedia('(prefers-color-scheme: dark)').matches);
    themeBtn.textContent = dark ? '[☀]' : '[☾]';
    document.dispatchEvent(new CustomEvent('themechange'));
  };
  try { applyTheme(localStorage.getItem('theme') || ''); } catch { applyTheme(''); }
  themeBtn.addEventListener('click', () => {
    const dark = root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
    const next = dark ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch {}
  });
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => applyTheme(root.dataset.theme || ''));

  /* ---------- "bits": decode from binary ----------
     Each letter starts as its 8-bit code and settles into the character. */
  const bitsEl = $('#bits');
  const binEl = $('#bin');
  const word = bitsEl.dataset.word;
  const toBin = (c) => c.charCodeAt(0).toString(2).padStart(8, '0');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const decode = () => {
    if (reduced) { bitsEl.textContent = word; return; }
    const start = performance.now();
    const per = 350, stagger = 180;
    bitsEl.classList.add('is-bin');
    const frame = (now) => {
      const t = now - start;
      let done = true;
      bitsEl.textContent = [...word].map((c, i) => {
        const local = t - i * stagger;
        if (local > per) return c;
        done = false;
        // show one random bit of the letter's binary while settling
        const b = toBin(c);
        return local < 0 ? b[(Math.random() * 8) | 0] : (Math.random() < local / per ? c : b[(Math.random() * 8) | 0]);
      }).join('');
      if (!done) requestAnimationFrame(frame);
      else bitsEl.classList.remove('is-bin');
    };
    requestAnimationFrame(frame);
  };
  decode();
  bitsEl.addEventListener('pointerenter', decode);
  // highlight the live binary line, one byte at a time, forever
  binEl.innerHTML = [...word].map((c) => `<span>${toBin(c)}</span>`).join(' ');
  let byte = 0;
  const bytes = $$('#bin span');
  setInterval(() => {
    bytes.forEach((b) => b.classList.remove('on'));
    bytes[byte % bytes.length].classList.add('on');
    byte++;
  }, 900);

  /* ---------- pointer coords readout ---------- */
  const coords = $('#coords');
  const pad = (n) => String(n).padStart(4, '0');
  let raf = 0;
  addEventListener('pointermove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      coords.textContent = `x:${pad(e.clientX | 0)} y:${pad(e.clientY | 0)}`;
      raf = 0;
    });
  }, { passive: true });

  /* ---------- console ----------
     For everyone who pressed ⌘⌥I out of habit. */
  const big = 'font: 700 28px/1.2 "Helvetica Neue", Helvetica, Arial, sans-serif; color: #0b00ff;';
  const mono = 'font: 12px/1.6 ui-monospace, Menlo, monospace; color: inherit;';
  const tag = 'font: 700 11px ui-monospace, Menlo, monospace; background: #0b00ff; color: #fff; padding: 2px 6px; border-radius: 9999px;';
  console.log('%ccasperjuel.dk', big);
  console.log(
    '%c' +
    'By day: TypeScript, Next.js, Hono, React, Tailwind. Daily. Happily.\n' +
    'This page: HTML, CSS, JavaScript. No bundler. No framework. No node_modules.\n\n' +
    '  document.querySelector      still works\n' +
    '  <details>                   still a component\n' +
    '  <a href>                    still a router\n' +
    '  .clearfix                   still clears (see #who)\n' +
    '  <marquee>                   still scrolls (never was in a spec)\n' +
    '  reset.css + main.css        still a stack\n\n' +
    'Keys:  r = new shape   t = terminal   ↑↑↓↓←→←→BA = 1999\n',
    mono,
  );
  console.log('%cNO BUILD STEP%c  %cNO TAILWIND%c  %c0 VULNERABILITIES', tag, '', tag, '', tag);

  /* ---------- menu count: count the real links, like a grown-up ---------- */
  $('#menu-count').textContent = `[${$$('#menu .menu-list a').length}]`;
  // close the <details> menu after navigating or clicking outside
  const menu = $('#menu');
  $$('#menu .menu-list a').forEach((a) => a.addEventListener('click', () => { menu.open = false; }));
  addEventListener('click', (e) => { if (!menu.contains(e.target)) menu.open = false; });

  /* ---------- visitor counter (the honest kind: it only counts you) ---------- */
  try {
    const n = (Number(localStorage.getItem('visits')) || 0) + 1;
    localStorage.setItem('visits', String(n));
    $('#visitors').textContent = String(n).padStart(6, '0');
  } catch { $('#visitors').textContent = '000001'; }

  /* ---------- tab title, like a needy blog from 2009 ---------- */
  const title = document.title;
  addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '( ._.) come back' : title;
  });

  /* ---------- konami → 1999 mode ---------- */
  const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let kIdx = 0;
  addEventListener('keydown', (e) => {
    kIdx = e.key === konami[kIdx] ? kIdx + 1 : (e.key === konami[0] ? 1 : 0);
    if (kIdx === konami.length) {
      kIdx = 0;
      const on = document.body.classList.toggle('y2k');
      document.dispatchEvent(new CustomEvent('themechange'));
      console.log(on ? '%c1999 MODE. Welcome to my homepage!!1' : '%cBack to 2026.', 'font: 700 14px "Comic Sans MS", cursive; color: #f0f;');
    }
  });

  /* ---------- miniterm ---------- */
  const term = $('#miniterm');
  const out = $('#term-out');
  const input = $('#term-input');
  const history = [];
  let hIdx = -1;

  const openTerm = () => { if (!term.open) term.showModal(); input.focus(); };
  const closeTerm = () => { if (term.open) term.close(); };
  $('#open-term').addEventListener('click', openTerm);
  $('#close-term').addEventListener('click', closeTerm);
  term.addEventListener('close', () => $('#open-term').focus());
  // click on the backdrop closes it (the backdrop is the dialog's own box outside its children)
  term.addEventListener('click', (e) => { if (e.target === term) closeTerm(); });

  const print = (txt) => { out.innerHTML += txt + '\n'; out.scrollTop = out.scrollHeight; };
  const projects = $$('#projects .p-name').map((n) => n.textContent.trim());

  const commands = {
    help: () => [
      'available commands:',
      '  <b>whoami</b>     who is this guy',
      '  <b>projects</b>   list side projects',
      '  <b>social</b>     links',
      '  <b>theme</b>      toggle dark/light',
      '  <b>regen</b>      new random shape',
      '  <b>radius</b>     explain the ellipse problem',
      '  <b>clearfix</b>   pour one out',
      '  <b>ls</b>, <b>cat</b>    you know these',
      '  <b>clear</b>      clear screen',
      '  <b>exit</b>       close terminal',
      '  <b>reboot</b>     you\'ll see',
      '',
      '↑/↓ browse commands · tab completes · click a command to run it',
    ].join('\n'),
    whoami: () => 'casper juel — creative developer, copenhagen. pixels → bits since 2011.',
    projects: () => projects.map((p, i) => `  [${String(i + 1).padStart(2, '0')}] ${p}`).join('\n'),
    social: () => [
      '  github     https://github.com/casperjuel/',
      '  linkedin   https://www.linkedin.com/in/casperjuel',
      '  instagram  https://www.instagram.com/casper.juel/',
      '  mail       info@casperjuel.dk',
    ].join('\n'),
    theme: () => { themeBtn.click(); return `theme → ${root.dataset.theme || 'system'}`; },
    regen: () => { document.dispatchEvent(new CustomEvent('regen')); return 'new shape generated.'; },
    radius: () => 'border-radius: 50% resolves horizontally against width and vertically against height.\non a 300×100 box that is 150px / 50px → an ellipse. you wanted 9999px.',
    clear: () => { out.innerHTML = ''; return ''; },
    exit: () => { closeTerm(); return ''; },
    sudo: () => 'nice try.',
    ls: () => 'index.html  reset.css  main.css  main.js  scene.js  serve.mjs  sandbox/',
    cat: (arg) => ({
      'main.css': '/* 500 lines of plain css. no tailwind. one .clearfix. */',
      'reset.css': '/* eric meyer, 2011. rest in peace, margin: 0. */',
      'package.json': 'cat: package.json: no such file (and that is the point)',
      'node_modules': 'cat: node_modules: is a directory. just kidding, it does not exist.',
    })[arg] || `cat: ${arg || ''}: no such file`,
    clearfix: () => '.clearfix::after { content: ""; display: table; clear: both; }\n2004 – 2017. still clearing #who on this page.',
    konami: () => 'you know what to do. ↑↑↓↓←→←→BA',
    rm: () => 'rm: permission denied (this is a static site)',
    npm: () => 'npm: command not found. no frameworks here.',
    npx: () => 'npx: command not found. no frameworks here.',
    reboot: () => { reboot(); return 'system going down for reboot NOW'; },
    kill: (arg) => { if (/^(-9\s+)?(1|init|-1|all)?$/.test(arg || '')) { reboot(); return `kill: pid 1 (init). oh no.`; } return `kill: ${arg}: no such process`; },
    shutdown: () => { reboot(); return 'shutdown: halting. see you in a sec.'; },
    halt: () => { reboot(); return 'halt.'; },
  };

  /* ---------- reboot: CRT off, BIOS, CRT on ---------- */
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  let rebooting = false;
  async function reboot() {
    if (rebooting) return;
    rebooting = true;
    const root = document.documentElement;
    await wait(500);
    closeTerm();
    const crt = document.createElement('pre');
    crt.className = 'crt';
    crt.setAttribute('aria-live', 'polite');
    root.append(crt);                 // outside <body>, so it survives the collapse
    root.classList.add('booting');
    await wait(reduced ? 100 : 650);
    const n = $$('#projects li').length;
    const lines = [
      ['CASPERJUEL.DK BIOS  v2026.10  (c) 2011-2026', 120],
      ['CPU: 1 × Human, Copenhagen', 180],
      ['Memory test: 640K ....... OK', 420],
      ['', 60],
      ['Loading reset.css ............ OK', 140],
      ['Loading main.css ............. OK', 120],
      ['Loading main.js .............. OK', 120],
      ['Mounting node_modules ........ not found (good)', 380],
      ['Starting three.js ............ OK', 160],
      ['Applying .clearfix ........... cleared', 140],
      ['Checking border-radius: 50% .. still an ellipse', 300],
      [`Indexing projects ............ ${n} found`, 160],
      ['Starting <marquee> ........... scrolling', 120],
      ['', 200],
      ['Boot complete. Press any key. Or don\'t.', 500],
    ];
    for (const [text, delay] of lines) {
      crt.textContent += text + '\n';
      await wait(reduced ? 20 : delay);
    }
    root.classList.add('back');
    crt.remove();
    document.dispatchEvent(new CustomEvent('regen'));
    await wait(reduced ? 50 : 600);
    root.classList.remove('booting', 'back');
    rebooting = false;
  }

  $('#term-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = input.value.trim();
    if (!raw) return;
    history.unshift(raw); hIdx = -1;
    print(`<span style="color:var(--muted)">&gt; ${raw.replace(/</g, '&lt;')}</span>`);
    const [cmd, ...args] = raw.toLowerCase().split(/\s+/);
    const fn = commands[cmd];
    const res = fn ? fn(args.join(' ')) : `${cmd}: command not found. try <b>help</b>.`;
    if (res) print(linkify(res));
    input.value = '';
  });
  /* ↑/↓ browse: your history first, then every command. Tab completes. */
  const names = Object.keys(commands).filter((c) => !['sudo', 'rm', 'npm', 'npx', 'cat', 'konami', 'kill', 'shutdown', 'halt'].includes(c));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      const list = [...new Set([...history, ...names])];
      hIdx = e.key === 'ArrowUp' ? Math.min(hIdx + 1, list.length - 1) : Math.max(hIdx - 1, -1);
      input.value = hIdx < 0 ? '' : list[hIdx];
      input.setSelectionRange(input.value.length, input.value.length);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const hit = names.find((n) => n.startsWith(input.value.toLowerCase()) && n !== input.value);
      if (hit) input.value = hit;
    } else if (e.key === 'Escape') {
      closeTerm();
    } else {
      hIdx = -1;
    }
  });
  /* click a command name or a URL in the output */
  out.addEventListener('click', (e) => {
    const b = e.target.closest('b');
    if (b && commands[b.textContent]) { input.value = b.textContent; $('#term-form').requestSubmit(); }
  });
  const linkify = (s) => s.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" rel="noopener">$1</a>').replace(/(\S+@\S+\.\w+)/g, '<a href="mailto:$1">$1</a>');

  /* ---------- global keys ---------- */
  addEventListener('keydown', (e) => {
    if (e.target.matches('input, textarea')) return;
    if (e.key === 'r') document.dispatchEvent(new CustomEvent('regen'));
    if (e.key === 't') openTerm();
  });
  $('#regen').addEventListener('click', () => document.dispatchEvent(new CustomEvent('regen')));

  /* ---------- demo 04: glass button pointer tracking ----------
     --mx / --my are the pointer's offset from the button centre, in [-1, 1]. */
  $$('.glass').forEach((g) => {
    g.addEventListener('pointermove', (e) => {
      const r = g.getBoundingClientRect();
      g.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      g.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    });
    g.addEventListener('pointerleave', () => { g.style.setProperty('--mx', 0); g.style.setProperty('--my', 0); });
  });

  /* ---------- project hover preview ---------- */
  const peek = $('#peek');
  const peekImg = $('#peek img');
  if (matchMedia('(hover: hover)').matches) {
    let px = 0, py = 0, peekRaf = 0;
    const place = () => {
      const w = peek.offsetWidth, h = peek.offsetHeight;
      const x = Math.min(px + 24, innerWidth - w - 16);
      const y = Math.min(py + 24, innerHeight - h - 16);
      peek.style.setProperty('--px', x + 'px');
      peek.style.setProperty('--py', y + 'px');
      peekRaf = 0;
    };
    let active = null; // the row the pointer is currently over
    const hide = () => { active = null; peek.hidden = true; };
    const show = () => { if (active) { peek.hidden = false; place(); } };
    // only show if the pointer is still over the row that asked for this image
    peekImg.onload = show;
    peekImg.onerror = hide;
    $$('.project[data-shot]').forEach((p) => {
      p.addEventListener('pointerenter', (e) => {
        active = p;
        px = e.clientX; py = e.clientY;
        peek.dataset.label = $('.p-name', p).firstChild.textContent.trim();
        if (peekImg.getAttribute('src') !== p.dataset.shot) {
          peek.hidden = true;
          peekImg.src = p.dataset.shot;
        }
        if (peekImg.complete && peekImg.naturalWidth) show();
      });
      p.addEventListener('pointermove', (e) => {
        px = e.clientX; py = e.clientY;
        // a scroll hides the card; bring it back once the pointer moves on the same row
        if (peek.hidden && active === p && peekImg.complete && peekImg.naturalWidth) { peek.hidden = false; }
        if (!peekRaf) peekRaf = requestAnimationFrame(place);
      });
      p.addEventListener('pointerleave', hide);
      p.addEventListener('click', hide);
    });
    addEventListener('scroll', hide, { passive: true });
    addEventListener('pagehide', hide);
    addEventListener('pageshow', hide);
    document.addEventListener('visibilitychange', () => { if (document.hidden) hide(); });
  }

  /* ---------- demo 01: fix-it toggle ---------- */
  const targets = { ellipse: $('#ellipse-btn') };
  $$('[data-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const el = targets[btn.dataset.toggle];
      const fixed = el.classList.toggle('is-fixed');
      el.classList.toggle('is-wrong', !fixed);
      btn.textContent = fixed ? '[break it]' : '[fix it]';
    });
  });

  /* ---------- demo 02: nested radius ---------- */
  const outer = $('#nest-outer');
  const padIn = $('#pad'), radIn = $('#rad');
  const update = () => {
    outer.style.setProperty('--pad', padIn.value + 'px');
    outer.style.setProperty('--rad', radIn.value + 'px');
    $('#pad-out').value = padIn.value;
    $('#rad-out').value = radIn.value;
  };
  padIn.addEventListener('input', update);
  radIn.addEventListener('input', update);
  $('#nest-fix').addEventListener('change', (e) => outer.classList.toggle('is-fixed', e.target.checked));
  update();

  /* ---------- demo 03: viewport readout ---------- */
  const vhOut = $('#vh-out');
  const measure = () => {
    const probe = document.createElement('div');
    probe.style.cssText = 'position:fixed;height:100vh;visibility:hidden;pointer-events:none';
    document.body.append(probe);
    const vh = probe.offsetHeight;
    probe.remove();
    vhOut.textContent = `vh ${vh} · inner ${innerHeight}`;
  };
  measure();
  addEventListener('resize', measure, { passive: true });
})();
