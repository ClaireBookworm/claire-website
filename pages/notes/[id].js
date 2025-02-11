import Layout from "../../components/layout";
import Head from 'next/head';
import CustomHead from '../components/custom_head';

import 'katex/dist/katex.min.css';

import { getAllPostIds, getPostData } from "../../notes-lib/posts";

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
	  <CustomHead
	  	title={postData.title}
		description="notes & things | clairebookworm"
		author="Claire Wang"
		/>
		{/* <Head>
        <title>{postData.title}</title>
        <meta property="og:title" content={postData.title} />
        <meta property="og:description" content="notes & thinks | clairebookworm" />
        <meta property="og:type" content="article" />
      </Head> */}
	  <div className="backButton" onClick={() => window.history.length > 1 ? window.history.back() : window.location.href = '/notes'}>
		<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="currentColor">
		  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
		</svg>
	  </div>
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