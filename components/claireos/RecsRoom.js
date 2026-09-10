import { useEffect, useMemo, useRef, useState } from 'react';
import artwork from '../../lib/table-art.json';
import styles from './RecsRoom.module.css';
import { layoutTable } from '../../lib/tableLayout';
import { layoutLibrary } from '../../lib/libraryLayout';
import spineColors from '../../lib/book-spine-colors.json';
import { useRouter } from 'next/router';
import { RecordHolder, PlaylistPlayer } from './LibraryMusic';
import RecommendationNote from './RecommendationNote';

const FILTERS = [['all', 'everything'], ['book', 'books'], ['music', 'music'], ['film', 'films'], ['blog', 'the internet']];
const SOURCES = { book: ['goodreads', 'https://www.goodreads.com/clairebookworm'], album: ['musicboard', 'https://musicboard.app/clairebookworm'], playlist: ['spotify', 'https://open.spotify.com/user/rsjahryaqu08yocko5k5cfd9s'], film: ['letterboxd', 'https://letterboxd.com/clairebookworm/'] };
const COLORS = ['#314a65', '#944434', '#dad0b5', '#416451', '#b59956', '#33444b', '#ad7861', '#776c81'];
const MIN_ZOOM = .02;
const MAX_ZOOM = 2.5;
const hash = str => Array.from(str).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);

function collection(data) {
  const groups = [
    (data.books || []).map(item => ({ ...item, type: 'book', by: item.author })),
    (data.albums || []).map(item => ({ ...item, type: 'album', by: item.artist })),
    (data.playlists || []).map(item => ({ ...item, title: item.name, type: 'playlist', by: 'a playlist by claire' })),
    (data.blogs || []).map(item => ({ ...item, title: item.name, type: 'blog', by: item.link ? new URL(item.link).hostname.replace('www.', '') : 'from the internet' })),
    (data.films || []).map(item => ({ ...item, type: 'film', by: item.director })),
  ].map(group => group.sort((a, b) => Number(!!b.fave) - Number(!!a.fave)));
  const items = [];
  // Interleave media so the first view feels like a personal reading table.
  for (let index = 0; index < Math.max(...groups.map(group => group.length)); index++) {
    groups.forEach(group => { if (group[index]) items.push(group[index]); });
  }
  return items.map(item => ({ ...item, id: `${item.type}:${item.title}`, featuredRank: item.type === 'book' ? (data.topBooks || []).indexOf(item.title) : -1, seed: hash(item.title), art: artwork[`${item.type}:${item.title}`] }));
}

function Jacket({ item, large = false }) {
  const [failed, setFailed] = useState(false);
  const realArt = item.art?.image && !failed;
  return <div className={`${styles.object} ${styles[item.type]} ${large ? styles.largeObject : ''}`} style={{ '--jacket': COLORS[item.seed % COLORS.length], '--cover-ink': [2, 4, 6].includes(item.seed % COLORS.length) ? '#292d26' : '#f2ecdc' }}>
    {item.type === 'album' && <div className={styles.vinyl} aria-hidden="true"><i /></div>}
    <div className={styles.face}>
      {item.type === 'blog' ? <>
        <span className={styles.clippingMasthead}>{item.art?.logo && !failed ? <img src={item.art.logo} alt="" draggable="false" onError={() => setFailed(true)} /> : <b>{item.title.slice(0, 1)}</b>}<span>{item.by}</span></span>
        <span className={styles.jacketTitle}>{item.title}</span>
        <span className={styles.printColumns} aria-hidden="true"><i /><i /></span>
        <span className={styles.clippingFoot}>saved for later ↗</span>
      </> : realArt ? <img src={item.art.image} alt="" loading={large ? 'eager' : 'lazy'} draggable="false" onError={() => setFailed(true)} /> : <>
        <span className={styles.imprint}>{({ book: 'from the bookshelf', album: '33⅓ rpm · stereo', playlist: 'a mixtape for you', film: 'cinema / admit one', blog: 'bookmarks & marginalia' })[item.type]}</span>
        <span className={styles.jacketTitle}>{item.title}</span>
        {item.type === 'playlist' && <span className={styles.reels} aria-hidden="true"><i /><i /></span>}
                <span className={styles.creator}>{item.by}</span>
      </>}
      {item.type === 'book' && <span className={styles.bookCrease} aria-hidden="true" />}
    </div>
  </div>;
}

