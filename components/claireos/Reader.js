import { useEffect, useState } from 'react';
import Link from 'next/link';
import MenuBar from './MenuBar';
import CrawlingWorm from './CrawlingWorm';

// Two-pane "reader" window used by /writing and /notes (README §4 & §5).
// variant: 'blue' (writing) | 'green' (notes).
// items: [{ id, title, meta }] (sorted) — sidebar links, prefetched by Next.
// current: { id, title, meta, contentHtml } — the post shown in the right pane.
// On mobile the list collapses; a "‹ posts" button in the title bar reveals it.

const BAR_PALETTE = ['#5ce6b5', '#0c63ff', '#ffd23f', '#a78bff', '#ff9f43', '#ff5d8f'];

const VARIANTS = {
  blue: {
    titleBar: '#0c63ff', titleColor: '#fff', accent: '#0c63ff', dateColor: '#b0a585',
    sidebarBg: '#f3f1ea', sidebarScroll: 'ccscroll-cream', itemBorderSide: 'top',
    itemBorder: '1px solid #e3dccb', sidebarLabelColor: '#9a8f78', selBg: '#fff',
    titleTextColor: '#1c1a17', metaColor: '#9a8f78', sidebarW: 268, h1Size: 42,
    articleClass: 'cc-article', metaTitleColor: '#dce8ff', backColor: '#fff',
  },
  green: {
    titleBar: '#1f8a5b', titleColor: '#fff', accent: '#1f8a5b', dateColor: '#7fa890',
    sidebarBg: '#0d1b2a', sidebarScroll: 'ccscroll-green', itemBorderSide: 'bottom',
    itemBorder: '1px solid #16263a', sidebarLabelColor: '#3f6f8c', selBg: '#16263a',
    titleTextColor: '#cdd6e4', metaColor: '#5f7a92', sidebarW: 228, h1Size: 38,
    articleClass: 'cc-article cc-article--green', metaTitleColor: '#d6f5e6', backColor: '#fff',
  },
};

