# Reading table artwork

Book jackets are cached from the Open Library Covers API. Album artwork is cached from Apple's public iTunes search catalog. Source links and matched titles/creators are recorded in `lib/table-art.json` and linked from the item's detail view. Missing or uncertain matches use a typographic object; they are not presented as real cover scans.

To refresh missing artwork, run `python3 scripts/fetch-table-art.py`. Existing matches are preserved. This is a build-time maintenance script; visitors do not trigger catalog searches.

`oak-table.png` was generated with the built-in image-generation tool for this prototype. Prompt: Photorealistic warm medium oak library table surface, top-down orthographic, fine horizontal grain, satin matte finish, diffuse daylight, subtle wear; no objects, text, borders, room, or vignette. It is only a background texture; all real jacket images come from the catalogs above.

The current backdrop, `walnut-table.jpg`, is a walnut tabletop photograph from [Kanademono](https://kanademono.design/products/dsk-k30-lft2). It is displayed once, with `cover` sizing, on the stationary viewport rather than the zoomable collection.

The handwriting uses Permanent Marker from Google Fonts, designed by Font Diner (Apache License 2.0). Film posters are cached from the corresponding Wikipedia film reference pages by `scripts/fetch-film-posters.py`; the original image URL, film page, and director are recorded in `lib/table-art.json`. These are actual film posters, not generated substitutes. Bookmark logos come from the linked publications. Some verified book jackets were supplemented with publisher artwork; their individual sources are recorded in the same manifest.

All 33 album sleeves now have matched artwork. `scripts/complete-album-art.py` records the release IDs used to fill catalog search gaps, including standard editions and the M3LL155X EP. The font license is included in `permanent-marker-LICENSE.txt`.

The optional library view uses the same real cover images. Its typographic spines are styled with colors sampled from those jackets (`lib/book-spine-colors.json`), with contrasting title lettering; they are not photographs of the physical spines. Hovering a spine reveals the actual cached front cover.

`book-thief-preferred.png` is the exact domino-cover image supplied by Claire, used in both views. The library's record holder and playlist player reuse the existing album artwork and playlist links; the player opens Spotify and does not simulate audio playback.
