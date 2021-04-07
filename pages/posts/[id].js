import Layout from "../../components/layout";
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import { getAllPostIds, getPostData } from "../../lib/posts";

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
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
        {/* <ReactMarkdown plugins={[gfm]}>
          {postData.contentHtml}
        </ReactMarkdown> */}
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </div>
    </Layout>
  );
}