function BookSpine({ item, stacked }) {
  const palette = spineColors[item.title] || { color: '#38434a', ink: '#e8d8b6' };
  return <>
    <div className={`${styles.spine} ${stacked ? styles.stackedSpine : ''}`} style={{ '--spine-color': palette.color, '--spine-ink': palette.ink }}>
      <span className={styles.spineGrain} aria-hidden="true" />
      <span className={styles.spineLettering}><strong>{item.title}</strong><small>{item.by}</small></span>
      <span className={styles.spineMark} aria-hidden="true">✦</span>
    </div>
    <span className={styles.revealedCover} style={{ aspectRatio: item.art?.aspect || .65 }} aria-hidden="true"><Jacket item={item} /></span>
  </>;
}

export default function RecsRoom({ data = {} }) {
  const router = useRouter();
  const [view, setView] = useState('table');
  const items = useMemo(() => collection(data), [data]);
  const [filter, setFilter] = useState('all');
  const [zoom, setZoom] = useState(.4);
  const [fitted, setFitted] = useState(true);
  const [overview, setOverview] = useState(false);
  const overviewRef = useRef(false);
  const [selected, setSelected] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [screen, setScreen] = useState({ width: 1440, height: 850 });
  const [layoutScreen, setLayoutScreen] = useState(screen);
  const viewport = useRef(null);
  const dialog = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  const zoomRef = useRef(.4);
  const fittedRef = useRef(true);
  const anchor = useRef(null);
  const shown = useMemo(() => items.filter(item => filter === 'all' || (filter === 'music' ? ['album', 'playlist'].includes(item.type) : item.type === filter)), [items, filter]);
  const layout = useMemo(() => view === 'library' ? layoutLibrary(shown, layoutScreen) : layoutTable(shown, filter, layoutScreen), [shown, filter, layoutScreen, view]);
  const { width, height, poses, featuredCount, labels } = layout;
  const layoutRef = useRef(layout);
  layoutRef.current = layout;

  function changeZoom(next, point) {
    const el = viewport.current;
    if (!el) return;
    next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, next));
    fittedRef.current = false;
    setFitted(false);
    const x = point?.x ?? el.clientWidth / 2;
    const y = point?.y ?? el.clientHeight / 2;
    const bounds = layoutRef.current;
    const oldX = Math.max(0, (el.clientWidth - bounds.width * zoomRef.current) / 2);
    const oldY = Math.max(0, (el.clientHeight - bounds.height * zoomRef.current) / 2);
    const newX = Math.max(0, (el.clientWidth - bounds.width * next) / 2);
    const newY = Math.max(0, (el.clientHeight - bounds.height * next) / 2);
    anchor.current = { left: (el.scrollLeft + x - oldX) / zoomRef.current * next + newX - x, top: (el.scrollTop + y - oldY) / zoomRef.current * next + newY - y };
    zoomRef.current = next;
    setZoom(next);
  }
  useEffect(() => {
    if (anchor.current && viewport.current) {
      viewport.current.scrollLeft = anchor.current.left;
      viewport.current.scrollTop = anchor.current.top;
      anchor.current = null;
    }
  }, [zoom]);
  useEffect(() => {
    const el = viewport.current;
    function fitOnResize() {
      const size = { width: el.clientWidth, height: el.clientHeight };
      setScreen(previous => previous.width === size.width && previous.height === size.height ? previous : size);
      // Preserve the arrangement while someone is exploring a zoomed-in pile.
      if (fittedRef.current) setLayoutScreen(previous => previous.width === size.width && previous.height === size.height ? previous : size);
    }
    const observer = new ResizeObserver(fitOnResize);
    observer.observe(el);
    fitOnResize();
    function wheel(event) {
      // Preserve the browser's own pinch / accessibility zoom shortcut.
      if (event.ctrlKey || event.metaKey || layoutRef.current.compact || event.target.closest('[data-library-control]')) return;
      event.preventDefault();
      const rect = el.getBoundingClientRect();
      changeZoom(zoomRef.current * Math.exp(-event.deltaY * .0015), { x: event.clientX - rect.left, y: event.clientY - rect.top });
    }
    el.addEventListener('wheel', wheel, { passive: false });
    return () => { el.removeEventListener('wheel', wheel); observer.disconnect(); };
  }, []);
  useEffect(() => { resetView(false); }, [filter, view]);
  useEffect(() => {
    if (!router.isReady) return;
    const next = router.query.view === 'library' ? 'library' : 'table';
    setView(next);
    setFilter('all');
  }, [router.isReady, router.query.view]);
  useEffect(() => { if (fittedRef.current) fitLayout(true); }, [layout, screen]);
  useEffect(() => {
    if (selected && dialog.current && !dialog.current.open) dialog.current.showModal();
  }, [selected]);

  function chooseView(next) {
    setView(next);
    setFilter('all');
    router.replace({ pathname: router.pathname, query: next === 'library' ? { view: 'library' } : {} }, undefined, { shallow: true, scroll: false });
  }
  function chooseFilter(key) {
    setFilter(key);
    viewport.current?.scrollTo({ left: 0, top: 0 });
  }
  function resetView(wholeTable = true) {
    overviewRef.current = wholeTable;
    setOverview(wholeTable);
    const el = viewport.current;
    if (!el) return;
    fittedRef.current = true;
    setFitted(true);
    setLayoutScreen(previous => previous.width === el.clientWidth && previous.height === el.clientHeight ? previous : { width: el.clientWidth, height: el.clientHeight });
    fitLayout();
  }
  function fitLayout(preservePosition = false) {
    const el = viewport.current;
    if (!el) return;
    const bounds = layoutRef.current;
    const fitHeight = bounds.compact && !overviewRef.current ? Infinity : (el.clientHeight - 12) / bounds.height;
    const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, (el.clientWidth - 12) / bounds.width, fitHeight));
    const top = preservePosition && bounds.compact && !overviewRef.current ? el.scrollTop * next / zoomRef.current : 0;
    zoomRef.current = next;
    fittedRef.current = true;
    setFitted(true);
    anchor.current = { left: 0, top };
    setZoom(next);
    el.scrollTo({ left: 0, top });
  }
  function close() { dialog.current?.close(); setSelected(null); }
  function pointerDown(event) {
    moved.current = false;
    if (event.pointerType === 'touch' || event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, left: viewport.current.scrollLeft, top: viewport.current.scrollTop, id: event.pointerId };
  }
  function pointerMove(event) {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x, dy = event.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 5) {
      moved.current = true;
      setDragging(true);
      viewport.current.setPointerCapture(event.pointerId);
      viewport.current.scrollLeft = drag.current.left - dx;
      viewport.current.scrollTop = drag.current.top - dy;
    }
  }
  function pointerUp(event) {
    if (viewport.current?.hasPointerCapture(event.pointerId)) viewport.current.releasePointerCapture(event.pointerId);
    drag.current = null;
    setDragging(false);
  }
  const source = selected && SOURCES[selected.type];
  const link = selected?.link || source?.[1];

  return <main className={styles.room}>
    <header className={styles.header}>
      <div className={styles.heading}><h1>{view === 'library' ? 'the library' : 'the reading table'}</h1><div className={styles.viewSwitch} role="group" aria-label="Collection view">{[['table', 'table'], ['library', 'library']].map(([key, label]) => <button key={key} type="button" aria-pressed={view === key} onClick={() => chooseView(key)}>{label}</button>)}</div></div>
      <nav aria-label="What’s on the table">{FILTERS.map(([key, label]) => <button key={key} type="button" aria-pressed={filter === key} onClick={() => chooseFilter(key)}>{label}</button>)}</nav>
    </header>
    <div ref={viewport} className={`${styles.viewport} ${view === 'library' ? styles.libraryViewport : ''} ${dragging ? styles.dragging : ''}`} tabIndex={0} role="region" aria-label={`${view === 'library' ? 'Library' : 'Reading table'}. Swipe, drag, or use arrow keys to explore. Use the zoom buttons to see more detail.`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onClickCapture={event => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false; } }} onKeyDown={event => {
      if (event.target !== event.currentTarget) return;
      const directions = { ArrowDown: [0, 180], ArrowUp: [0, -180], ArrowLeft: [-180, 0], ArrowRight: [180, 0] };
      if (directions[event.key]) { event.preventDefault(); viewport.current.scrollBy(...directions[event.key]); }
    }}>
      <div className={styles.surface} style={{ width: width * zoom, height: height * zoom, minWidth: '100%', minHeight: '100%' }}>
        <div className={`${styles.world} ${view === 'library' ? styles.libraryWorld : ''} ${layout.compact ? styles.compactWorld : ''}`} style={{ width, height, left: Math.max(0, (screen.width - width * zoom) / 2), top: Math.max(0, (screen.height - height * zoom) / 2), transform: `scale(${zoom})`, '--table-zoom': zoom }}>
          {view === 'table' && featuredCount > 0 && <div className={styles.featuredHeading} style={labels.featured}><h2>start with<br />these</h2><span>my top {featuredCount}</span></div>}
          {view === 'table' && <div className={styles.tableLabel} style={labels.collection}>{featuredCount ? '& everything else' : "claire’s collection"} <span>— take a look around</span></div>}
          {layout.shelves?.map((shelf, index) => <div key={index} aria-hidden="true"><div className={styles.shelfBay} style={{ top: shelf.bayTop, height: shelf.height, width: layout.shelfWidth - 28 }} /><div className={styles.shelfBoard} style={{ top: shelf.top, width: layout.shelfWidth - 18 }}>{shelf.label && <span>{shelf.label}</span>}</div></div>)}
          {layout.widgets?.map(widget => <div key={widget.type} className={styles.libraryWidget} style={{ left: widget.x, top: widget.y, width: widget.width, height: widget.height }}><div style={{ width: widget.width / (widget.scale || 1), height: widget.height / (widget.scale || 1), transform: `scale(${widget.scale || 1})`, transformOrigin: 'top left' }}>{widget.type === 'records' ? <RecordHolder items={widget.items} onOpen={setSelected} /> : <PlaylistPlayer items={widget.items} onOpen={setSelected} />}</div></div>)}
          {labels.cinema && <div className={styles.cinemaLabel} style={labels.cinema}>movie night ↘</div>}
          {poses.map(({ item, x, y, width: itemWidth, height: itemHeight, angle, layer, featured, captionWidth, shelfMode }) => (
            <button key={item.id} type="button" className={`${styles.item} ${shelfMode ? styles.shelfItem : ''} ${shelfMode === 'spine' || shelfMode === 'stack' ? styles.spineItem : ''} ${shelfMode === 'stack' ? styles.stackItem : ''} ${item.type === 'blog' ? styles.paperItem : ''} ${featured ? styles.featuredItem : ''}`} style={{ left: x, top: y, width: itemWidth, height: itemHeight, '--caption-width': `${captionWidth || 285}px`, '--angle': `${angle}deg`, '--layer': layer, '--thickness': `${2 + item.seed % 5}px` }} aria-label={`${item.title}${item.by ? ` — ${item.by}` : ''}. Open ${item.type}.`} aria-haspopup="dialog" onClick={() => setSelected(item)}>
              {shelfMode === 'spine' || shelfMode === 'stack' ? <BookSpine item={item} stacked={shelfMode === 'stack'} /> : <Jacket item={item} />}
              {featured && <span className={styles.featuredCaption}><strong>{item.title}</strong><small>{item.by}</small></span>}
              <span className={styles.hoverLabel}>{item.title}<small>{item.type === 'blog' ? 'visit bookmark' : 'pick it up'} ↗</small></span>
            </button>
          ))}
          {!shown.length && <p className={styles.empty}>Nothing here just yet.</p>}
          {view === 'table' && !!data.toread?.length && <div className={styles.readingPile} style={labels.reading}><strong>on the reading pile</strong>{data.toread.map(item => <span key={item.title}>{item.title}</span>)}</div>}
        </div>
      </div>
    </div>
    <footer className={styles.footer}>
      <span className={styles.count}>{shown.length} {view === 'library' ? 'things in the library' : 'things on the table'}{process.env.NODE_ENV === 'development' && <a className={styles.editorLink} href="/recs/edit" target="_blank" rel="noreferrer">edit descriptions ↗</a>}</span>
      <span className={styles.hint}>{layout.compact ? 'swipe to explore · tap to open' : <>scroll to zoom in <i>·</i> drag to explore</>}</span>
      <div className={styles.zoom}><button type="button" aria-label="Zoom out" disabled={zoom <= MIN_ZOOM} onClick={() => changeZoom(zoom / 1.2)}>−</button><output aria-label="Zoom level">{Math.round(zoom * 100)}%</output><button type="button" aria-label="Zoom in" disabled={zoom >= MAX_ZOOM} onClick={() => changeZoom(zoom * 1.2)}>+</button><button type="button" className={styles.reset} aria-pressed={fitted && (overview || !layout.compact)} onClick={() => resetView(!(layout.compact && overview && fitted))}>{layout.compact && overview && fitted ? 'reading size ↗' : view === 'library' ? 'fit library ↖' : 'fit whole table ↖'}</button></div>
    </footer>
    <dialog ref={dialog} className={styles.dialog} aria-labelledby="table-detail-title" onCancel={close} onClose={() => setSelected(null)} onClick={event => { if (event.target === event.currentTarget) close(); }}>
      {selected && <div className={styles.openItem} key={selected.id}>
        <div className={styles.openArt} style={{ '--object-aspect': selected.type === 'album' ? 1 : selected.type === 'playlist' ? 1.5 : selected.art?.aspect || .65 }}><Jacket item={selected} large /></div>
        <article className={styles.note}>
          <button autoFocus type="button" className={styles.close} aria-label="Put it back" onClick={close}>×</button>
          <span className={styles.eyebrow}>{({ book: 'from the bookshelf', album: 'on the turntable', playlist: 'made you a mixtape', blog: 'from the internet', film: 'at the movies' })[selected.type]}{selected.fave ? ' / a favorite' : ''}</span>
          <h2 id="table-detail-title">{selected.title}</h2>
          {selected.by && <p className={styles.byline}>{selected.by}</p>}
          <span className={styles.rule} />
          {selected.note && <RecommendationNote className={styles.noteText}>{selected.note}</RecommendationNote>}
          {link && <a href={link} target="_blank" rel="noreferrer">{selected.type === 'blog' ? 'read here' : selected.type === 'playlist' ? 'listen on spotify' : selected.link ? 'open' : source[0]} ↗</a>}
          {selected.art?.source && <a className={styles.artSource} href={selected.art.source} target="_blank" rel="noreferrer">artwork / catalog ↗</a>}
        </article>
      </div>}
    </dialog>
  </main>;
}
