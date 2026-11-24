/* روايات بوهاج — reader app */
(()=>{'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const app=$('#app'), root=document.documentElement;
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------------- interface text ---------------- */
const T={
 ar:{app:'روايات بوهاج',tag:'مكتبة القراءة',heroT:'اقرأ كما تحب أن تقرأ',heroP:'روايات محمد بوهاج في تطبيق صُمِّم للقراءة الطويلة: ضوء الشمعة، والكتاب الكريمي، والتحكم في الإضاءة، والقراءة الصوتية.',f1:'🕯️ ضوء الشمعة',f2:'📜 الكتاب الكريمي',f3:'🔆 التحكم في الإضاءة',f4:'🔊 القراءة الصوتية',f5:'⛶ ملء الشاشة',cont:'تابع القراءة',novels:'الروايات',chapters:'فصول',chapter:'الفصل',start:'ابدأ القراءة',resume:'تابع من حيث توقفت',more:'بقية الفصول على Amazon',install:'ثبّت التطبيق',site:'الموقع الرئيسي',back:'رجوع',settings:'إعدادات القراءة',theme:'المظهر',night:'ليلي',cream:'كريمي',day:'نهاري',candle:'شمعة',brightness:'الإضاءة',warmth:'دفء الضوء',size:'حجم الخط',font:'الخط',spacing:'تباعد الأسطر',lang:'لغة النص',justify:'ضبط الأسطر',wake:'إبقاء الشاشة مضاءة',fullscreen:'ملء الشاشة',exitfs:'الخروج من ملء الشاشة',listen:'القراءة الصوتية',next:'الفصل التالي',prev:'الفصل السابق',toBook:'فهرس الرواية',loading:'جارٍ تحميل الفصل…',err:'تعذّر تحميل الفصل. تحقق من الاتصال ثم حاول مجدداً.',retry:'إعادة المحاولة',noVoice:'لا يتوفر صوت لهذه اللغة على جهازك. يمكنك تثبيت أصوات من إعدادات «تحويل النص إلى كلام».',noTTS:'القراءة الصوتية غير مدعومة في هذا المتصفح.',noFS:'ملء الشاشة غير مدعوم هنا. أضف التطبيق إلى الشاشة الرئيسية ليفتح بملء الشاشة.',noWake:'إبقاء الشاشة مضاءة غير مدعوم في هذا المتصفح.',reading:'يقرأ',paused:'متوقف',done:'انتهى الفصل',of:'من',end:'نهاية الفصل',read:'مقروء',minutes:'دقيقة'},
 en:{app:'Bouhaj Novels',tag:'Reading library',heroT:'Read the way you love to read',heroP:'Mohamed Bouhaj’s novels in an app made for long reading: candlelight, cream paper, brightness control and read-aloud.',f1:'🕯️ Candlelight',f2:'📜 Cream paper',f3:'🔆 Brightness control',f4:'🔊 Read aloud',f5:'⛶ Full screen',cont:'Continue reading',novels:'Novels',chapters:'chapters',chapter:'Chapter',start:'Start reading',resume:'Resume where you left off',more:'More chapters on Amazon',install:'Install the app',site:'Main website',back:'Back',settings:'Reading settings',theme:'Theme',night:'Night',cream:'Cream',day:'Day',candle:'Candle',brightness:'Brightness',warmth:'Warmth',size:'Text size',font:'Font',spacing:'Line spacing',lang:'Text language',justify:'Justify',wake:'Keep screen on',fullscreen:'Full screen',exitfs:'Exit full screen',listen:'Read aloud',next:'Next chapter',prev:'Previous chapter',toBook:'Book contents',loading:'Loading chapter…',err:'Couldn’t load the chapter. Check your connection and try again.',retry:'Try again',noVoice:'No voice is available for this language on your device. You can add voices in your text-to-speech settings.',noTTS:'Read-aloud isn’t supported in this browser.',noFS:'Full screen isn’t supported here. Add the app to your home screen to open it full screen.',noWake:'Keeping the screen on isn’t supported in this browser.',reading:'Reading',paused:'Paused',done:'Chapter finished',of:'of',end:'End of chapter',read:'Read',minutes:'min'},
 fr:{app:'Romans de Bouhaj',tag:'Bibliothèque de lecture',heroT:'Lisez comme vous aimez lire',heroP:'Les romans de Mohamed Bouhaj dans une application pensée pour la lecture longue : lumière de bougie, papier crème, réglage de la luminosité et lecture à voix haute.',f1:'🕯️ Lumière de bougie',f2:'📜 Papier crème',f3:'🔆 Réglage de la luminosité',f4:'🔊 Lecture à voix haute',f5:'⛶ Plein écran',cont:'Reprendre la lecture',novels:'Romans',chapters:'chapitres',chapter:'Chapitre',start:'Commencer la lecture',resume:'Reprendre là où vous étiez',more:'Suite des chapitres sur Amazon',install:'Installer l’application',site:'Site principal',back:'Retour',settings:'Réglages de lecture',theme:'Thème',night:'Nuit',cream:'Crème',day:'Jour',candle:'Bougie',brightness:'Luminosité',warmth:'Chaleur',size:'Taille du texte',font:'Police',spacing:'Interligne',lang:'Langue du texte',justify:'Justifier',wake:'Garder l’écran allumé',fullscreen:'Plein écran',exitfs:'Quitter le plein écran',listen:'Lecture à voix haute',next:'Chapitre suivant',prev:'Chapitre précédent',toBook:'Sommaire du roman',loading:'Chargement du chapitre…',err:'Impossible de charger le chapitre. Vérifiez la connexion et réessayez.',retry:'Réessayer',noVoice:'Aucune voix n’est disponible pour cette langue sur votre appareil. Vous pouvez en ajouter dans les réglages de synthèse vocale.',noTTS:'La lecture à voix haute n’est pas prise en charge par ce navigateur.',noFS:'Le plein écran n’est pas pris en charge ici. Ajoutez l’application à l’écran d’accueil pour l’ouvrir en plein écran.',noWake:'Ce navigateur ne permet pas de garder l’écran allumé.',reading:'Lecture',paused:'En pause',done:'Chapitre terminé',of:'sur',end:'Fin du chapitre',read:'Lu',minutes:'min'}
};

/* ---------------- settings ---------------- */
const DEF={theme:'night',bright:100,warm:0,size:21,font:'amiri',lh:'2',justify:false,wake:false,rate:1};
let S=Object.assign({},DEF,store.get('rd:settings',{}));
let L=(()=>{try{return localStorage.getItem('lang')||'ar'}catch(e){return 'ar'}})(); if(!T[L])L='ar';
const t=k=>T[L][k]||T.ar[k]||k;
const save=()=>store.set('rd:settings',S);

function applySettings(){
  root.dataset.theme=S.theme; root.dataset.font=S.font; root.dataset.justify=S.justify?'on':'off';
  root.style.setProperty('--size',S.size+'px'); root.style.setProperty('--lh',S.lh);
  const warm=S.theme==='candle'?Math.max(S.warm,45):S.warm;
  $('.fx-dim').style.opacity=((100-S.bright)/100*0.85).toFixed(3);
  $('.fx-warm').style.opacity=(warm/100*0.32).toFixed(3);
  $('#bright').value=S.bright; $('#brightOut').textContent=S.bright+'%';
  $('#warm').value=S.warm; $('#warmOut').textContent=S.warm+'%';
  $('#fontOut').textContent=S.size;
  $$('#themes button').forEach(b=>b.classList.toggle('on',b.dataset.theme===S.theme));
  $$('#fonts button').forEach(b=>b.classList.toggle('on',b.dataset.font===S.font));
  $$('#spacing button').forEach(b=>b.classList.toggle('on',b.dataset.lh===S.lh));
  $$('#langs button').forEach(b=>b.classList.toggle('on',b.dataset.lang===L));
  $$('#rates button').forEach(b=>b.classList.toggle('on',+b.dataset.rate===S.rate));
  $('#justify').classList.toggle('on',S.justify); $('#wake').classList.toggle('on',S.wake);
  const meta=document.querySelector('meta[name=theme-color]'); if(meta)meta.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#100d13';
}
function applyLang(){
  root.lang=L; root.dir=L==='ar'?'rtl':'ltr';
  $$('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  document.title=t('app');
}

/* ---------------- data ---------------- */
let LIB=null;
const progress=store.get('rd:progress',{});
const saveProgress=()=>store.set('rd:progress',progress);
async function library(){ if(LIB)return LIB; const r=await fetch('/reader/library.json?v=1'); LIB=await r.json(); return LIB }
const book=id=>LIB.books.find(b=>b.id===id);
const tt=o=>o[L]||o.ar;
const bookPct=b=>{const p=progress[b.id]||{};const n=b.chapters.length;let s=0;for(let i=0;i<n;i++)s+=Math.min(1,p[i]||0);return n?s/n:0};

const ICON={
 back:'<svg viewBox="0 0 24 24" class="flip"><path d="M15 6l-6 6 6 6" transform="rotate(180 12 12)"/></svg>',
 aa:'<svg viewBox="0 0 24 24"><path d="M3 19l5-13 5 13M5 14h6M14 19l3.5-8 3.5 8M15.2 16.5h4.6"/></svg>',
 sound:'<svg viewBox="0 0 24 24"><path d="M4 10v4h4l5 4V6L8 10H4zM16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11"/></svg>',
 full:'<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
 home:'<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9H4z"/></svg>',
 play:'<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
 pause:'<svg viewBox="0 0 24 24"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>'
};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- views ---------------- */
function bar(title,backHref,extra=''){
  return `<header class="bar">${backHref?`<a class="icon-btn" href="${backHref}" aria-label="${t('back')}">${ICON.back}</a>`:`<div class="brand"><img src="/reader/icons/icon-192.png" alt=""><b>${t('app')}</b></div>`}
  <div class="bar-title">${esc(title||'')}</div>${extra}
  <button class="icon-btn" data-act="settings" aria-label="${t('settings')}">${ICON.aa}</button></header>`;
}

async function viewLibrary(){
  stopTTS(); await library();
  const last=store.get('rd:last',null); let cont='';
  if(last&&book(last.b)){const b=book(last.b),c=b.chapters[last.c];if(c)cont=`<a class="cont" href="#/r/${b.id}/${last.c}"><img src="${b.cover}" alt=""><div><small>${t('cont')}</small><strong>${esc(tt(c.title))}</strong><em>${esc(tt(b.title))} · ${Math.round((progress[b.id]||{})[last.c]*100||0)}%</em></div></a>`}
  app.innerHTML=bar('',null)+`<main class="lib">
   <section class="hero"><h2>${t('heroT')}</h2><p>${t('heroP')}</p>
   <ul class="feats"><li>${t('f1')}</li><li>${t('f2')}</li><li>${t('f3')}</li><li>${t('f4')}</li><li>${t('f5')}</li></ul></section>
   ${cont}
   <h3 class="sec-h">${t('novels')}</h3>
   <div class="books">${LIB.books.map(b=>`<a class="bk" href="#/b/${b.id}"><div class="bk-cover"><img src="${b.cover}" alt="${esc(tt(b.title))}" loading="lazy"></div><strong>${esc(tt(b.title))}</strong><span>${b.chapters.length} ${t('chapters')}</span><div class="meter"><i style="width:${Math.round(bookPct(b)*100)}%"></i></div></a>`).join('')}</div>
   <footer class="lib-foot"><button class="install" id="installBtn">⬇ ${t('install')}</button><a href="/">${t('site')} · go.bouhaj.com</a></footer>
  </main>`;
  $('#installBtn').onclick=doInstall; window.scrollTo(0,0);
}

async function viewBook(id){
  stopTTS(); await library(); const b=book(id); if(!b)return go('');
  const p=progress[id]||{}; const first=b.chapters.findIndex((c,i)=>(p[i]||0)<.98); const startAt=first<0?0:first;
  app.innerHTML=bar(tt(b.title),'#/')+`<main class="book">
   <div class="book-top"><img src="${b.cover}" alt=""><div><h2>${esc(tt(b.title))}</h2><p>${esc(tt(b.desc))}</p><a class="btn" href="#/r/${id}/${startAt}">${Object.keys(p).length?t('resume'):t('start')}</a></div></div>
   <ol class="chs">${b.chapters.map((c,i)=>{const v=p[i]||0;return `<li><a class="ch${v>.98?' done':''}" href="#/r/${id}/${i}"><b>${v>.98?'✓':i+1}</b><span>${esc(tt(c.title))}</span>${v>.02&&v<=.98?`<em>${Math.round(v*100)}%</em>`:''}</a></li>`}).join('')}</ol>
   ${b.more?`<a class="more" href="${b.more}" target="_blank" rel="noopener">${t('more')} ↗</a>`:''}
  </main>`; window.scrollTo(0,0);
}

/* extract the chapter text from the site page */
const ALLOWED=new Set(['P','BR','BLOCKQUOTE','H2','H3','EM','STRONG','I','B','UL','OL','LI','HR','DIV','SPAN']);
const KEEP_CLASS=new Set(['poem','stanza-gap']);
function clean(node){
  for(const el of [...node.querySelectorAll('*')]){
    if(!ALLOWED.has(el.tagName)){ if(['SCRIPT','STYLE','NAV','IMG','IFRAME','FORM','BUTTON','A'].includes(el.tagName)&&el.tagName!=='A'){el.remove();continue} el.replaceWith(...el.childNodes);continue }
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
  else{ el=doc.querySelector('main.prose')||doc.querySelector('main'); el=el.cloneNode(true); el.querySelectorAll('h1,.actions,.endnote').forEach(x=>x.remove()); if(L!=='ar')translateNode(el,await dict(c.i18n)); }
  const box=document.createElement('div'); box.append(...el.childNodes); return {html:clean(box).innerHTML,lang};
}

let cur=null;
async function viewRead(id,i){
  stopTTS(); await library(); const b=book(id); i=+i; const c=b&&b.chapters[i]; if(!c)return go('#/b/'+id);
  cur={b,i,c}; store.set('rd:last',{b:id,c:i});
  const extra=`<button class="icon-btn" data-act="tts" aria-label="${t('listen')}">${ICON.sound}</button><button class="icon-btn" data-act="fs" aria-label="${t('fullscreen')}">${ICON.full}</button>`;
  app.innerHTML=bar(tt(b.title),'#/b/'+id,extra)+`<main class="rd" id="rd"><article class="page"><div class="rd-kick">${t('chapter')} ${i+1} ${t('of')} ${b.chapters.length}</div><h1 class="rd-title">${esc(tt(c.title))}</h1><div class="rd-msg"><div class="spin"></div>${t('loading')}</div></article></main>
   <footer class="rd-foot"><a class="icon-btn" href="#/b/${id}" aria-label="${t('toBook')}">☰</a><div class="meter"><i id="pbar" style="width:0"></i></div><output id="pct">0%</output></footer>`;
  window.scrollTo(0,0);
  try{
    const {html,lang}=await loadChapter(b,c);
    if(!cur||cur.c!==c)return;
    const prev=i>0?`<a class="btn ghost" href="#/r/${id}/${i-1}">${t('prev')}</a>`:'';
    const next=i<b.chapters.length-1?`<a class="btn" href="#/r/${id}/${i+1}">${t('next')} ←</a>`:(b.more?`<a class="btn" href="${b.more}" target="_blank" rel="noopener">${t('more')} ↗</a>`:`<a class="btn" href="#/b/${id}">${t('toBook')}</a>`);
    $('.rd-msg').outerHTML=`<div class="txt" lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}">${html}</div><div class="rd-end"><p class="rd-kick">— ${t('end')} —</p>${next}${prev}</div>`;
    const saved=(progress[id]||{})[i]||0;
    if(saved>.02&&saved<.98)requestAnimationFrame(()=>window.scrollTo(0,saved*(document.documentElement.scrollHeight-innerHeight)));
    onScroll();
  }catch(e){
    $('.rd-msg').innerHTML=`${t('err')}<br><br><button class="btn" id="retry">${t('retry')}</button>`; $('#retry').onclick=()=>viewRead(id,i);
  }
}

/* ---------------- reading progress & immersive chrome ---------------- */
let lastY=0,ticking=false;
function onScroll(){
  if(!cur||!$('#rd'))return;
  const h=document.documentElement.scrollHeight-innerHeight; const v=h>0?Math.min(1,scrollY/h):1;
  $('#pbar')&&($('#pbar').style.width=(v*100).toFixed(1)+'%'); $('#pct')&&($('#pct').textContent=Math.round(v*100)+'%');
  const p=progress[cur.b.id]=progress[cur.b.id]||{}; if(v>(p[cur.i]||0)||v<(p[cur.i]||0)-.05){p[cur.i]=+v.toFixed(3);saveProgress()}
  const dy=scrollY-lastY; if(Math.abs(dy)>12){document.body.classList.toggle('chrome-hidden',dy>0&&scrollY>120);lastY=scrollY}
}
addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(()=>{ticking=false;onScroll()})}},{passive:true});
app.addEventListener('click',e=>{ if(e.target.closest('.txt')&&!getSelection().toString())document.body.classList.toggle('chrome-hidden') });

/* ---------------- settings sheet ---------------- */
function openSheet(){ $('#settings').hidden=false; $('#settingsBack').hidden=false }
function closeSheet(){ $('#settings').hidden=true; $('#settingsBack').hidden=true }
$('#settingsBack').onclick=closeSheet;
$('#themes').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.theme=b.dataset.theme;if(S.theme==='candle'&&S.bright>85)S.bright=80;save();applySettings()};
$('#fonts').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.font=b.dataset.font;save();applySettings()};
$('#spacing').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.lh=b.dataset.lh;save();applySettings()};
$('#langs').onclick=e=>{const b=e.target.closest('button');if(!b)return;L=b.dataset.lang;try{localStorage.setItem('lang',L)}catch(_){}applyLang();applySettings();route()};
$('#bright').oninput=e=>{S.bright=+e.target.value;save();applySettings()};
$('#warm').oninput=e=>{S.warm=+e.target.value;save();applySettings()};
$('#fontMinus').onclick=()=>{S.size=Math.max(15,S.size-1);save();applySettings()};
$('#fontPlus').onclick=()=>{S.size=Math.min(34,S.size+1);save();applySettings()};
$('#justify').onclick=()=>{S.justify=!S.justify;save();applySettings()};
$('#wake').onclick=async()=>{S.wake=!S.wake;save();applySettings();await wake()};
$('#fsBtn').onclick=()=>{toggleFS();closeSheet()};

