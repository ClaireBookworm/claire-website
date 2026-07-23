# Wiring "recs" into ClaireOS — integration guide

The recs page is now the **media room** (nook of faves + full shelf), and recs
becomes its own **desktop window + icon**, exactly like `radio` / `notes`.

## Files in this handoff (drop-in, same repo paths)

| File | Action |
|---|---|
| `lib/recommendations.json` | **Replace** — expanded to full books/films/albums/playlists/blogs, with `fave` + `category`. |
| `components/claireos/RecsRoom.js` | **New** — the media-room UI (nook hero + filter/sort shelf + detail). |
| `components/claireos/Glyphs.js` | **Replace** — same as before **plus** a new `RecsGlyph` export at the bottom. |
| `pages/recs.js` | **Replace** — drops the three.js/FBX bookshelf; renders `<RecsRoom>` in `Layout`. |
| `pages/index.js` | **Patch** — 9 small edits below. |

After copying, `pages/recs.js` no longer imports `three` / `FBXLoader`. You can
leave `three` in `package.json` or remove it; the `/public/*.FBX` asset is unused.

---

## pages/index.js — 9 edits

**1. Import the glyph** — add `RecsGlyph` to the Glyphs import:
```js
import { AboutGlyph, ProjectsGlyph, WritingGlyph, RadioGlyph, NotesGlyph, TerminalGlyph, RecsGlyph } from '../components/claireos/Glyphs';
```

**2. `ICON_TO_WIN`** — add the recs mapping:
```js
const ICON_TO_WIN = { iAbout: 'about', iProjects: 'projects', iWriting: 'writing', iRadio: 'radio', iNotes: 'notes', iTerminal: 'terminal', iRecs: 'recs' };
```

**3. `APPS`** — add `'recs'`:
```js
const APPS = ['about', 'projects', 'writing', 'radio', 'notes', 'terminal', 'recs'];
```

**4. `INITIAL_POS`** — add an icon slot (4th on the left column) and a window position.
In the icons block add `iRecs: { x: 38, y: 478 },` and in the windows block add `recs: { x: 540, y: 300 },`:
```js
const INITIAL_POS = {
  iAbout: { x: 38, y: 82 }, iProjects: { x: 38, y: 214 }, iWriting: { x: 38, y: 346 }, iRecs: { x: 38, y: 478 },
  iRadio: { x: 1120, y: 176 }, iNotes: { x: 1120, y: 308 }, iTerminal: { x: 1120, y: 440 },
  about: { x: 150, y: 90 }, writing: { x: 620, y: 150 }, projects: { x: 300, y: 320 }, radio: { x: 470, y: 250 }, notes: { x: 360, y: 380 }, terminal: { x: 250, y: 560 }, recs: { x: 540, y: 300 },
};
```

**5. `open` state** — add `recs: false`:
```js
const [open, setOpen] = useState({ about: true, writing: true, projects: false, radio: false, notes: false, terminal: true, recs: false });
```

**6. `z` state** — add `recs: 90`:
```js
const [z, setZ] = useState({ about: 100, writing: 99, terminal: 101, projects: 90, radio: 90, notes: 90, recs: 90 });
```

**7. Terminal commands** — three small additions inside `run()`:

- `help` — mention recs in the dirs line:
```js
P('dirs: projects/ · writing/ · notes/ · radio/ · recs/');
```
- `ls` — add `recs/`:
```js
case 'ls': P('about_me   projects/   writing/   radio.exe   notes/   recs/'); break;
```
- `cd` — add a recs branch (right after the `radio` branch):
```js
else if (d === 'recs') { P('opening recs/ …'); openWin('recs'); }
```
- and a top-level `recs` command (near the `radio` case):
```js
case 'recs': openWin('recs'); break;
```
(`open recs` already works — `recs` is in `APPS`.)

**8. The icon** — add after the `iWriting` icon `<div>` in the ICONS row:
```jsx
<div onPointerDown={down('iRecs', 'icon')} style={{ ...iconWrap, ...iconFrame('iRecs') }}>
  <RecsGlyph />
  <div style={iconLabel}>recs</div>
</div>
```

**9. The window** — add this block alongside the other window blocks
(e.g. right after the RADIO `{open.radio ? (...) : null}` block):
```jsx
{/* RECS */}
{open.recs ? (
  <div style={{ ...winBase, ...winFrame('recs', 340) }}>
    <div onPointerDown={down('recs', 'win')} style={{ ...titleBarBase, background: '#5a3a22' }}>
      <span onPointerDown={closeWin('recs')} style={closeBox} title="close">×</span>
      <span style={{ fontFamily: "'Pixelify Sans',sans-serif", fontWeight: 700, fontSize: 13, color: '#fff' }}>recs.app</span>
      <a href="/recs" title="open full" style={{ marginLeft: 'auto', width: 13, height: 13, background: '#5ce6b5', border: '1.5px solid #0d1b2a' }} />
    </div>
    <div style={{ padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 4, height: 88, background: 'linear-gradient(#f3efe4,#e6dfcd)', border: '2px solid #0d1b2a', padding: '0 10px 8px' }}>
        {[['#ff5d8f', 64], ['#ffd23f', 54], ['#0c63ff', 70], ['#5ce6b5', 48], ['#ff9f43', 60]].map((b, i) => (
          <div key={i} style={{ width: 10, height: b[1], background: b[0], border: '1.5px solid #0d1b2a' }} />
        ))}
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'radial-gradient(circle,#ff8ad1 0 20%,#15130f 21% 100%)', border: '1.5px solid #0d1b2a', marginLeft: 4 }} />
        <div style={{ width: 18, height: 60, background: '#17131f', border: '1.5px solid #0d1b2a', display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
          <span style={{ width: 11, height: 22, background: '#5ce6b5', border: '1px solid #0d1b2a' }} />
        </div>
      </div>
      <div style={{ fontFamily: "'VT323',monospace", fontSize: 16, color: '#5b5346', margin: '10px 0 12px', textAlign: 'center' }}>books · films · records · mixtapes</div>
      <a href="/recs" style={{ display: 'block', textAlign: 'center', fontFamily: "'VT323',monospace", fontSize: 18, color: '#15122a', background: '#ffd23f', border: '2px solid #0d1b2a', padding: '4px 18px', textDecoration: 'none' }}>▸ open the shelf →</a>
    </div>
  </div>
) : null}
```

That's it — the recs icon opens a little preview window on the desktop, and
"open the shelf" (or the nav link) goes to the full `/recs` media room.
