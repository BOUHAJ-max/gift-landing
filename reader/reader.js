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
 share:'<path d="M12 3v12M8 7l4-4 4 4M5 12v8h14v-8"/>', plus:'<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M12 8v8M8 12h8"/>', dots:'<circle cx="12" cy="5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/>',
 bookmark:'<path d="M6 3h12v18l-6-4-6 4z"/>', bookmarkOn:'<path d="M6 3h12v18l-6-4-6 4z" fill="currentColor" stroke="none"/>',
 hl:'<path d="M4 20h16M6.5 16l3.5-9 2.5 2.5 2-5.5 4 12"/>', note:'<path d="M5 4h14v11l-4 4H5z"/><path d="M15 19v-4h4M8 9h8M8 13h5"/>',
 share2:'<circle cx="18" cy="5" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="19" r="2.6"/><path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3"/>',
 imageIco:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M4 18l5-5 4 4 3-3 4 4"/>',
 stats:'<path d="M4 20V11M10 20V4M16 20v-6M22 20H2"/>', fire:'<path d="M12 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-1 .4-2 1-3 .4 1 1 1.6 2 1.8C9 9 10.5 6 12 3z"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m20 20-3.3-3.3"/>', trash:'<path d="M5 7h14M9 7V4.5h6V7M7 7l1 13h8l1-13"/>',
 copyIco:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/>', jump:'<path d="M5 12h13M12 6l6 6-6 6"/>',
 lock:'<rect x="5" y="11" width="14" height="10" rx="2.5"/><path d="M8 11V7.5a4 4 0 0 1 8 0V11"/>', link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/>', amazon:'<path d="M4 15c4.5 3 11 3.4 16 .6"/><path d="M17 14l3 1.5-1 3"/><path d="M8 11.5c0-2 1.6-3 4-3s3.5 1 3.5 2.6V14"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>', clock2:'<circle cx="12" cy="12" r="8"/><path d="M12 7.5V12l3 2"/>'
};
const BR={fb:['#1877F2','<path fill="currentColor" d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v7h4v-7h3l.5-4h-3.5V8.8c0-.5.4-.8 1-.8z"/>'],wa:['#25D366','<path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.2 13.9c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.2 1.1 2.3 1.4 2.6 1.6.3.1.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3.1.2.1.8-.1 1.4z"/>'],x:['#e8e8e8','<path fill="currentColor" d="M4 4l7.2 9.6L4.4 20H6l6-5.6L16.4 20H20l-7.5-10L19 4h-1.6l-5.6 5.2L7.8 4z"/>'],tg:['#229ED9','<path fill="currentColor" d="M21.5 4.5 2.8 11.6c-.8.3-.8 1.4 0 1.7l4.6 1.6 1.8 5.4c.2.7 1.1.9 1.6.4l2.6-2.4 4.7 3.5c.6.4 1.4.1 1.6-.6l3-15.4c.2-.9-.6-1.6-1.4-1.3zM9.6 14.6l8-6.4-6.4 7.4-.3 3z"/>']};
const I=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;

