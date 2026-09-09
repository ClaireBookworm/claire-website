import { useEffect, useRef, useState } from 'react';
import styles from './LibraryMusic.module.css';

function useWheel(ref, step) {
  const callback = useRef(step);
  callback.current = step;
  useEffect(() => {
    const el = ref.current;
    let total = 0, last = 0;
    function wheel(event) {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      event.stopPropagation();
      total += event.deltaY;
      if (Math.abs(total) > 35 && Date.now() - last > 140) {
        callback.current(Math.sign(total));
        last = Date.now(); total = 0;
      }
    }
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [ref]);
}

export function RecordHolder({ items, onOpen }) {
  const [index, setIndex] = useState(0);
  const ref = useRef(null), touch = useRef(null), swiped = useRef(false);
  const current = index % items.length;
  const album = items[current];
  const step = delta => setIndex(i => (i + delta + items.length) % items.length);
  useWheel(ref, step);
  return <section ref={ref} data-library-control className={styles.records} aria-label="Flip through the records" onPointerDown={event => event.stopPropagation()} onKeyDown={event => {
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
  }}>
    <div className={styles.recordHeader}><span>on rotation</span><small>{current + 1} / {items.length}</small></div>
    <div className={styles.sleeves} onTouchStart={event => { swiped.current = false; touch.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }} onTouchEnd={event => {
      if (!touch.current) return;
      const dx = event.changedTouches[0].clientX - touch.current.x, dy = event.changedTouches[0].clientY - touch.current.y;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) { swiped.current = true; step(dx < 0 ? 1 : -1); }
      touch.current = null;
    }}>
      {[3, 2, 1].filter(offset => offset < items.length).map(offset => <div key={offset} className={styles.backSleeve} style={{ '--depth': offset }} aria-hidden="true"><img src={items[(current + offset) % items.length].art?.image} alt="" draggable="false" /></div>)}
      <button type="button" className={styles.frontSleeve} key={album.id} aria-label={`Open ${album.title} by ${album.by}`} onClick={() => { if (swiped.current) { swiped.current = false; return; } onOpen(album); }}><img src={album.art?.image} alt={album.title} draggable="false" /></button>
      <div className={styles.crate} aria-hidden="true"><span>LP / 33⅓</span></div>
    </div>
    <div className={styles.recordCaption} aria-live="polite"><strong>{album.title}</strong><span>{album.by}</span></div>
    <div className={styles.recordControls}><button type="button" aria-label="Previous record" onClick={() => step(-1)}>←</button><span>flip through</span><button type="button" aria-label="Next record" onClick={() => step(1)}>→</button></div>
  </section>;
}

export function PlaylistPlayer({ items, onOpen }) {
  const [index, setIndex] = useState(0);
  const ref = useRef(null), list = useRef(null);
  const current = index % items.length, selected = items[current];
  const step = delta => setIndex(i => (i + delta + items.length) % items.length);
  useWheel(ref, step);
  useEffect(() => {
    const el = list.current, row = el?.children[current];
    if (!row) return;
    if (row.offsetTop < el.scrollTop) el.scrollTop = row.offsetTop;
    else if (row.offsetTop + row.offsetHeight > el.scrollTop + el.clientHeight) el.scrollTop = row.offsetTop + row.offsetHeight - el.clientHeight;
  }, [current]);
  return <section ref={ref} data-library-control className={styles.player} aria-label="Claire’s playlist player" onPointerDown={event => event.stopPropagation()} onKeyDown={event => {
    if (['ArrowDown', 'ArrowUp'].includes(event.key)) { event.preventDefault(); step(event.key === 'ArrowDown' ? 1 : -1); }
  }}>
    <div className={styles.playerScreen}>
      <div className={styles.statusBar}><span>claire’s playlists</span><i aria-label="Battery full" /></div>
      <div className={styles.playlistList} ref={list} aria-label="Playlists">{items.map((item, i) => <button type="button" key={item.id} aria-pressed={current === i} onClick={() => setIndex(i)}><span>{item.title}</span><b aria-hidden="true">›</b></button>)}</div>
      <div className={styles.playerStatus} aria-live="polite">{current + 1} of {items.length} · {selected.note || 'a playlist by claire'}</div>
    </div>
    <div className={styles.clickWheel}>
      <button type="button" className={styles.menuKey} aria-label="Back to first playlist" onClick={() => setIndex(0)}>MENU</button>
      <button type="button" className={styles.previousKey} aria-label="Previous playlist" onClick={() => step(-1)}>◀◀</button>
      <button type="button" className={styles.nextKey} aria-label="Next playlist" onClick={() => step(1)}>▶▶</button>
      <button type="button" className={styles.selectKey} aria-label={`Read about ${selected.title}`} onClick={() => onOpen(selected)} />
      <a className={styles.playKey} href={selected.link} target="_blank" rel="noreferrer" aria-label={`Listen to ${selected.title} on Spotify`}>▶Ⅱ</a>
    </div>
    <a className={styles.playerLink} href={selected.link} target="_blank" rel="noreferrer">listen on spotify ↗</a>
  </section>;
}
