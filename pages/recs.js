import Head from 'next/head';
import Link from 'next/link';
import RecsRoom from '../components/claireos/RecsRoom';
import styles from '../components/claireos/RecsPage.module.css';

export default function Recommendations({ recommendations }) {
  return <>
    <Head>
      <title>recs, claire wang</title>
      <meta name="description" content="Books, records, playlists, films, and things worth keeping around. Browse Claire’s reading table and library." />
      <meta property="og:title" content="recommendations — claire wang" />
      <link rel="canonical" href="https://clairebookworm.com/recs" />
    </Head>
    <nav className={styles.navigation} aria-label="Site navigation">
      <Link className={styles.name} href="/">clairebookworm</Link>
      <Link href="/">← home</Link>
      <Link href="/gallery">projects</Link>
      <Link href="/recs" aria-current="page">recs</Link>
    </nav>
    <RecsRoom data={recommendations} />
  </>;
}

export async function getStaticProps() {
  const fs = require('fs');
  const path = require('path');
  const recommendations = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'lib', 'recommendations.json'), 'utf8'));
  return { props: { recommendations } };
}
