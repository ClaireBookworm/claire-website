import Link from 'next/link';
import { useSkin } from './SkinContext';

// Shared top menu bar for ClaireOS sub-pages (projects, writing, notes, radio).
// Has the logo chip, "ClaireOS" wordmark, a "◄ Desktop" back link, optional
// extra middle items, and a right-aligned status label (Silkscreen).
export default function MenuBar({ middle, rightLabel, dark: forceDark }) {
  const { dark: ctxDark } = useSkin();
  const dark = forceDark ?? ctxDark;

  const barBg = dark ? 'rgba(20,8,40,.55)' : 'rgba(255,255,255,.95)';
  const barColor = dark ? '#ff9de2' : '#1c1a17';
  const logoBg = dark ? 'linear-gradient(#fff3a0,#ff7be6)' : '#0c63ff';

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 32,
        background: barBg,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        gap: 18,
        padding: '0 14px',
        zIndex: 9000,
        boxShadow: '0 1px 0 rgba(0,0,0,.18)',
        fontSize: 13,
        color: barColor,
      }}
    >
      <span style={{ width: 16, height: 16, background: logoBg, borderRadius: 3, display: 'inline-block' }} />
      <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700 }}>clairebookworm</span>
      <Link href="/" style={{ textDecoration: 'none', color: barColor, opacity: 0.65 }}>◄ Desktop</Link>
      {middle}
      {rightLabel ? (
        <span style={{ marginLeft: 'auto', fontFamily: "'Silkscreen',monospace", fontSize: 10, color: dark ? '#ff9de2' : '#5b6678' }}>
          {rightLabel}
        </span>
      ) : null}
    </div>
  );
}
