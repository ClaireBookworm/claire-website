import Layout from '../components/layout'
import { getSortedPostsData } from "../lib/posts";
import Link from "next/link";

// export default function Writing() {
//     return (
//         <Layout active="Writing">
//             <h1 className="heading">Writing<div className="inline opacity-50">.</div></h1>
//             <div className="mt-12 mr-16 flex flex-col">
//                 <h1>Hello!</h1>
//             </div>
//         </Layout>
//     )
// }

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
      <div>
        <h1 className="writingsTitle">cold brew blog</h1>
        <ul>
          {allPostsData.map(({ id, date, title }, index) => (
            <li key={index}>
              <Link href={`/posts/${id}`}>
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
        <p>Find my wordpress blog at <a href="https://clairebookworm.wordpress.com/">clairebookworm.wordpress.com</a></p>
      </div>
    </Layout>
  );
}