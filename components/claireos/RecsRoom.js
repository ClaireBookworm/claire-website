// components/claireos/RecsRoom.js
// The "recs room" — a cozy-nook hero of current faves, then the full media
// shelf (books as spines, films as VHS, albums as vinyl, playlists as
// cassette mixtapes) with filter + sort, plus a footer of blogs + the reading pile.
//
// Same visual language as the ClaireOS desktop: 2px #0d1b2a borders, hard
// offset shadows, Pixelify/Silkscreen/VT323/Newsreader type. All inline
// styles so it themes cleanly on either skin.

import { useMemo, useState } from 'react';

// deterministic hue per title so colors are stable between renders
function hueOf(str) {
  let h = 0;
  for (let i = 0; i < (str || '').length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h % 360;
}
const col = (h, l) => `hsl(${h},54%,${l}%)`;

// hsl(h,54%,l%) → rgb, so we can pick a legible ink color per spine.
function hslToRgb(h, l) {
  const s = 0.54; const L = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(L, 1 - L);
  const f = (n) => L - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
}
// dark ink on light spines, light ink on dark ones — auto contrast
function inkOn(hue, l) {
  const [r, g, b] = hslToRgb(hue, l);
  return (0.299 * r + 0.587 * g + 0.114 * b) > 150 ? '#15130f' : '#fbf7ea';
}
// shrink spine type so a long title fits its height without clipping mid-word
function fitFont(len, h, min, max) {
  return Math.max(min, Math.min(max, Math.floor((h - 30) / Math.max(1, len))));
}

// music filter groups albums + playlists; everything else maps to itself
const groupOf = (t) => (t === 'album' || t === 'playlist' ? 'music' : t);
const KIND = { book: 'BOOK', album: 'RECORD', playlist: 'MIXTAPE', film: 'FILM' };
const LINKS = {
  book: { url: 'https://www.goodreads.com/clairebookworm', label: 'goodreads ↗' },
  film: { url: 'https://letterboxd.com/clairebookworm/', label: 'letterboxd ↗' },
  album: { url: 'https://musicboard.app/clairebookworm', label: 'musicboard ↗' },
  playlist: { url: 'https://open.spotify.com/user/rsjahryaqu08yocko5k5cfd9s', label: 'spotify ↗' },
};

function flatten(data) {
  const out = [];
  (data.books || []).forEach((b) =>
    out.push({ type: 'book', id: 'b:' + b.title, title: b.title, by: b.author, note: b.note, link: b.link, cat: (b.category || 'fiction').toUpperCase(), fave: !!b.fave, hue: hueOf(b.title) }));
  (data.albums || []).forEach((a) =>
    out.push({ type: 'album', id: 'a:' + a.title, title: a.title, by: a.artist, note: a.note, link: a.link, cat: 'ALBUM', fave: !!a.fave, hue: hueOf(a.title) }));
  (data.playlists || []).forEach((p) =>
    out.push({ type: 'playlist', id: 'p:' + p.name, title: p.name, by: 'playlist', note: p.note, link: p.link, cat: 'MIXTAPE', fave: !!p.fave, hue: hueOf(p.name) }));
  (data.films || []).forEach((f) =>
    out.push({ type: 'film', id: 'f:' + f.title, title: f.title, by: f.director || '', note: f.note, link: f.link, cat: 'FILM', fave: !!f.fave, hue: hueOf(f.title) }));
  return out;
}

const FILTERS = [
  { key: 'all', label: 'all', dot: 'conic-gradient(#ff5d8f,#ffd23f,#5ce6b5,#0c63ff,#ff5d8f)' },
  { key: 'book', label: 'books', dot: col(205, 64) },
  { key: 'film', label: 'films', dot: '#17131f' },
  { key: 'music', label: 'music', dot: col(300, 62) },
];
const SORTS = [
  { key: 'shelf', label: 'by section' },
  { key: 'rainbow', label: 'rainbow' },
  { key: 'az', label: 'A–Z' },
];

export default function RecsRoom({ data, dark }) {
  const items = useMemo(() => flatten(data || {}), [data]);
  const blogs = (data && data.blogs) || [];
  const toread = (data && data.toread) || [];
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('shelf');
  const [view, setView] = useState('spine'); // 'spine' (upright) | 'stack' (lying flat)
  const [selId, setSelId] = useState(null);

  const sel = items.find((it) => it.id === selId) || items[0] || null;

  // faves for the nook hero
  const faveBooks = items.filter((it) => it.type === 'book' && it.fave);
  const faveAlbum = items.find((it) => it.type === 'album' && it.fave) || items.find((it) => it.type === 'album');
  const faveFilm = items.find((it) => it.type === 'film' && it.fave) || items.find((it) => it.type === 'film');
  const favePlaylist = items.find((it) => it.type === 'playlist' && it.fave) || items.find((it) => it.type === 'playlist');

  // shelf order + filter
  const rank = { book: 0, film: 1, album: 2, playlist: 3 };
  const shown = useMemo(() => {
    let list = items.filter((it) => filter === 'all' || groupOf(it.type) === filter);
    if (sort === 'az') list = list.slice().sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'rainbow') list = list.slice().sort((a, b) => a.hue - b.hue);
    else list = list.slice().sort((a, b) => (rank[a.type] - rank[b.type]) || a.title.localeCompare(b.title));
    return list;
  }, [items, filter, sort]);

  const link = sel ? LINKS[sel.type] : null;

  // ----- shared style bits -----
  const frame = { border: '2px solid #0d1b2a' };
  const hardShadow = '7px 7px 0 rgba(0,0,0,.22)';
  const spineText = {
    writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: "'Newsreader',serif",
    fontWeight: 600, lineHeight: 1, letterSpacing: '.01em', overflow: 'hidden', flex: 1, margin: '8px auto',
  };

  // book spine (varied dims from title length + hue) — clean hardcover: solid
  // cloth with a subtle sheen + a single head/tail band added in renderSpine.
  const bookSpine = (it, active) => {
    const w = 30 + ((it.title.length * 7) % 16);
    const h = (156 + ((it.title.length * 13) % 54)) - (active ? 12 : 0);
    return {
      position: 'relative', flexShrink: 0, width: w, height: h, alignSelf: 'flex-end',
      background: col(it.hue, 56),
      border: '2px solid #0d1b2a',
      boxShadow: active
        ? '0 -10px 16px rgba(0,0,0,.3)'
        : 'inset 3px 0 0 rgba(255,255,255,.15), inset -4px 0 0 rgba(0,0,0,.18), 1.5px 0 3px rgba(0,0,0,.13)',
      display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between',
      cursor: 'pointer', transition: 'transform .16s ease', transform: active ? 'translateY(-6px)' : 'none',
      overflow: 'hidden',
    };
  };

  // generic spine wrapper for a shelf item, styled per type
  const renderSpine = (it) => {
    const active = sel && it.id === sel.id;
    if (it.type === 'book') {
      const h = (156 + ((it.title.length * 13) % 54)) - (active ? 12 : 0);
      const band = col(it.hue, 34);
      const ink = inkOn(it.hue, 56);
      const fs = fitFont(it.title.length, h, 8, 13);
      return (
        <div key={it.id} title={it.title} onClick={() => setSelId(it.id)} style={bookSpine(it, active)}>
          {/* head band */}
          <span style={{ height: 8, flexShrink: 0, background: band, borderBottom: '1px solid rgba(0,0,0,.3)' }} />
          {/* title printed straight on the spine */}
          <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: fs, lineHeight: 1.05, letterSpacing: '.01em', color: ink, flex: 1, margin: '7px auto', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', textAlign: 'center' }}>{it.title}</span>
          {/* tail band + gilt line */}
          <span style={{ height: 8, flexShrink: 0, background: band, borderTop: '1px solid rgba(255,215,120,.45)' }} />
        </div>
      );
    }
    if (it.type === 'film') {
      const h = (168) - (active ? 12 : 0);
      const fs = fitFont(it.title.length, h - 30, 8, 12);
      return (
        <div key={it.id} title={it.title} onClick={() => setSelId(it.id)}
          style={{ position: 'relative', flexShrink: 0, width: 34, height: h, alignSelf: 'flex-end', background: 'linear-gradient(90deg,#1c1826,#17131f)', border: '2px solid #0d1b2a', boxShadow: active ? '0 -10px 16px rgba(0,0,0,.3)' : '1.5px 0 3px rgba(0,0,0,.14)', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'transform .16s ease', transform: active ? 'translateY(-6px)' : 'none', overflow: 'hidden' }}>
          <span style={{ height: 30, flexShrink: 0, marginTop: 8, background: 'repeating-linear-gradient(120deg,#f4f1ea 0 6px,#17131f 6px 12px)', borderBottom: '1.5px solid rgba(0,0,0,.35)' }} />
          <span style={{ ...spineText, fontFamily: "'Space Grotesk',system-ui,sans-serif", fontWeight: 500, fontSize: fs, color: col(it.hue, 70) }}>{it.title}</span>
        </div>
      );
    }
    if (it.type === 'album') {
      // record sleeve: the vinyl disc pokes out the top, printed sleeve below,
      // a white catalog sticker near the foot.
      const h = (190) - (active ? 12 : 0);
      const ink = inkOn(it.hue, 60);
      const fs = fitFont(it.title.length, h - 42, 8, 11);
      return (
        <div key={it.id} title={it.title} onClick={() => setSelId(it.id)}
          style={{ position: 'relative', flexShrink: 0, width: 26, height: h, alignSelf: 'flex-end', background: `linear-gradient(90deg, ${col(it.hue, 66)} 0 3px, ${col(it.hue, 58)} 3px 100%)`, border: '2px solid #0d1b2a', boxShadow: active ? '0 -10px 16px rgba(0,0,0,.3)' : 'inset -3px 0 0 rgba(0,0,0,.18), 1.5px 0 3px rgba(0,0,0,.14)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform .16s ease', transform: active ? 'translateY(-6px)' : 'none', overflow: 'hidden' }}>
          {/* vinyl disc edge poking above the sleeve */}
          <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'radial-gradient(circle, #4a4550 0 34%, #15130f 36% 100%)', border: '1.5px solid rgba(0,0,0,.5)', margin: '-4px auto 3px', flexShrink: 0 }} />
          <span style={{ ...spineText, fontFamily: "'Space Grotesk',system-ui,sans-serif", fontWeight: 500, fontSize: fs, color: ink, margin: '2px auto' }}>{it.title}</span>
          {/* catalog sticker */}
          <span style={{ width: '72%', height: 12, flexShrink: 0, marginBottom: 8, background: '#f4efe2', border: '1px solid rgba(0,0,0,.35)' }} />
        </div>
      );
    }
    // playlist = cassette tape stood on its edge (reel holes + handwritten label)
    const h = (150) - (active ? 12 : 0);
    const fs = fitFont(it.title.length, h - 28, 8, 11);
    return (
      <div key={it.id} title={it.title} onClick={() => setSelId(it.id)}
        style={{ position: 'relative', flexShrink: 0, width: 30, height: h, alignSelf: 'flex-end', background: `linear-gradient(90deg, ${col(it.hue, 40)}, ${col(it.hue, 30)})`, border: '2px solid #0d1b2a', boxShadow: active ? '0 -10px 16px rgba(0,0,0,.3)' : '1.5px 0 3px rgba(0,0,0,.14)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', transition: 'transform .16s ease', transform: active ? 'translateY(-6px)' : 'none', overflow: 'hidden' }}>
        <span style={{ display: 'flex', gap: 6, marginTop: 7, flexShrink: 0 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#15130f', border: '1px solid rgba(255,255,255,.3)' }} />
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#15130f', border: '1px solid rgba(255,255,255,.3)' }} />
        </span>
        {/* label window */}
        <span style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', fontFamily: "'Space Grotesk',system-ui,sans-serif", fontWeight: 500, fontSize: fs, lineHeight: 1, color: '#1c140f', background: '#fbf7ea', border: '1px solid rgba(0,0,0,.3)', flex: 1, margin: '6px 5px', padding: '6px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>{it.title}</span>
        <span style={{ width: '60%', height: 6, flexShrink: 0, marginBottom: 7, background: 'repeating-linear-gradient(90deg,#15130f 0 3px,transparent 3px 6px)' }} />
      </div>
    );
  };

  // stacked view: a pile of chunky books lying flat. Varied thickness (height)
  // and width (ragged right edge); they touch so the borders read as seams.
  // Horizontal titles, serif for books + sans for the rest, auto-contrast ink.
  const renderStack = (it) => {
    const active = sel && it.id === sel.id;
    const isBook = it.type === 'book';
    const thick = 26 + ((it.title.length * 5) % 18);  // 26–43px thickness
    const wPct = 72 + ((it.hue % 9) * 3);              // 72–96% → ragged right
    const bg = it.type === 'film' ? '#1c1826' : col(it.hue, 60);
    const ink = it.type === 'film' ? col(it.hue, 74) : inkOn(it.hue, 60);
    const byCol = it.type === 'film' ? '#a79fb0' : ink;
    return (
      <div key={it.id} title={it.title} onClick={() => setSelId(it.id)}
        style={{ breakInside: 'avoid', WebkitColumnBreakInside: 'avoid', width: `${wPct}%`, minHeight: thick, background: bg, border: '1.5px solid #0d1b2a', boxShadow: active ? 'inset 0 0 0 2px #ffd23f, inset 5px 0 0 rgba(255,255,255,.18)' : 'inset 5px 0 0 rgba(255,255,255,.12), inset -4px 0 0 rgba(0,0,0,.16)', display: 'flex', alignItems: 'center', gap: 8, padding: '3px 12px', cursor: 'pointer', position: 'relative', zIndex: active ? 2 : 1 }}>
        <span style={{ flexShrink: 0, width: 7, height: 7, borderRadius: it.type === 'album' || it.type === 'playlist' ? '50%' : 0, background: ink, opacity: 0.5, border: '1px solid rgba(0,0,0,.35)' }} />
        <span style={{ flex: 1, minWidth: 0, fontFamily: isBook ? "'Newsreader',serif" : "'Space Grotesk',system-ui,sans-serif", fontWeight: 600, fontSize: 14, lineHeight: 1.22, color: ink }}>{it.title}</span>
        {it.by ? <span style={{ flexShrink: 0, maxWidth: '42%', fontFamily: "'VT323',monospace", fontSize: 12.5, color: byCol, opacity: 0.72, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{it.by}</span> : null}
      </div>
    );
  };

  // ----- detail object (book cover / vinyl / VHS / cassette) -----
  const detailObject = () => {
    if (!sel) return null;
    const c = sel.type === 'film' ? col(sel.hue, 58) : col(sel.hue, 62);
    if (sel.type === 'book') {
      return (
        <div style={{ width: 104, height: 150, background: c, ...frame, boxShadow: '5px 5px 0 rgba(0,0,0,.22)', padding: '12px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}>
          <div style={{ fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: 15, color: '#1c1a17', lineHeight: 1.12 }}>{sel.title}</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 12, color: '#1c1a17', opacity: 0.85 }}>{sel.by}</div>
          <div style={{ position: 'absolute', top: -9, right: 14, width: 11, height: 28, background: '#ff9f43', border: '2px solid #0d1b2a', borderTop: 'none' }} />
        </div>
      );
    }
    if (sel.type === 'album' || sel.type === 'playlist') {
      return (
        <div style={{ position: 'relative', width: 150, height: 132 }}>
          <div style={{ position: 'absolute', right: 2, top: 6, width: 118, height: 118, borderRadius: '50%', background: `radial-gradient(circle, ${c} 0 16%, #15130f 17% 100%)`, ...frame, boxShadow: '4px 4px 0 rgba(0,0,0,.22)', animation: 'recSpin 3.6s linear infinite' }}>
            <span style={{ position: 'absolute', inset: 0, margin: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#fbfaf5' }} />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, width: 120, height: 120, background: c, ...frame, boxShadow: '4px 4px 0 rgba(0,0,0,.22)', padding: 10, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: 15, color: '#15130f', lineHeight: 1.12 }}>{sel.title}</div>
            <div style={{ fontFamily: "'VT323',monospace", fontSize: 12, color: '#15130f', opacity: 0.85 }}>{sel.by}</div>
          </div>
        </div>
      );
    }
    // film clapperboard
    return (
      <div style={{ width: 158, height: 112, background: '#17131f', ...frame, boxShadow: '5px 5px 0 rgba(0,0,0,.22)', overflow: 'hidden' }}>
        <div style={{ height: 24, background: 'repeating-linear-gradient(118deg,#f4f1ea 0 15px,#17131f 15px 30px)', borderBottom: `2px solid ${c}` }} />
        <div style={{ padding: '10px 12px' }}>
          <div style={{ fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: 16, color: c, lineHeight: 1.1 }}>{sel.title}</div>
          <div style={{ fontFamily: "'VT323',monospace", fontSize: 13, color: '#a79fb0', marginTop: 6 }}>dir. {sel.by}</div>
        </div>
      </div>
    );
  };

  const selCol = sel ? (sel.type === 'film' ? col(sel.hue, 58) : col(sel.hue, 62)) : '#0c63ff';
  const bylinePfx = sel ? ({ book: 'by ', film: 'dir. ', album: '', playlist: '' })[sel.type] : '';

  return (
    <div style={{ width: '100%', maxWidth: 1240, fontFamily: "'Space Grotesk',system-ui,sans-serif", color: '#15140f' }}>
      <style>{`
        @keyframes recSpin{to{transform:rotate(360deg)}}
        @keyframes recFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .rec-shelf-anim{animation:recFade .32s ease both}
        .rec-ctrl{transition:background .15s ease,color .15s ease,box-shadow .15s ease}
        @media (prefers-reduced-motion: reduce){.rec-shelf-anim{animation:none}}
      `}</style>

      <div style={{ background: '#fbfaf5', border: '2px solid #0d1b2a', boxShadow: hardShadow }}>
        {/* title bar */}
        <div style={{ height: 30, background: '#5a3a22', borderBottom: '2px solid #0d1b2a', display: 'flex', alignItems: 'center', padding: '0 10px', gap: 8 }}>
          <a href="/" title="close — back to desktop" aria-label="close" style={{ width: 15, height: 15, background: '#ffd23f', border: '1.5px solid #0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'VT323',monospace", fontSize: 15, lineHeight: 1, color: '#0d1b2a', fontWeight: 700, textDecoration: 'none' }}>×</a>
          <span style={{ width: 15, height: 15, background: '#5ce6b5', border: '1.5px solid #0d1b2a' }} />
          <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', marginLeft: 4 }}>recs.app — claire&apos;s room</span>
        </div>

        {/* ===== NOOK HERO ===== */}
        <div style={{ position: 'relative', background: 'linear-gradient(165deg,#2a2340 0%, #3a2f52 55%, #4a3550 100%)', borderBottom: '2px solid #0d1b2a', padding: '26px 34px 30px', overflow: 'hidden' }}>
          {/* string lights */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 12, height: 2, background: 'rgba(255,255,255,.16)', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {faveBooks.concat(items.filter((i) => i.type === 'film')).slice(0, 8).map((it, i) => {
              const c = col(it.hue, 62);
              return <span key={i} style={{ width: 9, height: 9, borderRadius: '50%', background: c, boxShadow: `0 0 8px 2px ${c}`, marginTop: 8 }} />;
            })}
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 18 }}>
            <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 22, color: '#fff', textShadow: '2px 2px 0 rgba(0,0,0,.3)' }}>on repeat lately</span>
            <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#c9bce6', marginBottom: 3 }}>— the current top shelf</span>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 26, flexWrap: 'wrap' }}>
            {/* book shelf */}
            <div style={{ position: 'relative', width: 250, height: 212 }}>
              <div style={{ position: 'absolute', left: 8, bottom: 16, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
                {faveBooks.slice(0, 6).map((it) => renderSpine(it))}
                <div style={{ flexShrink: 0, width: 11, height: 120, marginLeft: 4, background: 'linear-gradient(#c7bfa8,#8f8974)', border: '2px solid #0d1b2a' }} />
              </div>
              <div style={{ position: 'absolute', right: 6, bottom: 16, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 1, marginBottom: -3 }}>
                  <span style={{ width: 13, height: 26, borderRadius: '60% 60% 50% 50%', background: '#4c9a63', border: '1.5px solid #0d1b2a', transform: 'rotate(-18deg)' }} />
                  <span style={{ width: 13, height: 30, borderRadius: '60% 60% 50% 50%', background: '#5cae72', border: '1.5px solid #0d1b2a' }} />
                  <span style={{ width: 13, height: 26, borderRadius: '60% 60% 50% 50%', background: '#4c9a63', border: '1.5px solid #0d1b2a', transform: 'rotate(18deg)' }} />
                </div>
                <div style={{ width: 30, height: 24, background: '#c96a3f', border: '2px solid #0d1b2a', clipPath: 'polygon(10% 0,90% 0,100% 100%,0 100%)' }} />
              </div>
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 15, background: '#5a3a22', border: '2px solid #0d1b2a', boxShadow: '0 4px 8px rgba(0,0,0,.35)' }} />
            </div>

            {/* turntable */}
            <div style={{ position: 'relative', width: 280, height: 200 }}>
              <div style={{ position: 'absolute', left: -6, bottom: 8, width: 96, height: 96, background: '#ff8ad1', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', transform: 'rotate(-8deg)' }} />
              <div style={{ position: 'absolute', left: 8, bottom: 8, width: 96, height: 96, background: '#7d8cff', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', transform: 'rotate(-4deg)' }} />
              <div style={{ position: 'absolute', right: 0, bottom: 0, width: 242, height: 158, background: 'linear-gradient(#2a2016,#3d2c1c)', border: '2px solid #0d1b2a', borderRadius: 7, boxShadow: '5px 6px 0 rgba(0,0,0,.32)' }}>
                <div style={{ position: 'absolute', left: 22, top: 22, width: 114, height: 114, borderRadius: '50%', background: '#15121c', border: '2px solid #0d1b2a', boxShadow: 'inset 0 0 10px rgba(0,0,0,.7)' }}>
                  <div style={{ position: 'absolute', inset: 9, borderRadius: '50%', background: `radial-gradient(circle, ${faveAlbum ? col(faveAlbum.hue, 55) : '#c8452f'} 0 16%, #0e0b13 17% 100%)`, animation: 'recSpin 4.5s linear infinite' }}>
                    <span style={{ position: 'absolute', inset: 0, margin: 'auto', width: 7, height: 7, borderRadius: '50%', background: '#eae3d3' }} />
                  </div>
                </div>
                <div style={{ position: 'absolute', right: 30, top: 16, width: 8, height: 82, background: 'linear-gradient(#d8ccae,#a89b7a)', border: '1.5px solid #0d1b2a', transform: 'rotate(26deg)', transformOrigin: 'top center' }}>
                  <span style={{ position: 'absolute', bottom: -6, left: -3, width: 12, height: 12, background: '#cfc3a6', border: '1.5px solid #0d1b2a' }} />
                </div>
                <div style={{ position: 'absolute', right: 20, bottom: 14, textAlign: 'right' }}>
                  <div style={{ fontFamily: "'Silkscreen',monospace", fontSize: 7, letterSpacing: '.1em', color: '#8ff6ff' }}>SPINNING</div>
                  <div style={{ fontFamily: "'VT323',monospace", fontSize: 14, color: '#ffd7f2', lineHeight: 1 }}>{faveAlbum ? faveAlbum.title : ''}</div>
                </div>
              </div>
            </div>

            {/* CRT + cassette */}
            <div style={{ position: 'relative', width: 250, height: 212, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <div style={{ position: 'relative', width: 186 }}>
                <div style={{ width: 186, height: 150, background: 'linear-gradient(#3a3140,#241d2c)', border: '2px solid #0d1b2a', borderRadius: 11, boxShadow: '5px 6px 0 rgba(0,0,0,.32)', padding: 11, display: 'flex', gap: 9 }}>
                  <div style={{ flex: 1, background: `radial-gradient(circle at 50% 38%, ${faveFilm ? col(faveFilm.hue, 60) : '#ff8ad1'}, #12131f 92%)`, border: '2px solid #0d1b2a', borderRadius: 6, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 8 }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(rgba(0,0,0,0) 0 2px, rgba(0,0,0,.16) 2px 3px)' }} />
                    <span style={{ position: 'relative', fontFamily: "'Silkscreen',monospace", fontSize: 7, letterSpacing: '.1em', color: '#8ff6ff' }}>NOW PLAYING</span>
                    <span style={{ position: 'relative', fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff', lineHeight: 1.05, textShadow: '1px 1px 0 #0d1b2a' }}>{faveFilm ? faveFilm.title : ''}</span>
                  </div>
                  <div style={{ width: 26, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#151019', border: '1.5px solid #0d1b2a' }} />
                    <span style={{ width: 16, height: 16, borderRadius: '50%', background: '#151019', border: '1.5px solid #0d1b2a' }} />
                    <span style={{ width: 18, height: 24, marginTop: 2, background: 'repeating-linear-gradient(#151019 0 3px,#2c2530 3px 5px)', border: '1.5px solid #0d1b2a' }} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 26px' }}>
                  <span style={{ width: 10, height: 12, background: '#1a1622', border: '1.5px solid #0d1b2a', borderTop: 'none' }} />
                  <span style={{ width: 10, height: 12, background: '#1a1622', border: '1.5px solid #0d1b2a', borderTop: 'none' }} />
                </div>
              </div>
              {/* cassette mixtape for the fave playlist */}
              {favePlaylist ? (
                <a href={favePlaylist.link || '#'} target="_blank" rel="noreferrer" title={favePlaylist.title}
                  style={{ textDecoration: 'none', width: 52, marginBottom: 2, background: col(favePlaylist.hue, 60), border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.2)', padding: '7px 6px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#15130f' }} />
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#15130f' }} />
                  </div>
                  <div style={{ background: '#fbf7ea', border: '1.5px solid #0d1b2a', padding: '2px 3px', textAlign: 'center' }}>
                    <span style={{ fontFamily: "'VT323',monospace", fontWeight: 700, fontSize: 11, color: '#15130f', lineHeight: 1 }}>{favePlaylist.title}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#241d2c', border: '1.5px solid #0d1b2a' }} />
                    <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#241d2c', border: '1.5px solid #0d1b2a' }} />
                  </div>
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {/* ===== FULL SHELF ===== */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '14px 16px 0', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 19, color: '#15140f' }}>the whole shelf</span>
          <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#a89a7c' }}>everything, all in one place —</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'VT323',monospace", fontSize: 14, color: '#a89a7c' }}>{shown.length} / {items.length} items</span>
        </div>

        {/* controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', flexWrap: 'wrap' }}>
          <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 9, letterSpacing: '.1em', color: '#8a7f68' }}>SHOW</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {FILTERS.map((f) => {
              const act = filter === f.key;
              return (
                <span key={f.key} onClick={() => setFilter(f.key)} className="rec-ctrl"
                  style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'VT323',monospace", fontSize: 16, padding: '1px 11px', border: '2px solid #0d1b2a', background: act ? '#0d1b2a' : '#fbfaf5', color: act ? '#ffd23f' : '#5b5346' }}>
                  <span style={{ width: 9, height: 9, border: '1.5px solid #0d1b2a', background: f.dot }} />{f.label}
                </span>
              );
            })}
          </div>
          <span style={{ width: 2, height: 22, background: '#d3cab2', margin: '0 2px' }} />
          <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 9, letterSpacing: '.1em', color: '#8a7f68' }}>SORT</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {SORTS.map((s) => {
              const act = sort === s.key;
              return (
                <span key={s.key} onClick={() => setSort(s.key)} className="rec-ctrl"
                  style={{ cursor: 'pointer', fontFamily: "'VT323',monospace", fontSize: 16, padding: '1px 11px', border: '2px solid #0d1b2a', boxShadow: act ? '2px 2px 0 rgba(0,0,0,.2)' : 'none', background: act ? '#ffd23f' : '#fbfaf5', color: '#15130f' }}>
                  {s.label}{s.key === 'rainbow' ? ' 🌈' : ''}
                </span>
              );
            })}
          </div>
          <span style={{ width: 2, height: 22, background: '#d3cab2', margin: '0 2px' }} />
          <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 9, letterSpacing: '.1em', color: '#8a7f68' }}>VIEW</span>
          <div style={{ display: 'flex', gap: 6 }}>
            {[{ key: 'spine', label: 'spines' }, { key: 'stack', label: 'stacked' }].map((vw) => {
              const act = view === vw.key;
              return (
                <span key={vw.key} onClick={() => setView(vw.key)} className="rec-ctrl"
                  style={{ cursor: 'pointer', fontFamily: "'VT323',monospace", fontSize: 16, padding: '1px 11px', border: '2px solid #0d1b2a', boxShadow: act ? '2px 2px 0 rgba(0,0,0,.2)' : 'none', background: act ? '#ffd23f' : '#fbfaf5', color: '#15130f' }}>
                  {vw.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* shelf */}
        <div style={{ background: 'linear-gradient(180deg,#f3efe4,#e6dfcd)', borderTop: '2px solid #0d1b2a', padding: view === 'stack' ? '22px 20px 0' : '26px 20px 0' }}>
          {/* keyed wrapper: re-mounts on filter/sort/view change → replays fade */}
          <div key={`${filter}-${sort}-${view}`} className="rec-shelf-anim">
            {view === 'stack' ? (
              <div style={{ columnWidth: 250, columnGap: 14, minHeight: 220 }}>
                {shown.map((it) => renderStack(it))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', gap: '18px 4px', minHeight: 220 }}>
                {shown.map((it) => renderSpine(it))}
              </div>
            )}
          </div>
          <div style={{ height: 18, marginTop: view === 'stack' ? 22 : 12, background: 'linear-gradient(#7a5334,#5a3a22)', borderTop: '2px solid #0d1b2a', boxShadow: '0 6px 10px rgba(0,0,0,.28) inset' }} />
          <div style={{ height: 12, background: '#3f2916', borderBottom: '2px solid #0d1b2a' }} />
        </div>

        {/* ===== FOOTER: blogs + reading pile ===== */}
        {(blogs.length || toread.length) ? (
          <div style={{ display: 'flex', gap: 28, padding: '18px 24px 24px', borderTop: '2px solid #0d1b2a', background: 'linear-gradient(#efe9d9,#e6dfcd)', flexWrap: 'wrap' }}>
            {blogs.length ? (
              <div style={{ flex: '1 1 320px', minWidth: 260 }}>
                <div style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#15140f', marginBottom: 8 }}>blogs &amp; magazines i love</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {blogs.map((b) => (
                    b.link ? (
                      <a key={b.name} href={b.link} target="_blank" rel="noreferrer" style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#5a3a22', background: '#fbf7ea', border: '1.5px solid #0d1b2a', padding: '1px 9px', textDecoration: 'none' }}>{b.name} ↗</a>
                    ) : (
                      <span key={b.name} style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#8a7f68', background: '#f3eee0', border: '1.5px solid #c9c0ad', padding: '1px 9px' }}>{b.name}</span>
                    )
                  ))}
                </div>
              </div>
            ) : null}
            {toread.length ? (
              <div style={{ flex: '0 1 260px', minWidth: 220 }}>
                <div style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 16, color: '#15140f', marginBottom: 8 }}>on the reading pile</div>
                {toread.map((t) => (
                  <div key={t.title} style={{ fontFamily: "'Newsreader',serif", fontSize: 16, color: '#26241d', lineHeight: 1.5 }}>
                    <span style={{ color: '#c96a3f' }}>▸</span> {t.title}{t.author ? <span style={{ color: '#8a7f68' }}> — {t.author}</span> : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        {/* detail — sticky dock, pinned to the viewport bottom so the selected
            item's note stays visible while you browse the shelf */}
        <div style={{ position: 'sticky', bottom: 0, zIndex: 6, display: 'flex', gap: 26, padding: '18px 24px', alignItems: 'center', background: '#fbfaf5', minHeight: 150, flexWrap: 'wrap', borderTop: '2px solid #0d1b2a', boxShadow: '0 -7px 18px rgba(0,0,0,.20)' }}>
          <span style={{ position: 'absolute', top: 6, right: 12, fontFamily: "'Silkscreen',monospace", fontSize: 8, letterSpacing: '.1em', color: '#c4b89a' }}>NOW VIEWING</span>
          <div style={{ flexShrink: 0, width: 184, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>{detailObject()}</div>
          {sel ? (
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 8, letterSpacing: '.08em', color: '#fff', background: selCol, padding: '4px 7px', border: '1.5px solid #0d1b2a' }}>{KIND[sel.type]}</span>
                <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 8, letterSpacing: '.08em', color: '#8a7f68', background: '#efe9d9', padding: '4px 7px' }}>{sel.cat}</span>
              </div>
              <h3 style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 24, color: '#15140f', margin: '10px 0 2px', lineHeight: 1.05 }}>{sel.title}</h3>
              {sel.by ? <div style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#6b6456' }}>{bylinePfx}{sel.by}</div> : null}
              {sel.note ? <p style={{ fontFamily: "'Newsreader',serif", fontSize: 17, lineHeight: 1.5, color: '#26241d', margin: '10px 0 12px', textWrap: 'pretty' }}>{sel.note}</p> : <div style={{ height: 12 }} />}
              {link ? <a href={sel.link || link.url} target="_blank" rel="noreferrer" style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#0c63ff', border: '1.5px solid #c4d2ea', padding: '1px 12px', textDecoration: 'none' }}>{sel.link ? 'open ↗' : link.label}</a> : null}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
