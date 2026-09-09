const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');
const GROUPS = ['books', 'albums', 'playlists', 'films', 'blogs', 'toread'];

function localEditorAllowed(req, environment = process.env.NODE_ENV) {
  if (environment !== 'development') return false;
  try {
    const host = new URL('http://' + req.headers.host);
    if (!['localhost', '127.0.0.1', '[::1]'].includes(host.hostname)) return false;
    if (req.headers['sec-fetch-site'] === 'cross-site') return false;
    if (req.headers.origin && new URL(req.headers.origin).host !== host.host) return false;
    if (req.method === 'POST' && !req.headers.origin) return false;
    return true;
  } catch { return false; }
}

function saveNotes(file, changes) {
  if (!Array.isArray(changes) || !changes.length || changes.length > 200) throw Object.assign(new Error('Choose at least one description to save.'), { status: 400 });
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const seen = new Set();
  for (const change of changes) {
    if (!change || !GROUPS.includes(change.group) || typeof change.title !== 'string' || typeof change.note !== 'string' || typeof change.previousNote !== 'string' || change.note.length > 20000) throw Object.assign(new Error('Invalid description. Notes can contain up to 20,000 characters.'), { status: 400 });
    const key = `${change.group}:${change.title}`;
    if (seen.has(key)) throw Object.assign(new Error('Duplicate recommendation in this save.'), { status: 400 });
    seen.add(key);
    const matches = (data[change.group] || []).filter(item => (item.title || item.name) === change.title);
    if (matches.length !== 1) throw Object.assign(new Error(`“${change.title}” changed in the list. Reload before saving.`), { status: 409 });
    const item = matches[0];
    if ((item.note || '') !== change.previousNote && (item.note || '') !== change.note) throw Object.assign(new Error(`“${change.title}” was edited elsewhere. Your draft is kept; reload to review the newer description.`), { status: 409 });
    item.note = change.note;
  }
  const temporary = path.join(path.dirname(file), `.recs-${randomUUID()}.tmp`);
  try {
    fs.writeFileSync(temporary, JSON.stringify(data, null, 2) + '\n');
    fs.renameSync(temporary, file);
  } finally { if (fs.existsSync(temporary)) fs.unlinkSync(temporary); }
  return data;
}
module.exports = { GROUPS, localEditorAllowed, saveNotes };
