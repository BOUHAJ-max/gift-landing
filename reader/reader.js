/* Bouhaj Reader — reading app for Mohamed Bouhaj's novels (beta) */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#app'), root=document.documentElement;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------------- SVG icons (no emoji anywhere) ---------------- */
const P={
 back:'<path d="M9 6l6 6-6 6"/>', fwd:'<path d="M15 6l-6 6 6 6"/>',
 aa:'<path d="M3 19l5-13 5 13M5 14h6M14 19l3.5-8 3.5 8M15.2 16.5h4.6"/>',
 sound:'<path d="M4 10v4h4l5 4V6L8 10H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/>',
 full:'<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
 list:'<path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01"/>',
 close:'<path d="M6 6l12 12M18 6L6 18"/>',
 play:'<path d="M8 5v14l11-7z" fill="currentColor"/>', pause:'<path d="M7 5h3v14H7zM14 5h3v14h-3z" fill="currentColor"/>',
 prevP:'<path d="M19 6v12l-8-6zM5 6v12" fill="currentColor"/>', nextP:'<path d="M5 6v12l8-6zM19 6v12" fill="currentColor"/>',
 candle:'<path d="M12 3c-1.6 2.2-2.6 3.5-2.6 5a2.6 2.6 0 0 0 5.2 0c0-1.5-1-2.8-2.6-5z"/><path d="M9.5 12h5v9h-5z"/>',
 paper:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v3h3M9 11h6M9 15h6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
 eye:'<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
 day:'<circle cx="12" cy="12" r="5"/>',
 bright:'<circle cx="12" cy="12" r="3.5"/><path d="M12 3v1.5M12 19.5V21M3 12h1.5M19.5 12H21M5.6 5.6l1 1M17.4 17.4l1 1M5.6 18.4l1-1M17.4 6.6l1-1"/>',
 voice:'<path d="M12 3a3 3 0 0 0-3 3v6a3 3 0 0 0 6 0V6a3 3 0 0 0-3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 scroll:'<path d="M7 4h10M7 20h10M12 7v10M9 14l3 3 3-3"/>', pages:'<path d="M3 5h8v14H3zM13 5h8v14h-8z"/>',
 download:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', home:'<path d="M4 11l8-7 8 7v9H4z"/>',
 clock:'<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>', check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 female:'<circle cx="12" cy="9" r="5"/><path d="M12 14v7M9 18h6"/>', male:'<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>',
 ext:'<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>',
 share:'<path d="M12 3v12M8 7l4-4 4 4M5 12v8h14v-8"/>', plus:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>', dots:'<circle cx="12" cy="5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/>'
};
const I=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;

