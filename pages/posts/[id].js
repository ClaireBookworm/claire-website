import Layout from "../../components/layout";

import 'katex/dist/katex.min.css';

import { getAllPostIds, getPostData } from "../../lib/posts";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: { postData },
  };
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,

  };
}

export default function Post({ postData }) {
  return (
    <Layout>
      <div className="blogContainer">
        <div className="postTitle">{postData.title}</div>
        <div className="postDate">
          {postData.date}
        </div>
        <br />
        <div className="postContent" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    </Layout>
  );
}