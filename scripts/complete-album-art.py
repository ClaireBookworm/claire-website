"""Retrieve album covers by manually verified Apple Music release IDs.

Direct lookups avoid search omissions and confusion with singles, live records,
anniversary releases, and EP suffixes. Existing covers are preserved.
"""
import concurrent.futures
import json
import pathlib
import subprocess
import unicodedata

ROOT = pathlib.Path(__file__).resolve().parents[1]
RELEASES = {
    'Bleachers': 1712730224,
    'How to Build an Ocean: Instructions': 1725031274,
    'Five Seconds Flat': 1604657567,
    'BRAT': 1739079974,
    'Luv(sic) Hexalogy': 1361503700,
    'Nothing Happens': 1450670646,
    'Love Hate Music Box': 1732562033,
    '22, A Million': 1141107722,
    'Loss of Life': 1711646500,
    'M3LL155X': 1028920695,
    'Citrona': 1370580331,
}

def get(url):
    return subprocess.check_output(['curl', '--fail', '-L', '--max-time', '25', '-s', url])

def norm(text):
    return ''.join(c for c in unicodedata.normalize('NFKD', text).casefold() if c.isalnum())

if __name__ == '__main__':
    albums = json.loads((ROOT / 'lib/recommendations.json').read_text())['albums']
    manifest_path = ROOT / 'lib/table-art.json'
    art = json.loads(manifest_path.read_text())
    response = json.loads(get('https://itunes.apple.com/lookup?id=' + ','.join(map(str, RELEASES.values()))))
    catalog = {item['collectionId']: item for item in response['results']}

    def fetch(task):
        index, album = task
        title = album['title']
        if title not in RELEASES or 'album:' + title in art:
            return None
        record = catalog[RELEASES[title]]
        assert norm(record['artistName']) == norm(album['artist']), title
        assert norm(record['collectionName'].removesuffix(' - EP')) == norm(title), title
        url = record['artworkUrl100'].replace('100x100bb', '600x600bb')
        image = '/table-art/album-' + str(index) + '.jpg'
        raw = get(url)
        assert len(raw) > 1500, title
        (ROOT / 'public' / image.lstrip('/')).write_bytes(raw)
        return 'album:' + title, {
            'image': image, 'imageSource': url, 'source': record['collectionViewUrl'],
            'catalogTitle': record['collectionName'], 'catalogCreator': record['artistName'], 'aspect': 1,
        }

    with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
        results = [r for r in pool.map(fetch, enumerate(albums)) if r]
    art.update(results)
    manifest_path.write_text(json.dumps(art, ensure_ascii=False, indent=2) + '\n')
    print('Added covers:', ', '.join(key for key, _ in results))