/* ---------------- interface text ---------------- */
const T={
 ar:{app:'Bouhaj Reader',beta:'نسخة تجريبية',heroT:'اقرأ كما تحب أن تقرأ',heroP:'روايات محمد بوهاج في قارئ مصمَّم للقراءة الطويلة، بأوضاع تريح عينيك في الليل وتحت الشمس.',f1:'ضوء الشمعة',f2:'راحة العين',f3:'ضوء الشمس',f4:'ورق كريمي',f5:'صوتان: أنثى وذكر',f6:'وضع الصفحات',cont:'تابع القراءة',novels:'الروايات',chapters:'فصول',chapter:'الفصل',start:'ابدأ القراءة',resume:'تابع من حيث توقفت',more:'بقية الفصول على Amazon',install:'ثبّت التطبيق',site:'الموقع الرئيسي',back:'رجوع',settings:'إعدادات القراءة',theme:'وضع القراءة',night:'ليلي',cream:'ورق كريمي',day:'نهاري',candle:'شمعة',comfort:'راحة العين',sunlight:'ضوء الشمس',brightness:'الإضاءة',warmth:'دفء الضوء',size:'حجم الخط',font:'الخط',spacing:'تباعد الأسطر',lang:'لغة النص',justify:'ضبط الأسطر',wake:'إبقاء الشاشة مضاءة',flame:'حركة لهب الشمعة',layout:'طريقة القراءة',scrollM:'تمرير',pagesM:'صفحات',fullscreen:'ملء الشاشة',exitfs:'الخروج من ملء الشاشة',listen:'القراءة الصوتية',voice:'الصوت',female:'أنثى',male:'ذكر',speed:'السرعة',next:'الفصل التالي',prev:'الفصل السابق',toBook:'فهرس الرواية',contents:'الفهرس',loading:'جارٍ تحميل الفصل…',err:'تعذّر تحميل الفصل. تحقق من الاتصال ثم حاول مجدداً.',retry:'إعادة المحاولة',noVoice:'لا يتوفر صوت لهذه اللغة على جهازك. ثبّت الأصوات من إعدادات «تحويل النص إلى كلام» في هاتفك.',sameVoice:'جهازك يوفر صوتاً واحداً لهذه اللغة؛ نغيّر طبقته لتمييز الصوتين.',neural:'صوت عالي الجودة',device:'صوت الجهاز',noTTS:'القراءة الصوتية غير مدعومة في هذا المتصفح.',noFS:'ملء الشاشة غير مدعوم هنا. أضف التطبيق إلى الشاشة الرئيسية ليفتح بملء الشاشة.',noWake:'إبقاء الشاشة مضاءة غير مدعوم في هذا المتصفح.',reading:'يقرأ',paused:'متوقف',done:'انتهى الفصل',of:'من',end:'نهاية الفصل',left:'متبقٍ',minutes:'دقيقة',page:'صفحة',hint:'اضغط على أطراف الصفحة أو اسحب للتقليب'},
 en:{app:'Bouhaj Reader',beta:'Beta',heroT:'Read the way you love to read',heroP:'Mohamed Bouhaj’s novels in a reader built for long reading, with modes that rest your eyes at night and in bright sunlight.',f1:'Candlelight',f2:'Eye comfort',f3:'Sunlight',f4:'Cream paper',f5:'Two voices: female & male',f6:'Page mode',cont:'Continue reading',novels:'Novels',chapters:'chapters',chapter:'Chapter',start:'Start reading',resume:'Resume where you left off',more:'More chapters on Amazon',install:'Install the app',site:'Main website',back:'Back',settings:'Reading settings',theme:'Reading mode',night:'Night',cream:'Cream paper',day:'Day',candle:'Candle',comfort:'Eye comfort',sunlight:'Sunlight',brightness:'Brightness',warmth:'Warmth',size:'Text size',font:'Font',spacing:'Line spacing',lang:'Text language',justify:'Justify',wake:'Keep screen on',flame:'Candle flame motion',layout:'Reading layout',scrollM:'Scroll',pagesM:'Pages',fullscreen:'Full screen',exitfs:'Exit full screen',listen:'Read aloud',voice:'Voice',female:'Female',male:'Male',speed:'Speed',next:'Next chapter',prev:'Previous chapter',toBook:'Book contents',contents:'Contents',loading:'Loading chapter…',err:'Couldn’t load the chapter. Check your connection and try again.',retry:'Try again',noVoice:'No voice is available for this language on your device. Add voices in your phone’s text-to-speech settings.',sameVoice:'Your device has one voice for this language; we change its pitch to tell the two voices apart.',neural:'High-quality voice',device:'Device voice',noTTS:'Read-aloud isn’t supported in this browser.',noFS:'Full screen isn’t supported here. Add the app to your home screen to open it full screen.',noWake:'Keeping the screen on isn’t supported in this browser.',reading:'Reading',paused:'Paused',done:'Chapter finished',of:'of',end:'End of chapter',left:'left',minutes:'min',page:'Page',hint:'Tap the page edges or swipe to turn pages'},
 fr:{app:'Bouhaj Reader',beta:'Bêta',heroT:'Lisez comme vous aimez lire',heroP:'Les romans de Mohamed Bouhaj dans une liseuse pensée pour la lecture longue, avec des modes qui reposent les yeux la nuit et en plein soleil.',f1:'Lumière de bougie',f2:'Confort des yeux',f3:'Plein soleil',f4:'Papier crème',f5:'Deux voix : féminine et masculine',f6:'Mode pages',cont:'Reprendre la lecture',novels:'Romans',chapters:'chapitres',chapter:'Chapitre',start:'Commencer la lecture',resume:'Reprendre là où vous étiez',more:'Suite des chapitres sur Amazon',install:'Installer l’application',site:'Site principal',back:'Retour',settings:'Réglages de lecture',theme:'Mode de lecture',night:'Nuit',cream:'Papier crème',day:'Jour',candle:'Bougie',comfort:'Confort des yeux',sunlight:'Plein soleil',brightness:'Luminosité',warmth:'Chaleur',size:'Taille du texte',font:'Police',spacing:'Interligne',lang:'Langue du texte',justify:'Justifier',wake:'Garder l’écran allumé',flame:'Mouvement de la flamme',layout:'Mode de lecture',scrollM:'Défilement',pagesM:'Pages',fullscreen:'Plein écran',exitfs:'Quitter le plein écran',listen:'Lecture à voix haute',voice:'Voix',female:'Féminine',male:'Masculine',speed:'Vitesse',next:'Chapitre suivant',prev:'Chapitre précédent',toBook:'Sommaire du roman',contents:'Sommaire',loading:'Chargement du chapitre…',err:'Impossible de charger le chapitre. Vérifiez la connexion et réessayez.',retry:'Réessayer',noVoice:'Aucune voix n’est disponible pour cette langue sur votre appareil. Ajoutez des voix dans les réglages de synthèse vocale.',sameVoice:'Votre appareil n’a qu’une voix pour cette langue ; nous changeons sa hauteur pour distinguer les deux voix.',neural:'Voix haute qualité',device:'Voix de l’appareil',noTTS:'La lecture à voix haute n’est pas prise en charge par ce navigateur.',noFS:'Le plein écran n’est pas pris en charge ici. Ajoutez l’application à l’écran d’accueil pour l’ouvrir en plein écran.',noWake:'Ce navigateur ne permet pas de garder l’écran allumé.',reading:'Lecture',paused:'En pause',done:'Chapitre terminé',of:'sur',end:'Fin du chapitre',left:'restantes',minutes:'min',page:'Page',hint:'Touchez les bords ou balayez pour tourner les pages'}
};

/* ---------------- settings ---------------- */
const DEF={theme:'night',bright:100,warm:0,size:21,font:'amiri',lh:'2',justify:false,wake:false,rate:1,voice:'female',layout:'scroll',flame:true};
let S=Object.assign({},DEF,store.get('rd:settings',{}));
if(!['night','cream','day','candle','comfort','sunlight'].includes(S.theme))S.theme='night';
let L=(()=>{try{return localStorage.getItem('lang')||'ar'}catch(e){return 'ar'}})(); if(!T[L])L='ar';
const t=k=>T[L][k]||T.ar[k]||k;
const save=()=>store.set('rd:settings',S);
let CFG={ttsEndpoint:''};
fetch('/reader/config.json?v=1').then(r=>r.ok?r.json():{}).then(c=>{CFG=Object.assign(CFG,c)}).catch(()=>{});

