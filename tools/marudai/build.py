#!/usr/bin/env python3
"""Build /marudai/ pages (index + chapters) from en/ar/fr text files."""
import glob, html, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
OUT = ROOT + '/marudai'
BASE = 'https://go.bouhaj.com'
LANGS = ['ar', 'en', 'fr']
COVER = '/assets/marudai-cover.jpg'

ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX','XXI','XXII','XXIII','XXIV','XXV']
PARTS_AT = {1: 'ONE', 4: 'TWO', 8: 'THREE', 11: 'FOUR', 14: 'FIVE'}  # chapter number -> part that starts before it

UI = {  # Arabic source -> en, fr  (served to i18n.js through /i18n/<page>.json)
 'الرواية الكاملة': ('The complete novel', 'Le roman complet'),
 'آخر المتمردين: ماروداي': ('The Last Rebel: Marudai', 'Le Dernier Rebelle : Marudai'),
 'رواية بقلم محمد بوهاج': ('A novel by Mohamed Bouhaj', 'Un roman de Mohamed Bouhaj'),
 'ابدأ القراءة': ('Start reading', 'Commencer la lecture'),
 'فصول الرواية': ('Chapters', 'Chapitres'),
 'الفهرس': ('Contents', 'Sommaire'),
 'الفصل السابق': ('Previous chapter', 'Chapitre précédent'),
 'الفصل التالي': ('Next chapter', 'Chapitre suivant'),
 'العودة إلى الفهرس': ('Back to contents', 'Retour au sommaire'),
 'الرئيسية': ('Home', 'Accueil'),
 'المكتبة الأدبية': ('Literary library', 'Bibliothèque littéraire'),
 'لغة النص الأصلية: الإنجليزية. الترجمة العربية والفرنسية من إعداد الموقع.': ('Original language: English. Arabic and French translations by the site.', 'Langue originale : anglais. Traductions arabe et française réalisées par le site.'),
 'الترجمة إلى هذه اللغة قيد الإعداد؛ يُعرض النص الأصلي بالإنجليزية.': ('This translation is in progress; the original English text is shown.', 'La traduction dans cette langue est en cours ; le texte original anglais est affiché.'),
 '© 2024 محمد بوهاج · جميع الحقوق محفوظة': ('© 2024 Mohamed Bouhaj · All rights reserved', '© 2024 Mohamed Bouhaj · Tous droits réservés'),
 'غلاف رواية آخر المتمردين: ماروداي': ('Cover of The Last Rebel: Marudai', 'Couverture du Dernier Rebelle : Marudai'),
 'دقيقة قراءة': ('min read', 'min de lecture'),
 'الجزء': ('Part', 'Partie'),
 'الفصل': ('Chapter', 'Chapitre'),
 'الملحق': ('Appendix', 'Annexe'),
 'الخاتمة': ('Epilogue', 'Épilogue'),
 'صفحة المؤلف على Amazon': ('Author page on Amazon', 'Page auteur sur Amazon'),
}

def read(lang, slug):
    p = f'{HERE}/{lang}/{slug}.txt'
    return open(p, encoding='utf-8').read().strip() if os.path.exists(p) else None

def paras(text):
    return [p.strip() for p in re.split(r'\n\s*\n', text) if p.strip()]

QUOTE = ('"', '“', '«', '‘', "'")

def render(text, skip_title=True):
    ps = paras(text)
    if skip_title: ps = ps[1:]
    out = []
    for p in ps:
        e = html.escape(p)
        if p == '✦': out.append('<p class="mr-orn" aria-hidden="true">✦</p>')
        elif p.startswith('## '): out.append(f'<h2>{html.escape(p[3:])}</h2>')
        elif len(p) < 70 and not p.startswith(QUOTE) and not p.startswith(('— ','- ')) and not p.rstrip().endswith(('.', '!', '?', ':', '؟', '!', '…', '»', '”', '"', '،', ',', ';')): out.append(f'<h2>{e}</h2>')
        elif p.startswith(('— ', '- ')) and len(p) < 160: out.append(f'<p class="mr-cite">{e}</p>')
        elif p.startswith(QUOTE) and len(p) < 420 and p.rstrip().endswith(('"', '”', '»', '’', "'", '."', '.”')): out.append(f'<blockquote>{e}</blockquote>')
        else: out.append(f'<p>{e}</p>')
    return '\n'.join(out)

