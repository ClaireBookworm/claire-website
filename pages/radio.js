import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getPlaylistData } from '../lib/spotify';

// Weeks: real Spotify playlist IDs + curated theme/date. Tracklists are scraped
// from the Spotify embed at build time (lib/spotify.js); `fallback` is shown if
// a scrape fails so the build never breaks.
const WEEKS = [
  { wk: 'WK 01', date: 'Sep 22', theme: 'the sampled melody', pid: '50gCG7CZhe3IiyMoNzuodH', fallback: [{ who: "Bryan Adams & Tina Turner — It's Only Love", len: '3:16' }, { who: 'The Strokes — Ode to the Mets', len: '5:51' }] },
  { wk: 'WK 02', date: 'Sep 29', theme: 'secretly all Jack Antonoff', pid: '4oBpiIQ1dWxuOXJpUQaBGT', fallback: [] },
  { wk: 'WK 03', date: 'Oct 06', theme: 'virtuosic jazz bass', pid: '7IJLBQV3tcVn0yZilTSccl', fallback: [] },
  { wk: 'WK 04', date: 'Oct 13', theme: 'long instrumentals', pid: '5gnTTA2L0LPSqXQknG9bn5', fallback: [] },
  { wk: 'WK 05', date: 'Oct 20', theme: 'the world is ending', pid: '5qAry5JctJsbTA6grgWJBJ', fallback: [] },
  { wk: 'WK 06', date: 'Oct 27', theme: 'loneliness & longing', pid: '6AALFISH5Dcm9xGjmqcHRd', fallback: [] },
  { wk: 'WK 07', date: 'Nov 03', theme: 'a mix', pid: '7Aq5Ryvj2vyQz51DK086uw', fallback: [] },
  { wk: 'WK 08', date: 'Nov 10', theme: 'a mix', pid: '325q6sCzGPrC2nLLIyF2fe', fallback: [] },
  { wk: 'WK 09', date: 'Nov 17', theme: 'a mix', pid: '0fXtW7DCjVDUTul9nRMEAI', fallback: [] },
  { wk: 'WK 10', date: 'Nov 24', theme: 'a mix', pid: '1Mff0tchlOqU7XbGpmqK0R', fallback: [] },
  { wk: 'WK 11', date: 'Dec 01', theme: 'a mix', pid: '4szTjB6SHPlSMr4hyDGdKR', fallback: [] },
  { wk: 'WK 12', date: 'Dec 08', theme: 'a mix', pid: '0YmCe0bcumrgeY8OQNk1B6', fallback: [] },
  { wk: 'WK 18', date: 'Jan 19', theme: 'DJ mixes + songs', pid: '4xDBD1t4nRqec3XdkeToqc', fallback: [] },
  { wk: 'WK 20', date: 'Feb 09', theme: 'happy to be back', pid: '3tq1MXQJ2rSUPRXrf2CuUk', fallback: [] },
  { wk: 'WK 21', date: 'Feb 16', theme: "last show :')", pid: '4l8QnFgNYJGoSpifVKX3lf', fallback: [] },
];

export async function getStaticProps() {
  const weeks = await Promise.all(
    WEEKS.map(async (w) => {
      const data = await getPlaylistData(w.pid);
      const tracks = data && data.tracks.length ? data.tracks : (w.fallback || []);
      return { wk: w.wk, date: w.date, theme: w.theme, pid: w.pid, tracks };
    })
  );
  return { props: { weeks }, revalidate: 60 * 60 * 24 };
}

const VIS_BARS = ['.7s', '.9s', '.6s', '1s', '.8s', '.72s', '.95s'];
const VIS_DELAY = ['0s', '.1s', '.2s', '.05s', '.25s', '.14s', '.3s'];
const panelHead = { height: 24, background: 'linear-gradient(#4a7fb5,#1d3a63)', display: 'flex', alignItems: 'center', padding: '0 8px', cursor: 'move', touchAction: 'none' };
const silk = { fontFamily: "'Silkscreen',monospace", fontSize: 9, color: '#dce8ff', letterSpacing: '.04em' };

function Visualizer() {
  return (
    <div style={{ width: 80, background: '#06120b', border: '2px solid #0a0d14', display: 'flex', alignItems: 'flex-end', gap: 2, padding: 6 }}>
      {VIS_BARS.map((d, i) => (
        <div key={i} style={{ flex: 1, height: 30, background: 'linear-gradient(#22ff88,#ffd23f)', transformOrigin: 'bottom', animation: `ccVis ${d} ease-in-out infinite`, animationDelay: VIS_DELAY[i] }} />
      ))}
    </div>
  );
}

