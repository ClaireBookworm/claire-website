// pages/recs.js
// Recommendations — Claire's media room. Nook of current faves up top, then
// the full shelf (books / films / albums / playlists) with filter + sort.
// (Replaces the old three.js FBX bookshelf.)

import Layout from '../components/layout';
import RecsRoom from '../components/claireos/RecsRoom';
import { useSkin } from '../components/claireos/SkinContext';

export default function Recommendations({ recommendations }) {
  const { dark } = useSkin();
  return (
    <Layout active="recs">
      <div className="heading mb-6">recommendations</div>
      <p className="mb-8 max-w-2xl text-sm sm:text-base opacity-90">
        Everything I push on people, out of a list and onto a shelf. Pull a spine to read the note.
        I also keep running reviews on{' '}
        <a href="https://letterboxd.com/clairebookworm/" target="_blank" rel="noreferrer" className="underline">letterboxd</a>{' '}
        and <a href="https://musicboard.app/clairebookworm" target="_blank" rel="noreferrer" className="underline">musicboard</a>.
      </p>
      <div className="pr-6 md:pr-12 pb-16">
        <RecsRoom data={recommendations} dark={dark} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'lib', 'recommendations.json');
  const recommendations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { recommendations } };
}
