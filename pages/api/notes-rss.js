import RSS from 'rss';
import { getSortedPostsData } from '../../notes-lib/posts';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const feed = new RSS({
    title: 'Claire\'s Notes & Thinks',
    description: 'Shorter-form thoughts and notes I write that don\'t turn into an entire post',
    feed_url: 'https://clairewang.me/api/notes-rss',
    site_url: 'https://clairewang.me/notes',
    image_url: 'https://clairewang.me/signature.png',
    managingEditor: 'Claire Wang',
    webMaster: 'Claire Wang',
    copyright: '2024 Claire Wang',
    language: 'en',
    pubDate: new Date().toUTCString(),
    ttl: '60'
  });

  const allPostsData = getSortedPostsData();

  allPostsData.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.excerpt || `Read the full note: ${post.title}`,
      url: `https://clairewang.me/notes/${post.id}`,
      guid: post.id,
      categories: ['notes', 'thoughts'],
      author: 'Claire Wang',
      date: post.date
    });
  });

  res.setHeader('Content-Type', 'application/rss+xml');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
  res.write(feed.xml({ indent: true }));
  res.end();
} 