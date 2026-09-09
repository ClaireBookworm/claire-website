"""Fetch linked sites' own icons and exact album matches; retain source metadata."""
import json,pathlib,subprocess,urllib.parse,html.parser,concurrent.futures,time
ROOT=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((ROOT/'lib/recommendations.json').read_text())
art=json.loads((ROOT/'lib/table-art.json').read_text())
def fetch(url):
 return subprocess.check_output(['curl','--fail','-L','--max-time','18','-s',url])
class Icons(html.parser.HTMLParser):
 def __init__(self): super().__init__(); self.icons=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='link' and 'icon' in a.get('rel','') and a.get('href'):
   self.icons.append((2 if 'apple-touch' in a.get('rel','') else 1,a['href']))
def blog(task):
 i,b=task
 if not b.get('link'): return None
 try:
  parser=Icons();parser.feed(fetch(b['link']).decode('utf8','replace'))
  choices=sorted(parser.icons,reverse=True)
  choices.append((0,'/favicon.ico'))
  for _,href in choices[:4]:
   try:
    url=urllib.parse.urljoin(b['link'],href); raw=fetch(url)
    if len(raw)<100 or b'<html' in raw[:200].lower(): continue
    suffix='.svg' if b'<svg' in raw[:1000] else '.png' if raw[:4]==b'\x89PNG' else '.ico' if raw[:4]==b'\x00\x00\x01\x00' else '.jpg'
    name=f'blog-{i}{suffix}';(ROOT/'public/table-art'/name).write_bytes(raw)
    return 'blog:'+b['name'],{'logo':'/table-art/'+name,'source':b['link'],'logoSource':url,'catalogTitle':b['name']}
   except Exception: continue
 except Exception: pass
 return None
norm=lambda s: ''.join(c for c in s.casefold() if c.isalnum())
def album(task):
 i,a=task
 key='album:'+a['title']
 # Refresh only missing albums or a mismatched release (e.g. live vs studio).
 if key in art and norm(art[key]['catalogTitle'])==norm(a['title']): return None
 try:
  url='https://itunes.apple.com/search?'+urllib.parse.urlencode({'term':a['title']+' '+a['artist'],'entity':'album','limit':25})
  docs=json.loads(fetch(url)).get('results',[])
  matches=[d for d in docs if norm(d.get('artistName',''))==norm(a['artist']) and norm(d.get('collectionName',''))==norm(a['title'])]
  if not matches: return None
  m=matches[0];raw=fetch(m['artworkUrl100'].replace('100x100bb','600x600bb'));name=f'album-{i}.jpg';(ROOT/'public/table-art'/name).write_bytes(raw)
  return key,{'image':'/table-art/'+name,'source':m['collectionViewUrl'],'catalogTitle':m['collectionName'],'catalogCreator':m['artistName']}
 except Exception: return None
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 results=list(pool.map(blog,enumerate(data['blogs'])))+list(pool.map(album,enumerate(data['albums'])))
for result in results:
 if result: art[result[0]]=result[1]
(ROOT/'lib/table-art.json').write_text(json.dumps(art,ensure_ascii=False,indent=2)+'\n')
print('Updated:',[r[0] for r in results if r])
