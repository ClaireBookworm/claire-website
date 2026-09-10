const React = require('react');
const ReactMarkdown = require('react-markdown');

module.exports = {
  skipHtml: true,
  transformLinkUri(uri) {
    const safe = ReactMarkdown.uriTransformer(uri);
    return safe === 'javascript:void(0)' ? '' : safe;
  },
  renderers: {
    link({ href, title, children }) {
      return href
        ? React.createElement('a', { href, title, target: '_blank', rel: 'noopener noreferrer' }, children)
        : React.createElement('span', null, children);
    },
  },
};