function applySettings(){
  root.dataset.theme=S.theme; root.dataset.font=S.font; root.dataset.justify=S.justify?'on':'off'; root.dataset.flame=S.flame?'on':'off'; root.dataset.layout=S.layout;
  root.style.setProperty('--size',S.size+'px'); root.style.setProperty('--lh',S.lh);
  const warmBase={candle:55,comfort:35}[S.theme]||0, warm=Math.max(S.warm,warmBase);
  const bright=S.theme==='sunlight'?100:S.bright;
  $('.fx-dim').style.opacity=((100-bright)/100*0.85).toFixed(3);
  $('.fx-warm').style.opacity=(S.theme==='sunlight'?0:warm/100*0.32).toFixed(3);
  $('#bright').value=S.bright; $('#brightOut').textContent=S.bright+'%';
  $('#warm').value=S.warm; $('#warmOut').textContent=S.warm+'%';
  $('#fontOut').textContent=S.size;
  const on=(sel,attr,val)=>$$(sel).forEach(b=>b.classList.toggle('on',b.dataset[attr]===String(val)));
  on('#themes button','theme',S.theme); on('#fonts button','font',S.font); on('#spacing button','lh',S.lh); on('#langs button','lang',L);
  on('#rates button','rate',S.rate); on('#voices button','voice',S.voice); on('#layouts button','layout',S.layout);
  $('#justify').classList.toggle('on',S.justify); $('#wake').classList.toggle('on',S.wake); $('#flame').classList.toggle('on',S.flame);
  const meta=document.querySelector('meta[name=theme-color]'); if(meta)meta.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#100d13';
}
function applyLang(){
  root.lang=L; root.dir=L==='ar'?'rtl':'ltr';
  $$('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  $$('[data-ic]').forEach(el=>{if(!el.querySelector('svg'))el.insertAdjacentHTML('afterbegin',I(el.dataset.ic))});
  document.title=t('app');
}

/* ---------------- data ---------------- */
let LIB=null;
const progress=store.get('rd:progress',{});
const saveProgress=()=>store.set('rd:progress',progress);
async function library(){ if(LIB)return LIB; const r=await fetch('/reader/library.json?v=2'); LIB=await r.json(); return LIB }
const book=id=>LIB.books.find(b=>b.id===id);
const tt=o=>o[L]||o.ar;
const bookPct=b=>{const p=progress[b.id]||{};const n=b.chapters.length;let s=0;for(let i=0;i<n;i++)s+=Math.min(1,p[i]||0);return n?s/n:0};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- views ---------------- */
function bar(title,backHref,extra=''){
  return `<header class="bar">${backHref?`<a class="icon-btn" href="${backHref}" aria-label="${t('back')}">${I('back','dir')}</a>`:`<div class="brand"><img src="/reader/icons/icon-192.png" alt="" width="34" height="34"><b>Bouhaj Reader</b><em class="beta">${t('beta')}</em></div>`}
  <div class="bar-title">${esc(title||'')}</div>${extra}
  <button class="icon-btn" data-act="settings" aria-label="${t('settings')}">${I('aa')}</button></header>`;
}

async function viewLibrary(){
  stopTTS(); setReading(false); await library();
  const last=store.get('rd:last',null); let cont='';
  if(last&&book(last.b)){const b=book(last.b),c=b.chapters[last.c];if(c)cont=`<a class="cont" href="#/r/${b.id}/${last.c}"><img src="${b.cover}" alt=""><div><small>${t('cont')}</small><strong>${esc(tt(c.title))}</strong><em>${esc(tt(b.title))} · ${Math.round((progress[b.id]||{})[last.c]*100||0)}%</em></div>${I('fwd','dir go')}</a>`}
  const feats=[['candle','f1'],['eye','f2'],['sun','f3'],['paper','f4'],['voice','f5'],['pages','f6']];
  app.innerHTML=bar('',null)+`<main class="lib">
   <section class="hero"><h2>${t('heroT')}</h2><p>${t('heroP')}</p>
   <ul class="feats">${feats.map(([i,k])=>`<li>${I(i)}<span>${t(k)}</span></li>`).join('')}</ul></section>
   ${installed()?'':`<button class="ins-banner" data-act="install"><img src="/reader/icons/icon-192.png" alt="" width="44" height="44"><span><strong>${it('t')}</strong><small>${it('d')}</small></span>${I('download')}</button>`}
   ${cont}
   <h3 class="sec-h">${t('novels')}</h3>
   <div class="books">${LIB.books.map(b=>`<a class="bk" href="#/b/${b.id}"><div class="bk-cover"><img src="${b.cover}" alt="${esc(tt(b.title))}" loading="lazy"></div><strong>${esc(tt(b.title))}</strong><span>${b.chapters.length} ${t('chapters')}</span><div class="meter"><i style="width:${Math.round(bookPct(b)*100)}%"></i></div></a>`).join('')}</div>
   <footer class="lib-foot">${installed()?'':`<button class="install" data-act="install">${I('download')}${t('install')}</button>`}<a href="/">${I('home')}${t('site')}</a></footer>
  </main>`;
  window.scrollTo(0,0);
}

async function viewBook(id){
  stopTTS(); setReading(false); await library(); const b=book(id); if(!b)return go('');
  const p=progress[id]||{}; const first=b.chapters.findIndex((c,i)=>(p[i]||0)<.98); const startAt=first<0?0:first;
  app.innerHTML=bar(tt(b.title),'#/')+`<main class="book">
   <div class="book-top"><img src="${b.cover}" alt=""><div><h2>${esc(tt(b.title))}</h2><p>${esc(tt(b.desc))}</p><a class="btn" href="#/r/${id}/${startAt}">${Object.keys(p).length?t('resume'):t('start')}</a></div></div>
   <ol class="chs">${chapterList(b,p)}</ol>
   ${b.more?`<a class="more" href="${b.more}" target="_blank" rel="noopener">${t('more')}${I('ext')}</a>`:''}
  </main>`; window.scrollTo(0,0);
}
function chapterList(b,p,current=-1){
  return b.chapters.map((c,i)=>{const v=p[i]||0;return `<li><a class="ch${v>.98?' done':''}${i===current?' cur':''}" href="#/r/${b.id}/${i}"><b>${v>.98?I('check'):i+1}</b><span>${esc(tt(c.title))}</span>${v>.02&&v<=.98?`<em>${Math.round(v*100)}%</em>`:''}</a></li>`}).join('');
}

/* ---------------- chapter extraction ---------------- */
const ALLOWED=new Set(['P','BR','BLOCKQUOTE','H2','H3','EM','STRONG','I','B','UL','OL','LI','HR','DIV','SPAN']);
const KEEP_CLASS=new Set(['poem','stanza-gap']);
function clean(node){
  for(const el of [...node.querySelectorAll('*')]){
    if(!ALLOWED.has(el.tagName)){ if(['SCRIPT','STYLE','NAV','IMG','IFRAME','FORM','BUTTON'].includes(el.tagName)){el.remove();continue} el.replaceWith(...el.childNodes);continue }
    const keep=[...el.classList].filter(c=>KEEP_CLASS.has(c)); [...el.attributes].forEach(a=>el.removeAttribute(a.name)); if(keep.length)el.className=keep.join(' ');
  }
  return node;
}
const dictCache={};
async function dict(key){ if(dictCache[key])return dictCache[key]; try{const r=await fetch(`/i18n/${key}.json?v=7`);const rows=r.ok?await r.json():[];dictCache[key]=new Map(rows.map(x=>[x[0],x]))}catch(e){dictCache[key]=new Map()} return dictCache[key] }
function translateNode(node,map){
  const idx={ar:0,en:1,fr:2}[L]; const w=document.createTreeWalker(node,NodeFilter.SHOW_TEXT); let n;
  while(n=w.nextNode()){const key=n.nodeValue.trim().replace(/\s+/g,' ');const row=map.get(key);if(row)n.nodeValue=n.nodeValue.replace(n.nodeValue.trim(),row[idx])}
}
async function loadChapter(b,c){
  const r=await fetch(c.url,{credentials:'same-origin'}); if(!r.ok)throw new Error(r.status);
  const doc=new DOMParser().parseFromString(await r.text(),'text/html');
  let el,lang=L;
  if(c.marudai){ el=doc.querySelector(`.mr-text[lang=${L}]`)||doc.querySelector('.mr-text[lang=en]'); lang=el.getAttribute('lang'); el=el.cloneNode(true); el.querySelector('h1')?.remove() }
  else{ el=(doc.querySelector('main.prose')||doc.querySelector('main')).cloneNode(true); el.querySelectorAll('h1,.actions,.endnote').forEach(x=>x.remove()); if(L!=='ar')translateNode(el,await dict(c.i18n)) }
  const box=document.createElement('div'); box.append(...el.childNodes); return {html:clean(box).innerHTML,lang};
}

/* ---------------- reader ---------------- */
let cur=null;
function setReading(on){ document.body.classList.toggle('reading',on); if(!on)document.body.classList.remove('chrome-hidden') }
async function viewRead(id,i){
  stopTTS(); await library(); const b=book(id); i=+i; const c=b&&b.chapters[i]; if(!c)return go('#/b/'+id);
  cur={b,i,c,page:0,pages:1}; store.set('rd:last',{b:id,c:i}); setReading(true);
  const extra=`<button class="icon-btn" data-act="toc" aria-label="${t('contents')}">${I('list')}</button><button class="icon-btn" data-act="tts" aria-label="${t('listen')}">${I('sound')}</button><button class="icon-btn hide-sm" data-act="fs" aria-label="${t('fullscreen')}">${I('full')}</button>`;
  app.innerHTML=bar(tt(b.title),'#/b/'+id,extra)+`<main class="rd" id="rd"><div class="pager" id="pager"><article class="page" id="page"><div class="rd-kick">${t('chapter')} ${i+1} ${t('of')} ${b.chapters.length}</div><h1 class="rd-title">${esc(tt(c.title))}</h1><div class="rd-msg"><div class="spin"></div>${t('loading')}</div></article></div>
   <button class="tap tap-a" data-act="pgA" aria-label="page"></button><button class="tap tap-b" data-act="pgB" aria-label="page"></button></main>
   <footer class="rd-foot"><span class="rd-left" id="left"></span><div class="meter"><i id="pbar" style="width:0"></i></div><output id="pct">0%</output></footer>
   <aside class="drawer" id="toc" hidden><div class="drawer-h"><strong>${esc(tt(b.title))}</strong><button class="icon-btn" data-act="tocClose" aria-label="close">${I('close')}</button></div><ol class="chs">${chapterList(b,progress[id]||{},i)}</ol></aside>`;
  window.scrollTo(0,0);
  try{
    const {html,lang}=await loadChapter(b,c);
    if(!cur||cur.c!==c)return;
    const prev=i>0?`<a class="btn ghost" href="#/r/${id}/${i-1}">${t('prev')}</a>`:'';
    const next=i<b.chapters.length-1?`<a class="btn" href="#/r/${id}/${i+1}">${t('next')}${I('fwd','dir')}</a>`:(b.more?`<a class="btn" href="${b.more}" target="_blank" rel="noopener">${t('more')}${I('ext')}</a>`:`<a class="btn" href="#/b/${id}">${t('toBook')}</a>`);
    $('.rd-msg').outerHTML=`<div class="txt" lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}">${html}</div><div class="rd-end"><p class="rd-kick">— ${t('end')} —</p>${next}${prev}</div>`;
    cur.words=($('.txt').textContent.match(/\S+/g)||[]).length;
    layoutPages();
    const saved=(progress[id]||{})[i]||0;
    if(saved>.02&&saved<.98)requestAnimationFrame(()=>gotoFraction(saved));
    if(S.layout==='pages'&&!store.get('rd:hint',false)){toast(t('hint'));store.set('rd:hint',true)}
    update();
  }catch(e){
    $('.rd-msg').innerHTML=`${t('err')}<br><br><button class="btn" id="retry">${t('retry')}</button>`; $('#retry').onclick=()=>viewRead(id,i);
  }
}

/* page mode: CSS columns, one column per screen */
const paged=()=>S.layout==='pages'&&cur&&$('#pager');
function layoutPages(){
  const pg=$('#pager'); if(!pg||!cur)return;
  if(!paged()){pg.style.removeProperty('--colw');pg.scrollLeft=0;return}
  const w=pg.clientWidth; pg.style.setProperty('--colw',w+'px');
  cur.pageW=w+parseFloat(getComputedStyle($('#page')).columnGap||0);
  cur.pages=Math.max(1,Math.round(pg.scrollWidth/cur.pageW)); cur.page=Math.min(cur.page,cur.pages-1); showPage(cur.page,false);
}
function showPage(n,smooth=true){
  const pg=$('#pager'); if(!pg||!cur)return; cur.page=Math.max(0,Math.min(cur.pages-1,n));
  pg.scrollTo({left:(root.dir==='rtl'?-1:1)*cur.page*cur.pageW,behavior:smooth?'smooth':'auto'}); update();
}
function turn(d){ if(!paged())return; if(cur.page+d>=cur.pages){const n=cur.b.chapters[cur.i+1];if(n)go(`#/r/${cur.b.id}/${cur.i+1}`);return} showPage(cur.page+d) }
function gotoFraction(f){ if(paged()){showPage(Math.round(f*(cur.pages-1)),false)}else window.scrollTo(0,f*(document.documentElement.scrollHeight-innerHeight)) }
function revealEl(el){
  if(paged()){const pg=$('#pager');
    const r=el.getBoundingClientRect(), pr=pg.getBoundingClientRect(); if(r.left<pr.left-2||r.right>pr.right+2){ const delta=Math.round((r.left-pr.left)/cur.pageW); showPage(cur.page+(root.dir==='rtl'?-delta:delta)) } return}
  const r=el.getBoundingClientRect(); if(r.top<90||r.bottom>innerHeight-170)el.scrollIntoView({behavior:'smooth',block:'center'});
}
function fraction(){ if(paged())return cur.pages>1?cur.page/(cur.pages-1):1; const h=document.documentElement.scrollHeight-innerHeight; return h>0?Math.min(1,scrollY/h):1 }
function update(){
  if(!cur||!$('#rd'))return; const v=fraction();
  $('#pbar')&&($('#pbar').style.width=(v*100).toFixed(1)+'%');
  $('#pct')&&($('#pct').textContent=paged()?`${cur.page+1}/${cur.pages}`:Math.round(v*100)+'%');
  if(cur.words&&$('#left')){const m=Math.max(0,Math.ceil(cur.words*(1-v)/200));$('#left').innerHTML=`${I('clock')}${m} ${t('minutes')} ${t('left')}`}
  const p=progress[cur.b.id]=progress[cur.b.id]||{}; if(v>(p[cur.i]||0)||v<(p[cur.i]||0)-.05){p[cur.i]=+v.toFixed(3);saveProgress()}
}
let lastY=0,ticking=false;
addEventListener('scroll',()=>{ if(ticking||paged())return; ticking=true; requestAnimationFrame(()=>{ticking=false;update();const dy=scrollY-lastY;if(Math.abs(dy)>12){document.body.classList.toggle('chrome-hidden',dy>0&&scrollY>120);lastY=scrollY}}) },{passive:true});
addEventListener('resize',()=>{const f=cur?fraction():0;layoutPages();if(cur&&paged())gotoFraction(f)});
app.addEventListener('click',e=>{ if(e.target.closest('.txt')&&!getSelection().toString()&&!paged())document.body.classList.toggle('chrome-hidden') });
let tx=0,ty=0;
app.addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY},{passive:true});
app.addEventListener('touchend',e=>{ if(!paged())return; const dx=e.changedTouches[0].clientX-tx, dy=e.changedTouches[0].clientY-ty; if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.3){ const fwd=root.dir==='rtl'?dx>0:dx<0; turn(fwd?1:-1) } },{passive:true});
addEventListener('keydown',e=>{ if(!paged())return; if(e.key==='ArrowLeft')turn(root.dir==='rtl'?1:-1); if(e.key==='ArrowRight')turn(root.dir==='rtl'?-1:1); if(e.key===' ')turn(1) });

