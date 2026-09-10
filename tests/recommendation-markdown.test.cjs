const { test } = require('node:test');
const assert = require('node:assert/strict');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const ReactMarkdown = require('react-markdown');
const options = require('../lib/recommendationMarkdown');
const render = source => renderToStaticMarkup(React.createElement(ReactMarkdown, options, source));
test('the supplied playlist Markdown becomes a safely opening clickable link', () => {
 const url = 'https://open.spotify.com/playlist/6Z3O7HiOYcz19rPhHhPGH5?si=6923b5ddc0ab4139';
 const html = render(`"suppose I were to begin by saying that I had fallen in love with a color." Find my playlist for this book [here](${url}).`);
 assert(html.includes(`href="${url}"`)); assert(html.includes('target="_blank"')); assert(html.includes('rel="noopener noreferrer"')); assert(html.includes('>here</a>')); assert(!html.includes('[here]'));
});
test('paragraphs, emphasis and lists render while plain notes remain intact', () => {
 const html = render('A **favorite**.\n\n*Read slowly.*\n\n- One\n- Two');
 assert(html.includes('<strong>favorite</strong>')); assert(html.includes('<em>Read slowly.</em>')); assert(html.includes('<ul>')); assert(html.includes('<li>Two</li>'));
 assert.equal(render('A simple note.'), '<p>A simple note.</p>');
});
test('raw HTML and executable links do not render active markup', () => {
 const html = render('<script>alert(1)</script>\n\n[bad](javascript:alert%281%29)');
 assert(!html.includes('<script')); assert(!html.includes('href="javascript:')); assert(html.includes('bad'));
});
