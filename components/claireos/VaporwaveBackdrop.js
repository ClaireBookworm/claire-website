// Vaporwave (dark skin) backdrop — sun, perspective grid floor, CRT scanlines,
// and glitchy "CLAIRE OS" title. Rendered behind the windows on the desktop.
// Spec from designs/ClaireOS Skins.dc.html + README §D.

// Tiny background specks/stars (deterministic so SSR + client match). A faint
// scatter of glowing dots up in the "sky" to add depth.
const SPECKS = [
  { top: '12%', left: '8%', size: 3, color: '#8ff6ff', op: 0.5 },
  { top: '20%', left: '22%', size: 2, color: '#ff9de2', op: 0.4 },
  { top: '9%', left: '38%', size: 2, color: '#fff', op: 0.45 },
  { top: '16%', left: '70%', size: 3, color: '#8ff6ff', op: 0.45 },
  { top: '7%', left: '84%', size: 2, color: '#ff9de2', op: 0.4 },
  { top: '26%', left: '92%', size: 3, color: '#fff', op: 0.35 },
  { top: '30%', left: '5%', size: 2, color: '#ff9de2', op: 0.35 },
  { top: '40%', left: '15%', size: 2, color: '#8ff6ff', op: 0.3 },
  { top: '14%', left: '54%', size: 2, color: '#fff', op: 0.4 },
  { top: '34%', left: '78%', size: 2, color: '#8ff6ff', op: 0.3 },
  { top: '23%', left: '46%', size: 2, color: '#ff9de2', op: 0.3 },
  { top: '38%', left: '63%', size: 3, color: '#fff', op: 0.3 },
];

export default function VaporwaveBackdrop({ titleSize = '60px' }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 32,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'linear-gradient(180deg,#1a0633 0%, #3d1163 34%, #b5347e 66%, #ff7a59 100%)',
      }}
    >
      {/* tiny background specks / stars */}
      {SPECKS.map((s, i) => (
        <div key={i} style={{ position: 'absolute', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: s.color, opacity: s.op, boxShadow: `0 0 6px ${s.color}` }} />
      ))}

      {/* chrome sun */}
      <div style={{ position: 'absolute', top: 60, left: '50%', transform: 'translateX(-50%)', width: 230, height: 230, borderRadius: '50%', background: 'linear-gradient(#fff3a0 0%, #ff7be6 52%, #a14bff 100%)', boxShadow: '0 0 70px rgba(255,123,230,.55)', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: '46%', background: 'repeating-linear-gradient(0deg, transparent 0 5px, #2a0a3d 5px 11px)' }} />
      </div>
      {/* perspective grid floor */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '42%', perspective: '260px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 2, background: '#ff9de2', boxShadow: '0 0 18px 3px rgba(255,67,200,.8)' }} />
        <div style={{ position: 'absolute', inset: 0, transform: 'rotateX(66deg)', transformOrigin: 'top', backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 46px, rgba(255,67,200,.8) 46px 48px), repeating-linear-gradient(0deg, transparent 0 46px, rgba(110,240,255,.55) 46px 48px)', animation: 'ccGrid 1.4s linear infinite' }} />
      </div>
      {/* CRT scanlines */}
      <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(rgba(0,0,0,0) 0 2px, rgba(0,0,0,.14) 2px 3px)', animation: 'ccScan 1s linear infinite', mixBlendMode: 'multiply' }} />
      {/* glitch title */}
      <div style={{ position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '100%' }}>
        <div style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: titleSize, lineHeight: 0.9, color: '#fff', letterSpacing: '.04em', textShadow: '3px 3px 0 #ff2bd0, -2px -2px 0 #00eaff, 0 0 26px rgba(255,123,230,.7)', animation: 'ccFlick 4s infinite' }}>CLAIRE OS</div>
        <div style={{ fontFamily: "'VT323',monospace", fontSize: 20, color: '#8ff6ff', letterSpacing: '.3em', marginTop: 2, textShadow: '0 0 10px rgba(110,240,255,.8)' }}>クレア・オーエス</div>
      </div>
    </div>
  );
}
