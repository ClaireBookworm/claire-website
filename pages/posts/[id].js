import Head from 'next/head';
import 'katex/dist/katex.min.css';
import Reader from '../../components/claireos/Reader';
import { getAllPostIds, getReaderList, getPostData } from '../../lib/posts';

const SUBSTACK_FOOTER = (
  <>↳ also on <a href="https://clairebookworm.substack.com" target="_blank" rel="noreferrer" style={{ color: '#0c63ff' }}>substack</a> · written by claire wang</>
);

export async function getStaticProps({ params }) {
  const list = getReaderList();
  const items = list.map((p) => ({ id: p.id, title: p.title, meta: `${p.date}${p.date ? ' · ' : ''}${p.minutes} min` }));
  const meta = items.find((it) => it.id === params.id);
  const post = await getPostData(params.id);
  const current = { id: params.id, title: post.title || params.id, meta: meta ? meta.meta : (post.date || ''), contentHtml: post.contentHtml };
  return { props: { items, current } };
}

export async function getStaticPaths() {
  return { paths: getAllPostIds(), fallback: false };
}

export default function Post({ items, current }) {
  return (
    <>
      <Head>
        <title>{current.title}</title>
        <meta property="og:title" content={current.title} />
        <meta property="og:type" content="article" />
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
