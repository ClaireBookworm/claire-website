// Keep the objects' proportions, but rearrange the table to suit its viewport.
const hash = str => Array.from(str).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
function dimensions(item) {
  const n = hash(item.id);
  if (item.type === 'album') { const side = 205 + n % 29; return { width: side, height: side }; }
  if (item.type === 'playlist') return { width: 225 + n % 25, height: 165 + n % 10 };
  if (item.type === 'blog') return { width: 108 + n % 21, height: 144 + n % 20 };
  const height = item.type === 'film' ? 200 + n % 12 : (item.category === 'graphic' ? 220 : 175) + n % 48;
  const ratio = item.art?.aspect || (item.category === 'graphic' ? .69 : .63);
  return { width: height * Math.max(.48, Math.min(.85, ratio)), height };
}

function arrange(items, filter, width) {
  const featured = items.filter(i => i.featuredRank >= 0).sort((a, b) => a.featuredRank - b.featuredRank);
  const rest = items.filter(i => !(i.featuredRank >= 0));
  const poses = [];
  const labels = {};
  const inner = width - 100;
  let cursor = 25;
  function place(item, x, y, angle, layer, size = dimensions(item), featured = false) {
    poses.push({ item, x, y, angle, layer, ...size, featured });
  }
  // Each pile has a predictable exposed edge and its own loose rhythm.
  function pile(group, x, y, available, type) {
    if (!group.length) return y;
    const config = { book: [110, 222, 215], album: [165, 151, 275], playlist: [235, 210, 265], blog: [76, 195, 150], film: [185, 260, 190] }[type];
    const [dx, dy, reserve] = config;
    const columns = Math.max(1, Math.min(group.length, Math.floor((available - reserve) / dx) + 1));
    let bottom = y;
    group.forEach((item, i) => {
      const n = hash(item.id), row = Math.floor(i / columns), col = i % columns;
      const jitter = type === 'film' ? (i % 2) * 8 : n % 14;
      const angle = type === 'film' ? (i % 2 ? 1 : -1) : type === 'blog' ? [-12, 7, -4, 11][i % 4] : n % 15 - 7;
      const size = dimensions(item);
      place(item, x + col * dx + (type === 'film' ? 0 : row % 2 * 8), y + row * dy + jitter, angle, 1 + poses.length, size);
      bottom = Math.max(bottom, y + row * dy + jitter + size.height + 25);
    });
    return bottom;
  }

  if (featured.length) {
    const sideNote = width >= 2100;
    labels.featured = { left: 50, top: 25 };
    const left = sideNote ? 330 : 50;
    const space = width - left - 50;
    const maxColumns = Math.max(1, Math.floor(space / (width < 1000 ? 245 : 310)));
    const rows = Math.ceil(featured.length / maxColumns);
    const columns = Math.ceil(featured.length / rows);
    const cell = space / columns;
    const top = sideNote ? 70 : 225;
    featured.forEach((item, index) => {
      const size = dimensions(item), row = Math.floor(index / columns), col = index % columns;
      const height = (width < 1000 ? 245 : 292) + hash(item.id) % 20;
      const bookWidth = height * size.width / size.height;
      // Center an incomplete last row like a bookstore display.
      const rowCount = Math.min(columns, featured.length - row * columns);
      const offset = (columns - rowCount) * cell / 2;
      place(item, left + offset + cell * (col + .5) - bookWidth / 2, top + row * 435 + 315 - height,
        [-2, 1.5, -1, 2, -.5][index % 5], 250 + index, { width: bookWidth, height, captionWidth: Math.min(285, cell - 20) }, true);
    });
    cursor = top + rows * 435;
  }
  labels.collection = { left: 45, top: cursor + 10 };
  cursor += 125;
  if (filter === 'all') {
    const books = rest.filter(i => i.type === 'book');
    const albums = rest.filter(i => i.type === 'album');
    if (width >= 2000) {
      const bookWidth = inner * .65;
      cursor = Math.max(pile(books, 50, cursor, bookWidth - 25, 'book'), pile(albums, 50 + bookWidth + 35, cursor, inner - bookWidth - 35, 'album')) + 55;
    } else {
      cursor = pile(books, 50, cursor, inner, 'book') + 55;
      cursor = pile(albums, 50, cursor, inner, 'album') + 55;
    }
    const playlists = rest.filter(i => i.type === 'playlist');
    const blogs = rest.filter(i => i.type === 'blog');
    if (width >= 2000) {
      const musicWidth = inner * .6;
      cursor = Math.max(pile(playlists, 50, cursor, musicWidth - 35, 'playlist'), pile(blogs, 50 + musicWidth + 30, cursor, inner - musicWidth - 30, 'blog')) + 55;
    } else {
      cursor = pile(playlists, 50, cursor, inner, 'playlist') + 45;
      cursor = pile(blogs, 50, cursor, inner, 'blog') + 55;
    }
    const films = rest.filter(i => i.type === 'film');
    if (films.length) {
      labels.cinema = { left: 50, top: cursor };
      if (width < 1000) {
        cursor = pile(films, 65, cursor + 140, inner - 30, 'film') + 35;
      } else {
        labels.reading = { left: 55, top: cursor + 135 };
        cursor = Math.max(cursor + 325, pile(films, 375, cursor + 15, width - 425, 'film'));
      }
    }
  } else {
    // Keep records, cassettes, and papers in their own piles even when filtered.
    for (const type of ['book', 'album', 'playlist', 'blog', 'film']) {
      const group = rest.filter(i => i.type === type);
      if (group.length) cursor = pile(group, 50, cursor, inner, type) + 45;
    }
  }
  if (!labels.reading) {
    labels.reading = { left: 55, top: cursor + 15 };
    cursor += 210;
  }
  poses.sort((a, b) => Number(b.featured) - Number(a.featured));
  return { poses, width, height: cursor + 55, featuredCount: featured.length, labels };
}

function layoutTable(items, filter = 'all', screen = { width: 1440, height: 850 }) {
  const viewportWidth = Math.max(1, screen.width || 1440);
  const viewportHeight = Math.max(1, screen.height || 850);
  if (viewportWidth < 700 || viewportHeight < 420) {
    return { ...arrange(items, filter, Math.max(600, Math.min(1600, (viewportWidth - 12) / .64))), compact: true };
  }
  let best, bestScore = -Infinity;
  // Try a modest set of arrangements. This uses the actual available table area,
  // including portrait, split windows, and ultrawide displays, without stretching covers.
  for (let width = 1050; width <= 6500; width += 50) {
    const candidate = arrange(items, filter, width);
    const scale = Math.min(viewportWidth / width, viewportHeight / candidate.height);
    const coverage = width * candidate.height * scale * scale / (viewportWidth * viewportHeight);
    const score = scale * Math.pow(coverage, .35);
    if (score > bestScore) { best = candidate; bestScore = score; }
  }
  return best;
}
module.exports = { layoutTable, dimensions };
