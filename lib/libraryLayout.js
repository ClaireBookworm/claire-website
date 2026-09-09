const { dimensions } = require('./tableLayout');
const hash = text => Array.from(text).reduce((n, c) => (n * 31 + c.charCodeAt(0)) >>> 0, 0);

function arrangeLibrary(items, width) {
  const poses = [], shelves = [], labels = {}, widgets = [];
  const albums = items.filter(i => i.type === 'album');
  const playlists = items.filter(i => i.type === 'playlist');
  const hasShelfItems = items.some(i => !['album', 'playlist'].includes(i.type));
  const sideBay = width >= 1100 && hasShelfItems && (albums.length || playlists.length);
  const shelfWidth = sideBay ? width - 650 : width;
  const margin = 45, available = shelfWidth - margin * 2;
  let top = 30;
  function shelf(height, label) {
    const baseline = top + height;
    shelves.push({ top: baseline, bayTop: top, height, label });
    top = baseline + 48;
    return baseline;
  }
  function place(item, x, baseline, size, shelfMode = 'face', angle = 0) {
    poses.push({ item, x, y: baseline - size.height, ...size, shelfMode, angle, layer: poses.length + 1 });
  }
  const featured = items.filter(i => i.featuredRank >= 0).sort((a, b) => a.featuredRank - b.featuredRank);
  if (featured.length) {
    const cols = Math.max(2, Math.min(5, Math.floor(available / 210)));
    for (let start = 0; start < featured.length; start += cols) {
      const group = featured.slice(start, start + cols);
      const baseline = shelf(285, start === 0 ? 'start with these · my top five' : 'a few favorites');
      group.forEach((item, index) => {
        const original = dimensions(item), height = 238 + hash(item.id) % 23;
        const size = { height, width: height * original.width / original.height };
        place(item, margin + available / group.length * (index + .5) - size.width / 2, baseline, size, 'face', [-1.5, 1, -.5, 1.5, -1][index]);
      });
    }
  }
  const books = items.filter(i => i.type === 'book' && !(i.featuredRank >= 0));
  // Alternate clusters of upright books with low piles. Every spine is exposed.
  const units = [];
  for (let i = 0; i < books.length;) {
    if (i % 15 === 8 && books.length - i >= 3) {
      const stack = books.slice(i, i + 4);
      units.push({ books: stack, width: 230, stacked: true });
      i += stack.length;
    } else {
      const item = books[i++];
      units.push({ books: [item], width: 36 + hash(item.id) % 25 });
    }
  }
  const films = items.filter(i => i.type === 'film');
  const interval = Math.max(1, Math.ceil(units.length / Math.max(1, films.length)));
  films.forEach((item, i) => {
    const size = dimensions(item);
    units.splice(Math.min(units.length, (i + 1) * interval + i), 0, { books: [item], width: size.width + 30, poster: true });
  });
  let index = 0, row = 0;
  while (index < units.length) {
    const baseline = shelf(282, row === 0 ? books.length ? 'the bookshelf · & movie nights' : 'movie night' : null);
    let x = margin;
    while (index < units.length && x + units[index].width <= shelfWidth - margin) {
      const unit = units[index++];
      if (unit.poster) {
        const item = unit.books[0];
        place(item, x + 15, baseline, dimensions(item), 'face', row % 2 ? -1 : 1);
      } else if (unit.stacked) {
        let bottom = baseline;
        unit.books.forEach((item, i) => {
          const size = { width: unit.width - 5 - hash(item.id) % 20, height: 31 + hash(item.id) % 10 };
          place(item, x + i % 2 * 5, bottom, size, 'stack');
          bottom -= size.height + 3;
        });
      } else {
        const item = unit.books[0];
        place(item, x, baseline, { width: unit.width, height: 225 + hash(item.id) % 49 }, 'spine');
      }
      x += unit.width + (unit.stacked ? 20 : 3);
    }
    row++;
  }
  for (const [type, label] of [['blog', 'saved from the internet']]) {
    const group = items.filter(i => i.type === type);
    let i = 0;
    while (i < group.length) {
      const baseline = shelf(type === 'playlist' ? 210 : 278, i === 0 ? label : null);
      let x = margin;
      while (i < group.length) {
        const item = group[i], size = dimensions(item);
        const extra = type === 'album' ? 30 : type === 'film' ? 20 : 12;
        if (x + size.width + extra > shelfWidth - margin) break;
        place(item, x + (type === 'film' ? 15 : 0), baseline, size);
        x += size.width + extra + 14;
        i++;
      }
    }
  }
  if (sideBay) {
    let y = 55;
    if (albums.length) { widgets.push({ type: 'records', items: albums, x: shelfWidth + 40, y, width: 560, height: 760, scale: 1.6 }); y += 810; }
    if (playlists.length) { widgets.push({ type: 'player', items: playlists, x: shelfWidth + 95, y, width: 448, height: 744, scale: 1.6 }); y += 790; }
    top = Math.max(top, y);
  } else if (albums.length || playlists.length) {
    if (!hasShelfItems && width >= 900) {
      const start = Math.max(45, (width - (albums.length && playlists.length ? 760 : 350)) / 2);
      if (albums.length) widgets.push({ type: 'records', items: albums, x: start, y: 55, width: 350, height: 475 });
      if (playlists.length) widgets.push({ type: 'player', items: playlists, x: albums.length ? start + 470 : (width - 280) / 2, y: 55, width: 280, height: 465 });
      top = 570;
    } else {
      if (albums.length) { const baseline = shelf(520, 'flip through the records'); widgets.push({ type: 'records', items: albums, x: (width - 350) / 2, y: baseline - 480, width: 350, height: 475 }); }
      if (playlists.length) { const baseline = shelf(505, 'made you a playlist'); widgets.push({ type: 'player', items: playlists, x: (width - 280) / 2, y: baseline - 470, width: 280, height: 465 }); }
    }
  }
  return { poses, shelves, labels, widgets, shelfWidth, width, height: Math.max(360, top + 5), featuredCount: featured.length };
}

function layoutLibrary(items, screen = { width: 1440, height: 850 }) {
  const width = Math.max(1, screen.width), height = Math.max(1, screen.height);
  const compact = width < 700 || height < 420;
  if (compact) return { ...arrangeLibrary(items, Math.max(510, (width - 12) / .75)), compact: true };
  let best, score = -Infinity;
  for (let span = 1100; span <= 4800; span += 50) {
    const candidate = arrangeLibrary(items, span);
    const scale = Math.min(width / span, height / candidate.height);
    const coverage = span * candidate.height * scale ** 2 / (width * height);
    const value = scale * coverage ** .3;
    if (value > score) { best = candidate; score = value; }
  }
  return best;
}
module.exports = { layoutLibrary };