/* ---------------- settings sheet ---------------- */
function openSheet(){ $('#settings').hidden=false; $('#settingsBack').hidden=false }
function closeSheet(){ $('#settings').hidden=true; $('#settingsBack').hidden=true }
$('#settingsBack').onclick=closeSheet;
const seg=(sel,fn)=>$(sel).onclick=e=>{const b=e.target.closest('button');if(b){fn(b.dataset);save();applySettings()}};
seg('#themes',d=>{S.theme=d.theme;if(d.theme==='candle'&&S.bright>85)S.bright=78});
seg('#fonts',d=>{S.font=d.font}); seg('#spacing',d=>{S.lh=d.lh;setTimeout(layoutPages,50)});
seg('#layouts',d=>{const f=cur?fraction():0;S.layout=d.layout;applySettings();setTimeout(()=>{layoutPages();if(cur)gotoFraction(f);update()},60)});
seg('#voices',d=>{S.voice=d.voice;if(ttsOn){stopSpeech();speakNext()}});
seg('#rates',d=>{S.rate=+d.rate;if(ttsOn){stopSpeech();speakNext()}});
$('#langs').onclick=e=>{const b=e.target.closest('button');if(!b)return;L=b.dataset.lang;try{localStorage.setItem('lang',L)}catch(_){}applyLang();applySettings();route()};
$('#bright').oninput=e=>{S.bright=+e.target.value;save();applySettings()};
$('#warm').oninput=e=>{S.warm=+e.target.value;save();applySettings()};
$('#fontMinus').onclick=()=>{S.size=Math.max(15,S.size-1);save();applySettings();layoutPages()};
$('#fontPlus').onclick=()=>{S.size=Math.min(34,S.size+1);save();applySettings();layoutPages()};
$('#justify').onclick=()=>{S.justify=!S.justify;save();applySettings();layoutPages()};
$('#flame').onclick=()=>{S.flame=!S.flame;save();applySettings()};
$('#wake').onclick=async()=>{S.wake=!S.wake;save();applySettings();await wake()};
$('#fsBtn').onclick=()=>{toggleFS();closeSheet()};