export default function Reader({
  variant = 'blue',
  items,
  current,
  basePath,
  windowTitle,
  menuRightLabel,
  sidebarLabel,
  sidebarFooter,
  articleFooter,
}) {
  const v = VARIANTS[variant];
  const [mobile, setMobile] = useState(false);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 760);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const closeBox = { width: 14, height: 14, background: '#ffd23f', border: '1.5px solid #0d1b2a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'VT323',monospace", fontSize: 14, lineHeight: 1, color: '#0d1b2a', fontWeight: 700, textDecoration: 'none' };

  const showSidebar = !mobile || listOpen;
  const showArticle = !mobile || !listOpen;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0c63ff', backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px)', backgroundSize: '20px 20px', fontFamily: "'Space Grotesk',system-ui,sans-serif", overflow: 'hidden' }}>
      <MenuBar rightLabel={menuRightLabel} dark={false} />

      {/* window */}
      <div style={{ position: 'absolute', top: 46, left: 22, right: 22, bottom: 22, background: '#fff', border: '2px solid #0d1b2a', boxShadow: '8px 8px 0 rgba(0,0,0,.28)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 28, background: v.titleBar, borderBottom: '2px solid #0d1b2a', display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6, flex: 'none' }}>
          <Link href="/" title="close" aria-label="back to desktop" style={closeBox}>×</Link>
          {mobile && !listOpen ? (
            <button onClick={() => setListOpen(true)} style={{ background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.5)', color: v.titleColor, fontFamily: "'VT323',monospace", fontSize: 14, lineHeight: 1, padding: '1px 8px', cursor: 'pointer' }}>‹ posts</button>
          ) : null}
          <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: v.titleColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{windowTitle}</span>
          <span style={{ marginLeft: 'auto', fontFamily: "'VT323',monospace", fontSize: 15, color: v.metaTitleColor, whiteSpace: 'nowrap' }}>{current.meta}</span>
        </div>

        <div className="cc-reader-panes" style={{ flex: 1, display: 'flex', minHeight: 0 }}>
          {/* sidebar list */}
          {showSidebar ? (
            <div className={`${v.sidebarScroll} cc-reader-sidebar`} style={{ width: mobile ? '100%' : v.sidebarW, flex: mobile ? 1 : 'none', maxHeight: mobile ? 'none' : undefined, borderRight: mobile ? 'none' : '2px solid #0d1b2a', background: v.sidebarBg, overflowY: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px 8px' }}>
                <span style={{ fontFamily: "'Silkscreen',monospace", fontSize: 9, letterSpacing: '.1em', color: v.sidebarLabelColor, flex: 1 }}>{sidebarLabel || `${items.length} POSTS`}</span>
                {mobile && listOpen ? (
                  <button onClick={() => setListOpen(false)} style={{ background: 'transparent', border: `1px solid ${v.sidebarLabelColor}`, color: v.sidebarLabelColor, fontFamily: "'VT323',monospace", fontSize: 13, lineHeight: 1, padding: '1px 8px', cursor: 'pointer' }}>‹ reading</button>
                ) : null}
              </div>
              {items.map((p, i) => {
                const bar = BAR_PALETTE[i % BAR_PALETTE.length];
                const selected = p.id === current.id;
                const titleColor = variant === 'green' ? (selected ? '#5ce6b5' : '#cdd6e4') : v.titleTextColor;
                const borderProp = v.itemBorderSide === 'top' ? { borderTop: v.itemBorder } : { borderBottom: v.itemBorder };
                return (
                  <Link
                    key={p.id}
                    href={`${basePath}/${p.id}`}
                    onClick={() => setListOpen(false)}
                    style={{
                      display: 'block', textDecoration: 'none',
                      padding: variant === 'green' ? '10px 14px' : '11px 14px',
                      ...borderProp,
                      borderLeft: `3px solid ${bar}`,
                      background: selected ? v.selBg : 'transparent',
                    }}
                  >
                    <div style={{ fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: variant === 'green' ? 15 : 16, color: titleColor, lineHeight: 1.2 }}>{p.title}</div>
                    <div style={{ fontFamily: "'VT323',monospace", fontSize: variant === 'green' ? 12 : 13, color: v.metaColor, marginTop: 2 }}>{p.meta}</div>
                  </Link>
                );
              })}
              {sidebarFooter ? (
                <div style={{ padding: 14, fontFamily: "'VT323',monospace", fontSize: 14, color: v.sidebarLabelColor }}>{sidebarFooter}</div>
              ) : null}
            </div>
          ) : null}

          {/* article pane */}
          {showArticle ? (
            <div className={`${v.sidebarScroll}`} style={{ flex: 1, overflowY: 'auto', background: '#fbfaf5' }}>
              <div className="cc-reader-article" style={{ maxWidth: variant === 'green' ? 660 : 680, margin: '0 auto', padding: variant === 'green' ? '42px 44px 64px' : '46px 44px 70px' }}>
                <div style={{ fontFamily: "'VT323',monospace", fontSize: 15, letterSpacing: '.08em', color: v.dateColor, textTransform: 'uppercase' }}>{current.meta}</div>
                <h1 style={{ fontFamily: "'Newsreader',serif", fontWeight: 600, fontSize: v.h1Size, lineHeight: 1.12, color: '#15140f', margin: '8px 0 6px', letterSpacing: '-0.01em', textWrap: 'balance' }}>{current.title}</h1>
                <div style={{ width: 54, height: 3, background: v.accent, margin: '18px 0 28px' }} />
                <div className={v.articleClass} dangerouslySetInnerHTML={{ __html: current.contentHtml }} />
                {articleFooter ? (
                  <div style={{ marginTop: 34, paddingTop: 18, borderTop: '1px solid #e3dccb', fontFamily: "'VT323',monospace", fontSize: 16, color: '#9a8f78' }}>{articleFooter}</div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <CrawlingWorm />
    </div>
  );
}
