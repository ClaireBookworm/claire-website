import { useEffect, useRef, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getSortedPostsData as getPosts } from '../lib/posts';
import { getSortedPostsData as getNotes } from '../notes-lib/posts';
import { useSkin } from '../components/claireos/SkinContext';
import VaporwaveBackdrop from '../components/claireos/VaporwaveBackdrop';
import { AboutGlyph, ProjectsGlyph, WritingGlyph, RadioGlyph, NotesGlyph } from '../components/claireos/Glyphs';

export async function getStaticProps() {
  const allPosts = getPosts().map((p) => ({ id: p.id, title: p.title || p.id, date: p.date || '' }));
  const allNotes = getNotes().map((n) => ({ id: n.id, title: n.title || n.id, date: n.date || '' }));
  return { props: { allPosts, allNotes } };
}

const MOODS = [
  { name: 'happy', colors: ['#ff9f43', '#ffb15c'], head: '#ff9f43', face: '♥' },
  { name: 'excited', colors: ['#ff5d8f', '#ff85aa'], head: '#ff5d8f', face: '!!' },
  { name: 'full', colors: ['#5ce6b5', '#86eecb'], head: '#5ce6b5', face: '✦' },
  { name: 'sleepy', colors: ['#a78bff', '#c0adff'], head: '#a78bff', face: 'z' },
];
const ICON_TO_WIN = { iAbout: 'about', iProjects: 'projects', iWriting: 'writing', iRadio: 'radio', iNotes: 'notes' };
const APPS = ['about', 'projects', 'writing', 'radio', 'notes'];
const NOW_PLAYING = '♪ WILLOW — b i g f e e l i n g s   ✦   Thundercat — Them Changes   ✦   Bleachers — Stop Making This Hurt   ✦   Japanese Breakfast — Posing for Cars   ✦   Esperanza Spalding — I Know You Know   ✦';

// Icons scattered around the desktop (kept clear of the default-open windows
// and the bottom chrome). Each is still individually draggable.
const INITIAL_POS = {
  iAbout: { x: 38, y: 78 }, iWriting: { x: 66, y: 222 }, iNotes: { x: 40, y: 362 }, iProjects: { x: 168, y: 470 }, iRadio: { x: 318, y: 472 },
  about: { x: 168, y: 92 }, writing: { x: 600, y: 150 }, projects: { x: 300, y: 320 }, radio: { x: 470, y: 250 }, notes: { x: 360, y: 380 },
};