/* ---------------- interface text ---------------- */
const T={
 ar:{app:'Bouhaj Reader',beta:'نسخة تجريبية',heroT:'اقرأ كما تحب أن تقرأ',heroP:'روايات محمد بوهاج في قارئ مصمَّم للقراءة الطويلة، بأوضاع تريح عينيك في الليل وتحت الشمس.',f1:'ضوء الشمعة',f2:'راحة العين',f3:'ضوء الشمس',f4:'ورق كريمي',f5:'صوتان: أنثى وذكر',f6:'وضع الصفحات',cont:'تابع القراءة',novels:'الروايات',chapters:'فصول',chapter:'الفصل',start:'ابدأ القراءة',resume:'تابع من حيث توقفت',more:'بقية الفصول على Amazon',share:'مشاركة',shareT:'شارك مع أصدقائك',shareLead:'اكتب ملاحظتك، ثم اختر أين تنشرها.',fbCopied:'نسخنا ملاحظتك. الصقها في منشور فيسبوك قبل النشر.',copyLink:'نسخ الرابط',copied2:'تم النسخ',sysShare:'خيارات أخرى',lockTag:'Amazon',lockT:'هذا الفصل في النسخة الكاملة',lockP:'الفصلان الأول والثاني مجانيان هنا. تابع بقية الرواية في نسختها الكاملة على Amazon.',lockBtn:'تابع القراءة على Amazon',lockBack:'العودة إلى الفصول',later:'لاحقاً',install:'ثبّت التطبيق',site:'الموقع الرئيسي',back:'رجوع',settings:'إعدادات القراءة',theme:'وضع القراءة',night:'ليلي',cream:'ورق كريمي',day:'نهاري',candle:'شمعة',comfort:'راحة العين',sunlight:'ضوء الشمس',brightness:'الإضاءة',warmth:'دفء الضوء',size:'حجم الخط',font:'الخط',spacing:'تباعد الأسطر',lang:'لغة النص',justify:'ضبط الأسطر',wake:'إبقاء الشاشة مضاءة',flame:'حركة لهب الشمعة',realpaper:'ملمس ورق حقيقي',paperHint:'يظهر مع الأوضاع الفاتحة (كريمي، نهاري، راحة العين)',layout:'طريقة القراءة',scrollM:'تمرير',pagesM:'صفحات',fullscreen:'ملء الشاشة',exitfs:'الخروج من ملء الشاشة',listen:'القراءة الصوتية',voice:'الصوت',female:'أنثى',male:'ذكر',speed:'السرعة',next:'الفصل التالي',prev:'الفصل السابق',toBook:'فهرس الرواية',contents:'الفهرس',loading:'جارٍ تحميل الفصل…',err:'تعذّر تحميل الفصل. تحقق من الاتصال ثم حاول مجدداً.',retry:'إعادة المحاولة',noVoice:'لا يتوفر صوت لهذه اللغة على جهازك. ثبّت الأصوات من إعدادات «تحويل النص إلى كلام» في هاتفك.',sameVoice:'جهازك يوفر صوتاً واحداً لهذه اللغة؛ نغيّر طبقته لتمييز الصوتين.',neural:'صوت عالي الجودة',device:'صوت الجهاز',noTTS:'القراءة الصوتية غير مدعومة في هذا المتصفح.',noFS:'ملء الشاشة غير مدعوم هنا. أضف التطبيق إلى الشاشة الرئيسية ليفتح بملء الشاشة.',noWake:'إبقاء الشاشة مضاءة غير مدعوم في هذا المتصفح.',reading:'يقرأ',paused:'متوقف',done:'انتهى الفصل',of:'من',end:'نهاية الفصل',left:'متبقٍ',minutes:'دقيقة',page:'صفحة',hint:'اضغط على أطراف الصفحة أو اسحب للتقليب',tools:'أدواتي',bookmark:'علامة مرجعية',bookmarkAdd:'أضف علامة',bookmarkDel:'أُزيلت العلامة',bookmarks:'العلامات',highlight:'تظليل',hlAdd:'ظُلِّل',note:'ملاحظة',noteAdd:'أضف ملاحظة',notes:'ملاحظاتي',marks:'ملاحظاتي وعلاماتي',empty:'لا شيء بعد. ظلّل نصاً أو أضف علامة أثناء القراءة.',copy:'نسخ',copied:'نُسخ النص',share:'مشاركة',shareImg:'مشاركة كصورة',quoteShare:'شارك اقتباساً',writeNote:'اكتب ملاحظتك (اختياري)…',makeImg:'أنشئ الصورة',download:'تنزيل',shareNow:'مشاركة',chapters2:'فهرس الفصل',headings:'عناوين الفصل',search:'بحث في الرواية',searchHint:'اكتب كلمة للبحث في كل الفصول…',searching:'جارٍ البحث…',noResults:'لا نتائج',results:'نتيجة',bookProgress:'تقدّم الرواية',stats:'إحصاء القراءة',streak:'سلسلة الأيام',day:'يوم',days:'أيام',thisWeek:'هذا الأسبوع',wordsRead:'كلمة قُرئت',min:'دقيقة',finished:'مكتملة',keepGoing:'واصل القراءة اليوم لتبقي السلسلة!',startedToday:'بدأت سلسلتك اليوم 🔥',jump:'اذهب',del:'حذف',selectHint:'ظلّل نصاً لتظهر الأدوات',by:'بقلم محمد بوهاج'},
 en:{app:'Bouhaj Reader',beta:'Beta',heroT:'Read the way you love to read',heroP:'Mohamed Bouhaj’s novels in a reader built for long reading, with modes that rest your eyes at night and in bright sunlight.',f1:'Candlelight',f2:'Eye comfort',f3:'Sunlight',f4:'Cream paper',f5:'Two voices: female & male',f6:'Page mode',cont:'Continue reading',novels:'Novels',chapters:'chapters',chapter:'Chapter',start:'Start reading',resume:'Resume where you left off',more:'More chapters on Amazon',share:'Share',shareT:'Share with friends',shareLead:'Write your note, then choose where to post it.',fbCopied:'Your note is copied. Paste it into the Facebook post before publishing.',copyLink:'Copy link',copied2:'Copied',sysShare:'More options',lockTag:'Amazon',lockT:'This chapter is in the full edition',lockP:'Chapters one and two are free here. Continue the novel in its full edition on Amazon.',lockBtn:'Continue reading on Amazon',lockBack:'Back to chapters',later:'Later',install:'Install the app',site:'Main website',back:'Back',settings:'Reading settings',theme:'Reading mode',night:'Night',cream:'Cream paper',day:'Day',candle:'Candle',comfort:'Eye comfort',sunlight:'Sunlight',brightness:'Brightness',warmth:'Warmth',size:'Text size',font:'Font',spacing:'Line spacing',lang:'Text language',justify:'Justify',wake:'Keep screen on',flame:'Candle flame motion',realpaper:'Real paper texture',paperHint:'Shows on light modes (cream, day, eye comfort)',layout:'Reading layout',scrollM:'Scroll',pagesM:'Pages',fullscreen:'Full screen',exitfs:'Exit full screen',listen:'Read aloud',voice:'Voice',female:'Female',male:'Male',speed:'Speed',next:'Next chapter',prev:'Previous chapter',toBook:'Book contents',contents:'Contents',loading:'Loading chapter…',err:'Couldn’t load the chapter. Check your connection and try again.',retry:'Try again',noVoice:'No voice is available for this language on your device. Add voices in your phone’s text-to-speech settings.',sameVoice:'Your device has one voice for this language; we change its pitch to tell the two voices apart.',neural:'High-quality voice',device:'Device voice',noTTS:'Read-aloud isn’t supported in this browser.',noFS:'Full screen isn’t supported here. Add the app to your home screen to open it full screen.',noWake:'Keeping the screen on isn’t supported in this browser.',reading:'Reading',paused:'Paused',done:'Chapter finished',of:'of',end:'End of chapter',left:'left',minutes:'min',page:'Page',hint:'Tap the page edges or swipe to turn pages',tools:'My tools',bookmark:'Bookmark',bookmarkAdd:'Add bookmark',bookmarkDel:'Bookmark removed',bookmarks:'Bookmarks',highlight:'Highlight',hlAdd:'Highlighted',note:'Note',noteAdd:'Add note',notes:'My notes',marks:'My notes & marks',empty:'Nothing yet. Highlight text or add a bookmark while reading.',copy:'Copy',copied:'Text copied',share:'Share',shareImg:'Share as image',quoteShare:'Share a quote',writeNote:'Write your note (optional)…',makeImg:'Create image',download:'Download',shareNow:'Share',chapters2:'Chapter outline',headings:'In this chapter',search:'Search the novel',searchHint:'Type a word to search all chapters…',searching:'Searching…',noResults:'No results',results:'results',bookProgress:'Novel progress',stats:'Reading stats',streak:'Day streak',day:'day',days:'days',thisWeek:'This week',wordsRead:'words read',min:'min',finished:'finished',keepGoing:'Keep reading today to keep your streak!',startedToday:'Your streak started today 🔥',jump:'Go',del:'Delete',selectHint:'Select text to see the tools',by:'by Mohamed Bouhaj'},
 fr:{app:'Bouhaj Reader',beta:'Bêta',heroT:'Lisez comme vous aimez lire',heroP:'Les romans de Mohamed Bouhaj dans une liseuse pensée pour la lecture longue, avec des modes qui reposent les yeux la nuit et en plein soleil.',f1:'Lumière de bougie',f2:'Confort des yeux',f3:'Plein soleil',f4:'Papier crème',f5:'Deux voix : féminine et masculine',f6:'Mode pages',cont:'Reprendre la lecture',novels:'Romans',chapters:'chapitres',chapter:'Chapitre',start:'Commencer la lecture',resume:'Reprendre là où vous étiez',more:'Suite des chapitres sur Amazon',share:'Partager',shareT:'Partager avec vos amis',shareLead:'Écrivez votre note, puis choisissez où la publier.',fbCopied:'Votre note est copiée. Collez-la dans la publication Facebook avant de publier.',copyLink:'Copier le lien',copied2:'Copié',sysShare:'Autres options',lockTag:'Amazon',lockT:'Ce chapitre fait partie de l’édition complète',lockP:'Les chapitres un et deux sont gratuits ici. Continuez le roman dans son édition complète sur Amazon.',lockBtn:'Continuer la lecture sur Amazon',lockBack:'Retour aux chapitres',later:'Plus tard',install:'Installer l’application',site:'Site principal',back:'Retour',settings:'Réglages de lecture',theme:'Mode de lecture',night:'Nuit',cream:'Papier crème',day:'Jour',candle:'Bougie',comfort:'Confort des yeux',sunlight:'Plein soleil',brightness:'Luminosité',warmth:'Chaleur',size:'Taille du texte',font:'Police',spacing:'Interligne',lang:'Langue du texte',justify:'Justifier',wake:'Garder l’écran allumé',flame:'Mouvement de la flamme',realpaper:'Texture papier réel',paperHint:'Visible en modes clairs (crème, jour, confort)',layout:'Mode de lecture',scrollM:'Défilement',pagesM:'Pages',fullscreen:'Plein écran',exitfs:'Quitter le plein écran',listen:'Lecture à voix haute',voice:'Voix',female:'Féminine',male:'Masculine',speed:'Vitesse',next:'Chapitre suivant',prev:'Chapitre précédent',toBook:'Sommaire du roman',contents:'Sommaire',loading:'Chargement du chapitre…',err:'Impossible de charger le chapitre. Vérifiez la connexion et réessayez.',retry:'Réessayer',noVoice:'Aucune voix n’est disponible pour cette langue sur votre appareil. Ajoutez des voix dans les réglages de synthèse vocale.',sameVoice:'Votre appareil n’a qu’une voix pour cette langue ; nous changeons sa hauteur pour distinguer les deux voix.',neural:'Voix haute qualité',device:'Voix de l’appareil',noTTS:'La lecture à voix haute n’est pas prise en charge par ce navigateur.',noFS:'Le plein écran n’est pas pris en charge ici. Ajoutez l’application à l’écran d’accueil pour l’ouvrir en plein écran.',noWake:'Ce navigateur ne permet pas de garder l’écran allumé.',reading:'Lecture',paused:'En pause',done:'Chapitre terminé',of:'sur',end:'Fin du chapitre',left:'restantes',minutes:'min',page:'Page',hint:'Touchez les bords ou balayez pour tourner les pages',tools:'Mes outils',bookmark:'Marque-page',bookmarkAdd:'Ajouter un marque-page',bookmarkDel:'Marque-page retiré',bookmarks:'Marque-pages',highlight:'Surligner',hlAdd:'Surligné',note:'Note',noteAdd:'Ajouter une note',notes:'Mes notes',marks:'Mes notes et repères',empty:'Rien pour l’instant. Surlignez du texte ou ajoutez un marque-page.',copy:'Copier',copied:'Texte copié',share:'Partager',shareImg:'Partager en image',quoteShare:'Partager une citation',writeNote:'Écrivez votre note (facultatif)…',makeImg:'Créer l’image',download:'Télécharger',shareNow:'Partager',chapters2:'Plan du chapitre',headings:'Dans ce chapitre',search:'Rechercher dans le roman',searchHint:'Tapez un mot pour chercher dans tous les chapitres…',searching:'Recherche…',noResults:'Aucun résultat',results:'résultats',bookProgress:'Progression du roman',stats:'Statistiques de lecture',streak:'Jours d’affilée',day:'jour',days:'jours',thisWeek:'Cette semaine',wordsRead:'mots lus',min:'min',finished:'terminé',keepGoing:'Lisez aujourd’hui pour garder votre série !',startedToday:'Votre série commence aujourd’hui 🔥',jump:'Aller',del:'Supprimer',selectHint:'Sélectionnez du texte pour voir les outils',by:'par Mohamed Bouhaj'}
};

/* ---------------- settings ---------------- */
const DEF={theme:'night',bright:100,warm:0,size:21,font:'amiri',lh:'2',justify:false,wake:false,rate:1,voice:'female',layout:'scroll',flame:true,sfx:false,paper:false};
let S=Object.assign({},DEF,store.get('rd:settings',{}));
if(!['night','cream','day','candle','comfort','sunlight'].includes(S.theme))S.theme='night';
let L=(()=>{try{return localStorage.getItem('lang')||'ar'}catch(e){return 'ar'}})(); if(!T[L])L='ar';
const t=k=>T[L][k]||T.ar[k]||k;
const save=()=>store.set('rd:settings',S);
let CFG={ttsEndpoint:''};
fetch('/reader/config.json?v=1').then(r=>r.ok?r.json():{}).then(c=>{CFG=Object.assign(CFG,c)}).catch(()=>{});

