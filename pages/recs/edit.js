import Head from 'next/head';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import artwork from '../../lib/table-art.json';
import styles from '../../components/claireos/RecsEditor.module.css';
import RecommendationNote from '../../components/claireos/RecommendationNote';

const GROUPS = [['books', 'books', 'book'], ['albums', 'albums', 'album'], ['playlists', 'playlists', 'playlist'], ['films', 'films', 'film'], ['blogs', 'the internet', 'blog'], ['toread', 'to read', 'book']];
const STORAGE = 'claire-recs-description-drafts-v1';
export default function RecsEditor() {
  const [data, setData] = useState(null), [drafts, setDrafts] = useState({});
  const [search, setSearch] = useState(''), [group, setGroup] = useState('all'), [emptyOnly, setEmptyOnly] = useState(false);
  const [status, setStatus] = useState('Loading your collection…'), [error, setError] = useState(''), [saving, setSaving] = useState(false);
  const savingRef = useRef(false), draftRef = useRef(drafts);
  draftRef.current = drafts;
  useEffect(() => {
    let active = true;
    fetch('/api/recs-editor').then(async response => {
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      if (!active) return;
      let restored = {};
      try { restored = JSON.parse(localStorage.getItem(STORAGE) || '{}'); } catch {}
      const valid = {};
      for (const [key, value] of Object.entries(restored || {})) {
        if (value && GROUPS.some(([name]) => name === value.group) && typeof value.title === 'string' && typeof value.note === 'string' && typeof value.previousNote === 'string') valid[key] = value;
      }
      setDrafts(valid); setData(result.data); setStatus('Write as much or as little as you like.');
    }).catch(error => { if (active) setError(error.message); });
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!data) return;
    try { if (Object.keys(drafts).length) localStorage.setItem(STORAGE, JSON.stringify(drafts)); else localStorage.removeItem(STORAGE); }
    catch { setError('Browser draft storage is unavailable. Keep this page open until you save.'); }
  }, [drafts, data]);
  useEffect(() => {
    const warn = event => { if (Object.keys(draftRef.current).length) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, []);
  async function save() {
    if (savingRef.current || !Object.keys(draftRef.current).length) return;
    savingRef.current = true; setSaving(true); setError('');
    const snapshot = { ...draftRef.current };
    try {
      const response = await fetch('/api/recs-editor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ changes: Object.values(snapshot) }) });
      const result = await response.json();
      if (!response.ok) { if (result.data) setData(result.data); throw new Error(result.error); }
      setData(result.data);
      setDrafts(current => {
        const next = { ...current };
        for (const [key, saved] of Object.entries(snapshot)) {
          if (next[key]?.note === saved.note) delete next[key];
          else if (next[key]) next[key] = { ...next[key], previousNote: saved.note };
        }
        return next;
      });
      setStatus(`Saved ${Object.keys(snapshot).length} description${Object.keys(snapshot).length === 1 ? '' : 's'} to your site’s file. Refresh the preview to see them.`);
    } catch (error) { setError(error.message); }
    finally { savingRef.current = false; setSaving(false); }
  }
  const saveRef = useRef(save); saveRef.current = save;
  useEffect(() => {
    const key = event => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') { event.preventDefault(); saveRef.current(); } };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, []);
  const items = useMemo(() => GROUPS.flatMap(([name, label, type]) => (data?.[name] || []).map(item => {
    const title = item.title || item.name;
    return { ...item, title, key: `${name}:${title}`, group: name, label, art: artwork[`${type}:${title}`], by: item.author || item.artist || item.director || item.link || '' };
  })), [data]);
  const shown = items.filter(item => (group === 'all' || item.group === group) && (!emptyOnly || !(item.note || '').trim()) && `${item.title} ${item.by}`.toLowerCase().includes(search.toLowerCase()));
  const count = Object.keys(drafts).length;
  function edit(item, note) {
    setDrafts(current => {
      const next = { ...current };
      if (note === (item.note || '')) delete next[item.key];
      else next[item.key] = { group: item.group, title: item.title, previousNote: current[item.key]?.previousNote ?? item.note ?? '', note };
      return next;
    });
  }
  return <div className={styles.page}>
    <Head><title>Edit recommendations — Claire</title><meta name="robots" content="noindex,nofollow" /></Head>
    <header className={styles.header}>
      <div><Link href="/recs">← recommendations</Link><h1>A little note for each thing.</h1><p>Links and Markdown welcome. Blank is completely fine.</p></div>
      <div className={styles.actions}><a href="/recs?view=library" target="_blank" rel="noreferrer">open preview ↗</a><button type="button" onClick={save} disabled={!count || saving}>{saving ? 'Saving…' : count ? `Save ${count} change${count === 1 ? '' : 's'}` : 'All saved'}</button><small>⌘ / Ctrl + S</small></div>
    </header>
    <main className={styles.main}>
      <div className={styles.toolbar}><label className={styles.search}>Find something<input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Title, author, artist…" /></label><label>Show<select value={group} onChange={event => setGroup(event.target.value)}><option value="all">everything</option>{GROUPS.map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></label><label className={styles.checkbox}><input type="checkbox" checked={emptyOnly} onChange={event => setEmptyOnly(event.target.checked)} /> without a description</label></div>
      <div className={styles.status} role="status">{error ? <span role="alert" className={styles.error}>{error}</span> : status}{data && <span>{shown.length} items · {count ? `${count} unsaved` : 'up to date'}</span>}</div>
      <div className={styles.cards}>{shown.map(item => <article key={item.key} className={`${styles.card} ${drafts[item.key] ? styles.changed : ''}`}>
        <div className={styles.info}>{item.art?.image || item.art?.logo ? <img src={item.art.image || item.art.logo} alt="" loading="lazy" /> : <div className={styles.placeholder}>{item.label}</div>}<div><small>{item.label}</small><h2>{item.title}</h2><p>{item.by}</p></div></div>
        {drafts[item.key] && drafts[item.key].previousNote !== (item.note || '') && drafts[item.key].note !== (item.note || '') && <div className={styles.conflict}><strong>This description changed elsewhere.</strong><p>Currently saved: {item.note || '(blank)'}</p><div><button type="button" onClick={() => setDrafts(current => ({ ...current, [item.key]: { ...current[item.key], previousNote: item.note || '' } }))}>Keep my draft instead</button><button type="button" onClick={() => edit(item, item.note || '')}>Use saved description</button></div></div>}
        <label htmlFor={`note-${item.key}`} className={styles.noteLabel}>Your description {drafts[item.key] && <span>unsaved</span>}</label>
        <textarea id={`note-${item.key}`} value={drafts[item.key]?.note ?? item.note ?? ''} onChange={event => edit(item, event.target.value)} maxLength={20000} rows={4} placeholder="What stayed with you? Why would you recommend it?" />
        <p className={styles.markdownHelp}>Add a link with <code>[here](https://…)</code> · <code>*italics*</code> · <code>**bold**</code></p>
        <details className={styles.preview}><summary>Preview description</summary>{(drafts[item.key]?.note ?? item.note ?? '').trim() ? <RecommendationNote>{drafts[item.key]?.note ?? item.note}</RecommendationNote> : <p className={styles.previewEmpty}>Your description will appear here as you write.</p>}</details>
      </article>)}</div>
      {data && !shown.length && <p className={styles.empty}>Nothing matches—try another search or filter.</p>}
      <p className={styles.footnote}>Save updates this checkout’s recommendations file. Publishing to clairebookworm.com is a separate commit and push; your public site has no editing endpoint.</p>
    </main>
  </div>;
}
export function getServerSideProps() { return process.env.NODE_ENV === 'development' ? { props: {} } : { notFound: true }; }