/* ---------------- full screen & wake lock ---------------- */
function toggleFS(){
  const d=document, el=root;
  if(d.fullscreenElement||d.webkitFullscreenElement){(d.exitFullscreen||d.webkitExitFullscreen).call(d);return}
  const req=el.requestFullscreen||el.webkitRequestFullscreen; if(!req)return toast(t('noFS')); req.call(el).catch(()=>toast(t('noFS')));
}
document.addEventListener('fullscreenchange',()=>{$('#fsBtn').textContent=document.fullscreenElement?t('exitfs'):t('fullscreen')});
let lock=null;
async function wake(){
  try{ if(S.wake){ if(!('wakeLock' in navigator)){toast(t('noWake'));S.wake=false;save();applySettings();return} lock=await navigator.wakeLock.request('screen') } else if(lock){await lock.release();lock=null} }catch(e){}
}
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&S.wake)wake()});

/* ---------------- read aloud ---------------- */
const synth=window.speechSynthesis; let ttsQ=[],ttsI=0,ttsOn=false;
function voiceFor(lang){ const vs=synth?synth.getVoices():[]; return vs.find(v=>v.lang&&v.lang.toLowerCase().startsWith(lang)&&/google|natural|neural/i.test(v.name))||vs.find(v=>v.lang&&v.lang.toLowerCase().startsWith(lang)) }
function chunks(text){ const parts=text.match(/[^.!?؟؛…\n]+[.!?؟؛…]*\s*/g)||[text]; const out=[];let buf='';for(const p of parts){if((buf+p).length>220){if(buf)out.push(buf);buf=p}else buf+=p}if(buf.trim())out.push(buf);return out }
function buildQueue(){ ttsQ=[]; $$('.txt p,.txt h2,.txt h3,.txt blockquote,.txt li').forEach(el=>{const tx=el.textContent.trim();if(tx)chunks(tx).forEach(c=>ttsQ.push({el,text:c}))}) }
function ttsUI(){ $('#ttsPlay').innerHTML=ttsOn?ICON.pause:ICON.play; $('#ttsState').textContent=ttsOn?t('reading')+' · '+(Math.min(ttsI+1,ttsQ.length))+'/'+ttsQ.length:(ttsI>=ttsQ.length&&ttsQ.length?t('done'):t('paused')) }
function speakNext(){
  $$('.is-reading').forEach(x=>x.classList.remove('is-reading'));
  if(!ttsOn)return ttsUI(); if(ttsI>=ttsQ.length){ttsOn=false;return ttsUI()}
  const it=ttsQ[ttsI], lang=($('.txt')?.getAttribute('lang'))||'ar';
  it.el.classList.add('is-reading'); const r=it.el.getBoundingClientRect(); if(r.top<90||r.bottom>innerHeight-160)it.el.scrollIntoView({behavior:'smooth',block:'center'});
  const u=new SpeechSynthesisUtterance(it.text); const v=voiceFor(lang); if(v)u.voice=v; u.lang={ar:'ar-SA',en:'en-US',fr:'fr-FR'}[lang]; u.rate=S.rate;
  u.onend=()=>{if(ttsOn){ttsI++;speakNext()}}; u.onerror=()=>{if(ttsOn){ttsI++;speakNext()}};
  synth.speak(u); ttsUI();
}
function startTTS(){
  if(!synth)return toast(t('noTTS'));
  const lang=($('.txt')?.getAttribute('lang'))||'ar'; if(!voiceFor(lang)&&synth.getVoices().length)toast(t('noVoice'));
  if(!ttsQ.length||ttsI>=ttsQ.length){buildQueue();ttsI=0;
    const firstVisible=ttsQ.findIndex(q=>q.el.getBoundingClientRect().bottom>100); if(firstVisible>0)ttsI=firstVisible}
  ttsOn=true; synth.cancel(); speakNext();
}
function pauseTTS(){ ttsOn=false; if(synth)synth.cancel(); $$('.is-reading').forEach(x=>x.classList.remove('is-reading')); ttsUI() }
function stopTTS(){ pauseTTS(); ttsQ=[]; ttsI=0; $('#tts').hidden=true }
$('#ttsPlay').onclick=()=>ttsOn?pauseTTS():startTTS();
$('#ttsClose').onclick=stopTTS;
$('#rates').onclick=e=>{const b=e.target.closest('button');if(!b)return;S.rate=+b.dataset.rate;save();applySettings();if(ttsOn){synth.cancel();speakNext()}};
if(synth&&'onvoiceschanged' in synth)synth.onvoiceschanged=()=>{};

/* ---------------- global actions ---------------- */
document.addEventListener('click',e=>{
  const a=e.target.closest('[data-act]'); if(!a)return;
  if(a.dataset.act==='settings')openSheet();
  if(a.dataset.act==='fs')toggleFS();
  if(a.dataset.act==='tts'){ $('#tts').hidden=false; ttsUI(); if(!ttsOn)startTTS() }
});
addEventListener('keydown',e=>{ if(e.key==='Escape')closeSheet() });

let tid; function toast(m){ const el=$('#toast'); el.textContent=m; el.hidden=false; clearTimeout(tid); tid=setTimeout(()=>el.hidden=true,4200) }

/* ---------------- install ---------------- */
let deferred=null;
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.body.classList.add('can-install')});
async function doInstall(){ if(!deferred)return; deferred.prompt(); await deferred.userChoice; deferred=null; document.body.classList.remove('can-install') }
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/reader/sw.js',{scope:'/reader/'}).catch(()=>{}));

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