function WinampWindow({ week, frame, onClose, onDownTitle }) {
  const tracks = week.tracks || [];
  const scroll = tracks.length ? tracks[0].who : `${week.wk} — tracklist syncing`;
  const playlistUrl = `https://open.spotify.com/playlist/${week.pid}`;
  return (
    <div style={{ background: 'linear-gradient(#3a4456,#2a3240)', border: '2px solid #0a0d14', boxShadow: '0 10px 28px rgba(0,0,0,.55)', display: 'flex', flexDirection: 'column', ...frame }}>
      {/* title bar */}
      <div onPointerDown={onDownTitle} style={{ ...panelHead, borderBottom: '1px solid #0a0d14', flex: 'none' }}>
        <span onPointerDown={onClose} role="button" tabIndex={0} aria-label="close window" title="close" style={{ width: 14, height: 14, background: '#ff5d6c', border: '1px solid #0a0d14', marginRight: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'VT323',monospace", fontSize: 13, lineHeight: 1, color: '#2a0a0f', fontWeight: 700 }}>×</span>
        <span style={silk}>DEATH CAR FOR QT — {week.wk}</span>
        <span style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
          <span style={{ width: 10, height: 9, background: '#5a6680', border: '1px solid #0a0d14' }} />
          <span style={{ width: 10, height: 9, background: '#5a6680', border: '1px solid #0a0d14' }} />
        </span>
      </div>

      {/* player header */}
      <div style={{ padding: 10, flex: 'none' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: '#06120b', border: '2px solid #0a0d14', boxShadow: 'inset 0 0 14px rgba(34,255,136,.14)', padding: '6px 9px', minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 28, lineHeight: 0.9, color: '#22ff88', textShadow: '0 0 8px rgba(34,255,136,.6)' }}>0:42</span>
              <span style={{ fontFamily: "'VT323',monospace", fontSize: 13, color: '#1aa15a' }}>{week.date}</span>
            </div>
            <div style={{ overflow: 'hidden', marginTop: 4, borderTop: '1px solid rgba(34,255,136,.18)', paddingTop: 4 }}>
              <div style={{ display: 'inline-flex', whiteSpace: 'nowrap', animation: 'ccMarquee 15s linear infinite' }}>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#22ff88', paddingRight: 40 }}>♪ {scroll} &nbsp;***&nbsp;</span>
                <span style={{ fontFamily: "'VT323',monospace", fontSize: 17, color: '#22ff88', paddingRight: 40 }}>♪ {scroll} &nbsp;***&nbsp;</span>
              </div>
            </div>
          </div>
          <Visualizer />
        </div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#ffd23f', marginTop: 6 }}>▸ connection: {week.theme}</div>
      </div>

      {/* column headers */}
      <div style={{ display: 'flex', gap: 8, padding: '5px 12px', background: '#0f131c', borderTop: '1px solid #0a0d14', borderBottom: '1px solid #0a0d14', fontFamily: "'Silkscreen',monospace", fontSize: 8, letterSpacing: '.08em', color: '#5f6f8c', flex: 'none' }}>
        <span style={{ width: 16 }}>#</span>
        <span style={{ flex: 1 }}>ARTIST — TITLE</span>
        <span style={{ width: 42, textAlign: 'right' }}>TIME</span>
      </div>

      {/* tracklist */}
      <div className="cclib" style={{ background: '#161b27', overflowY: 'auto', maxHeight: 220, minHeight: 60 }}>
        {tracks.map((t, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '6px 12px', borderBottom: '1px solid #1f2738', fontFamily: "'VT323',monospace", background: i === 0 ? '#11401f' : 'transparent' }}>
            <span style={{ width: 16, fontSize: 15, lineHeight: 1.2, color: i === 0 ? '#22ff88' : '#6b788f' }}>{i + 1}</span>
            <span style={{ flex: 1, fontSize: 16, lineHeight: 1.2, color: i === 0 ? '#22ff88' : '#cdd6e4' }}>{t.who}</span>
            <span style={{ width: 42, textAlign: 'right', fontSize: 14, color: '#7d8ba6' }}>{t.len}</span>
          </div>
        ))}
        {tracks.length === 0 ? (
          <div style={{ padding: '18px 12px', fontFamily: "'VT323',monospace", fontSize: 16, color: '#6b788f' }}>▸ tracklist syncs from Spotify — notes coming soon.</div>
        ) : null}
      </div>

      {/* spotify embed */}
      <div style={{ background: '#0f131c', padding: 8, flex: 'none' }}>
        <iframe
          title={`Spotify — ${week.wk}`}
          src={`https://open.spotify.com/embed/playlist/${week.pid}?utm_source=generator&theme=0`}
          width="100%"
          height={152}
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
          style={{ display: 'block', border: 'none' }}
        />
      </div>

      {/* footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderTop: '2px solid #0a0d14', background: '#0f131c', flex: 'none' }}>
        <span style={{ fontFamily: "'VT323',monospace", fontSize: 15, color: '#8fa3c7' }}>{tracks.length} tracks</span>
        <a href={playlistUrl} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', fontFamily: "'VT323',monospace", fontSize: 16, color: '#22ff88', textDecoration: 'none' }}>▶ open in Spotify →</a>
      </div>
    </div>
  );
}

export default function Radio({ weeks }) {
  const [openIds, setOpenIds] = useState([0]); // first week open by default
  const [pos, setPos] = useState({ lib: { x: 24, y: 56 }, 0: { x: 300, y: 70 } });
  const [z, setZ] = useState({ lib: 50, 0: 51 });
  const [mobile, setMobile] = useState(false);
  const topZ = useRef(51);
  const dragRef = useRef(null);

  const front = (id) => {
    const nz = topZ.current + 1;
    topZ.current = nz;
    setZ((zz) => ({ ...zz, [id]: nz }));
  };

  const openWeek = (i) => {
    setOpenIds((ids) => {
      if (ids.includes(i)) return ids;
      const k = ids.length;
      setPos((pp) => (pp[i] ? pp : { ...pp, [i]: { x: 300 + (k % 4) * 30, y: 70 + (k % 4) * 30 } }));
      return [...ids, i];
    });
    front(i);
  };
  const closeWeek = (i) => (e) => { e.stopPropagation(); setOpenIds((ids) => ids.filter((x) => x !== i)); };

  const down = (id) => (e) => {
    if (mobile) return;
    e.preventDefault();
    const p = pos[id] || { x: 0, y: 0 };
    dragRef.current = { id, dx: e.clientX - p.x, dy: e.clientY - p.y };
    front(id);
  };

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 760);
    onResize();
    const onMove = (e) => {
      const dr = dragRef.current;
      if (!dr) return;
      const x = Math.max(0, e.clientX - dr.dx);
      const y = Math.max(10, e.clientY - dr.dy);
      setPos((pp) => ({ ...pp, [dr.id]: { x, y } }));
    };
    const onUp = () => { dragRef.current = null; };
    window.addEventListener('resize', onResize);
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, []);

  const winFrame = (id, w) => (mobile
    ? { position: 'relative', width: '100%', maxWidth: 460, margin: '0 auto' }
    : { position: 'absolute', width: w, left: (pos[id] || {}).x || 0, top: (pos[id] || {}).y || 0, zIndex: z[id] || 50 });

  return (
    <>
      <Head>
        <title>radio, claire wang</title>
        <meta property="og:title" content="radio — Death Car for QT" />
      </Head>
      <div style={{ position: 'fixed', inset: 0, background: 'radial-gradient(120% 120% at 50% 0%, #2a3650 0%, #11151f 65%)', overflow: 'auto', fontFamily: "'Space Grotesk',system-ui,sans-serif", userSelect: 'none' }}>

        <Link href="/" style={{ position: 'fixed', top: 14, left: 16, zIndex: 9000, fontFamily: "'VT323',monospace", fontSize: 17, color: '#9fb0c9', textDecoration: 'none', background: '#0c0f16', border: '1px solid #2c3650', padding: '2px 12px', whiteSpace: 'nowrap' }}>◄ back to desktop</Link>

        <div style={mobile ? { display: 'flex', flexDirection: 'column', gap: 16, padding: '52px 14px 40px' } : { display: 'contents' }}>

          {/* LIBRARY LAUNCHER */}
          <div style={{ background: '#1b212e', border: '2px solid #0a0d14', boxShadow: '0 10px 28px rgba(0,0,0,.55)', ...winFrame('lib', 248) }}>
            <div onPointerDown={down('lib')} style={{ ...panelHead, flex: 'none' }}>
              <span style={silk}>MEDIA LIBRARY</span>
            </div>
            <div className="cclib" style={{ maxHeight: mobile ? 'none' : 420, overflowY: 'auto', padding: '8px 0', fontFamily: "'VT323',monospace", background: '#11151f' }}>
              <div style={{ padding: '2px 10px', fontSize: 17, color: '#8fa3c7' }}>▾ Death Car for QT</div>
              <div style={{ padding: '2px 10px 4px 22px', fontSize: 16, color: '#7d8ba6' }}>▾ Season 1</div>
              {weeks.map((w, i) => {
                const open = openIds.includes(i);
                return (
                  <div
                    key={w.wk}
                    onClick={() => openWeek(i)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWeek(i); } }}
                    style={{ display: 'flex', justifyContent: 'space-between', gap: 6, padding: '3px 12px 3px 32px', fontSize: 16, cursor: 'pointer', whiteSpace: 'nowrap', background: open ? '#11401f' : 'transparent' }}
                  >
                    <span style={{ color: open ? '#22ff88' : (w.tracks.length ? '#cdd6e4' : '#6b788f') }}>{w.wk}</span>
                    <span style={{ color: '#6b788f' }}>{w.date}</span>
                  </div>
                );
              })}
              <div style={{ padding: '8px 12px 4px', fontSize: 14, color: '#5f6f8c' }}>// click a week to open it ↗</div>
            </div>
          </div>

          {/* OPEN WEEK WINDOWS */}
          {openIds.map((i) => (
            <WinampWindow
              key={i}
              week={weeks[i]}
              frame={winFrame(i, 412)}
              onClose={closeWeek(i)}
              onDownTitle={down(i)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
