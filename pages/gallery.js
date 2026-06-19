import { useState } from 'react';
import Head from 'next/head';
import MenuBar from '../components/claireos/MenuBar';
import CrawlingWorm from '../components/claireos/CrawlingWorm';

// Project list — curated for the ClaireOS file-browser cards
// (designs/Projects.dc.html). glyph + color + tags + blurb + href.
const PROJECTS = [
  { title: 'E11 Bio', glyph: '⬡', color: '#c9f7e4', tags: ['neuro', 'work exp', 'research'], href: 'https://e11.bio', blurb: 'CV/spatial-reasoning pipeline for cross-slice barcode matching in brain tissue — 82% on a motor-neuron set; contributed to the PRISM paper.' },
  { title: 'Boyden Lab @ McGovern', glyph: '◍', color: '#d6c9ff', tags: ['research', 'neuro'], href: 'https://synthneuro.org/', blurb: 'Toward whole-nervous-system emulation of C. elegans: custom microscopes (diSPIM, SCAPE), RNN mapping, voltage indicators, expansion seq.' },
  { title: 'Algorithmic Alignment Lab', glyph: '◇', color: '#a7c4ff', tags: ['research'], href: 'https://algorithmicalignment.csail.mit.edu/', blurb: 'Open task-and-motion planning — an open-source symbolic formalism for interpretable belief-space planning in RL/robotics agents.' },
  { title: 'Apple CoreOS', glyph: '', color: '#e7ecf5', tags: ['work exp'], href: 'https://developer.apple.com/', blurb: 'Shipped consumer OS features in Obj-C/Swift/Python; designed encrypted data transfer across CloudKit/CryptoKit with retail edge-cases.' },
  { title: 'SineRider', glyph: '△', color: '#ffe2a7', tags: ['hacks', 'creative'], href: 'https://sinerider.com', blurb: 'A game of love, math & graphing. Led a team of Hack Clubbers; prototype hit #2 on HN; loved by Nicky Case & Grant Sanderson.' },
  { title: 'Blonk — HTMAA', glyph: '▤', color: '#ffc2d6', tags: ['hacks', 'creative'], href: 'https://htmaa.clairebookworm.com/', blurb: 'Physical DAW/looper: sample modules + stacking blocks build synths. Also the BRAINROTBOT 9000 that follows you & scrolls reels.' },
  { title: 'AngelHacks', glyph: '✦', color: '#ffd23f', tags: ['hacks', 'friends'], href: 'https://angelhacks.org', blurb: 'Founded a hackathon at Snapchat HQ (150+ mentors); 2.0 hit 1000+ attendees; 3.0 a 24-hour game jam in Boston. Raised $10k+.' },
  { title: 'MIT PRIMES CS', glyph: '∑', color: '#a7c4ff', tags: ['research'], href: 'https://epubs.siam.org/', blurb: 'Efficient bi-core decomposition of graphs — won the S.T. Yau award & Best CS Project; presented at JMM 2022 & SODA APOCS 2023.' },
  { title: 'Phillipian SOTA', glyph: '◫', color: '#c9f7e4', tags: ['creative', 'writing'], href: 'https://sota.phillipian.net/', blurb: 'Annual data-journalism report from the student body. Won NSPA Digital Story of the Year for interactive graphics.' },
  { title: 'RSI @ Harvard', glyph: '◉', color: '#d6c9ff', tags: ['research', 'neuro'], href: 'https://math.mit.edu/research/highschool/rsi/', blurb: 'Spatial & temporal massive-memory research at the Visual Attention Lab + a platform for human memory experiments.' },
  { title: 'Memory Sports', glyph: '♣', color: '#ffe2a7', tags: ['creative', 'neuro'], href: 'https://artofmemory.com/', blurb: 'Longest-reigning Words champ on Memory League; 2021 World Speed Reading champion. The thing that got me into neuro.' },
  { title: 'ExCStential Ethics', glyph: '§', color: '#ffc2d6', tags: ['writing', 'research'], href: 'https://excstential.substack.com/', blurb: 'Independent tech-ethics reading project on privacy, EA/AI, competition & design ethics — with essays and a final privacy-policy talk.' },
  { title: 'Contrary', glyph: '◮', color: '#a7c4ff', tags: ['work exp'], href: 'https://contrary.com/', blurb: 'Venture partner — sourcing and evaluating deals; one of the best communities I have been part of.' },
  { title: 'Jasanoff Lab @ MIT', glyph: '∿', color: '#c9f7e4', tags: ['research', 'neuro'], href: 'https://jasanofflab.mit.edu/', blurb: 'Built RF phase-array circuits for rat & marmoset MRI; worked with 3D fab, NMR spectroscopy, circuit design & signal processing.' },
];

