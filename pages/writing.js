import Layout from '../components/layout'
import Head from 'next/head';

import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>cold brew blog</title>
        <meta property="og:title" content="cold brew blog" />
      </Head>
      <div>
        <h1 className="writingsTitle">cold brew blog</h1>
        <p style={{"fontSize": '1.25rem', "fontWeight" : "800"}}>Find my substack at <a href="https://clairebookworm.substack.com/" style={{"textDecoration":"underline"}}>clairebookworm.substack.com</a>.</p>
        <br />
        <ul>
          {allPostsData.map(({ id, date, title }, index) => (
            <li key={index}>
              <Link href={`/posts/${id}`}> 
              {/*  lowkey this should be / writing / but idk... */}
                <a className="blogListName">{title}</a>
              </Link>
              <br />
              <span>
                {date}
              </span>
              <br /><br />
            </li>
          ))}
        </ul>
        <br />
      </div>
    </Layout>
  );
}