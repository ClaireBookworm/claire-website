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
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
}