function applySettings(){
  root.dataset.theme=S.theme; root.dataset.font=S.font; root.dataset.justify=S.justify?'on':'off'; root.dataset.flame=S.flame?'on':'off'; root.dataset.layout=S.layout; root.dataset.paper=S.paper?'on':'off';
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
  $('#justify').classList.toggle('on',S.justify); $('#wake').classList.toggle('on',S.wake); $('#flame').classList.toggle('on',S.flame); $('#sfx')&&$('#sfx').classList.toggle('on',S.sfx); $('#paper')&&$('#paper').classList.toggle('on',S.paper);
  const meta=document.querySelector('meta[name=theme-color]'); if(meta)meta.content=getComputedStyle(root).getPropertyValue('--bg').trim()||'#100d13';
}
function applyLang(){
  root.lang=L; root.dir=L==='ar'?'rtl':'ltr';
  $$('[data-t]').forEach(el=>el.textContent=t(el.dataset.t));
  $$('[data-ic]').forEach(el=>{if(!el.querySelector('svg'))el.insertAdjacentHTML('afterbegin',I(el.dataset.ic))});
  $$('[data-t-ph]').forEach(el=>el.setAttribute('placeholder',t(el.dataset.tPh)));
  document.title=t('app');
}

/* ---------------- data ---------------- */
let LIB=null;
const progress=store.get('rd:progress',{});
const saveProgress=()=>store.set('rd:progress',progress);
async function library(){ if(LIB)return LIB; const r=await fetch('/reader/library.json?v=3'); LIB=await r.json(); return LIB }
const book=id=>LIB.books.find(b=>b.id===id);
const tt=o=>o[L]||o.ar;
const bookPct=b=>{const p=progress[b.id]||{};let n=0,s=0;b.chapters.forEach((c,i)=>{if(c.locked)return;n++;s+=Math.min(1,p[i]||0)});return n?s/n:0};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

/* ---------------- views ---------------- */
function bar(title,backHref,extra=''){
  return `<header class="bar">${backHref?`<a class="icon-btn" href="${backHref}" aria-label="${t('back')}">${I('back','dir')}</a>`:`<div class="brand"><img src="/reader/icons/icon.svg?v=2" alt="" width="34" height="34"><b>Bouhaj Reader</b><em class="beta">${t('beta')}</em></div>`}
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
   ${installed()?'':`<button class="ins-banner" data-act="install"><img src="/reader/icons/icon.svg?v=2" alt="" width="44" height="44"><span><strong>${it('t')}</strong><small>${it('d')}</small></span>${I('download')}</button>`}
   ${cont}
   <h3 class="sec-h">${t('novels')}</h3>
   <div class="books">${LIB.books.map(b=>`<a class="bk" href="#/b/${b.id}"><div class="bk-cover"><img src="${b.cover}" alt="${esc(tt(b.title))}" loading="lazy"></div><strong>${esc(tt(b.title))}</strong><span>${b.chapters.length} ${t('chapters')}</span><div class="meter"><i style="width:${Math.round(bookPct(b)*100)}%"></i></div></a>`).join('')}</div>
   <footer class="lib-foot">${installed()?'':`<button class="install" data-act="install">${I('download')}${t('install')}</button>`}<button class="install" data-act="stats">${I('stats')}${t('stats')}</button><a href="/">${I('home')}${t('site')}</a></footer>
  </main>`;
  window.scrollTo(0,0);
}

