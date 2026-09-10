import fs from 'fs';
import path from 'path';
import { localEditorAllowed, saveNotes } from '../../lib/recsEditorStore';

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!localEditorAllowed(req)) return res.status(404).json({ error: 'This editor is available only on your local development server.' });
  const file = path.join(process.cwd(), 'lib', 'recommendations.json');
  try {
    if (req.method === 'GET') return res.status(200).json({ data: JSON.parse(fs.readFileSync(file, 'utf8')) });
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
    if (!req.headers['content-type']?.startsWith('application/json')) return res.status(415).json({ error: 'Please send JSON.' });
    return res.status(200).json({ data: saveNotes(file, req.body?.changes) });
  } catch (error) { return res.status(error.status || 500).json({ error: error.status ? error.message : 'Could not save the file. Your drafts are still here; please try again.', ...(error.status === 409 ? { data: JSON.parse(fs.readFileSync(file, 'utf8')) } : {}) }); }
}
export const config = { api: { bodyParser: { sizeLimit: '1mb' } } };
