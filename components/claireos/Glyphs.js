// Pixel-art glyphs for the ClaireOS desktop icons.
// Each is a small box of inline-styled divs; two of them animate (projects cursor, notes worm tank).

export function AboutGlyph() {
  return (
    <div style={{ width: 56, height: 56, margin: '0 auto', background: '#3fc5d6', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 5, right: 8, width: 18, height: 18, background: '#0d1b2a' }} />
      <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8, height: 20, background: '#eaf6f8' }} />
    </div>
  );
}

export function ProjectsGlyph() {
  return (
    <>
      <div style={{ width: 60, height: 48, margin: '0 auto', background: '#1a1730', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: "'VT323',monospace", fontSize: 18, color: '#5ce6b5' }}>
          &gt;_<span style={{ animation: 'ccBlink 1s step-end infinite' }}>█</span>
        </span>
      </div>
      <div style={{ width: 16, height: 8, background: '#cfd6e4', margin: '0 auto', border: '2px solid #0d1b2a', borderTop: 'none' }} />
    </>
  );
}

export function WritingGlyph() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 3, padding: 6, background: '#5a3a22', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', width: 58, margin: '0 auto' }}>
      <div style={{ width: 8, height: 30, background: '#ff6b6b' }} />
      <div style={{ width: 8, height: 36, background: '#ffd23f' }} />
      <div style={{ width: 8, height: 26, background: '#5ce6b5' }} />
      <div style={{ width: 8, height: 32, background: '#7d8cff' }} />
    </div>
  );
}

export function RadioGlyph() {
  return (
    <div style={{ width: 64, height: 40, margin: '0 auto', background: '#2a2444', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#15122a', boxShadow: 'inset 0 0 0 2px #ff6b6b' }} />
      <span style={{ width: 16, height: 6, background: '#ffd23f' }} />
      <span style={{ width: 14, height: 14, borderRadius: '50%', background: '#15122a', boxShadow: 'inset 0 0 0 2px #ff6b6b' }} />
    </div>
  );
}

export function NotesGlyph() {
  return (
    <div style={{ width: 62, height: 42, margin: '0 auto', background: 'rgba(92,230,181,.18)', border: '2px solid #0d1b2a', boxShadow: '3px 3px 0 rgba(0,0,0,.3)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', bottom: 12, left: 18, width: 22, height: 7, borderRadius: 5, background: '#ff9f43', animation: 'ccTankWorm 2.4s ease-in-out infinite' }} />
      <div style={{ position: 'absolute', bottom: 5, left: 0, right: 0, height: 6, background: '#2e5e52' }} />
    </div>
  );
}