async function viewBook(id){
  stopTTS(); setReading(false); await library(); const b=book(id); if(!b)return go('');
  const p=progress[id]||{}; const first=b.chapters.findIndex((c,i)=>!c.locked&&(p[i]||0)<.98); const startAt=first<0?0:first;
  app.innerHTML=bar(tt(b.title),'#/')+`<main class="book">
   <div class="book-top"><img src="${b.cover}" alt=""><div><h2>${esc(tt(b.title))}</h2><p>${esc(tt(b.desc))}</p><div class="book-acts"><a class="btn" href="#/r/${id}/${startAt}">${Object.keys(p).length?t('resume'):t('start')}</a><button class="btn ghost" data-act="shareBook" data-book="${id}">${I('share2')}${t('share')}</button></div></div></div>
   <ol class="chs">${chapterList(b,p)}</ol>
   ${b.more?`<a class="more" href="${b.more}" target="_blank" rel="noopener">${t('more')}${I('ext')}</a>`:''}
  </main>`; window.scrollTo(0,0);
}
function chapterList(b,p,current=-1){
  return b.chapters.map((c,i)=>{if(c.locked)return `<li><a class="ch locked${i===current?' cur':''}" href="#/r/${b.id}/${i}"><b>${I('lock')}</b><span>${esc(tt(c.title))}</span><em class="lk">${t('lockTag')}</em></a></li>`;const v=p[i]||0;return `<li><a class="ch${v>.98?' done':''}${i===current?' cur':''}" href="#/r/${b.id}/${i}"><b>${v>.98?I('check'):i+1}</b><span>${esc(tt(c.title))}</span>${v>.02&&v<=.98?`<em>${Math.round(v*100)}%</em>`:''}</a></li>`}).join('');
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
function setReading(on){ document.body.classList.toggle('reading',on); if(!on){document.body.classList.remove('chrome-hidden');stopTimer()} }
async function viewRead(id,i){
  stopTTS(); await library(); const b=book(id); i=+i; const c=b&&b.chapters[i]; if(!c)return go('#/b/'+id);
  if(c.locked)return viewLocked(b,i);
  cur={b,i,c,page:0,pages:1}; store.set('rd:last',{b:id,c:i}); setReading(true);
  const extra=`<button class="icon-btn" data-act="shareCh" aria-label="${t('share')}">${I('share2')}</button><button class="icon-btn" id="bmBtn" data-act="bm" aria-label="${t('bookmark')}">${I('bookmark')}</button><button class="icon-btn" data-act="marks" aria-label="${t('marks')}">${I('note')}</button><button class="icon-btn hide-sm" data-act="search" aria-label="${t('search')}">${I('search')}</button><button class="icon-btn" data-act="toc" aria-label="${t('contents')}">${I('list')}</button><button class="icon-btn" data-act="tts" aria-label="${t('listen')}">${I('sound')}</button><button class="icon-btn hide-sm" data-act="fs" aria-label="${t('fullscreen')}">${I('full')}</button>`;
  app.innerHTML=bar(tt(b.title),'#/b/'+id,extra)+`<main class="rd" id="rd"><div class="pager" id="pager"><article class="page" id="page"><div class="rd-kick">${t('chapter')} ${i+1} ${t('of')} ${b.chapters.length}</div><h1 class="rd-title">${esc(tt(c.title))}</h1><div class="rd-msg"><div class="spin"></div>${t('loading')}</div></article></div>
   <button class="tap tap-a" data-act="pgA" aria-label="page"></button><button class="tap tap-b" data-act="pgB" aria-label="page"></button></main>
   <div class="bookbar"><i id="bookbar" style="width:0"></i></div><footer class="rd-foot"><span class="rd-left" id="left"></span><div class="meter"><i id="pbar" style="width:0"></i></div><output id="pct">0%</output></footer>
   <aside class="drawer" id="toc" hidden><div class="drawer-h"><strong>${esc(tt(b.title))}</strong><button class="icon-btn" data-act="tocClose" aria-label="close">${I('close')}</button></div><div id="drawerExtra"></div><div class="dr-sec">${t('chapters2')}</div><ol class="chs">${chapterList(b,progress[id]||{},i)}</ol></aside>`;
  window.scrollTo(0,0);
  try{
    const {html,lang}=await loadChapter(b,c);
    if(!cur||cur.c!==c)return;
    const prev=i>0?`<a class="btn ghost" href="#/r/${id}/${i-1}">${t('prev')}</a>`:'';
    const nx=b.chapters[i+1];const next=nx&&nx.locked&&b.more?`<a class="btn amz" href="${b.more}" target="_blank" rel="noopener">${I('amazon')}${t('lockBtn')}</a>`:i<b.chapters.length-1?`<a class="btn" href="#/r/${id}/${i+1}">${t('next')}${I('fwd','dir')}</a>`:(b.more?`<a class="btn" href="${b.more}" target="_blank" rel="noopener">${t('more')}${I('ext')}</a>`:`<a class="btn" href="#/b/${id}">${t('toBook')}</a>`);
    $('.rd-msg').outerHTML=`<div class="txt" lang="${lang}" dir="${lang==='ar'?'rtl':'ltr'}">${html}</div><div class="rd-end"><p class="rd-kick">— ${t('end')} —</p>${next}${prev}<button class="btn ghost" data-act="shareCh">${I('share2')}${t('share')}</button></div>`;
    cur.words=($('.txt').textContent.match(/\S+/g)||[]).length;
    applyMarks(); buildDrawerExtras(); refreshBookmarkBtn(); startTimer(); layoutPages();
    if(pendingFrac!=null){const f=pendingFrac;pendingFrac=null;requestAnimationFrame(()=>gotoFraction(f));}
    else if(pendingMid){const mid=pendingMid;pendingMid=null;requestAnimationFrame(()=>{const el=$('mark[data-mid="'+mid+'"]');if(el)el.scrollIntoView({block:'center'})});}
    else { const saved=(progress[id]||{})[i]||0; if(saved>.02&&saved<.98)requestAnimationFrame(()=>gotoFraction(saved)); }
    if(S.layout==='pages'&&!store.get('rd:hint',false)){toast(t('hint'));store.set('rd:hint',true)}
    update();
  }catch(e){
    $('.rd-msg').innerHTML=`${t('err')}<br><br><button class="btn" id="retry">${t('retry')}</button>`; $('#retry').onclick=()=>viewRead(id,i);
  }
}

function viewLocked(b,i){
  stopTTS(); setReading(false); cur=null; const c=b.chapters[i];
  app.innerHTML=bar(tt(b.title),'#/b/'+b.id)+`<main class="locked-view"><div class="lk-card">
   <div class="lk-cover"><img src="${b.cover}" alt=""><span class="lk-badge">${I('lock')}</span></div>
   <div class="rd-kick">${t('chapter')} ${i+1} ${t('of')} ${b.chapters.length}</div>
   <h1 class="rd-title">${esc(tt(c.title))}</h1>
   <h3>${t('lockT')}</h3><p>${t('lockP')}</p>
   ${b.more?`<a class="btn amz" href="${b.more}" target="_blank" rel="noopener">${I('amazon')}${t('lockBtn')}</a>`:''}
   <a class="btn ghost" href="#/b/${b.id}">${t('lockBack')}</a>
   <button class="btn ghost" data-act="shareBook" data-book="${b.id}">${I('share2')}${t('share')}</button>
  </div></main>`; window.scrollTo(0,0);
}

/* ---------------- share sheet ---------------- */
let shareCtx=null;
const absUrl=u=>new URL(u||'/reader/',location.origin).href;
function openShare(ctx){
  shareCtx=ctx; const m=$('#shareModal');
  $('#shareTitle').textContent=t('shareT'); $('#shareLead').textContent=t('shareLead');
  $('#shareNote').value=ctx.note||''; $('#shareNote').placeholder=t('writeNote');
  $('#sharePrev').innerHTML=`${ctx.quote?`<blockquote>«${esc(ctx.quote.length>220?ctx.quote.slice(0,217)+'…':ctx.quote)}»</blockquote>`:''}<div class="sp-t">${esc(ctx.title)}</div><div class="sp-u">${esc(ctx.url.replace(/^https?:\/\//,''))}</div>`;
  $('#shareBtns').innerHTML=[['fb','Facebook'],['wa','WhatsApp'],['x','X'],['tg','Telegram']].map(([k,n])=>`<button class="sb" data-sh="${k}" style="--c:${BR[k][0]}"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${BR[k][1]}</svg><span>${n}</span></button>`).join('')
   +`<button class="sb" data-sh="copy" style="--c:var(--acc)">${I('link')}<span>${t('copyLink')}</span></button>`
   +(navigator.share?`<button class="sb" data-sh="sys" style="--c:var(--acc)">${I('dots')}<span>${t('sysShare')}</span></button>`:'');
  m.hidden=false; $('#sheetBack').hidden=false; setTimeout(()=>$('#shareNote').focus(),80);
}
function shareText(){ const n=$('#shareNote').value.trim(); return [n, shareCtx.quote?'«'+shareCtx.quote+'»':'', '— '+shareCtx.title].filter(Boolean).join('\n\n') }
async function doShare(k){
  const url=shareCtx.url, txt=shareText(), all=txt+'\n'+url, E=encodeURIComponent;
  const open=u=>window.open(u,'_blank','noopener,width=640,height=640');
  if(k==='fb'){ try{await navigator.clipboard.writeText(txt);toast(t('fbCopied'))}catch(e){} open('https://www.facebook.com/sharer/sharer.php?u='+E(url)) }
  if(k==='wa')open('https://wa.me/?text='+E(all));
  if(k==='x')open('https://twitter.com/intent/tweet?text='+E(txt.length>230?txt.slice(0,227)+'…':txt)+'&url='+E(url));
  if(k==='tg')open('https://t.me/share/url?url='+E(url)+'&text='+E(txt));
  if(k==='copy'){ try{await navigator.clipboard.writeText(all);toast(t('copied2'))}catch(e){prompt('',all)} }
  if(k==='sys'){ try{await navigator.share({title:shareCtx.title,text:txt,url})}catch(e){} }
}
function closeShare(){ $('#shareModal').hidden=true; if($('#marks').hidden&&$('#noteModal').hidden&&$('#quoteModal').hidden)$('#sheetBack').hidden=true }
document.addEventListener('click',e=>{ const b=e.target.closest('[data-sh]'); if(b&&shareCtx)doShare(b.dataset.sh) });
function shareChapter(){ if(!cur)return; openShare({title:tt(cur.c.title)+' · '+tt(cur.b.title),url:absUrl(cur.c.url)}) }
function shareBook(id){ const b=book(id); if(!b)return; const first=b.chapters.find(c=>c.url); openShare({title:tt(b.title),url:absUrl(b.page||(first&&first.url))}) }
function shareQuoteSocial(){ if(!quoteCtx)return; const q=quoteCtx.text, n=$('#quoteText').value.trim(); closeQuote(); openShare({quote:q,note:n,title:cur?tt(cur.c.title)+' · '+tt(cur.b.title):'Bouhaj Reader',url:absUrl(cur&&cur.c.url)}) }

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
function turn(d){ if(!paged())return; sfxPage(); if(cur.page+d>=cur.pages){const n=cur.b.chapters[cur.i+1];if(n)go(`#/r/${cur.b.id}/${cur.i+1}`);return} showPage(cur.page+d) }
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
  const p=progress[cur.b.id]=progress[cur.b.id]||{}; const was=p[cur.i]||0; if(v>was||v<was-.05){p[cur.i]=+v.toFixed(3);saveProgress()} if(was<.98&&v>=.98&&cur.words){addWords(cur.words)} const bb=$('#bookbar'); if(bb)bb.style.width=Math.round(bookPct(cur.b)*100)+'%';
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
$('#paper')&&($('#paper').onclick=()=>{S.paper=!S.paper;save();applySettings();if(S.paper&&!['cream','day','comfort'].includes(S.theme))toast(t('paperHint'))});
$('#sfx')&&($('#sfx').onclick=()=>{S.sfx=!S.sfx;save();applySettings();if(S.sfx)sfxTick()});
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
  if(act==='toc'){ buildDrawerExtras(); $('#toc').hidden=false } if(act==='tocClose'){ $('#toc').hidden=true }
  if(act==='bm')toggleBookmark();
  if(act==='marks')openMarks();
  if(act==='search'){ $('#search').hidden=false; setTimeout(()=>$('#searchInput').focus(),60) }
  if(act==='searchClose')$('#search').hidden=true;
  if(act==='marksClose'){ $('#marks').hidden=true; if($('#noteModal').hidden&&$('#quoteModal').hidden)$('#sheetBack').hidden=true }
  if(act==='selHl')addHighlight('hl');
  if(act==='selNote')addHighlight('note');
  if(act==='selCopy')copySel();
  if(act==='selShare'){ if(selData){openQuote(selData.text,'');getSelection().removeAllRanges();$('#selbar').hidden=true} }
  if(act==='noteSave')saveNote();
  if(act==='noteClose')closeNote();
  if(act==='quoteShare')shareQuote();
  if(act==='quoteDl')downloadQuote();
  if(act==='quoteClose')closeQuote();
  if(act==='shareCh')shareChapter();
  if(act==='shareBook')shareBook(a.dataset.book);
  if(act==='shareClose')closeShare();
  if(act==='quoteSocial')shareQuoteSocial();
  if(act==='stats')go('#/stats');
  if(act==='pgA')turn(root.dir==='rtl'?1:-1); if(act==='pgB')turn(root.dir==='rtl'?-1:1);
  // drawer sub-actions
  const head=a.dataset.head; if(head){ const el=document.getElementById(head); $('#toc').hidden=true; if(el)el.scrollIntoView({behavior:'smooth',block:'start'}) }
  const goCh=a.dataset.go; if(goCh!==undefined&&a.dataset.frac!==undefined){ $('#marks').hidden=true;$('#sheetBack').hidden=true; const f=+a.dataset.frac; if(+goCh===cur.i){gotoFraction(f)}else{pendingFrac=f;go('#/r/'+cur.b.id+'/'+goCh)} }
  const goq=a.closest('[data-goq]'); if(goq){ const ci=+goq.dataset.goq,mid=goq.dataset.mid; $('#marks').hidden=true;$('#sheetBack').hidden=true; if(ci===cur.i){const el=$('mark[data-mid="'+mid+'"]');if(el)el.scrollIntoView({behavior:'smooth',block:'center'})}else{pendingMid=mid;go('#/r/'+cur.b.id+'/'+ci)} }
  const delbm=a.dataset.delbm; if(delbm){ const arr=bmarks[cur.b.id]||[]; const k=arr.findIndex(x=>String(x.ts)===delbm); if(k>=0){arr.splice(k,1);saveBm()} renderMarks(); if(cur)refreshBookmarkBtn() }
  const delmk=a.dataset.delmk; if(delmk){ const ci=+a.dataset.ch; const arr=(marks[cur.b.id]||{})[ci]||[]; const k=arr.findIndex(x=>x.id===delmk); if(k>=0){arr.splice(k,1);saveMarks()} const el=$('mark[data-mid="'+delmk+'"]'); if(el)el.replaceWith(...el.childNodes); renderMarks() }
  const shareq=a.dataset.shareq; if(shareq){ const ci=+a.dataset.ch; const m=((marks[cur.b.id]||{})[ci]||[]).find(x=>x.id===shareq); if(m)openQuote(m.text,m.note||'') }
});
document.addEventListener('click',e=>{ const mk=e.target.closest('mark.hl'); if(mk&&!e.target.closest('[data-act]')){ const m=chapMarks().find(x=>x.id===mk.dataset.mid); if(m)openNoteEditor(m,false) } });
let pendingFrac=null,pendingMid=null;
addEventListener('keydown',e=>{ if(e.key==='Escape'){closeSheet();['#toc','#marks','#search','#noteModal','#quoteModal','#shareModal'].forEach(x=>{const el=$(x);if(el)el.hidden=true});$('#sheetBack')&&($('#sheetBack').hidden=true)} });
document.addEventListener('input',e=>{ if(e.target.id==='searchInput'){clearTimeout(window.__sq);window.__sq=setTimeout(()=>runSearch(e.target.value),300)} });
let tid; function toast(m){ const el=$('#toast'); el.textContent=m; el.hidden=false; clearTimeout(tid); tid=setTimeout(()=>el.hidden=true,4500) }

