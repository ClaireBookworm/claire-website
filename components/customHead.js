import Head from 'next/head';

const CustomHead = ({ title, description, children }) => {
    const defaultDescription = "words, words, words, they're all we have to go on!";
    const desc = description || defaultDescription;
    const defaultKeywords = "claire, wang, neuroscience, computer science, hack club, mit";
    const defaultAuthor = "Claire Wang";
    const defaultTwitter = "@clairebookworm1";
    const defaultTitle = "claire's corner";
    const title_final  = title || defaultTitle;

    return (
        <Head>
            <meta charSet="utf-8" />
            <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width,initial-scale=1" />
            <title>{title_final}</title>
            <meta name="description" content={desc} />
            <meta name="keywords" content={defaultKeywords} />
            <meta name="author" content={defaultAuthor} />
            <meta property="og:url" content="clairebookworm.com" />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title_final} />
            <meta property="og:description" content={desc} />
            {/* <meta property="og:image" content={image} /> */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:site" content={defaultTwitter} />
            <meta name="twitter:creator" content={defaultTwitter} />
            {children}
        </Head>
    )
}

export default CustomHead;