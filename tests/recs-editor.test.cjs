const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { saveNotes, localEditorAllowed } = require('../lib/recsEditorStore');
const seed = { topBooks: ['Bluets'], books: [{ title: 'Bluets', author: 'Maggie Nelson', note: 'old', fave: true }, { title: 'Sum', note: '' }], playlists: [{ name: 'sizzle', link: 'https://open.spotify.com/playlist/example', note: 'beats' }] };
function fixture(t) { const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'recs-editor-test-')); t.after(() => fs.rmSync(dir, { recursive: true, force: true })); const file = path.join(dir, 'recs.json'); fs.writeFileSync(file, JSON.stringify(seed)); return file; }
const update = note => ({ group: 'books', title: 'Bluets', previousNote: 'old', note });
test('saves multiline notes and empty notes without changing other recommendation fields', t => {
 const file = fixture(t); const result = saveNotes(file, [update('one\n\ntwo'), { group: 'playlists', title: 'sizzle', previousNote: 'beats', note: '' }]);
 assert.equal(result.books[0].note, 'one\n\ntwo'); assert.equal(result.playlists[0].note, '');
 const expected = structuredClone(seed); expected.books[0].note = 'one\n\ntwo'; expected.playlists[0].note = ''; assert.deepEqual(JSON.parse(fs.readFileSync(file)), expected);
 assert.deepEqual(fs.readdirSync(path.dirname(file)), ['recs.json']);
});
test('stale edits reject the entire batch and preserve newer content', t => {
 const file = fixture(t); saveNotes(file, [update('newer')]); const before = fs.readFileSync(file, 'utf8');
 assert.throws(() => saveNotes(file, [{ group: 'books', title: 'Sum', previousNote: '', note: 'pending' }, update('stale')]), error => error.status === 409);
 assert.equal(fs.readFileSync(file, 'utf8'), before);
});
test('a retried save succeeds if its note was already written', t => { const file = fixture(t); saveNotes(file, [update('new')]); assert.equal(saveNotes(file, [update('new')]).books[0].note, 'new'); });
test('invalid targets and oversized notes do not touch the file', t => {
 const file = fixture(t), before = fs.readFileSync(file, 'utf8');
 for (const changes of [[{ ...update('x'), group: '__proto__' }], [{ ...update('x'), title: 'missing' }], [update('a'.repeat(20001))], [update('x'), update('y')]]) assert.throws(() => saveNotes(file, changes));
 assert.equal(fs.readFileSync(file, 'utf8'), before);
});
test('editing is restricted to local development and same-origin requests', () => {
 const req = { method: 'POST', headers: { host: '127.0.0.1:3001', origin: 'http://127.0.0.1:3001', 'sec-fetch-site': 'same-origin' } };
 assert.equal(localEditorAllowed(req, 'development'), true);
 assert.equal(localEditorAllowed(req, 'production'), false);
 assert.equal(localEditorAllowed({ ...req, headers: { ...req.headers, origin: 'https://elsewhere.example' } }, 'development'), false);
 assert.equal(localEditorAllowed({ ...req, headers: { host: '127.0.0.1:3001' } }, 'development'), false);
 assert.equal(localEditorAllowed({ method: 'GET', headers: { host: 'clairebookworm.com' } }, 'development'), false);
});