/* ---------------- install ---------------- */
const IT={
 ar:{t:'ثبّت Bouhaj Reader',d:'أضفه إلى الشاشة الرئيسية ليفتح كتطبيق بملء الشاشة، ويعمل دون إنترنت.',now:'تثبيت الآن',wait:'جارٍ تجهيز التثبيت…',chrome:'افتح في Chrome للتثبيت',inapp:'أنت داخل متصفح تطبيق آخر (مثل إنستغرام) لا يسمح بالتثبيت. سنفتح الصفحة في Chrome، ثم اضغط «تثبيت الآن».',ios1:'اضغط زر المشاركة',ios2:'اختر «إضافة إلى الشاشة الرئيسية»',ios3:'اضغط «إضافة»',iosSafari:'افتح في Safari',iosInapp:'التثبيت على آيفون يتم من Safari فقط. افتح الرابط في Safari ثم اتبع الخطوات:',menu1:'افتح قائمة المتصفح',menu2:'اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية»',menuHint:'إن لم يظهر زر التثبيت تلقائياً، استخدم قائمة المتصفح:',menuOne:'لإتمام التثبيت: افتح قائمة المتصفح ⋮ ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».',menuShort:'أو من قائمة المتصفح ⋮ اختر «تثبيت التطبيق»',noChrome:'هذا المتصفح لا يدعم التثبيت المباشر. افتح الرابط في Chrome لإتمامه.',iosTap:'على آيفون: اضغط زر المشاركة ⬆ ثم «إضافة إلى الشاشة الرئيسية».',opening:'جارٍ فتح Chrome…',done:'التطبيق مثبّت على جهازك',haveIt:'التطبيق مثبّت بالفعل — افتحه من شاشتك الرئيسية. (لإعادة التثبيت: احذفه أولاً ثم جرّب)',later:'لاحقاً',copy:'نسخ الرابط',copied:'تم نسخ الرابط'},
 en:{t:'Install Bouhaj Reader',d:'Add it to your home screen to open it like an app, full screen, even offline.',now:'Install now',wait:'Preparing install…',chrome:'Open in Chrome to install',inapp:'You’re in another app’s browser (like Instagram), which can’t install apps. We’ll open the page in Chrome; then tap “Install now”.',ios1:'Tap the Share button',ios2:'Choose “Add to Home Screen”',ios3:'Tap “Add”',iosSafari:'Open in Safari',iosInapp:'On iPhone, apps are installed from Safari only. Open the link in Safari, then follow these steps:',menu1:'Open the browser menu',menu2:'Choose “Install app” or “Add to Home screen”',menuHint:'If the install button doesn’t appear automatically, use the browser menu:',menuOne:'To finish: open the browser menu ⋮ and choose “Install app” or “Add to Home screen”.',menuShort:'Or from the browser ⋮ menu choose “Install app”',noChrome:'This browser can’t install directly. Open the link in Chrome to finish.',iosTap:'On iPhone: tap Share ⬆ then “Add to Home Screen”.',opening:'Opening Chrome…',done:'The app is installed on your device',haveIt:'Already installed — open it from your home screen. (To reinstall: remove it first, then try again.)',later:'Later',copy:'Copy link',copied:'Link copied'},
 fr:{t:'Installer Bouhaj Reader',d:'Ajoutez-le à l’écran d’accueil pour l’ouvrir comme une application, en plein écran, même hors ligne.',now:'Installer maintenant',wait:'Préparation de l’installation…',chrome:'Ouvrir dans Chrome pour installer',inapp:'Vous êtes dans le navigateur d’une autre application (comme Instagram), qui ne permet pas l’installation. Nous allons ouvrir la page dans Chrome ; touchez ensuite « Installer maintenant ».',ios1:'Touchez le bouton Partager',ios2:'Choisissez « Sur l’écran d’accueil »',ios3:'Touchez « Ajouter »',iosSafari:'Ouvrir dans Safari',iosInapp:'Sur iPhone, l’installation se fait uniquement depuis Safari. Ouvrez le lien dans Safari, puis suivez ces étapes :',menu1:'Ouvrez le menu du navigateur',menu2:'Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil »',menuHint:'Si le bouton d’installation n’apparaît pas automatiquement, utilisez le menu du navigateur :',menuOne:'Pour terminer : ouvrez le menu ⋮ et choisissez « Installer l’application » ou « Sur l’écran d’accueil ».',menuShort:'Ou depuis le menu ⋮ : « Installer l’application »',noChrome:'Ce navigateur n’installe pas directement. Ouvrez le lien dans Chrome pour terminer.',iosTap:'Sur iPhone : touchez Partager ⬆ puis « Sur l’écran d’accueil ».',opening:'Ouverture de Chrome…',done:'L’application est installée sur votre appareil',haveIt:'Déjà installée — ouvrez-la depuis l’écran d’accueil. (Pour réinstaller : supprimez-la d’abord.)',later:'Plus tard',copy:'Copier le lien',copied:'Lien copié'}};