/* ---------------- full screen & wake lock ---------------- */
function toggleFS(){
  const d=document, el=root;
  if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);return}
  const req=el.requestFullscreen||el.webkitRequestFullscreen; if(!req)return toast(t('noFS')); Promise.resolve(req.call(el)).catch(()=>toast(t('noFS')));
}
document.addEventListener('fullscreenchange',()=>{$('#fsBtn').lastChild.textContent=document.fullscreenElement?t('exitfs'):t('fullscreen');setTimeout(layoutPages,200)});
let lock=null;
async function wake(){ try{ if(S.wake){ if(!('wakeLock' in navigator)){toast(t('noWake'));S.wake=false;save();applySettings();return} lock=await navigator.wakeLock.request('screen') } else if(lock){await lock.release();lock=null} }catch(e){} }
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S.wake)wake()});

/* ---------------- read aloud: neural voices (if configured) or device voices ---------------- */
const synth=window.speechSynthesis; let ttsQ=[],ttsI=0,ttsOn=false,audio=null;
const MALE=/\b(hamed|shakir|jamal|omar|taim|moaz|naayf|maged|bassel|rami|hamdan|fahed|saleh|ismael|kareem|guy|davis|andrew|brian|christopher|eric|roger|steffan|tony|jason|ryan|thomas|daniel|henri|remy|claude|alain|antoine|jerome|yves|paul|male|man)\b/i;
const FEMALE=/\b(zariyah|salma|mouna|amina|layla|laila|hoda|sana|fatima|reem|amany|iman|nour|jenny|aria|emma|ava|michelle|ana|sonia|libby|samantha|karen|moira|tessa|denise|vivienne|eloise|brigitte|celeste|coralie|julie|amelie|audrey|marie|female|woman)\b/i;
function deviceVoice(lang){
  const vs=(synth?synth.getVoices():[]).filter(v=>v.lang&&v.lang.toLowerCase().replace('_','-').startsWith(lang));
  if(!vs.length)return {voice:null,pitch:1};
  const rank=v=>(/natural|neural|online|enhanced|premium|google/i.test(v.name)?2:0)+(lang==='ar'&&/ar-ma|morocco/i.test(v.lang+v.name)?1:0);
  const want=S.voice==='male'?MALE:FEMALE, other=S.voice==='male'?FEMALE:MALE;
  const pick=vs.filter(v=>want.test(v.name)).sort((a,b)=>rank(b)-rank(a))[0];
  if(pick)return {voice:pick,pitch:1};
  const neutral=vs.filter(v=>!other.test(v.name)).sort((a,b)=>rank(b)-rank(a))[0]||vs[0];
  return {voice:neutral,pitch:S.voice==='male'?0.78:1.18,emulated:true};
}
function chunks(text){ const parts=text.match(/[^.!?؟؛…\n]+[.!?؟؛…]*\s*/g)||[text]; const out=[];let buf='';for(const p of parts){if((buf+p).length>230){if(buf)out.push(buf);buf=p}else buf+=p}if(buf.trim())out.push(buf);return out }
function buildQueue(){ ttsQ=[]; $$('.txt p,.txt h2,.txt h3,.txt blockquote,.txt li').forEach(el=>{const tx=el.textContent.trim();if(tx)chunks(tx).forEach(c=>ttsQ.push({el,text:c}))}) }
function ttsUI(){
  $('#ttsPlay').innerHTML=I(ttsOn?'pause':'play');
  const src=CFG.ttsEndpoint?t('neural'):t('device');
  $('#ttsState').textContent=(ttsOn?t('reading'):(ttsI>=ttsQ.length&&ttsQ.length?t('done'):t('paused')))+(ttsQ.length?` · ${Math.min(ttsI+1,ttsQ.length)}/${ttsQ.length}`:'')+` · ${src}`;
}
function stopSpeech(){ if(synth)synth.cancel(); if(audio){audio.pause();audio.src='';audio=null} }
const curLang=()=>($('.txt')?.getAttribute('lang'))||'ar';
async function speakNeural(text){
  const r=await fetch(CFG.ttsEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text,lang:curLang(),gender:S.voice,rate:S.rate})});
  if(!r.ok)throw new Error('tts '+r.status);
  const url=URL.createObjectURL(await r.blob()); audio=new Audio(url); audio.playbackRate=1;
  await new Promise((res,rej)=>{audio.onended=res;audio.onerror=rej;audio.play().catch(rej)}); URL.revokeObjectURL(url);
}
function speakDevice(text){ return new Promise(res=>{ const {voice,pitch}=deviceVoice(curLang()); const u=new SpeechSynthesisUtterance(text); if(voice)u.voice=voice; u.lang={ar:'ar-SA',en:'en-US',fr:'fr-FR'}[curLang()]; u.rate=S.rate; u.pitch=pitch; u.onend=res; u.onerror=res; synth.speak(u) }) }
async function speakNext(){
  $$('.is-reading').forEach(x=>x.classList.remove('is-reading'));
  if(!ttsOn)return ttsUI(); if(ttsI>=ttsQ.length){ttsOn=false;return ttsUI()}
  const it=ttsQ[ttsI], mine=ttsI; it.el.classList.add('is-reading'); revealEl(it.el); ttsUI();
  try{ if(CFG.ttsEndpoint)await speakNeural(it.text); else await speakDevice(it.text) }
  catch(e){ if(CFG.ttsEndpoint){CFG.ttsEndpoint='';} await speakDevice(it.text) }
  if(ttsOn&&mine===ttsI){ttsI++;speakNext()}
}
function startTTS(){
  if(!synth&&!CFG.ttsEndpoint)return toast(t('noTTS'));
  if(!CFG.ttsEndpoint&&synth){ const vs=synth.getVoices(); if(vs.length){ const d=deviceVoice(curLang()); if(!d.voice)toast(t('noVoice')); else if(d.emulated&&!store.get('rd:emuNote',false)){toast(t('sameVoice'));store.set('rd:emuNote',true)} } }
  if(!ttsQ.length||ttsI>=ttsQ.length){ buildQueue(); ttsI=0; const pr=$('#pager').getBoundingClientRect(); const f=ttsQ.findIndex(q=>{const r=q.el.getBoundingClientRect();return paged()?(r.left>=pr.left-2&&r.right<=pr.right+2):r.bottom>100}); if(f>0)ttsI=f }
  ttsOn=true; stopSpeech(); speakNext();
}
function pauseTTS(){ ttsOn=false; stopSpeech(); $$('.is-reading').forEach(x=>x.classList.remove('is-reading')); ttsUI() }
function stopTTS(){ pauseTTS(); ttsQ=[]; ttsI=0; $('#tts').hidden=true }
$('#ttsPlay').onclick=()=>ttsOn?pauseTTS():startTTS();
$('#ttsPrev').onclick=()=>{ if(!ttsQ.length)return; const el=ttsQ[ttsI]?.el; let j=ttsI; while(j>0&&ttsQ[j].el===el)j--; while(j>0&&ttsQ[j-1].el===ttsQ[j].el)j--; ttsI=Math.max(0,j); if(ttsOn){stopSpeech();speakNext()}else ttsUI() };
$('#ttsNext').onclick=()=>{ if(!ttsQ.length)return; const el=ttsQ[ttsI]?.el; let j=ttsI; while(j<ttsQ.length&&ttsQ[j].el===el)j++; ttsI=Math.min(ttsQ.length-1,j); if(ttsOn){stopSpeech();speakNext()}else ttsUI() };
$('#ttsClose').onclick=stopTTS;
if(synth)synth.onvoiceschanged=()=>{};

