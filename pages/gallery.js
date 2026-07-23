import { useState } from 'react';
import Head from 'next/head';
import MenuBar from '../components/claireos/MenuBar';
import CrawlingWorm from '../components/claireos/CrawlingWorm';

// Full project list for the ClaireOS file-browser cards. Blurbs condensed from
// the long-form portfolio; `links` become small chip-buttons on the card (like
// the about_me window's social chips).
const PROJECTS = [
  { title: 'E11 Bio', glyph: '⬡', color: '#c9f7e4', tags: ['neuro', 'work exp', 'research'], href: 'https://e11.bio',
    blurb: "CV/spatial-reasoning pipeline for cross-slice barcode matching in brain tissue — 82.1% on a motor-neuron set, feeding a larger Google Connectomics effort. Contributed analysis & figures to the PRISM paper.",
    links: [{ label: 'PRISM paper', href: 'https://www.biorxiv.org/content/10.1101/2025.09.26.678648v1' }] },
  { title: 'Boyden Lab @ McGovern', glyph: '◍', color: '#d6c9ff', tags: ['research', 'neuro'], href: 'https://synthneuro.org/',
    blurb: "Toward whole-nervous-system emulation of C. elegans under Davy Deng — custom microscopes (diSPIM, SCAPE), deep-net (RNN) mapping, voltage indicators, expansion sequencing, and 3D fab for 'brain uploading.'" },
  { title: 'Algorithmic Alignment Lab', glyph: '◇', color: '#a7c4ff', tags: ['research'], href: 'https://algorithmicalignment.csail.mit.edu/',
    blurb: "Open Task-and-Motion Planning — an open-source symbolic formalism for interpretable belief-space planning in RL/robotics agents, with Phillip Christoffersen in Dylan Hadfield-Menell's lab." },
  { title: 'Jasanoff Lab @ MIT', glyph: '∿', color: '#c9f7e4', tags: ['research', 'neuro'], href: 'https://jasanofflab.mit.edu/',
    blurb: 'Built RF phase-array circuits for rat & marmoset MRI under Kevin Chung — 3D fabrication, NMR spectroscopy, circuit design, and signal processing.' },
  { title: 'Apple CoreOS', glyph: '', color: '#e7ecf5', tags: ['work exp'], href: 'https://developer.apple.com/',
    blurb: 'Shipped consumer OS features in Obj-C/Swift/Python; designed encrypted data transfer across CloudKit/CryptoKit with retail edge-cases, and helped integrate ML pipelines into existing systems.' },
  { title: 'MIT PRIMES CS', glyph: '∑', color: '#a7c4ff', tags: ['research'], href: 'https://epubs.siam.org/doi/abs/10.1137/1.9781611977578.ch2',
    blurb: 'An efficient parallel algorithm for bi-core decomposition of graphs — won the S.T. Yau Award & Best CS Project; presented at AMS-PME JMM 2022 and ACM-SIAM SODA APOCS 2023.',
    links: [{ label: 'github', href: 'https://github.com/ClaireBookworm/gbbs' }, { label: 'PRIMES paper', href: 'https://math.mit.edu/research/highschool/primes/materials/2021/Huang-Wang.pdf' }] },
  { title: 'Contrary', glyph: '◮', color: '#a7c4ff', tags: ['work exp'], href: 'https://contrary.com/',
    blurb: "Venture partner — sourcing and evaluating deals; one of the best communities I've been part of." },
  { title: 'Hack Club', glyph: '⚑', color: '#ffd0c2', tags: ['friends', 'hacks'], href: 'https://hackclub.com',
    blurb: 'Grew up here — community team, organizer, fundraiser. Lead producer of SineRider, ran the AMA program (Elon Musk, Nicky Case, Sal Khan), and organized the HackerZephyr cross-country hackathon.',
    links: [{ label: 'Zephyr', href: 'https://zephyr.hackclub.com' }, { label: 'SineRider', href: 'https://sinerider.com' }] },
  { title: 'AngelHacks', glyph: '✦', color: '#ffd23f', tags: ['hacks', 'friends'], href: 'https://angelhacks.org',
    blurb: 'Founded a hackathon at Snapchat HQ (150+ mentors); 2.0 hit 1000+ attendees; 3.0 was a 24-hour game jam in Boston. Raised $10k+ in cash & in-kind.',
    links: [{ label: '2019', href: 'https://2019.angelhacks.org/' }, { label: '2021', href: 'https://2021.angelhacks.org/' }] },
  { title: 'SineRider', glyph: '△', color: '#ffe2a7', tags: ['hacks', 'creative'], href: 'https://sinerider.com',
    blurb: 'A game of love, math & graphing. Led a team of Hack Clubbers with Chris Walker; the prototype hit #2 on HN and was loved by Nicky Case & Grant Sanderson.',
    links: [{ label: 'trailer', href: 'https://www.youtube.com/watch?v=35nDYoIwiA8' }] },
  { title: 'Blonk — HTMAA', glyph: '▤', color: '#ffc2d6', tags: ['hacks', 'creative'], href: 'https://htmaa.clairebookworm.com/',
    blurb: "MIT's How to Make (almost) Anything: a physical DAW/looper where sample modules + stacking blocks build synths. Also the BRAINROTBOT 9000 that follows you & scrolls reels.",
    links: [{ label: 'BRAINROTBOT', href: 'https://fab.cba.mit.edu/classes/MAS.863/EECS/Machine/Machine.html' }] },
  { title: 'Phillipian SOTA', glyph: '◫', color: '#c9f7e4', tags: ['creative', 'writing'], href: 'https://sota.phillipian.net/',
    blurb: 'As digital editor of The Phillipian, built the annual State of the Academy data-journalism report from the whole student body — won NSPA Digital Story of the Year.' },
  { title: 'ExCStential Ethics', glyph: '§', color: '#ffc2d6', tags: ['writing', 'research'], href: 'https://excstential.substack.com/',
    blurb: 'An independent tech-ethics reading project with Dr. Kiran Bhardwaj — privacy, EA/AI, competition & design ethics, with essays and a final privacy-policy talk.',
    links: [{ label: 'readings', href: 'https://bit.ly/excstential-readings' }, { label: 'talk', href: 'https://cloud-qg99kx646-hack-club-bot.vercel.app/0excstential-presentation.pdf' }] },
  { title: 'RSI @ Harvard', glyph: '◉', color: '#d6c9ff', tags: ['research', 'neuro'], href: 'https://math.mit.edu/research/highschool/rsi/',
    blurb: "Spatial & Temporal Massive Memory research at Harvard Med's Visual Attention Lab under Jeremy Wolfe, plus a platform for human-memory experiments. Returned as a counselor." },
  { title: 'UCLA LONN Lab', glyph: '◐', color: '#d6c9ff', tags: ['research', 'neuro'], href: 'http://lonn.semel.ucla.edu/',
    blurb: 'Analyzed brain-imaging data and helped build VR/AR experiments for participants with implanted neural electrodes — and spearheaded my own project.' },
  { title: 'Memory Sports', glyph: '♣', color: '#ffe2a7', tags: ['creative', 'neuro'], href: 'https://artofmemory.com/',
    blurb: 'Longest-reigning Words champion on Memory League, 2021 World Speed-Reading champion, and Taiwan Youth champ. The thing that got me into neuro.' },
  { title: 'MIT PRIMES @ Broad', glyph: '∷', color: '#c9f7e4', tags: ['research', 'neuro'], href: 'https://www.broadinstitute.org/klarman-cell-observatory',
    blurb: 'With the Broad Institute, scRNA-sequencing for cross-tissue analysis of senescent cells. (Hiatus.)' },
  { title: 'Phillipian Digital Editor', glyph: '❏', color: '#ffc2d6', tags: ['writing', 'creative'], href: 'https://phillipian.net',
    blurb: 'Digital Editor of The Phillipian CXLV — exploring data journalism and amplifying marginalized voices on campus.',
    links: [{ label: 'SOTA', href: 'https://sota.phillipian.net' }, { label: 'Latine Legacy', href: 'https://latinelegacy.phillipian.net' }] },
  { title: 'Acting / Theater', glyph: '☻', color: '#ffe2a7', tags: ['creative'], href: 'https://www.imdb.com/name/nm7980879/',
    blurb: "Played Oberon (A Midsummer Night's Dream), the Cannibal Queen (Airness), and Benedick (Much Ado); previously on-screen with the Clear Talent Group." },
  { title: 'Nujjet (prev. TARDIS)', glyph: '◈', color: '#a7c4ff', tags: ['hacks', 'neuro'], href: 'https://nujjet.us/',
    blurb: 'A low-cost neuroscience headset (EEG/tDCS) to monitor & modulate your brain for better studying — Conrad Challenge, GATSVI, Hack Club. (Hiatus.)' },
  { title: 'MIRAI', glyph: '◑', color: '#c9f7e4', tags: ['research', 'neuro'], href: 'https://deepai.org/machine-learning-model/mri-brain-tumor-detection',
    blurb: 'A neural net that detects & outlines brain tumors in MRI scans using meta-learning and a Mask R-CNN — accuracy rivaling a professional. (Practice project.)' },
  { title: 'Mind Over Matter', glyph: '◊', color: '#d6c9ff', tags: ['writing', 'neuro'], href: 'https://www.notion.so/nerdfighteria/Mind-Over-Matter-Neuroethical-Considerations-of-Neurotechnology-e54d1c520b5d419ba4fed84cec5a24be',
    blurb: 'A neuroethics piece weighing the risks & benefits of brain-computer interfaces as the technology races ahead.' },
  { title: 'Supersingular Elliptic Curves', glyph: '∮', color: '#ffe2a7', tags: ['research', 'writing'], href: 'https://www.dropbox.com/scl/fi/dlf7ovuytvkbj3hhshxdr/Supersingular-claire.pdf?rlkey=b4q84zxvqv1gz29gk21xgjpqi&st=0a6igrkz&dl=0',
    blurb: 'An overview of elliptic curves and the Lang-Trotter conjecture, showing the ratio of supersingular primes 2 (mod 3) to 1 (mod 3) approaches 2.' },
  { title: 'MIDI Lab', glyph: '♫', color: '#ffc2d6', tags: ['hacks', 'creative'], href: 'https://midilab.netlify.app/',
    blurb: 'My CS 630B Data Visualization final — upload your own mp3s or use the presets to watch the music move.',
    links: [{ label: 'portfolio', href: 'https://dont-break-things.vercel.app/' }] },
  { title: 'IQ & Misleading Data', glyph: '◔', color: '#a7c4ff', tags: ['writing', 'creative'], href: 'https://observablehq.com/@clairebookworm/iq',
    blurb: 'Is IQ a thing? We argue no — by showing how easily a little finagling turns simple data into misleading graphs.' },
  { title: 'Anomaly Science', glyph: '✸', color: '#c9f7e4', tags: ['friends', 'work exp'], href: 'https://anomaly-science.com',
    blurb: "On the board & CMO of Anomaly Science — honing the artisan's craft through legal aid, engagement, the particle system, and community." },
  { title: 'Arena of Memory', glyph: '▰', color: '#ffe2a7', tags: ['creative', 'neuro'], href: 'https://www.twitch.tv/memorysportstv',
    blurb: 'I commentate memory-sports matches — most notably the Arena of Memory, live on Twitch @ memorysportstv.' },
  { title: 'Halo Charity', glyph: '♡', color: '#ffc2d6', tags: ['friends'], href: 'https://halo.angelhacks.org/',
    blurb: "AngelHacks' leftover funds went toward donating many K-N95 masks to non-medical essential workers." },
];