def words(text): return len(re.findall(r'\w+', text))

def sections():
    files = sorted(glob.glob(f'{HERE}/en/[0-9][0-9]-*.txt'))
    secs = []
    for f in files:
        slug = os.path.basename(f)[:-4]
        if slug.startswith('00-'): continue
        n = int(slug[:2])
        kind = 'chapter' if 'chapter' in slug else slug.split('-', 1)[1]
        url = f'chapter-{n}' if kind == 'chapter' else kind
        secs.append(dict(slug=slug, n=n, kind=kind, url=url))
    return secs

def label(s, lang):
    if s['kind'] == 'chapter':
        return {'ar': f'الفصل {s["n"]}', 'en': f'Chapter {ROMAN[s["n"]-1]}', 'fr': f'Chapitre {ROMAN[s["n"]-1]}'}[lang]
    return {'appendix': {'ar': 'الملحق', 'en': 'Appendix', 'fr': 'Annexe'},
            'epilogue': {'ar': 'الخاتمة', 'en': 'Epilogue', 'fr': 'Épilogue'}}[s['kind']][lang]

def title(s, lang):
    t = read(lang, s['slug']) or read('en', s['slug'])
    return paras(t)[0]

def head(page_title, desc, url, img):
    return f'''<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{html.escape(page_title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{BASE}{url}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="book"><meta property="og:site_name" content="BOUHAJ TECH"><meta property="og:title" content="{html.escape(page_title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:url" content="{BASE}{url}"><meta property="og:image" content="{BASE}{img}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{BASE}{img}">
<meta name="author" content="Mohamed Bouhaj">
<meta name="theme-color" content="#0a101c">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Amiri:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/site.css?v=3">
<link rel="stylesheet" href="/assets/marudai.css?v=1">
<script src="/assets/site.js?v=1" defer></script>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5006130101466731" crossorigin="anonymous"></script>
</head>
<body class="mr-page">
<div class="wrap">
<header class="top"><a class="brand" href="/">BOUHAJ TECH</a><a href="/#literary-shelf">المكتبة الأدبية</a><a href="/marudai/">الفهرس</a></header>
'''

LANG_JS = '''<script>
(()=>{const L=['ar','en','fr'];
function show(l){if(!L.includes(l))l='ar';let any=false;
document.querySelectorAll('.mr-text').forEach(a=>{a.hidden=a.lang!==l;if(!a.hidden)any=true});
const fb=document.querySelector('.mr-text[lang=en]'),note=document.querySelector('.mr-fallback');
if(!any&&fb){fb.hidden=false;if(note)note.hidden=false}else if(note)note.hidden=true;}
let l='ar';try{l=localStorage.getItem('lang')||'ar'}catch(e){}
show(l);document.addEventListener('site:lang',e=>show(e.detail));})();
</script>
'''

FOOT = '''<footer class="mr-foot"><p>© 2024 محمد بوهاج · جميع الحقوق محفوظة</p><p><a href="https://www.amazon.com/author/bouhaj" target="_blank" rel="noopener noreferrer">صفحة المؤلف على Amazon</a></p></footer>
</div>
''' + LANG_JS + '''<script src="/i18n.js?v=7" defer></script>
</body>
</html>
'''

def i18n_rows(extra):
    rows = [[k, v[0], v[1]] for k, v in UI.items()] + extra
    seen, out = set(), []
    for r in rows:
        if r[0] not in seen: seen.add(r[0]); out.append(r)
    return out

def write_i18n(key, rows):
    json.dump(rows, open(f'{ROOT}/i18n/{key}.json', 'w', encoding='utf-8'), ensure_ascii=False, separators=(',', ':'))

