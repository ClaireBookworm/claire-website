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
    <Layout className="blog-elements mt-6 sm:mt-12 md:mt-16 pl-0 md:pl-0">
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