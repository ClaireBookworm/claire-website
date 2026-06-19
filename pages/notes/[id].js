import Head from 'next/head';
import 'katex/dist/katex.min.css';
import Reader from '../../components/claireos/Reader';
import { getAllPostIds, getReaderList, getPostData } from '../../notes-lib/posts';

export async function getStaticProps({ params }) {
  const list = getReaderList();
  const items = list.map((p) => ({ id: p.id, title: p.title, meta: p.date }));
  const post = await getPostData(params.id);
  const current = { id: params.id, title: post.title || params.id, meta: post.date || '', contentHtml: post.contentHtml };
  return { props: { items, current } };
}

export async function getStaticPaths() {
  return { paths: getAllPostIds(), fallback: false };
}

export default function Note({ items, current }) {
  return (
    <>
      <Head>
        <title>{current.title}</title>
        <meta property="og:title" content={current.title} />
        <meta property="og:type" content="article" />
      </Head>
      <Reader
        variant="green"
        items={items}
        current={current}
        basePath="/notes"
        windowTitle="notes/ — lists, recs & musings"
        menuRightLabel="notes/ — scratchpad"
        sidebarLabel={`${items.length} NOTES`}
        sidebarFooter="// a working scratchpad. opinions change — that's allowed."
      />
    </>
  );
}
