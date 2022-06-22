import fs from "fs";
import path from "path";
import matter from "gray-matter";
import remark from "remark";
import html from "remark-html";
import math from "remark-math";
import katex from "rehype-katex";


//  REMARKABLE
import { Remarkable } from 'remarkable';
import katexPlugin from 'remarkable-katex';
import nb from 'notebookjs';

nb.coder = (text, pre, code, lang) => {
  var language = lang || 'text';
  pre.className = 'language-' + language;
  if (typeof code != 'undefined') {
    code.className = 'language-' + language;
  }
  return highlighter(text, language);
};

const markdownOptions = {
  html: true,             // Allow and pass inline HTML
  sup: true,              // Accept '^' as a superscript operator
  breaks: false,          // Require two new lines to end a paragraph
  typographer: true,      // Allow substitutions for nicer looking text
  smartypants: true,      // Allow substitutions for nicer looking text
  gfm: true,              // Allow GitHub Flavored Markdown (GFM) constructs
  footnote: true,         // Allow footnotes
  tables: true,           // Allow table constructs
  langPrefix: "language-", // Prefix to use for <code> language designation (set to match Prism setting)
  // highlight: coder

};

const md = new Remarkable("full", markdownOptions).use(katexPlugin);


const postsDirectory = path.join(process.cwd(), "posts");

export function getSortedPostsData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      id,
      ...matterResult.data,
    };
  });

  return allPostsData.sort((a, b) => {
    const aDate = new Date(a.date);
    const bDate = new Date(b.date);
    // console.log("adate", aDate, "bdate", bDate);
    if (bDate - aDate > 0) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ""),
      },
    };
  });
}

export async function getPostData(id) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  const contentHtml = md.render(matterResult.content);

  // const processedContent = await remark()
  //   .use(html)
  //   .use(math)
  //   .use(katex)
  //   .process(matterResult.content);
  // const contentHtml = processedContent.toString();
  // const markdownContent = matterResult;

  return {
    id,
    contentHtml,
    ...matterResult.data,
  };
}