const FILTERS = ['all', 'research', 'neuro', 'hacks', 'creative', 'work exp', 'writing', 'friends'];

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [hover, setHover] = useState(null);
  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));

  return (
    <>
      <Head>
        <title>projects/ — what i&apos;ve been making</title>
        <meta property="og:title" content="projects & portfolio" />
      </Head>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0c63ff', backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px)', backgroundSize: '20px 20px', fontFamily: "'Space Grotesk',system-ui,sans-serif", overflow: 'hidden' }}>
        <MenuBar
          dark={false}
          middle={(<><span style={{ opacity: 0.65 }}>View</span><span style={{ opacity: 0.65 }}>Sort</span></>)}
          rightLabel={`projects/ — ${filtered.length} items`}
        />

        <div style={{ position: 'absolute', top: 46, left: 22, right: 22, bottom: 22, background: '#fff', border: '2px solid #0d1b2a', boxShadow: '8px 8px 0 rgba(0,0,0,.28)', display: 'flex', flexDirection: 'column' }}>
          {/* title bar */}
          <div style={{ height: 28, background: '#0c63ff', borderBottom: '2px solid #0d1b2a', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6, flex: 'none' }}>
            <a href="/" title="close" aria-label="back to desktop" style={{ width: 14, height: 14, background: '#ffd23f', border: '1.5px solid #0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'VT323',monospace", fontSize: 14, lineHeight: 1, color: '#0d1b2a', fontWeight: 700, textDecoration: 'none' }}>×</a>
            <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>projects/ — what i&apos;ve been making</span>
          </div>

          {/* filter chips */}
          <div style={{ flex: 'none', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 7, padding: '11px 14px', borderBottom: '2px solid #0d1b2a', background: '#eef4ff' }}>
            <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 9, letterSpacing: '.1em', color: '#5b6678', marginRight: 2 }}>FILTER</span>
            {FILTERS.map((f) => {
              const on = filter === f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{ fontFamily: "'VT323',monospace", fontSize: 16, cursor: 'pointer', padding: '1px 12px', border: '1.5px solid #0d1b2a', whiteSpace: 'nowrap', color: on ? '#fff' : '#0d1b2a', background: on ? '#0c63ff' : '#fff' }}
                >
                  {f}
                </button>
              );
            })}
          </div>

          {/* grid */}
          <div className="ccwin-scroll" style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(248px, 1fr))', gap: 14, alignContent: 'start', background: '#f7f9fd' }}>
            {filtered.map((p, i) => {
              const hovered = hover === i;
              return (
                <a
                  key={p.title}
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 9,
                    textDecoration: 'none',
                    background: '#fff',
                    border: '2px solid #0d1b2a',
                    boxShadow: hovered ? '6px 6px 0 rgba(0,0,0,.22)' : '4px 4px 0 rgba(0,0,0,.18)',
                    padding: '13px 14px 14px',
                    transform: hovered ? 'translate(-2px,-2px)' : 'none',
                    transition: 'transform .12s, box-shadow .12s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ width: 30, height: 30, flex: 'none', border: '2px solid #0d1b2a', background: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'VT323',monospace", fontSize: 16, color: '#0d1b2a' }}>{p.glyph}</span>
                    <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 15, color: '#0d1b2a', lineHeight: 1.15 }}>{p.title}</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {p.tags.map((tg) => (
                      <span key={tg} style={{ fontFamily: "'Silkscreen',monospace", fontSize: 8, letterSpacing: '.04em', color: '#5b6678', border: '1px solid #c4d2ea', padding: '1px 5px' }}>{tg}</span>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 12.5, lineHeight: 1.55, color: '#444b58', margin: 0 }}>{p.blurb}</p>
                </a>
              );
            })}
          </div>

          {/* footer */}
          <div style={{ flex: 'none', padding: '7px 14px', borderTop: '2px solid #0d1b2a', background: '#eef4ff', fontFamily: "'VT323',monospace", fontSize: 15, color: '#0c63ff', display: 'flex', gap: 14 }}>
            <span>{filtered.length} projects</span>
            <span style={{ color: '#8a93a6' }}>click a card to open ↗</span>
          </div>
        </div>

        <CrawlingWorm />
      </div>
    </>
  );
}
