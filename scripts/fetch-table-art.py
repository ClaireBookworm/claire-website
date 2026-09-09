"""Cache public catalog artwork; keep matching metadata for review and attribution."""
import json, pathlib, urllib.request, urllib.parse, time, re, unicodedata, concurrent.futures, subprocess
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'lib/recommendations.json').read_text())
manifest_path=ROOT/'lib/table-art.json'
manifest=json.loads(manifest_path.read_text()) if manifest_path.exists() else {}
def save_manifest():
    temporary = manifest_path.with_suffix('.tmp')
    temporary.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    temporary.replace(manifest_path)
def norm(s):
    return re.sub(r'[^a-z0-9]', '', unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower())
def get(url):
    return subprocess.check_output(['curl','--fail','-L','--max-time','20','-s',url])

def fetch(task):
    kind,index,item=task; title=item['title']; by=item.get('author',item.get('artist',item.get('director',''))); key=kind+':'+title
    if key in manifest: return key,manifest[key]
    try:
        if kind=='book':
            url='https://openlibrary.org/search.json?'+urllib.parse.urlencode({'q':title+' '+by,'limit':5,'fields':'key,title,author_name,cover_i'})
            docs=json.loads(get(url)).get('docs',[])
            matches=[d for d in docs if d.get('cover_i') and norm(title)==norm(d['title']) and any(norm(by.split()[-1]) in norm(a) for a in d.get('author_name',[]))]
            if not matches: return key,None
            match=matches[0]; image='https://covers.openlibrary.org/b/id/'+str(match['cover_i'])+'-L.jpg?default=false'; source='https://openlibrary.org'+match['key']
        else:
            url='https://itunes.apple.com/search?'+urllib.parse.urlencode({'term':title+' '+by,'entity':'album','limit':5})
            docs=json.loads(get(url)).get('results',[])
            matches=[d for d in docs if norm(d.get('artistName',''))==norm(by) and norm(title) == norm(d.get('collectionName',''))]
            if not matches: return key,None
            match=matches[0]; image=match['artworkUrl100'].replace('100x100bb','600x600bb'); source=match['collectionViewUrl']
        raw=get(image)
        if len(raw)<1500: return key,None
        filename=f'{kind}-{index}.jpg'; (ROOT/'public/table-art'/filename).write_bytes(raw)
        return key,{'image':'/table-art/'+filename,'source':source,'catalogTitle':match.get('title',match.get('collectionName')), 'catalogCreator':match.get('author_name',match.get('artistName'))}
    except Exception as e: return key,None
books=sorted(enumerate(data['books']),key=lambda x:not x[1].get('fave'))
albums=sorted(enumerate(data['albums']),key=lambda x:not x[1].get('fave'))
tasks=[]
for i in range(max(len(books),len(albums))):
    if i<len(books): tasks.append(('book',*books[i]))
    if i<len(albums): tasks.append(('album',*albums[i]))
# Two workers, staggered submissions to keep public catalog requests modest.
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
    pending=[]
    for task in tasks:
        pending.append(pool.submit(fetch,task)); time.sleep(1)
        for future in list(pending):
            if future.done():
                key,result=future.result()
                if result: manifest[key]=result
                pending.remove(future)
                save_manifest()
    for future in concurrent.futures.as_completed(pending):
        key,result=future.result()
        if result: manifest[key]=result
        save_manifest()
print(f'Cached {len(manifest)} matched covers out of {len(tasks)} items; unmatched items use typographic jackets.')