const it=k=>(IT[L]||IT.ar)[k];
const UA=navigator.userAgent||'';
const isAndroid=/Android/i.test(UA), isIOS=/iPhone|iPad|iPod/i.test(UA)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const inApp=/Instagram|FBAN|FBAV|FB_IAB|Messenger|Line\/|TikTok|musical_ly|Snapchat|Twitter|; wv\)/i.test(UA);
const isChrome=/Chrome\/\d/i.test(UA)&&!/EdgA?|OPR|SamsungBrowser|YaBrowser|UCBrowser|Firefox/i.test(UA);
const installed=()=>matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;
// Detect whether THIS reader app (scope /reader/) is installed — ignoring the main-site app whose
// scope "/" also covers this page, so we don't falsely report the reader as installed.
async function alreadyInstalled(){ try{ if(navigator.getInstalledRelatedApps){ const a=await navigator.getInstalledRelatedApps(); return (a||[]).some(x=>/\/reader\//.test(x.url||x.id||'')); } }catch(e){} return false; }
const INSTALL_URL='https://go.bouhaj.com/reader/?install=1';
let deferred=null, auto=new URLSearchParams(location.search).has('install');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;document.body.classList.add('can-install');
  // Arrived from "open in Chrome" → fire the system dialog with no extra tap.
  if(auto&&!installed()){auto=false;tryInstall();}});
addEventListener('appinstalled',()=>{deferred=null;closeInstall();toast(it('done'))});
// Open this same page in Chrome (from Instagram/other in-app browsers or non-Chrome browsers).
// If Chrome doesn't take over the screen within ~1.4s, fall back to a one-line menu hint.
function openInChrome(){
  toast(it('opening')); const start=Date.now();
  const fb=setTimeout(()=>{ if(!document.hidden&&Date.now()-start<3000)menuFallback(); },1400);
  const vh=()=>{ if(document.hidden){clearTimeout(fb);removeEventListener('visibilitychange',vh);} };
  addEventListener('visibilitychange',vh);
  try{ location.href='intent://go.bouhaj.com/reader/?install=1#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url='+encodeURIComponent(INSTALL_URL)+';end'; }
  catch(e){ clearTimeout(fb); menuFallback(); }
}
function openInSafari(){ location.href='x-safari-https://go.bouhaj.com/reader/?install=1' }
// Last resort when no native prompt and Chrome can't take over: one clear line pointing at the browser menu.
function menuFallback(){ showSheet(); const card=$('.ins-card'); if(card&&!card.querySelector('.ins-hint')){ const p=document.createElement('p'); p.className='ins-hint'; p.innerHTML=I('dots')+' '+it('menuOne'); const f=card.querySelector('.ins-feats'); (f||card.querySelector('.ins-d')).after(p); } toast(it('menuOne')); }
// The only two buttons: «Install now» + «Later». No manual browser-menu steps, ever.
function sheetHTML(){
  const feats=[['candle','f1'],['eye','f2'],['voice','f5'],['pages','f6']];
  const hint=isIOS?`<p class="ins-hint">${it('iosTap')}</p>`:'';
  const menu=isIOS?'':`<p class="ins-menu">${it('menuShort')}</p>`;
  return `<div class="ins-card"><div class="ins-logo"><img src="/reader/icons/icon.svg?v=2" alt="" width="88" height="88"></div><h3>${it('t')}</h3><p class="ins-d">${it('d')}</p><ul class="ins-feats">${feats.map(([i,k])=>`<li>${I(i)}<span>${t(k)}</span></li>`).join('')}</ul>${hint}<div class="ins-btns"><button class="btn big" id="insNow">${I('download')}${it('now')}</button><button class="btn ghost" id="insLater">${it('later')}</button></div>${menu}</div>`;
}
function refreshSheet(){ const sh=$('#installSheet'); if(!sh||sh.hidden)return; sh.innerHTML=sheetHTML(); bindSheet() }
function bindSheet(){
  $('#insNow')&&($('#insNow').onclick=tryInstall);
  $('#insLater')&&($('#insLater').onclick=()=>{try{localStorage.setItem('rd:insLater',String(Date.now()))}catch(e){}closeInstall()});
}
// One action for «Install now»: native prompt if ready, else jump straight to Chrome.
async function tryInstall(){
  if(installed()){ toast(it('done')); return closeInstall(); }
  // Best path: the browser's own install prompt (Chrome/Edge/Samsung/Brave on Android, desktop Chrome/Edge).
  if(deferred){ const d=deferred; deferred=null; document.body.classList.remove('can-install');
    try{ d.prompt(); const r=await d.userChoice; if(r&&r.outcome==='accepted')closeInstall(); }catch(e){ menuFallback(); } return; }
  if(isIOS){ if(inApp||/CriOS|FxiOS/i.test(UA))return openInSafari(); return toast(it('iosTap')); }
  // In-app browser (Instagram/FB…) or a non-Chrome Android browser → hand off to Chrome, where it can install.
  if(inApp||(isAndroid&&!isChrome)) return openInChrome();
  // Capable browser but no prompt offered: usually because it's already installed — say so clearly.
  if(await alreadyInstalled()){ toast(it('haveIt')); return; }
  // Otherwise the prompt just isn't being offered (recently dismissed, or not yet eligible) — one-line menu hint.
  return menuFallback();
}
function openInstall(){ if(installed())return toast(it('done')); showSheet(); }
function showSheet(){ let sh=$('#installSheet'); if(!sh){sh=document.createElement('div');sh.id='installSheet';sh.className='ins';document.body.appendChild(sh)} sh.hidden=false; sh.innerHTML=sheetHTML(); bindSheet() }
function closeInstall(){ const sh=$('#installSheet'); if(sh)sh.hidden=true }
const doInstall=openInstall;
document.addEventListener('click',e=>{ if(e.target.closest('[data-act=install]'))openInstall() });
if('serviceWorker' in navigator)addEventListener('load',()=>navigator.serviceWorker.register('/reader/sw.js',{scope:'/reader/'}).catch(()=>{}));
// Arriving from "open in Chrome": if the native prompt doesn't fire in time, still show the two-button card.
if(auto&&!installed())setTimeout(()=>{if(auto&&!installed())showSheet();},1400);
// First visit in a plain browser: offer the card once (one tap then installs). Hidden for 3 days after "Later".
(function(){ if(installed()||auto)return; let last=0; try{last=+localStorage.getItem('rd:insLater')||0}catch(e){} if(Date.now()-last<3*864e5)return;
  const show=()=>{ if(!installed()&&(($('#installSheet')||{}).hidden!==false))showSheet() };
  if(isAndroid||isIOS){ setTimeout(show,deferred?600:1800) } else { addEventListener('beforeinstallprompt',()=>setTimeout(show,600),{once:true}) }
})();

/* ================= Pro features: marks, notes, bookmarks, stats, quote card, search, SFX ================= */
const marks=store.get('rd:marks',{});       // {book:{chap:[{id,type,text,para,note,color,ts}]}}
const bmarks=store.get('rd:bookmarks',{});   // {book:[{chapter,frac,snippet,ts}]}
const saveMarks=()=>store.set('rd:marks',marks);
const saveBm=()=>store.set('rd:bookmarks',bmarks);
const chapMarks=()=>cur?((marks[cur.b.id]=marks[cur.b.id]||{})[cur.i]=(marks[cur.b.id]||{})[cur.i]||[]):[];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const HLCOLORS=['#ffd36a','#7ee6c6','#9fd0ff','#ff9a8b','#c3a6ff'];

/* ---- reading stats ---- */
const stats=store.get('rd:stats',{days:{},words:0});
const today=()=>new Date().toISOString().slice(0,10);
function addSeconds(sec){ const d=today(); stats.days[d]=(stats.days[d]||0)+sec; store.set('rd:stats',stats) }
function addWords(n){ stats.words=(stats.words||0)+n; store.set('rd:stats',stats) }
function streak(){ let s=0; const d=new Date(); for(;;){ const k=d.toISOString().slice(0,10); if((stats.days[k]||0)>=30){s++;d.setDate(d.getDate()-1)} else { if(k===today()&&s===0&&(stats.days[k]||0)>0){s++;d.setDate(d.getDate()-1);continue} break } } return s }
let timer=null,tick=0;
function startTimer(){ stopTimer(); timer=setInterval(()=>{ if(document.visibilityState==='visible'&&document.body.classList.contains('reading')){ tick+=5; if(tick>=15){addSeconds(15);tick=0} } },5000) }
function stopTimer(){ if(timer){clearInterval(timer);timer=null} }

/* ---- sound effects (generated in code, optional) ---- */
let actx=null; const AC=()=>actx||(actx=new (window.AudioContext||window.webkitAudioContext)());
function sfxPage(){ if(!S.sfx)return; try{ const c=AC(),t=c.currentTime,buf=c.createBuffer(1,c.sampleRate*0.3,c.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++){const e=1-i/d.length;d[i]=(Math.random()*2-1)*e*e*0.5}
  const src=c.createBufferSource();src.buffer=buf; const f=c.createBiquadFilter();f.type='bandpass';f.frequency.setValueAtTime(1200,t);f.frequency.exponentialRampToValueAtTime(3500,t+0.18);f.Q.value=0.7;
  const g=c.createGain();g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.35,t+0.03);g.gain.exponentialRampToValueAtTime(0.0001,t+0.28);
  src.connect(f);f.connect(g);g.connect(c.destination);src.start(t);src.stop(t+0.3);
}catch(e){} }
function sfxTick(){ if(!S.sfx)return; try{ const c=AC(),t=c.currentTime,o=c.createOscillator(),g=c.createGain();o.type='sine';o.frequency.setValueAtTime(880,t);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(0.12,t+0.005);g.gain.exponentialRampToValueAtTime(0.0001,t+0.08);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+0.09) }catch(e){} }

/* ---- highlights: apply saved marks to the loaded chapter ---- */
function blockEls(){ return [...($('.txt')?.querySelectorAll(':scope > p, :scope > blockquote, :scope > h2, :scope > h3, :scope > ul > li, :scope > ol > li')||[])] }
function applyMarks(){
  const list=chapMarks(); if(!list.length)return; const blocks=blockEls();
  list.filter(m=>m.type!=='bm').forEach(m=>{ const el=blocks[m.para]; if(!el)return; wrapFirst(el,m.text,m.id,m.color,m.type) });
}
function wrapFirst(el,text,id,color,type){
  const w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT); let n,acc='',target=null,start=0; const norm=text.replace(/\s+/g,' ').trim();
  // find a text node whose content (joined) contains the target; simplest: search within el.textContent first occurrence
  const full=el.textContent; const idx=full.replace(/\s+/g,' ').indexOf(norm); if(idx<0)return;
  // map normalized idx back approximately by walking
  let plain=0,realStart=-1,realEnd=-1,node; const w2=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  const map=[]; while(node=w2.nextNode()){ for(let k=0;k<node.nodeValue.length;k++){ map.push([node,k]) } }
  // build normalized string with index map
  let norS='',norMap=[];for(let p=0;p<map.length;p++){const ch=map[p][1]<map[p][0].nodeValue.length?map[p][0].nodeValue[map[p][1]]:'';const c=ch.replace(/\s/g,' ');if(c===' '&&norS.endsWith(' '))continue;norS+=c;norMap.push(p)}
  const ni=norS.indexOf(norm); if(ni<0)return; const a=norMap[ni],b=norMap[Math.min(ni+norm.length-1,norMap.length-1)];
  try{ const r=document.createRange(); r.setStart(map[a][0],map[a][1]); r.setEnd(map[b][0],map[b][1]+1);
    const mk=document.createElement('mark'); mk.className='hl'+(type==='note'?' has-note':''); mk.dataset.mid=id; mk.style.setProperty('--hlc',color||HLCOLORS[0]);
    r.surroundContents(mk);
  }catch(e){}
}