/* ---------------- global actions ---------------- */
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]'); if(!a)return; const act=a.dataset.act;
  if(act==='settings')openSheet();
  if(act==='fs')toggleFS();
  if(act==='tts'){ $('#tts').hidden=false; ttsUI(); if(!ttsOn)startTTS() }
  if(act==='toc'){ $('#toc').hidden=false } if(act==='tocClose'){ $('#toc').hidden=true }
  if(act==='pgA')turn(root.dir==='rtl'?1:-1); if(act==='pgB')turn(root.dir==='rtl'?-1:1);
});
addEventListener('keydown',e=>{ if(e.key==='Escape'){closeSheet();$('#toc')&&($('#toc').hidden=true)} });
let tid; function toast(m){ const el=$('#toast'); el.textContent=m; el.hidden=false; clearTimeout(tid); tid=setTimeout(()=>el.hidden=true,4500) }

/* ---------------- install ---------------- */
const IT={
 ar:{t:'ثبّت Bouhaj Reader',d:'أضفه إلى الشاشة الرئيسية ليفتح كتطبيق بملء الشاشة، ويعمل دون إنترنت.',now:'تثبيت الآن',wait:'جارٍ تجهيز التثبيت…',chrome:'افتح في Chrome للتثبيت',inapp:'أنت داخل متصفح تطبيق آخر (مثل إنستغرام) لا يسمح بالتثبيت. سنفتح الصفحة في Chrome، ثم اضغط «تثبيت الآن».',ios1:'اضغط زر المشاركة',ios2:'اختر «إضافة إلى الشاشة الرئيسية»',ios3:'اضغط «إضافة»',iosSafari:'افتح في Safari',iosInapp:'التثبيت على آيفون يتم من Safari فقط. افتح الرابط في Safari ثم اتبع الخطوات:',menu1:'افتح قائمة المتصفح',menu2:'اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»',menuHint:'إن لم يظهر زر التثبيت تلقائياً، استخدم قائمة المتصفح:',done:'التطبيق مثبّت على جهازك',later:'لاحقاً',copy:'نسخ الرابط',copied:'تم نسخ الرابط'},
 en:{t:'Install Bouhaj Reader',d:'Add it to your home screen to open it like an app, full screen, even offline.',now:'Install now',wait:'Preparing install…',chrome:'Open in Chrome to install',inapp:'You’re in another app’s browser (like Instagram), which can’t install apps. We’ll open the page in Chrome; then tap “Install now”.',ios1:'Tap the Share button',ios2:'Choose “Add to Home Screen”',ios3:'Tap “Add”',iosSafari:'Open in Safari',iosInapp:'On iPhone, apps are installed from Safari only. Open the link in Safari, then follow these steps:',menu1:'Open the browser menu',menu2:'Choose “Install app” or “Add to Home screen”',menuHint:'If the install button doesn’t appear automatically, use the browser menu:',done:'The app is installed on your device',later:'Later',copy:'Copy link',copied:'Link copied'},
 fr:{t:'Installer Bouhaj Reader',d:'Ajoutez-le à l’écran d’accueil pour l’ouvrir comme une application, en plein écran, même hors ligne.',now:'Installer maintenant',wait:'Préparation de l’installation…',chrome:'Ouvrir dans Chrome pour installer',inapp:'Vous êtes dans le navigateur d’une autre application (comme Instagram), qui ne permet pas l’installation. Nous allons ouvrir la page dans Chrome ; touchez ensuite « Installer maintenant ».',ios1:'Touchez le bouton Partager',ios2:'Choisissez « Sur l’écran d’accueil »',ios3:'Touchez « Ajouter »',iosSafari:'Ouvrir dans Safari',iosInapp:'Sur iPhone, l’installation se fait uniquement depuis Safari. Ouvrez le lien dans Safari, puis suivez ces étapes :',menu1:'Ouvrez le menu du navigateur',menu2:'Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil »',menuHint:'Si le bouton d’installation n’apparaît pas automatiquement, utilisez le menu du navigateur :',done:'L’application est installée sur votre appareil',later:'Plus tard',copy:'Copier le lien',copied:'Lien copié'}};
