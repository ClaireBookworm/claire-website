import Layout from '../components/layout'
import Head from 'next/head';

import { getSortedPostsData } from "../notes-lib/posts";
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
			<title>notes & thinks</title>
			<meta property="og:title" content="notes & things | claire" />
		</Head>
      <div>
        <h1 className="writingsTitle">notes & thinks <span style={{"fontSize" : "0.75em"}}>♥︎</span></h1>
        <p style={{"fontSize": '1.25rem', "fontWeight" : "800"}}>Shorter-form thoughts and notes I write that don't turn into an entire post.</p>
        <br />
        <ul>
          {allPostsData.map(({ id, date, title }, index) => (
            <li key={index}>
              <Link href={`/notes/${id}`}>
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
		<p className="para">These posts come from my "journal," which is never a regular thing. I write things only when I have too many thoughts in a moment, and have found that months of intense emotion lead to a lot of writing. It's also helped me become much more introspective & sometimes sharing these notion links have been helpful in communication. Feel free to try the same! <br /><br /> You can also find my old & inactive hack club <a href="https://scrapbook.hackclub.com/clairebookworm" style={{"textDecoration":"underline"}}>scrapbook</a>.</p>
		<br />
      </div>
    </Layout>
  );
}