import Head from 'next/head';
import Reader from '../components/claireos/Reader';
import { getReaderList, getPostData } from '../lib/posts';

const SUBSTACK_FOOTER = (
  <>↳ also on <a href="https://clairebookworm.substack.com" target="_blank" rel="noreferrer" style={{ color: '#0c63ff' }}>substack</a> · written by claire wang</>
);

export async function getStaticProps() {
  const list = getReaderList();
  const items = list.map((p) => ({ id: p.id, title: p.title, meta: `${p.date}${p.date ? ' · ' : ''}${p.minutes} min` }));
  const top = list[0];
  const post = await getPostData(top.id);
  const current = { id: top.id, title: post.title || top.id, meta: items[0].meta, contentHtml: post.contentHtml };
  return { props: { items, current } };
}

export default function Writing({ items, current }) {
  return (
    <>
      <Head>
        <title>cold brew blog</title>
        <meta property="og:title" content="cold brew blog" />
      </Head>
      <Reader
        variant="blue"
        items={items}
        current={current}
        basePath="/posts"
        windowTitle="cold-brew-blog — reader"
        menuRightLabel="cold-brew-blog.app"
        sidebarLabel={`${items.length} POSTS · FULL TEXT ON-SITE`}
        articleFooter={SUBSTACK_FOOTER}
      />
    </>
  );
}