const it=k=>(IT[L]||IT.ar)[k];
const UA=navigator.userAgent||'';
const isAndroid=/Android/i.test(UA), isIOS=/iPhone|iPad|iPod/i.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const inApp=/Instagram|FBAN|FBAV|FB_IAB|Messenger|Line\/|TikTok|musical_ly|Snapchat|Twitter|; wv\)/i.test(UA);
const isChrome=/Chrome\/\d/i.test(UA)&&!/EdgA?|OPR|SamsungBrowser|YaBrowser|UCBrowser|Firefox/i.test(UA);
const installed=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
const INSTALL_URL='https://go.bouhaj.com/reader/?install=1';
let deferred=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.body.classList.add('can-install');refreshSheet()});
addEventListener('appinstalled',()=>{deferred=null;closeInstall();toast(it('done'))});
function openInChrome(){ location.href='intent://go.bouhaj.com/reader/?install=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(INSTALL_URL)+';end' }
function openInSafari(){ location.href='x-safari-https://go.bouhaj.com/reader/?install=1' }
function sheetHTML(){
  const step=(n,txt,ic)=>`<li><b>${n}</b><span>${txt}</span>${ic?I(ic):''}</li>`;
  let body='',btn='';
  if(isAndroid&&(inApp||!isChrome)){ body=`<p>${it('inapp')}</p>`; btn=`<button class="btn" id="insGo">${I('ext')}${it('chrome')}</button>` }
  else if(isIOS){ body=(inApp||!/Safari/i.test(UA)||/CriOS|FxiOS/i.test(UA)?`<p>${it('iosInapp')}</p>`:'')+`<ol class="steps">${step(1,it('ios1'),'share')}${step(2,it('ios2'),'plus')}${step(3,it('ios3'))}</ol>`; if(inApp||/CriOS|FxiOS/i.test(UA))btn=`<button class="btn" id="insSafari">${I('ext')}${it('iosSafari')}</button><button class="btn ghost" id="insCopy">${it('copy')}</button>` }
  else if(deferred){ btn=`<button class="btn big" id="insNow">${I('download')}${it('now')}</button>` }
  else { body=`<p>${it('menuHint')}</p><ol class="steps">${step(1,it('menu1'),'dots')}${step(2,it('menu2'),'download')}</ol>`; btn=`<button class="btn big" id="insNow" disabled>${it('wait')}</button>` }
  return `<div class="ins-card"><img src="/reader/icons/icon-192.png" alt="" width="72" height="72"><h3>${it('t')}</h3><p class="ins-d">${it('d')}</p>${body}<div class="ins-btns">${btn}<button class="btn ghost" id="insLater">${it('later')}</button></div></div>`;
}
function refreshSheet(){ const sh=$('#installSheet'); if(!sh||sh.hidden)return; sh.innerHTML=sheetHTML(); bindSheet() }
function bindSheet(){
  $('#insNow')&&($('#insNow').onclick=async()=>{ if(!deferred)return; deferred.prompt(); const r=await deferred.userChoice; deferred=null; document.body.classList.remove('can-install'); if(r&&r.outcome==='accepted')closeInstall(); else refreshSheet() });
  $('#insGo')&&($('#insGo').onclick=openInChrome);
  $('#insSafari')&&($('#insSafari').onclick=openInSafari);
  $('#insCopy')&&($('#insCopy').onclick=async()=>{try{await navigator.clipboard.writeText(INSTALL_URL);toast(it('copied'))}catch(e){prompt('',INSTALL_URL)}});
  $('#insLater').onclick=closeInstall;
}
function openInstall(){
  if(installed())return toast(it('done'));
  if(deferred&&!isIOS&&!(isAndroid&&inApp)){ deferred.prompt(); deferred.userChoice.then(r=>{deferred=null;document.body.classList.remove('can-install');if(!r||r.outcome!=='accepted'){showSheet()}}); return }
  if(isAndroid&&(inApp||!isChrome)){ openInChrome(); setTimeout(showSheet,900); return }
  showSheet();
}
function showSheet(){ let sh=$('#installSheet'); if(!sh){sh=document.createElement('div');sh.id='installSheet';sh.className='ins';document.body.appendChild(sh)} sh.hidden=false; sh.innerHTML=sheetHTML(); bindSheet() }
function closeInstall(){ const sh=$('#installSheet'); if(sh)sh.hidden=true }
const doInstall=openInstall;
document.addEventListener('click',e=>{ if(e.target.closest('[data-act=install]'))openInstall() });
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/reader/sw.js',{scope:'/reader/'}).catch(()=>{}));
// Arriving from "open in Chrome": show the install card right away (browsers need one tap to install)
if(new URLSearchParams(location.search).has('install')&&!installed())setTimeout(showSheet,400);

/* ---------------- router ---------------- */
function go(h){ location.hash=h }
function route(){
  closeSheet(); document.body.classList.remove('chrome-hidden');
  const h=location.hash.replace(/^#\/?/,'').split('/');
  if(h[0]==='b'&&h[1])return viewBook(h[1]);
  if(h[0]==='r'&&h[1])return viewRead(h[1],h[2]||0);
  return viewLibrary();
}
addEventListener('hashchange',route);
applyLang(); applySettings(); if(S.wake)wake(); route();
})();
