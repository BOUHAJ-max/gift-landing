#!/usr/bin/env python3
"""Build reader/library.json: the books and chapters the reader app can open."""
import json, os, re, html
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))

def i18n_key(url):
    k = re.sub(r'^/+|/+$', '', url); return k.replace('/', '--') or 'home'

def dict_for(url):
    p = f'{ROOT}/i18n/{i18n_key(url)}.json'
    return {r[0]: r for r in json.load(open(p, encoding='utf-8'))} if os.path.exists(p) else {}

def h1(url):
    s = open(f'{ROOT}{url}index.html', encoding='utf-8').read()
    m = re.search(r'<h1[^>]*>(.*?)</h1>', s, re.S)
    return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', '', m.group(1)))).strip()

def tr(text, d):
    r = d.get(text); return {'ar': text, 'en': r[1] if r else text, 'fr': r[2] if r else text}

def page_title(url):
    s = open(f'{ROOT}{url}index.html', encoding='utf-8').read()
    return html.unescape(re.search(r'<title>(.*?)</title>', s, re.S).group(1)).strip()

def page_book(urls):
    out = []
    for u in urls:
        full = page_title(u); t = tr(full, dict_for(u))
        t = {k: re.split(r'\s+\|\s+', v)[0].strip() for k, v in t.items()}
        out.append({'url': u, 'title': t, 'i18n': i18n_key(u)})
    return out

titles = json.load(open(f'{ROOT}/tools/marudai/titles.json', encoding='utf-8'))
mar_pub = [k for k in titles if all(os.path.exists(f'{ROOT}/tools/marudai/{lg}/{k}.txt') for lg in ('ar', 'en', 'fr'))]
marudai = [{'url': f'/marudai/chapter-{int(k[:2])}/', 'title': titles[k], 'marudai': True} for k in mar_pub]

library = {'version': 1, 'books': [
 {'id': 'marudai', 'cover': '/assets/marudai-cover-v2.jpg', 'accent': '#b06cff',
  'title': {'ar': 'آخر المتمردين: ماروداي', 'en': 'The Last Rebel: Marudai', 'fr': 'Le Dernier Rebelle : Marudai'},
  'desc': {'ar': 'رواية عن الوعي والتمرد والعوالم الخفية.', 'en': 'A novel of consciousness, rebellion and hidden worlds.', 'fr': 'Un roman sur la conscience, la rébellion et les mondes cachés.'},
  'more': 'https://www.amazon.com/author/bouhaj', 'chapters': marudai},
 {'id': 'rebellious', 'cover': '/assets/rebellious-novel-cover-v2.jpg', 'accent': '#58baff',
  'title': {'ar': 'الرواية المتمردة', 'en': 'The Rebellious Novel', 'fr': 'Le Roman rebelle'},
  'desc': {'ar': 'تنين يفتح أبواب الخيال والتمرد وأسئلة الهوية.', 'en': 'A dragon that opens the gates of imagination, rebellion and identity.', 'fr': 'Un dragon qui ouvre les portes de l’imaginaire, de la rébellion et de l’identité.'},
  'chapters': page_book(['/rebellious-novel/identity-flexible-part-1/', '/rebellious-novel/identity-flexible-part-2/', '/rebellious-novel/identity-flexible-part-3/', '/rebellious-novel/identity-flexible-part-4/', '/rebellious-novel/maroudai-zumaria-manifesto/', '/rebellious-novel/mirror-sciences-tailor/', '/rebellious-novel/ghabira-memory/'])},
 {'id': 'wadi', 'cover': '/assets/wadi-al-aql-cover.jpg', 'accent': '#e5bd79',
  'title': {'ar': 'رواية وادي العقل', 'en': 'Wadi Al-Aql', 'fr': 'Wadi Al-Aql'},
  'desc': {'ar': 'أسد يحرس بوابة الصحراء؛ حيث تتواجه الحكمة والتناقض.', 'en': 'A lion guards the desert gate, where wisdom meets contradiction.', 'fr': 'Un lion garde la porte du désert, là où la sagesse affronte la contradiction.'},
  'chapters': page_book(['/wadi-al-aql/one-day/', '/wadi-al-aql/al-qadar-al-mahtum/', '/wadi-al-aql/ashbah-al-wafaa/', '/wadi-al-aql/hadatha-dhata-laylah/'])},
]}
json.dump(library, open(f'{ROOT}/reader/library.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print({b['id']: len(b['chapters']) for b in library['books']})
