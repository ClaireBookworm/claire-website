// Build-time scraper for Spotify playlist tracklists.
// The public embed page (open.spotify.com/embed/playlist/<id>) ships its data in
// a __NEXT_DATA__ JSON blob at props.pageProps.state.data.entity.trackList.
// No API credentials needed. Resilient: returns null on any failure so callers
// can fall back to curated data and the build never breaks.

function msToLen(ms) {
  if (!ms && ms !== 0) return '';
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = String(total % 60).padStart(2, '0');
  return `${m}:${s}`;
}

export async function getPlaylistData(id) {
  try {
    const res = await fetch(`https://open.spotify.com/embed/playlist/${id}`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ClaireOS/1.0)' },
    });
    if (!res.ok) return null;
    const html = await res.text();
    const m = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/s);
    if (!m) return null;
    const data = JSON.parse(m[1]);
    const entity = data?.props?.pageProps?.state?.data?.entity;
    const list = entity?.trackList;
    if (!Array.isArray(list) || !list.length) return null;
    const tracks = list.map((t) => ({
      who: t.subtitle ? `${t.subtitle} — ${t.title}` : t.title,
      len: msToLen(t.duration),
    }));
    return { name: entity?.title || '', tracks };
  } catch (e) {
    return null;
  }
}
