// pages/recs.js
// Recommendations — Claire's media room. Nook of current faves up top, then
// the full shelf (books / films / albums / playlists) with filter + sort,
// plus a footer of blogs + the reading pile. Rendered on the ClaireOS desktop
// chrome, like the other sub-pages. (Replaces the old three.js FBX bookshelf.)

import Head from 'next/head';
import MenuBar from '../components/claireos/MenuBar';
import RecsRoom from '../components/claireos/RecsRoom';
import { useSkin } from '../components/claireos/SkinContext';

export default function Recommendations({ recommendations }) {
  const { dark } = useSkin();
  return (
    <>
      <Head>
        <title>recs, claire wang</title>
        <meta property="og:title" content="recommendations — claire wang" />
      </Head>
      <div style={{ position: 'fixed', inset: 0, backgroundColor: '#0c63ff', backgroundImage: 'radial-gradient(rgba(255,255,255,.12) 1px, transparent 1.5px)', backgroundSize: '20px 20px', fontFamily: "'Space Grotesk',system-ui,sans-serif", overflowY: 'auto', overflowX: 'hidden' }}>
        <MenuBar dark={false} rightLabel="recs/ — books · films · records · mixtapes" />
        <div style={{ padding: '48px 22px 80px', display: 'flex', justifyContent: 'center' }}>
          <RecsRoom data={recommendations} dark={dark} />
        </div>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');
  const filePath = path.join(process.cwd(), 'lib', 'recommendations.json');
  const recommendations = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  return { props: { recommendations } };
}
