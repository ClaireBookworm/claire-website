# Editing recommendation descriptions

On the checkout you want to edit (`main` or `redesign-2`), run `npm run edit:recs`, then open:

http://127.0.0.1:3001/recs/edit

Search by title, author, or artist, filter by type or missing descriptions, and type your notes. Save with the button or Command/Ctrl+S. Blank descriptions are allowed. Unsaved drafts stay in this browser, and conflicting external edits must be reviewed before they can be replaced.

Saving updates `lib/recommendations.json` in the checkout running the server. Refresh `/recs` to preview the saved notes. Commit and push those changes to publish them; saving itself does not publish anything.

The editor and its write API are unavailable in production. Local requests must use a loopback hostname, and saves must be same-origin JSON requests.

Run the save/conflict/access tests with `node --test tests/recs-editor.test.cjs`.

Descriptions support Markdown: `[here](https://example.com)`, `*italics*`, `**bold**`, paragraphs, blockquotes, and lists. Expand **Preview description** under any text box to see the same formatting used in the table and library. Links open in a new tab.
