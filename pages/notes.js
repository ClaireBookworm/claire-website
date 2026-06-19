import Head from 'next/head';
import Reader from '../components/claireos/Reader';
import { getReaderList, getPostData } from '../notes-lib/posts';

export async function getStaticProps() {
  const list = getReaderList();
  const items = list.map((p) => ({ id: p.id, title: p.title, meta: p.date }));
  const top = list[0];
  const post = await getPostData(top.id);
  const current = { id: top.id, title: post.title || top.id, meta: post.date || '', contentHtml: post.contentHtml };
  return { props: { items, current } };
}

export default function Notes({ items, current }) {
  return (
    <>
      <Head>
        <title>notes/ — lists, recs & musings</title>
        <meta property="og:title" content="notes & thinks | claire" />
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