/* ---- selection popover ---- */
function selInfo(){
  const sel=getSelection(); if(!sel||sel.isCollapsed)return null; const txt=sel.toString().trim(); if(txt.length<2)return null;
  const r=sel.getRangeAt(0); let node=r.commonAncestorContainer; if(node.nodeType===3)node=node.parentElement; if(!node.closest||!node.closest('.txt'))return null;
  const blocks=blockEls(); let el=node; while(el&&el.parentElement&&!blocks.includes(el))el=el.parentElement;
  const para=blocks.indexOf(el); const rect=r.getBoundingClientRect();
  return {text:txt,para,rect};
}
let selData=null;
function showSelBar(){
  const info=selInfo(); const bar=$('#selbar'); if(!info){bar.hidden=true;selData=null;return}
  selData=info; bar.hidden=false;
  const touch=matchMedia('(pointer:coarse)').matches;
  bar.classList.toggle('docked',touch);
  if(touch){ // phones: keep clear of the system copy/share menu, which sits next to the selection
    const nearBottom=info.rect.bottom>innerHeight-170; bar.style.left='50%';
    if(nearBottom){bar.style.top='calc(env(safe-area-inset-top,0px) + 74px)';bar.style.bottom='auto'}else{bar.style.top='auto';bar.style.bottom='calc(env(safe-area-inset-bottom,0px) + 64px)'}
    return }
  bar.style.bottom='auto';
  const bw=bar.offsetWidth||300, x=Math.min(Math.max(info.rect.left+info.rect.width/2,bw/2+8),innerWidth-bw/2-8);
  let y=info.rect.top-bar.offsetHeight-14; if(y<70)y=info.rect.bottom+14;
  bar.style.left=x+'px'; bar.style.top=y+'px';
}
document.addEventListener('selectionchange',()=>{ if(!document.body.classList.contains('reading'))return; clearTimeout(window.__st); window.__st=setTimeout(showSelBar,180) });
document.addEventListener('scroll',()=>{ const b=$('#selbar'); if(b&&!b.hidden&&!b.classList.contains('docked'))b.hidden=true },true);

function addHighlight(type){
  if(!selData)return; const list=chapMarks(); const color=HLCOLORS[list.length%HLCOLORS.length];
  const m={id:uid(),type:type,text:selData.text,para:selData.para,color,ts:Date.now()};
  if(type==='note'){ m.note=''; openNoteEditor(m,true); }
  list.push(m); saveMarks(); const blocks=blockEls(); wrapFirst(blocks[m.para],m.text,m.id,m.color,m.type);
  getSelection().removeAllRanges(); $('#selbar').hidden=true; sfxTick();
  if(type==='hl')toast(t('hlAdd'));
}
function copySel(){ if(!selData)return; navigator.clipboard?.writeText(selData.text).then(()=>toast(t('copied'))).catch(()=>{}); $('#selbar').hidden=true; getSelection().removeAllRanges() }

/* ---- bookmarks ---- */
function isBookmarked(){ return (bmarks[cur.b.id]||[]).some(x=>x.chapter===cur.i&&Math.abs(x.frac-fraction())<0.03) }
function toggleBookmark(){
  const arr=bmarks[cur.b.id]=bmarks[cur.b.id]||[]; const f=fraction();
  const near=arr.findIndex(x=>x.chapter===cur.i&&Math.abs(x.frac-f)<0.04);
  if(near>=0){ arr.splice(near,1); toast(t('bookmarkDel')) }
  else { const snip=currentSnippet(); arr.push({chapter:cur.i,frac:+f.toFixed(3),snippet:snip,ts:Date.now()}); toast(t('bookmarkAdd')); sfxTick() }
  saveBm(); refreshBookmarkBtn();
}
function currentSnippet(){ const blocks=blockEls(); for(const el of blocks){ const r=el.getBoundingClientRect(); if(r.bottom>120){ return el.textContent.trim().slice(0,80) } } return '' }
function refreshBookmarkBtn(){ const b=$('#bmBtn'); if(b)b.innerHTML=I(isBookmarked()?'bookmarkOn':'bookmark') }

/* ---- in-chapter headings + marks into the drawer ---- */
function buildDrawerExtras(){
  const d=$('#toc'); if(!d)return; const heads=[...($('.txt')?.querySelectorAll('h2,h3')||[])];
  let html='';
  if(heads.length){ heads.forEach((h,k)=>{h.id='h'+k}); html+=`<div class="dr-sec">${t('headings')}</div><ol class="chs">`+heads.map((h,k)=>`<li><a class="ch" data-head="h${k}"><span>${esc(h.textContent)}</span></a></li>`).join('')+'</ol>'; }
  const inject=$('#drawerExtra'); if(inject)inject.innerHTML=html;
}

/* ---- marks & notes view (drawer) ---- */
function openMarks(){ renderMarks(); $('#marks').hidden=false; $('#sheetBack').hidden=false }
function renderMarks(){
  const bm=(bmarks[cur.b.id]||[]).map(x=>({...x,kind:'bm'}));
  const ms=[]; const byBook=marks[cur.b.id]||{}; Object.keys(byBook).forEach(ci=>byBook[ci].forEach(m=>ms.push({...m,chapter:+ci,kind:'mk'})));
  const all=[...bm,...ms].sort((a,b)=>(a.chapter-b.chapter)||((a.frac||0)-(b.frac||0))||(a.ts-b.ts));
  const body=$('#marksBody');
  if(!all.length){ body.innerHTML=`<p class="dr-empty">${t('empty')}</p>`; return }
  body.innerHTML=all.map(m=>{
    const chTitle=esc(tt(cur.b.chapters[m.chapter]?.title||''));
    if(m.kind==='bm')return `<div class="mkrow" data-go="${m.chapter}" data-frac="${m.frac}"><span class="mkico">${I('bookmark')}</span><div class="mktx"><small>${chTitle}</small><span>${esc(m.snippet||'')}…</span></div><button class="icon-btn mkdel" data-delbm="${m.ts}" data-ch="${m.chapter}">${I('trash')}</button></div>`;
    return `<div class="mkrow"><span class="mkico" style="color:${m.color}">${I(m.type==='note'?'note':'hl')}</span><div class="mktx" data-goq="${m.chapter}" data-mid="${m.id}"><small>${chTitle}</small><span class="mkq">“${esc(m.text)}”</span>${m.note?`<em class="mknote">${esc(m.note)}</em>`:''}</div><button class="icon-btn mkshare" data-shareq="${m.id}" data-ch="${m.chapter}">${I('share2')}</button><button class="icon-btn mkdel" data-delmk="${m.id}" data-ch="${m.chapter}">${I('trash')}</button></div>`;
  }).join('');
}

/* ---- note editor ---- */
let noteCtx=null;
function openNoteEditor(m,isNew){ noteCtx={m,isNew}; $('#noteText').value=m.note||''; $('#noteModal').hidden=false; $('#sheetBack').hidden=false; setTimeout(()=>$('#noteText').focus(),50) }
function saveNote(){ if(!noteCtx)return; noteCtx.m.note=$('#noteText').value.trim(); if(noteCtx.m.type==='hl'&&noteCtx.m.note)noteCtx.m.type='note'; saveMarks(); const el=$(`mark[data-mid="${noteCtx.m.id}"]`); if(el&&noteCtx.m.note)el.classList.add('has-note'); closeNote(); if(!$('#marks').hidden)renderMarks() }
function closeNote(){ $('#noteModal').hidden=true; if($('#marks').hidden&&$('#quoteModal').hidden)$('#sheetBack').hidden=true }