function fmtClock() {
  const d = new Date();
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ap = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ap}`;
}

export default function Home({ allPosts, allNotes }) {
  const router = useRouter();
  const { skin, dark, setSkin, toggleSkin } = useSkin();

  const [pos, setPos] = useState(INITIAL_POS);
  const [open, setOpen] = useState({ about: true, writing: true, projects: false, radio: false, notes: false });
  const [z, setZ] = useState({ about: 101, writing: 100, projects: 90, radio: 90, notes: 90 });
  const topZ = useRef(101);
  const [mobile, setMobile] = useState(false);
  const [termH, setTermH] = useState(116); // terminal dock height — grows on tall screens
  const [now, setNow] = useState('');
  const [worm, setWorm] = useState({ fed: 0, moodIdx: 0 });
  const [pop, setPop] = useState({ show: false, char: '' });
  const [cmd, setCmd] = useState('');
  const [term, setTerm] = useState([
    { type: 'sys', text: 'ClaireOS 1.0 — booted ok ✓' },
    { type: 'sys', text: "type 'help' · drag icons · click the worm · ✉ contact ↘" },
  ]);

  const dragRef = useRef(null);
  const popTimer = useRef(null);
  const wormRef = useRef(worm);
  wormRef.current = worm;

  // ---- terminal helpers ----
  const print = useCallback((type, text) => {
    setTerm((t) => [...t, { type, text }].slice(-40));
  }, []);

  const front = useCallback((win) => {
    const nz = topZ.current + 1;
    topZ.current = nz;
    setZ((zz) => ({ ...zz, [win]: nz }));
  }, []);

  const openWin = useCallback((win) => {
    const nz = topZ.current + 1;
    topZ.current = nz;
    setOpen((o) => ({ ...o, [win]: true }));
    setZ((zz) => ({ ...zz, [win]: nz }));
    print('out', `▸ opened ${win}/`);
  }, [print]);

  const closeWin = (win) => (e) => {
    e.stopPropagation();
    setOpen((o) => ({ ...o, [win]: false }));
  };

  const wormCount = () => 7 + Math.min(wormRef.current.fed, 9);

  const feedWorm = useCallback(() => {
    clearTimeout(popTimer.current);
    setWorm((w) => {
      const moodIdx = (w.moodIdx + 1) % MOODS.length;
      const m = MOODS[moodIdx];
      setPop({ show: true, char: m.face });
      print('out', `▸ *nom* — the worm is now ${m.name} ${m.face}`);
      return { fed: w.fed + 1, moodIdx };
    });
    popTimer.current = setTimeout(() => setPop((p) => ({ ...p, show: false })), 900);
  }, [print]);

  const showContact = useCallback(() => print('out', '✉  claire [at] angelhacks [dot] org  — say hi!'), [print]);
  const focusCmd = () => { const el = document.querySelector('.ccterm-input'); if (el) el.focus(); };

  const run = useCallback((raw) => {
    const line = (raw || '').trim();
    print('in', `claire@os ~ % ${line}`);
    if (!line) return;
    const parts = line.split(/\s+/);
    const c = parts[0].toLowerCase();
    const arg = (parts[1] || '').toLowerCase();
    const P = (t) => print('out', t);
    const E = (t) => print('err', t);
    switch (c) {
      case 'help':
        P('apps: ls · open <app> · cat about · whoami · feed · clear');
        P('look: dark · light   ·   reach: contact');
        P('pages: projects · writing · notes · radio');
        break;
      case 'ls': P('about_me   projects/   writing/   radio.exe   notes/'); break;
      case 'open':
        if (APPS.includes(arg)) openWin(arg);
        else E(`can't open '${arg}' — try: ${APPS.join(', ')}`);
        break;
      case 'cat':
        if (['about', 'about_me', 'me', 'about_me.txt'].includes(arg)) {
          P('claire wang — neuro + cs @ mit, on leave in sf.');
          P('building whole-brain emulation @ e11.bio. radio host. worm fan. DFTBA!');
        } else E(`no such file: ${arg || '(nothing)'}`);
        break;
      case 'whoami': P('claire wang ☺ — but you probably knew that'); break;
      case 'feed': case 'feed-worm': feedWorm(); break;
      case 'contact': case 'email': showContact(); break;
      case 'dark': case 'night': case 'vaporwave': setSkin('dark'); P('☾ dark mode (vaporwave) on'); break;
      case 'light': case 'day': setSkin('light'); P('☀ light mode on'); break;
      case 'skin': case 'theme': toggleSkin(); P('flipped the skin — see the ☀/☾ in the menu bar'); break;
      case 'projects': P('loading projects/ …'); setTimeout(() => router.push('/gallery'), 350); break;
      case 'writing': case 'blog': P('loading cold-brew-blog …'); setTimeout(() => router.push('/writing'), 350); break;
      case 'notes': P('loading notes/ …'); setTimeout(() => router.push('/notes'), 350); break;
      case 'radio': openWin('radio'); break;
      case 'clear': setTerm([]); break;
      case 'date': P(new Date().toString()); break;
      case 'sudo': P('nice try ☺ — you already have root in here'); break;
      case 'bleachers': P('♫ ♫  BLEACHERS FOREVER  ♫ ♫'); break;
      case 'worm': P(`the worm has ${1 + wormCount()} segments & feels ${MOODS[wormRef.current.moodIdx].name}. click it to feed.`); break;
      default: E(`command not found: ${c}   (try 'help')`);
    }
  }, [print, openWin, feedWorm, showContact, setSkin, toggleSkin, router]);

  // ---- drag (pointer events) ----
  const down = (key, kind) => (e) => {
    // bring windows to front on grab — on desktop (z-index) and mobile (stack order)
    if (kind === 'win') front(key);
    if (mobile) { dragRef.current = { key, kind, moved: false, mobile: true }; return; }
    e.preventDefault();
    const p = pos[key];
    dragRef.current = { key, kind, dx: e.clientX - p.x, dy: e.clientY - p.y, sx: e.clientX, sy: e.clientY, moved: false };
  };

  useEffect(() => {
    const tick = setInterval(() => setNow(fmtClock()), 1000);
    setNow(fmtClock());
    const onResize = () => {
      setMobile(window.innerWidth < 760);
      const h = window.innerHeight;
      // give the terminal a slightly larger slice of tall screens
      setTermH(h >= 800 ? Math.min(208, Math.round(h * 0.18)) : 116);
    };
    onResize();
    const onMove = (e) => {
      const dr = dragRef.current;
      if (!dr || dr.mobile) return;
      if (Math.abs(e.clientX - dr.sx) + Math.abs(e.clientY - dr.sy) > 3) dr.moved = true;
      const x = Math.max(0, e.clientX - dr.dx);
      const y = Math.max(34, e.clientY - dr.dy);
      setPos((pp) => ({ ...pp, [dr.key]: { x, y } }));
    };
    const onUp = () => {
      const dr = dragRef.current;
      dragRef.current = null;
      if (dr && dr.kind === 'icon' && !dr.moved) openWin(ICON_TO_WIN[dr.key]);
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      clearInterval(tick);
      clearTimeout(popTimer.current);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, [openWin]);

  // ---- derived render values ----
  const mood = MOODS[worm.moodIdx];
  const n = 7 + Math.min(worm.fed, 9);
  const wormSegs = [];
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const size = Math.round(18 - t * 11);
    const color = mood.colors[i % 2];
    wormSegs.push({ size, color, delay: (i * 0.07).toFixed(2), glow: dark ? `0 0 7px ${color}` : 'none' });
  }
  const termColor = { in: '#9fd9ff', out: '#5ce6b5', sys: '#3f8f74', err: '#ff6b6b' };
  const termLines = Math.max(4, Math.floor((termH - 52) / 21));
  const termView = term.slice(-termLines);
  const bottomDockH = termH; // now-playing sits on top of the terminal
  const npBottom = termH; // now-playing bar bottom offset
  const wormBottom = termH + 36; // worm + webring float just above now-playing

  const winBorder = dark ? '#ff43c8' : '#0d1b2a';
  const winShadow = dark ? '0 0 20px rgba(255,67,200,.45)' : '7px 7px 0 rgba(0,0,0,.22)';
  const termAccent = dark ? '#ff43c8' : '#5ce6b5';
  const npBg = dark ? 'rgba(18,6,34,.85)' : 'rgba(255,255,255,.92)';
  const npBorder = dark ? '#8a2be2' : '#0d1b2a';
  const npLabel = dark ? '#00eaff' : '#0c63ff';
  const npText = dark ? '#ff9de2' : '#0d1b2a';
  const barBg = dark ? 'rgba(20,8,40,.55)' : 'rgba(255,255,255,.95)';
  const barColor = dark ? '#ff9de2' : '#1c1a17';
  const logoBg = dark ? 'linear-gradient(#fff3a0,#ff7be6)' : '#0c63ff';

  const winFrame = (key, w) => (mobile
    ? { position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto', order: 1000 - (z[key] || 90) }
    : { position: 'absolute', width: w, left: pos[key].x, top: pos[key].y, zIndex: z[key] });
  const iconFrame = (key) => (mobile
    ? { position: 'relative' }
    : { position: 'absolute', left: pos[key].x, top: pos[key].y });

  const iconLabel = { marginTop: 5, fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 600, fontSize: 12, color: '#fff', textShadow: '1px 1px 0 rgba(0,0,0,.55)' };
  const iconWrap = { width: 88, textAlign: 'center', cursor: 'pointer', touchAction: 'none', zIndex: 20 };
  const titleBarBase = { height: 28, borderBottom: `2px solid ${winBorder}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6, cursor: 'move', touchAction: 'none' };
  const winBase = { background: '#fff', border: `2px solid ${winBorder}`, boxShadow: winShadow };
  const chip = { fontFamily: "'VT323',monospace", fontSize: 15, color: '#0c63ff', border: '1.5px solid #c4d2ea', padding: '0 8px', textDecoration: 'none' };
  // yellow close box, now with an × so it reads as "exit"
  const closeBox = { width: 14, height: 14, background: '#ffd23f', border: '1.5px solid #0d1b2a', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'VT323',monospace", fontSize: 14, lineHeight: 1, color: '#0d1b2a', fontWeight: 700 };

  // Webring — loose on the desktop. fixed=true pins it just above the now-playing
  // bar (desktop); otherwise it flows inline (mobile). Retro font, lower opacity.
  const renderWebring = (fixed) => (
    <div
      style={fixed
        ? { position: 'fixed', left: 18, bottom: wormBottom, width: 300, zIndex: 7, opacity: 0.68 }
        : { position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto', opacity: 0.85 }}
    >
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, letterSpacing: '.08em', color: dark ? '#8ff6ff' : '#fff', textShadow: dark ? '0 0 8px rgba(110,240,255,.7)' : '1px 1px 0 rgba(0,0,0,.45)', marginBottom: 2 }}>✦ overengineeRING webring</div>
      <iframe
        src="https://overengineering.kognise.dev/embed/claire"
        title="overengineeRING webring"
        width="100%"
        height="84"
        frameBorder="0"
        allowTransparency="true"
        style={{ border: 'none', display: 'block', background: 'transparent' }}
      />
    </div>
  );

  return (
    <>
      <Head>
        <title>ClaireOS — claire wang</title>
        <meta name="description" content="claire wang — a desktop-OS corner of the internet." />
      </Head>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: dark ? '#160a2e' : '#0c63ff',
          backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px)',
          backgroundSize: '20px 20px',
          fontFamily: "'Space Grotesk',system-ui,sans-serif",
          userSelect: 'none',
          overflowY: mobile ? 'auto' : 'hidden',
          overflowX: 'hidden',
        }}
      >
        {dark ? <VaporwaveBackdrop titleSize={mobile ? '34px' : '60px'} /> : null}

        {/* MENU BAR */}
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: 32, background: barBg, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', gap: 16, padding: '0 12px', zIndex: 9000, boxShadow: '0 1px 0 rgba(0,0,0,.2)', fontSize: 13, color: barColor }}>
          <span style={{ width: 16, height: 16, borderRadius: 3, display: 'inline-block', background: logoBg }} />
          <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700 }}>clairebookworm</span>
          <span style={{ opacity: 0.6 }} className="cc-hide-sm">File</span>
          <span style={{ opacity: 0.6 }} className="cc-hide-sm">Edit</span>
          <span style={{ opacity: 0.6 }} className="cc-hide-sm">View</span>
          <span onClick={toggleSkin} style={{ cursor: 'pointer', fontSize: 16, lineHeight: 1, marginLeft: 2 }} title="toggle light / dark">{dark ? '☾' : '☀'}</span>
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14, fontFamily: "'Silkscreen',monospace", fontSize: 10, color: barColor }}>
            <span onClick={feedWorm} style={{ cursor: 'pointer', opacity: 0.85 }}>{`◐ worm: ${mood.name} ${mood.face}`}</span>
            <span suppressHydrationWarning>{now}</span>
          </span>
        </div>

        {/* BLEACHERS POSTER (desktop only) */}
        {!mobile ? (
          <div style={{ position: 'fixed', top: 60, right: 34, zIndex: 10, background: '#11122a', border: '3px solid #fff', boxShadow: '5px 5px 0 rgba(0,0,0,.3)', padding: '14px 18px', textAlign: 'center', transform: 'rotate(2.5deg)' }}>
            <div style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 20, color: '#ffd23f', lineHeight: 1, textShadow: '2px 2px 0 #000' }}>BLEACHERS</div>
            <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: 10, letterSpacing: '.2em', color: '#ff5d8f', marginTop: 6 }}>F O R E V E R</div>
            <div style={{ marginTop: 7, display: 'flex', gap: 5, justifyContent: 'center' }}>
              <span style={{ color: '#5ce6b5' }}>★</span><span style={{ color: '#ffd23f' }}>★</span><span style={{ color: '#ff5d8f' }}>★</span>
            </div>
          </div>
        ) : null}

        {/* FLOW: icons + windows + webring */}
        <div style={mobile ? { position: 'relative', zIndex: 5, padding: `42px 14px ${termH + 120}px`, display: 'flex', flexDirection: 'column', gap: 16 } : { display: 'contents' }}>

          {/* ICONS */}
          <div style={mobile ? { display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', marginBottom: 4, order: -1 } : { display: 'contents' }}>
            <div onPointerDown={down('iAbout', 'icon')} style={{ ...iconWrap, ...iconFrame('iAbout') }}>
              <AboutGlyph />
              <div style={iconLabel}>about_me</div>
            </div>
            <div onPointerDown={down('iProjects', 'icon')} style={{ ...iconWrap, ...iconFrame('iProjects') }}>
              <ProjectsGlyph />
              <div style={{ ...iconLabel, marginTop: 3 }}>projects</div>
            </div>
            <div onPointerDown={down('iWriting', 'icon')} style={{ ...iconWrap, ...iconFrame('iWriting') }}>
              <WritingGlyph />
              <div style={iconLabel}>writing</div>
            </div>
            <div onPointerDown={down('iRadio', 'icon')} style={{ ...iconWrap, ...iconFrame('iRadio') }}>
              <RadioGlyph />
              <div style={iconLabel}>radio</div>
            </div>
            <div onPointerDown={down('iNotes', 'icon')} style={{ ...iconWrap, ...iconFrame('iNotes') }}>
              <NotesGlyph />
              <div style={iconLabel}>notes</div>
            </div>
          </div>

          {/* ABOUT */}
          {open.about ? (
            <div style={{ ...winBase, ...winFrame('about', 392) }}>
              <div onPointerDown={down('about', 'win')} style={{ ...titleBarBase, background: '#0c63ff' }}>
                <span onPointerDown={closeWin('about')} style={closeBox} title="close">×</span>
                <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>about_me.txt</span>
                <span style={{ marginLeft: 'auto', width: 13, height: 13, background: '#5ce6b5', border: '1.5px solid #0d1b2a' }} />
              </div>
              <div style={{ padding: 18 }}>
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ width: 54, height: 54, flex: 'none', background: '#ffd23f', border: '2px solid #0d1b2a', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 10, left: 10, width: 8, height: 8, background: '#0d1b2a' }} />
                    <div style={{ position: 'absolute', top: 10, right: 10, width: 8, height: 8, background: '#0d1b2a' }} />
                    <div style={{ position: 'absolute', bottom: 11, left: 13, right: 13, height: 6, background: '#0d1b2a', borderRadius: '0 0 6px 6px' }} />
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 22, color: '#0d1b2a', lineHeight: 1 }}>claire wang</div>
                    <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: 9, letterSpacing: '.1em', color: '#5b6678', marginTop: 6 }}>NEURO + CS @ MIT · SF</div>
                  </div>
                </div>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#2a2722', margin: '14px 0 10px' }}>hi, i&apos;m claire ☺ — on leave from MIT in SF, building toward a whole-brain connectome of the mouse <a href="https://e11.bio" style={{ color: '#0c63ff' }}>@ e11.bio</a>. before: ML eng @ dimensionalOS, CoreOS @ Apple, and a pile of neuro research.</p>
                <p style={{ fontSize: 13.5, lineHeight: 1.6, color: '#2a2722', margin: '0 0 14px' }}>i run a weekly radio show (<em>Death Car for QT</em>), love Bleachers + jazz, hold strong book opinions, and was once a memory athlete. <strong>DFTBA!</strong></p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  <a href="https://twitter.com/clairebookworm" target="_blank" rel="noreferrer" style={chip}>twitter</a>
                  <a href="https://github.com/clairebookworm" target="_blank" rel="noreferrer" style={chip}>github</a>
                  <a href="https://clairebookworm.substack.com" target="_blank" rel="noreferrer" style={chip}>substack</a>
                  <a href="https://open.spotify.com/user/rsjahryaqu08yocko5k5cfd9s" target="_blank" rel="noreferrer" style={chip}>spotify</a>
                  <a href="https://www.goodreads.com/clairebookworm" target="_blank" rel="noreferrer" style={chip}>goodreads</a>
                </div>
              </div>
            </div>
          ) : null}

          {/* WRITING preview */}
          {open.writing ? (
            <div style={{ ...winBase, ...winFrame('writing', 436) }}>
              <div onPointerDown={down('writing', 'win')} style={{ ...titleBarBase, background: '#0c63ff' }}>
                <span onPointerDown={closeWin('writing')} style={closeBox} title="close">×</span>
                <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>cold-brew-blog</span>
                <a href="/writing" title="open full" style={{ marginLeft: 'auto', width: 13, height: 13, background: '#5ce6b5', border: '1.5px solid #0d1b2a' }} />
              </div>
              <div className="ccwin-scroll" style={{ maxHeight: 320, overflowY: 'auto' }}>
                {allPosts.map((p, i) => (
                  <a key={p.id} href={`/posts/${p.id}`} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 16px', borderBottom: i < allPosts.length - 1 ? '1px solid #e7ecf5' : 'none', textDecoration: 'none' }}>
                    <span style={{ fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: 17, color: '#0d1b2a', flex: 1, lineHeight: 1.25 }}>{p.title}</span>
                    <span style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#8a93a6', whiteSpace: 'nowrap' }}>{p.date}</span>
                  </a>
                ))}
              </div>
              <a href="/writing" style={{ display: 'block', padding: '9px 16px', borderTop: `2px solid ${winBorder}`, background: '#f3f7ff', fontFamily: "'VT323',monospace", fontSize: 15, color: '#0c63ff', textDecoration: 'none' }}>▸ open cold-brew-blog →</a>
            </div>
          ) : null}

          {/* PROJECTS preview */}
          {open.projects ? (
            <div style={{ ...winBase, ...winFrame('projects', 380) }}>
              <div onPointerDown={down('projects', 'win')} style={{ ...titleBarBase, background: '#0c63ff' }}>
                <span onPointerDown={closeWin('projects')} style={closeBox} title="close">×</span>
                <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>projects/</span>
                <a href="/gallery" title="open full" style={{ marginLeft: 'auto', width: 13, height: 13, background: '#5ce6b5', border: '1.5px solid #0d1b2a' }} />
              </div>
              <div style={{ padding: '6px 0' }}>
                {[
                  { c: '#c9f7e4', name: 'whole-brain emulation', tag: 'NEURO' },
                  { c: '#a7c4ff', name: 'SineRider', tag: 'GAME' },
                  { c: '#ffe2a7', name: 'Blonk — physical DAW', tag: 'HTMAA' },
                  { c: '#ffc2d6', name: 'AngelHacks', tag: 'HACKS' },
                ].map((r) => (
                  <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px' }}>
                    <span style={{ width: 20, height: 20, background: r.c, border: '1.5px solid #0d1b2a', flex: 'none' }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#0d1b2a', flex: 1 }}>{r.name}</span>
                    <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 8, color: '#8a93a6' }}>{r.tag}</span>
                  </div>
                ))}
              </div>
              <a href="/gallery" style={{ display: 'block', padding: '9px 14px', borderTop: `2px solid ${winBorder}`, background: '#f3f7ff', fontFamily: "'VT323',monospace", fontSize: 15, color: '#0c63ff', textDecoration: 'none' }}>▸ open full portfolio →</a>
            </div>
          ) : null}

          {/* RADIO */}
          {open.radio ? (
            <div style={{ background: '#15122a', border: `2px solid ${winBorder}`, boxShadow: winShadow, ...winFrame('radio', 340) }}>
              <div onPointerDown={down('radio', 'win')} style={{ ...titleBarBase, background: '#ff5d8f' }}>
                <span onPointerDown={closeWin('radio')} style={closeBox} title="close">×</span>
                <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>radio.exe</span>
              </div>
              <div style={{ padding: 18, textAlign: 'center' }}>
                <div style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 18, color: '#ffd23f', textShadow: '2px 2px 0 #000' }}>DEATH CAR FOR QT</div>
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#5ce6b5', marginTop: 4 }}>Tue 12–1AM EST · 88.1 FM WMBR</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 36, margin: '14px 0' }}>
                  {[['#5ce6b5', '.7s', '0s'], ['#ffd23f', '.9s', '.1s'], ['#ff5d8f', '.6s', '.2s'], ['#5ce6b5', '1s', '.05s'], ['#ffd23f', '.8s', '.25s']].map((b, i) => (
                    <div key={i} style={{ width: 6, height: 30, background: b[0], transformOrigin: 'bottom', animation: `ccVis ${b[1]} ease-in-out infinite`, animationDelay: b[2] }} />
                  ))}
                </div>
                <a href="/radio" style={{ display: 'inline-block', fontFamily: "'VT323',monospace", fontSize: 18, color: '#15122a', background: '#5ce6b5', border: '2px solid #0d1b2a', padding: '4px 18px', textDecoration: 'none' }}>▶ launch player →</a>
              </div>
            </div>
          ) : null}

          {/* NOTES */}
          {open.notes ? (
            <div style={{ ...winBase, ...winFrame('notes', 320) }}>
              <div onPointerDown={down('notes', 'win')} style={{ ...titleBarBase, background: '#5ce6b5' }}>
                <span onPointerDown={closeWin('notes')} style={closeBox} title="close">×</span>
                <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#0d1b2a' }}>notes/</span>
                <a href="/notes" title="open full" style={{ marginLeft: 'auto', width: 13, height: 13, background: '#0c63ff', border: '1.5px solid #0d1b2a' }} />
              </div>
              <div className="ccwin-scroll" style={{ padding: '8px 0', maxHeight: 300, overflowY: 'auto' }}>
                {allNotes.map((nt) => (
                  <a key={nt.id} href={`/notes/${nt.id}`} style={{ display: 'flex', alignItems: 'baseline', gap: 8, padding: '6px 16px', fontFamily: "'VT323',monospace", fontSize: 17, color: '#0d1b2a', textDecoration: 'none' }}>
                    <span style={{ flex: 1, lineHeight: 1.2 }}>▸ {nt.title}</span>
                    <span style={{ fontSize: 13, color: '#8a93a6', whiteSpace: 'nowrap' }}>{nt.date}</span>
                  </a>
                ))}
                <div style={{ padding: '9px 16px 4px', fontFamily: "'VT323',monospace", fontSize: 15, color: '#8a93a6' }}>// you found the worm tank. hi 🪱</div>
              </div>
            </div>
          ) : null}

          {/* WEBRING (mobile: inline in flow) */}
          {mobile ? renderWebring(false) : null}
        </div>

        {/* WEBRING (desktop: pinned just above the now-playing bar) */}
        {!mobile ? renderWebring(true) : null}

        {/* WORM PET */}
        <div onClick={feedWorm} style={{ position: 'fixed', bottom: wormBottom, zIndex: 8000, display: 'flex', alignItems: 'flex-end', cursor: 'pointer', animation: 'ccCrawl 19s linear infinite' }} title="click to feed me!">
          {pop.show ? (
            <span style={{ position: 'absolute', left: 8, top: -26, fontFamily: "'VT323',monospace", fontSize: 22, color: '#fff', textShadow: '1px 1px 0 #0d1b2a', animation: 'ccPop .9s ease-out forwards' }}>{pop.char}</span>
          ) : null}
          <div style={{ width: 20, height: 20, borderRadius: '50%', background: mood.head, border: '2px solid #0d1b2a', position: 'relative', boxShadow: dark ? `0 0 8px ${mood.head}` : 'none', animation: 'ccSeg .55s ease-in-out infinite' }}>
            <span style={{ position: 'absolute', top: 5, left: 4, width: 3, height: 3, background: '#0d1b2a', borderRadius: '50%' }} />
            <span style={{ position: 'absolute', top: 5, left: 11, width: 3, height: 3, background: '#0d1b2a', borderRadius: '50%' }} />
          </div>
          {wormSegs.map((s, i) => (
            <div key={i} style={{ borderRadius: '50%', border: '2px solid #0d1b2a', marginLeft: -4, width: s.size, height: s.size, background: s.color, boxShadow: s.glow, animation: 'ccSeg .55s ease-in-out infinite', animationDelay: `${s.delay}s` }} />
          ))}
        </div>

        {/* NOW PLAYING */}
        <div style={{ position: 'fixed', left: 0, right: 0, bottom: npBottom, height: 30, zIndex: 8400, display: 'flex', alignItems: 'center', background: npBg, borderTop: `2px solid ${npBorder}`, overflow: 'hidden' }}>
          <span style={{ flex: 'none', fontFamily: "'Silkscreen',monospace", fontSize: 9, color: npLabel, padding: '0 12px', borderRight: `1px solid ${npBorder}` }}>NOW PLAYING</span>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'ccMarquee 22s linear infinite' }}>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: npText, paddingRight: 50 }}>{NOW_PLAYING}</span>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: npText, paddingRight: 50 }}>{NOW_PLAYING}</span>
            </div>
          </div>
        </div>

        {/* TERMINAL DOCK */}
        <div onClick={focusCmd} style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: bottomDockH, background: '#0a0a14', borderTop: `2px solid ${termAccent}`, zIndex: 8500, padding: '8px 14px 10px', fontFamily: "'VT323',monospace", boxShadow: '0 -4px 16px rgba(0,0,0,.4)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
            {termView.map((l, i) => (
              <div key={i} style={{ fontSize: 16, lineHeight: 1.3, color: termColor[l.type] || '#5ce6b5', whiteSpace: 'pre-wrap' }}>{l.text}</div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, borderTop: '1px solid #1c2030', paddingTop: 6 }}>
            <span style={{ fontSize: 16, color: termAccent }}>claire@os</span>
            <span style={{ fontSize: 16, color: '#ffd23f' }}>~ %</span>
            <input
              className="ccterm-input"
              value={cmd}
              onChange={(e) => setCmd(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { const v = cmd; setCmd(''); run(v); } }}
              placeholder="type 'help' · 'contact' · 'dark'"
              spellCheck="false"
              autoComplete="off"
              aria-label="terminal command input"
              style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: '#eafff7', fontFamily: "'VT323',monospace", fontSize: 18 }}
            />
            <span onClick={showContact} style={{ cursor: 'pointer', fontSize: 15, color: '#ff9de2', whiteSpace: 'nowrap' }}>✉ contact</span>
          </div>
        </div>
      </div>
    </>
  );
}
