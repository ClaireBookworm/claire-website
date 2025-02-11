import Head from 'next/head';

const CustomHead = ({ title, description, keywords, author, twitter, children }) => {
    const defaultDescription = "words, words, words, they're all we have to go on!";
    const defaultKeywords = "claire, wang, neuroscience, computer science, hack club, mit";
    const defaultAuthor = "Claire Wang";
    const defaultTwitter = "@clairebookworm1";
    const defaultTitle = "claire's corner";

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>{title || defaultTitle}</title>
            <meta name="description" content={description || defaultDescription} />
            <meta name="keywords" content={keywords || defaultKeywords} />
            <meta name="author" content={author || defaultAuthor} />
            <meta property="og:url" content="clairebookworm.com" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title || defaultTitle} />
            <meta property="og:description" content={description || defaultDescription} />
            {/* <meta property="og:image" content={image} /> */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content={twitter || defaultTwitter} />
            <meta name="twitter:creator" content={twitter || defaultTwitter} />
            {children}
        </Head>
    )
}

export default CustomHead;