/* ---- quote share card (canvas, fully drawn) ---- */
let quoteCtx=null;
function openQuote(text,noteTxt){ quoteCtx={text,note:noteTxt||''}; $('#quoteText').value=noteTxt||''; $('#quoteModal').hidden=false; $('#sheetBack').hidden=false; drawQuote(); }
function wrapText(ctx,text,maxW){ const words=text.split(/\s+/),lines=[];let line='';for(const w of words){const test=line?line+' '+w:w;if(ctx.measureText(test).width>maxW&&line){lines.push(line);line=w}else line=test}if(line)lines.push(line);return lines }
function drawQuote(){
  const cv=$('#quoteCanvas'),ctx=cv.getContext('2d'),W=1080,H=1350; cv.width=W;cv.height=H;
  const acc=cur?.b.accent||'#d8a75a';
  const g=ctx.createLinearGradient(0,0,W,H); g.addColorStop(0,'#141019'); g.addColorStop(1,'#0a0710'); ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  const rg=ctx.createRadialGradient(W*0.8,H*0.1,60,W*0.8,H*0.1,700); rg.addColorStop(0,acc+'44'); rg.addColorStop(1,'transparent'); ctx.fillStyle=rg; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle=acc+'88'; ctx.lineWidth=3; ctx.strokeRect(46,46,W-92,H-92);
  ctx.direction='rtl'; ctx.textAlign='center'; ctx.fillStyle=acc; ctx.font='700 90px Amiri, serif'; ctx.fillText('”',W/2,210);
  const q=quoteCtx.text.length>300?quoteCtx.text.slice(0,297)+'…':quoteCtx.text;
  const isAr=/[؀-ۿ]/.test(q); ctx.direction=isAr?'rtl':'ltr';
  ctx.fillStyle='#f3ead9'; let fs=q.length>180?44:q.length>90?54:64; ctx.font=`${isAr?'700':'400'} ${fs}px ${isAr?'Amiri, serif':'Lora, Georgia, serif'}`;
  const lines=wrapText(ctx,q,W-220); const lh=fs*1.6; let y=H/2-(lines.length*lh)/2+40;
  lines.forEach(l=>{ctx.fillText(l,W/2,y);y+=lh});
  if(quoteCtx.note){ ctx.fillStyle='#b9a98f'; ctx.font='italic 34px '+(isAr?'Amiri, serif':'Lora, serif'); const nl=wrapText(ctx,quoteCtx.note,W-260); let ny=y+30; nl.slice(0,3).forEach(l=>{ctx.fillText(l,W/2,ny);ny+=46}); }
  ctx.strokeStyle=acc; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(W/2-90,H-220); ctx.lineTo(W/2+90,H-220); ctx.stroke();
  ctx.direction='rtl'; ctx.fillStyle='#f3ead9'; ctx.font='700 40px Amiri, serif'; ctx.fillText(cur?tt(cur.b.title):'',W/2,H-160);
  ctx.fillStyle=acc; ctx.font='600 30px "IBM Plex Sans Arabic", sans-serif'; ctx.fillText(t('by'),W/2,H-112);
  ctx.fillStyle='#8c8273'; ctx.font='600 26px "JetBrains Mono", monospace'; ctx.direction='ltr'; ctx.fillText('go.bouhaj.com/reader',W/2,H-66);
}
function quoteBlob(){ return new Promise(res=>$('#quoteCanvas').toBlob(res,'image/jpeg',0.92)) }
async function shareQuote(){
  quoteCtx.note=$('#quoteText').value.trim(); drawQuote(); const blob=await quoteBlob(); const file=new File([blob],'bouhaj-quote.jpg',{type:'image/jpeg'});
  const shareText=(quoteCtx.note?quoteCtx.note+'\n\n':'')+'«'+quoteCtx.text+'»\n— '+(cur?tt(cur.b.title):'')+' · go.bouhaj.com/reader';
  if(navigator.canShare&&navigator.canShare({files:[file]})){ try{ await navigator.share({files:[file],text:shareText}); return }catch(e){} }
  downloadQuote();
}
function downloadQuote(){ $('#quoteCanvas').toBlob(b=>{ const u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='bouhaj-quote.jpg';a.click();setTimeout(()=>URL.revokeObjectURL(u),2000) },'image/jpeg',0.92) }
function closeQuote(){ $('#quoteModal').hidden=true; if($('#marks').hidden&&$('#noteModal').hidden)$('#sheetBack').hidden=true }

/* ---- in-book search ---- */
const searchCache={};
async function chapterText(b,c){ const k=b.id+'/'+c.url; if(searchCache[k])return searchCache[k]; try{const {html}=await loadChapter(b,c);const d=document.createElement('div');d.innerHTML=html;searchCache[k]=d.textContent}catch(e){searchCache[k]=''} return searchCache[k] }
async function runSearch(q){
  q=q.trim(); const body=$('#searchBody'); if(q.length<2){body.innerHTML='';return}
  body.innerHTML=`<p class="dr-empty"><span class="spin"></span> ${t('searching')}</p>`;
  const b=cur.b, hits=[];
  for(let ci=0;ci<b.chapters.length;ci++){ const c=b.chapters[ci]; if(c.locked||!c.url)continue; const txt=await chapterText(b,c); const lo=txt.toLowerCase(),ql=q.toLowerCase(); let idx=lo.indexOf(ql),count=0;
    while(idx>=0&&count<3){ const s=Math.max(0,idx-40),e=Math.min(txt.length,idx+q.length+40); hits.push({ci,snip:txt.slice(s,e),idx}); count++; idx=lo.indexOf(ql,idx+q.length) } }
  if(!hits.length){ body.innerHTML=`<p class="dr-empty">${t('noResults')}</p>`; return }
  body.innerHTML=`<p class="dr-count">${hits.length} ${t('results')}</p>`+hits.map(h=>{ const re=new RegExp('('+q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig'); const snip=esc(h.snip).replace(re,'<b>$1</b>'); return `<a class="mkrow" href="#/r/${cur.b.id}/${h.ci}"><div class="mktx"><small>${esc(tt(b.chapters[h.ci].title))}</small><span>…${snip}…</span></div></a>` }).join('');
}

/* ---- reading stats view ---- */
function viewStats(){
  stopTTS(); setReading(false);
  const total=Object.values(stats.days).reduce((a,b)=>a+b,0); const wk=weekSeconds(); const st=streak();
  app.innerHTML=bar(t('stats'),'#/')+`<main class="lib"><section class="stats-wrap">
    <div class="stat-hero"><div class="stat-fire">${I('fire')}</div><div><b>${st}</b><span>${st===1?t('day'):t('days')} · ${t('streak')}</span></div></div>
    <div class="stat-grid">
      <div class="stat-card"><b>${Math.round(wk/60)}</b><span>${t('min')} · ${t('thisWeek')}</span></div>
      <div class="stat-card"><b>${Math.round(total/60)}</b><span>${t('min')} · ${L==='ar'?'المجموع':'total'}</span></div>
      <div class="stat-card"><b>${(stats.words||0).toLocaleString()}</b><span>${t('wordsRead')}</span></div>
    </div>
    <div class="stat-week">${weekBars()}</div>
    <h3 class="sec-h">${t('novels')}</h3>
    <div class="stat-books">${LIB.books.map(b=>{const p=Math.round(bookPct(b)*100);return `<a class="stat-book" href="#/b/${b.id}"><img src="${b.cover}" alt=""><div><strong>${esc(tt(b.title))}</strong><div class="meter"><i style="width:${p}%"></i></div><span>${p}% ${p>=98?t('finished'):''}</span></div></a>`}).join('')}</div>
    <p class="stat-note">${st?(stats.days[today()]?'':t('keepGoing')):''}</p>
  </section></main>`;
  window.scrollTo(0,0);
}
function weekSeconds(){ let s=0;const d=new Date();for(let k=0;k<7;k++){s+=stats.days[d.toISOString().slice(0,10)]||0;d.setDate(d.getDate()-1)}return s }
function weekBars(){ const days=[],names=L==='ar'?['أحد','إثن','ثلا','أرب','خمي','جمع','سبت']:L==='fr'?['D','L','M','M','J','V','S']:['S','M','T','W','T','F','S'];
  const arr=[];const d=new Date();d.setDate(d.getDate()-6); let max=1;
  for(let k=0;k<7;k++){const sec=stats.days[d.toISOString().slice(0,10)]||0;arr.push({sec,dn:names[d.getDay()]});max=Math.max(max,sec);d.setDate(d.getDate()+1)}
  return arr.map(a=>`<div class="wkbar"><div class="wkb" style="height:${Math.max(6,a.sec/max*90)}px"></div><small>${a.dn}</small></div>`).join('');
}

/* ---------------- router ---------------- */
function go(h){ location.hash=h }
function route(){
  closeSheet(); document.body.classList.remove('chrome-hidden');
  const h=location.hash.replace(/^#\/?/,'').split('/');
  if(h[0]==='b'&&h[1])return viewBook(h[1]);
  if(h[0]==='stats')return viewStats();
  if(h[0]==='r'&&h[1])return viewRead(h[1],h[2]||0);
  return viewLibrary();
}
addEventListener('hashchange',route);
applyLang(); applySettings(); if(S.wake)wake(); route();
})();