def main():
    secs = sections()
    parts = json.load(open(f'{HERE}/parts.json', encoding='utf-8'))
    os.makedirs(OUT, exist_ok=True)
    extra = [['آخر المتمردين: ماروداي | محمد بوهاج', 'The Last Rebel: Marudai | Mohamed Bouhaj', 'Le Dernier Rebelle : Marudai | Mohamed Bouhaj']]
    for p in parts.values(): extra.append([p['title']['ar'], p['title']['en'], p['title']['fr']])
    # ---------- chapter pages
    for i, s in enumerate(secs):
        en = read('en', s['slug']); mins = max(1, round(words(en) / 220))
        prev, nxt = (secs[i-1] if i else None), (secs[i+1] if i+1 < len(secs) else None)
        t_ar = title(s, 'ar'); lab_ar = label(s, 'ar')
        page_title = f'{lab_ar}: {t_ar} | آخر المتمردين: ماروداي'
        rows = list(extra) + [[t_ar, title(s, 'en'), title(s, 'fr')], [lab_ar, label(s, 'en'), label(s, 'fr')],
                [page_title, f'{label(s,"en")}: {title(s,"en")} | The Last Rebel: Marudai', f'{label(s,"fr")} : {title(s,"fr")} | Le Dernier Rebelle : Marudai'],
                [f'{mins} دقيقة قراءة', f'{mins} min read', f'{mins} min de lecture']]
        part_html = ''
        for pk, p in parts.items():
            if p['before_chapter'] == s['n'] and s['kind'] == 'chapter':
                part_html = f'<div class="mr-part"><span>{html.escape(p["label"]["ar"])}</span><strong>{html.escape(p["title"]["ar"])}</strong></div>'
                rows.append([p['label']['ar'], p['label']['en'], p['label']['fr']])
        arts = []
        for lg in LANGS:
            txt = read(lg, s['slug'])
            if txt is None: continue
            arts.append(f'<article class="mr-text" lang="{lg}" dir="{"rtl" if lg=="ar" else "ltr"}" data-no-i18n{" hidden" if lg!="ar" else ""}>\n<h1>{html.escape(paras(txt)[0])}</h1>\n{render(txt)}\n</article>')
        nav = '<nav class="mr-nav" aria-label="التنقل بين الفصول">'
        nav += f'<a class="mr-prev" href="/marudai/{prev["url"]}/"><small>الفصل السابق</small><span>{html.escape(title(prev,"ar"))}</span></a>' if prev else '<span></span>'
        nav += f'<a class="mr-next" href="/marudai/{nxt["url"]}/"><small>الفصل التالي</small><span>{html.escape(title(nxt,"ar"))}</span></a>' if nxt else '<a class="mr-next" href="/marudai/"><small>العودة إلى الفهرس</small><span>آخر المتمردين: ماروداي</span></a>'
        nav += '</nav>'
        if prev: rows.append([title(prev,'ar'), title(prev,'en'), title(prev,'fr')])
        if nxt: rows.append([title(nxt,'ar'), title(nxt,'en'), title(nxt,'fr')])
        body = f'''<main class="mr-main">
{part_html}
<div class="mr-kicker"><a href="/marudai/">آخر المتمردين: ماروداي</a><span>·</span><span>{lab_ar}</span><span>·</span><span>{mins} دقيقة قراءة</span></div>
<p class="mr-fallback" hidden>الترجمة إلى هذه اللغة قيد الإعداد؛ يُعرض النص الأصلي بالإنجليزية.</p>
{chr(10).join(arts)}
{nav}
</main>
'''
        desc = paras(read('ar', s['slug']) or en)[1][:155] if len(paras(read('ar', s['slug']) or en)) > 1 else t_ar
        d = f'{OUT}/{s["url"]}'; os.makedirs(d, exist_ok=True)
        open(f'{d}/index.html', 'w', encoding='utf-8').write(head(page_title, desc, f'/marudai/{s["url"]}/', COVER) + body + FOOT)
        write_i18n(f'marudai--{s["url"]}', i18n_rows(rows))
    # ---------- index page
    toc = []
    rows = list(extra)
    for s in secs:
        for pk, p in parts.items():
            if p['before_chapter'] == s['n'] and s['kind'] == 'chapter':
                toc.append(f'<li class="mr-toc-part"><span>{html.escape(p["label"]["ar"])}</span>{html.escape(p["title"]["ar"])}</li>')
                rows.append([p['label']['ar'], p['label']['en'], p['label']['fr']])
        toc.append(f'<li><a href="/marudai/{s["url"]}/"><span class="mr-num">{label(s,"ar")}</span><span>{html.escape(title(s,"ar"))}</span></a></li>')
        rows += [[label(s,'ar'), label(s,'en'), label(s,'fr')], [title(s,'ar'), title(s,'en'), title(s,'fr')]]
    fronts = []
    for lg in LANGS:
        txt = read(lg, '00-front')
        fronts.append(f'<section class="mr-text mr-front" lang="{lg}" dir="{"rtl" if lg=="ar" else "ltr"}" data-no-i18n{" hidden" if lg!="ar" else ""}>\n<h2>{html.escape(paras(txt)[0])}</h2>\n{render(txt)}\n</section>')
    first = secs[0]['url']
    total_words = sum(words(read('en', s['slug'])) for s in secs)
    hours = round(total_words / 220 / 60, 1)
    body = f'''<main class="mr-main mr-index">
<section class="mr-hero">
<img class="mr-cover" src="{COVER}" alt="غلاف رواية آخر المتمردين: ماروداي" width="600" height="900" fetchpriority="high">
<div>
<span class="mr-eyebrow">الرواية الكاملة</span>
<h1>آخر المتمردين: ماروداي</h1>
<p class="mr-by">رواية بقلم محمد بوهاج</p>
<p class="mr-stats"><span>{len([s for s in secs if s["kind"]=="chapter"])} فصلاً</span><span>·</span><span>5 أجزاء</span><span>·</span><span>{hours} ساعات قراءة</span></p>
<div class="mr-actions"><a class="ds-btn ds-btn-primary" href="/marudai/{first}/">ابدأ القراءة</a><a class="ds-btn ds-btn-ghost" href="#toc">فصول الرواية</a></div>
<p class="mr-note">لغة النص الأصلية: الإنجليزية. الترجمة العربية والفرنسية من إعداد الموقع.</p>
</div>
</section>
{chr(10).join(fronts)}
<section class="mr-toc" id="toc"><h2>فصول الرواية</h2><ol>{"".join(toc)}</ol></section>
</main>
'''
    nchap = len([s for s in secs if s['kind'] == 'chapter'])
    rows += [[f'{nchap} فصلاً', f'{nchap} chapters', f'{nchap} chapitres'], ['5 أجزاء', '5 parts', '5 parties'],
             [f'{hours} ساعات قراءة', f'{hours} hours of reading', f'{hours} heures de lecture'], ['فصول الرواية', 'Chapters', 'Chapitres'], ['التنقل بين الفصول', 'Chapter navigation', 'Navigation entre les chapitres']]
    desc = 'رواية «آخر المتمردين: ماروداي» لمحمد بوهاج كاملة بالعربية والإنجليزية والفرنسية: رحلة في الوعي والتمرد والعوالم الخفية.'
    rows.append([desc, 'The complete novel “The Last Rebel: Marudai” by Mohamed Bouhaj in Arabic, English and French: a journey through consciousness, rebellion and hidden worlds.', 'Le roman complet « Le Dernier Rebelle : Marudai » de Mohamed Bouhaj en arabe, anglais et français : un voyage à travers la conscience, la rébellion et les mondes cachés.'])
    open(f'{OUT}/index.html', 'w', encoding='utf-8').write(head('آخر المتمردين: ماروداي | محمد بوهاج', desc, '/marudai/', COVER) + body + FOOT)
    write_i18n('marudai', i18n_rows(rows))
    done = {lg: len([s for s in secs if read(lg, s['slug'])]) for lg in LANGS}
    print('built', len(secs), 'sections; translated:', done)

if __name__ == '__main__':
    main()