const FILTERS = ['all', 'research', 'neuro', 'hacks', 'creative', 'work exp', 'writing', 'friends'];
const subChip = { fontFamily: "'VT323',monospace", fontSize: 14, color: '#0c63ff', border: '1.5px solid #c4d2ea', padding: '0 7px', textDecoration: 'none', whiteSpace: 'nowrap', lineHeight: 1.5 };

export default function Gallery() {
  const [filter, setFilter] = useState('all');
  const [hover, setHover] = useState(null);
  const filtered = filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.tags.includes(filter));

  return (
    <>
      <Head>
        <title>projects, claire wang</title>
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
                <div
                  key={p.title}
                  onMouseEnter={() => setHover(i)}
                  onMouseLeave={() => setHover(null)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#fff',
                    border: '2px solid #0d1b2a',
                    boxShadow: hovered ? '6px 6px 0 rgba(0,0,0,.22)' : '4px 4px 0 rgba(0,0,0,.18)',
                    padding: '13px 14px 12px',
                    transform: hovered ? 'translate(-2px,-2px)' : 'none',
                    transition: 'transform .12s, box-shadow .12s',
                  }}
                >
                  <a href={p.href} target="_blank" rel="noreferrer" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9, textDecoration: 'none' }}>
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
                  {p.links && p.links.length ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 11 }}>
                      {p.links.map((l) => (
                        <a key={l.label} href={l.href} target="_blank" rel="noreferrer" style={subChip}>{l.label} ↗</a>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>

          {/* footer */}
          <div style={{ flex: 'none', padding: '7px 14px', borderTop: '2px solid #0d1b2a', background: '#eef4ff', fontFamily: "'VT323',monospace", fontSize: 15, color: '#0c63ff', display: 'flex', gap: 14 }}>
            <span>{filtered.length} projects</span>
            <span style={{ color: '#8a93a6' }}>click a card to open ↗ · small chips are extra links</span>
          </div>
        </div>

        <CrawlingWorm />
      </div>
    </>
  );
}
