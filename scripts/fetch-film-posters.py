"""Cache theatrical posters from the corresponding film's reference page."""
import json,pathlib,subprocess,urllib.parse,concurrent.futures
ROOT=pathlib.Path(__file__).resolve().parents[1]
films=json.loads((ROOT/'lib/recommendations.json').read_text())['films']
pages=['Everything_Everywhere_All_at_Once','A_Silent_Voice_(film)','Spider-Man:_Across_the_Spider-Verse','The_Dark_Knight','Synecdoche,_New_York','Stalker_(1979_film)','Kinds_of_Kindness','Challengers_(film)','Paprika_(2006_film)','The_Secret_Life_of_Walter_Mitty_(2013_film)','Resurrection_(2025_film)','Sinners_(2025_film)','Flow_(2024_film)','Weathering_with_You','Coco_(2017_film)']
def get(url): return subprocess.check_output(['curl','--fail','-L','--max-time','25','-s',url])
def fetch(task):
 i,page=task
 current=json.loads((ROOT/'lib/table-art.json').read_text()).get('film:'+films[i]['title'])
 if current and (ROOT/'public'/current['image'].lstrip('/')).exists(): return 'film:'+films[i]['title'],current
 try:
  m=json.loads(get('https://en.wikipedia.org/api/rest_v1/page/summary/'+urllib.parse.quote(page)))
  url=m.get('originalimage',m.get('thumbnail',{})).get('source')
  if not url: return None
  filename=f'film-{i}.jpg';raw=get(url);(ROOT/'public/table-art'/filename).write_bytes(raw)
  return 'film:'+films[i]['title'],{'image':'/table-art/'+filename,'imageSource':url,'source':m['content_urls']['desktop']['page'],'catalogTitle':m['title'],'catalogCreator':[films[i]['director']], 'description':m.get('description','')}
 except Exception as e: print('Poster unavailable:',page,str(e));return None
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool: found=dict(r for r in pool.map(fetch,enumerate(pages)) if r)
p=ROOT/'lib/table-art.json';art=json.loads(p.read_text());art.update(found);p.write_text(json.dumps(art,ensure_ascii=False,indent=2)+'\n');print('Posters:',list(found))
