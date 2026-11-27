/* Bouhaj Reader — cinematic trailer engine.
   One deterministic timeline renderAt(t) drives both the live play (with
   Web-Audio sound generated in code) and the frame-by-frame video capture. */
(()=>{
'use strict';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const q=new URLSearchParams(location.search);
const CAP=q.get('capture')==='1';

const BOOKS={
  wadi:{acc:'#e5bd79',cover:'/assets/wadi-al-aql-cover.jpg',root:110.0,
    title:{ar:'وادي العقل',en:'Wadi Al-Aql',fr:'Wadi Al-Aql'},
    kick:{ar:'رواية · محمد بوهاج',en:'A novel · Mohamed Bouhaj',fr:'Un roman · Mohamed Bouhaj'},
    tag:{ar:'في وادٍ لا تبلغه الخطى، يسكن العقلُ الذي لا يُقهَر.',en:'In a valley no footstep reaches, dwells the mind that cannot be conquered.',fr:'Dans une vallée qu’aucun pas n’atteint vit l’esprit qu’on ne peut vaincre.'},
    quote:{ar:'مَن عرف وادي العقل، لم يَعُد يخاف الطريق.',en:'Whoever knows the Valley of the Mind fears the road no more.',fr:'Qui connaît la Vallée de l’Esprit ne craint plus le chemin.'}},
  marudai:{acc:'#b06cff',cover:'/assets/marudai-cover-v2.jpg',root:97.999,
    title:{ar:'آخر المتمردين: ماروداي',en:'The Last Rebel: Marudai',fr:'Le Dernier Rebelle : Marudai'},
    kick:{ar:'رواية · محمد بوهاج',en:'A novel · Mohamed Bouhaj',fr:'Un roman · Mohamed Bouhaj'},
    tag:{ar:'آخرُ المتمردين لا ينتصر نصراً نهائياً… لكنه لا يستسلم أبداً.',en:'The last rebel wins no final victory… yet never surrenders.',fr:'Le dernier rebelle ne gagne aucune victoire finale… mais ne cède jamais.'},
    quote:{ar:'رأى التنينَ الأرجواني، فعرف أن الخوفَ مجردُ ظلّ.',en:'He saw the violet dragon, and knew fear was only a shadow.',fr:'Il vit le dragon violet et sut que la peur n’était qu’une ombre.'}},
  rebellious:{acc:'#58baff',cover:'/assets/rebellious-novel-cover-v2.jpg',root:123.47,
    title:{ar:'الرواية المتمردة',en:'The Rebellious Novel',fr:'Le Roman rebelle'},
    kick:{ar:'رواية · محمد بوهاج',en:'A novel · Mohamed Bouhaj',fr:'Un roman · Mohamed Bouhaj'},
    tag:{ar:'حين يرفض القلبُ أن يُطيع، تبدأ الحكاية.',en:'When the heart refuses to obey, the story begins.',fr:'Quand le cœur refuse d’obéir, l’histoire commence.'},
    quote:{ar:'تمرّدٌ واحد يكفي ليغيّرَ مصيراً.',en:'A single act of defiance is enough to change a fate.',fr:'Un seul acte de révolte suffit à changer un destin.'}}
};
const UI={
  present:{ar:'يُقدّم',en:'presents',fr:'présente'},
  cta:{ar:'ابدأ القراءة الآن',en:'Start reading now',fr:'Commencez à lire'},
  read:{ar:'اقرأ الرواية',en:'Read the novel',fr:'Lire le roman'},
  replay:{ar:'إعادة',en:'Replay',fr:'Rejouer'},
  gateT:{ar:'تريلر الرواية',en:'Novel trailer',fr:'Bande-annonce'},
  gateP:{ar:'تجربة قصيرة بالصوت. اضغط للتشغيل.',en:'A short experience with sound. Tap to play.',fr:'Une courte expérience sonore. Appuyez pour lancer.'}
};
const ORDER=['wadi','marudai','rebellious'];
let BK=ORDER.includes(q.get('book'))?q.get('book'):'wadi';
let L=['ar','en','fr'].includes(q.get('lang'))?q.get('lang'):'ar';
const DUR=18.5; // seconds

/* ---------- helpers ---------- */
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const easeOut=x=>1-Math.pow(1-x,3);
const easeIO=x=>x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;
// ramp 0..1 across [a,b] (eased)
const up=(t,a,b)=>easeOut(clamp((t-a)/(b-a),0,1));
// window: fade in a→b, hold, fade out c→d
const win=(t,a,b,c,d)=>clamp((t-a)/(b-a),0,1)*(d?(1-clamp((t-c)/(d-c),0,1)):1);
const fr=i=>{const x=Math.sin(i*12.9898)*43758.5453;return x-Math.floor(x);};

/* ---------- build embers ---------- */
const wrap=$('#wrap'); const EMB=[];
for(let i=0;i<16;i++){const e=document.createElement('div');e.className='ember';wrap.appendChild(e);EMB.push(e);}

/* ---------- apply book/lang text ---------- */
function applyBook(){
  const b=BOOKS[BK];
  document.documentElement.style.setProperty('--acc',b.acc);
  document.querySelector('meta[name=theme-color]').content='#05060a';
  $('#cover').src=b.cover;
  $('#title').textContent=b.title[L]; $('#title').className=L;
  $('#kick').textContent=b.kick[L];
  $('#tagline').textContent=b.tag[L];
  $('#quoteT').textContent=b.quote[L]; $('#quote').className=L;
  $('#presentMain').textContent=UI.present[L];
  $('#ctaT').textContent=b.title[L];
  $('#ctaLbl').textContent=UI.cta[L];
  $('#ctaBtn').href='/reader/#/book/'+BK;
  $('#readBtn').href='/reader/#/book/'+BK; $('#readBtn').textContent=UI.read[L];
  $('#replayBtn').textContent=UI.replay[L];
  $('#gateT').textContent=UI.gateT[L]; $('#gateP').textContent=UI.gateP[L];
  document.documentElement.lang=L; document.documentElement.dir=L==='ar'?'rtl':'ltr';
  buildPicker();
}
function buildPicker(){
  const p=$('#picker'); p.innerHTML='';
  ORDER.forEach(id=>{const btn=document.createElement('button');btn.textContent=BOOKS[id].title[L].split(':')[0];
    btn.className=id===BK?'on':''; btn.onclick=()=>{BK=id;reset();applyBook();}; p.appendChild(btn);});
}

/* ---------- the timeline ---------- */
function renderAt(t){
  const st=el=>el.style;
  // glow breathes in and holds
  st($('#glow')).opacity=(0.85*up(t,0.3,2.0)*(1-0.15*Math.sin(t*0.7))).toFixed(3);
  // embers drift upward (deterministic)
  const vis=up(t,1.0,3.0);
  EMB.forEach((e,i)=>{
    const sp=0.6+fr(i)*1.1, x=6+fr(i+9)*88, range=118, ph=fr(i+3);
    const y=((1-(((t*sp*0.08)+ph)%1))*range)-9; // 109→-9
    const pulse=0.3+0.7*Math.abs(Math.sin((t*sp+ph*6)));
    const s=el=>el.style; s(e).insetInlineStart=x+'%'; s(e).top=y+'%';
    s(e).opacity=(vis*pulse*0.55*(y<2||y>100?0:1)).toFixed(3);
    s(e).transform=`scale(${0.6+fr(i+5)*1.4})`;
  });
  // present credit
  {const o=win(t,0.9,1.9,3.5,4.4); st($('#present')).opacity=o.toFixed(3);
   st($('#present')).transform=`translateY(${(1-up(t,0.9,1.9))*16}px)`;}
  // cover reveal → float → fade before quote
  {const inn=up(t,4.4,5.5), o=inn*(1-up(t,11.3,12.2)*0.0); // keep till 11.3 then fade
   const fade=1-up(t,11.3,12.2);
   const sc=1.17-0.17*easeOut(clamp((t-4.4)/1.2,0,1))+ (t>5.5? 0.012*Math.sin((t-5.5)*0.9):0);
   const fl=t>5.6?Math.sin((t-5.6)*0.8)*6:0;
   st($('#coverBox')).opacity=(inn*fade).toFixed(3);
   st($('#coverBox')).transform=`translateY(calc(-50% + ${fl}px)) scale(${sc.toFixed(4)})`;}
  // title + underline
  {const o=win(t,7.0,8.0,11.3,12.1); st($('#titleBox')).opacity=o.toFixed(3);
   st($('#titleBox')).transform=`translateY(${(1-up(t,7.0,8.0))*18}px)`;
   st($('#uline')).width=(72*up(t,7.5,8.9)).toFixed(1)+'%';
   st($('#kick')).opacity=win(t,8.4,9.2,11.3,12.0).toFixed(3);}
  // tagline
  {st($('#tagline')).opacity=win(t,9.6,10.6,11.4,12.1).toFixed(3);
   st($('#tagline')).transform=`translateY(${(1-up(t,9.6,10.6))*12}px)`;}
  // quote (centered)
  {const o=win(t,12.5,13.7,15.4,16.2); st($('#quoteBox')).opacity=o.toFixed(3);
   st($('#quoteBox')).transform=`translateY(calc(-50% + ${(1-up(t,12.5,13.7))*10}px)) scale(${(0.98+0.02*up(t,12.5,14)).toFixed(4)})`;}
  // cta + brand
  {st($('#ctaBox')).opacity=win(t,16.2,17.1).toFixed(3);
   st($('#ctaBox')).transform=`translateY(${(1-up(t,16.2,17.1))*14}px)`;
   st($('#brand')).opacity=(0.9*win(t,16.5,17.3)).toFixed(3);}
}
window.__seek=t=>renderAt(clamp(t,0,DUR));
window.__dur=DUR;

/* ---------- Web Audio (generated sound) ---------- */
let actx;
function tone(ac,t0,dur,f0,f1,type,peak,q,lp){
  const o=ac.createOscillator(),g=ac.createGain(); o.type=type||'sine';
  o.frequency.setValueAtTime(f0,t0); if(f1)o.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  let node=o;
  if(lp){const bq=ac.createBiquadFilter();bq.type='lowpass';bq.frequency.value=lp;bq.Q.value=q||0.7;o.connect(bq);node=bq;}
  node.connect(g); g.connect(ac.destination);
  g.gain.setValueAtTime(0,t0); g.gain.linearRampToValueAtTime(peak,t0+Math.min(0.03,dur*0.2));
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur); o.start(t0); o.stop(t0+dur+0.05);
}
function noise(ac,t0,dur,peak,type,f0,f1,Q){
  const n=Math.floor(ac.sampleRate*dur),buf=ac.createBuffer(1,n,ac.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<n;i++)d[i]=Math.random()*2-1;
  const src=ac.createBufferSource();src.buffer=buf;
  const bq=ac.createBiquadFilter();bq.type=type||'bandpass';bq.frequency.setValueAtTime(f0||1200,t0);
  if(f1)bq.frequency.exponentialRampToValueAtTime(f1,t0+dur);bq.Q.value=Q||0.8;
  const g=ac.createGain();src.connect(bq);bq.connect(g);g.connect(ac.destination);
  g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(peak,t0+dur*0.25);
  g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);src.start(t0);src.stop(t0+dur);
}
function schedule(ac,t0){
  const R=BOOKS[BK].root;
  // drone: root + fifth + sub, long swell
  const drone=(f,pk,type,lp)=>{const o=ac.createOscillator(),g=ac.createGain(),bq=ac.createBiquadFilter();
    o.type=type;o.frequency.value=f;bq.type='lowpass';bq.frequency.value=lp;o.connect(bq);bq.connect(g);g.connect(ac.destination);
    g.gain.setValueAtTime(0.0001,t0);g.gain.exponentialRampToValueAtTime(pk,t0+5.5);
    g.gain.setValueAtTime(pk,t0+13.5);g.gain.exponentialRampToValueAtTime(0.0001,t0+DUR);
    o.start(t0);o.stop(t0+DUR+0.1);};
  drone(R/2,0.14,'sine',500); drone(R,0.09,'triangle',900); drone(R*1.5,0.05,'triangle',1200);
  // slow heartbeat sub-pulses under the build
  for(let k=0;k<6;k++) tone(ac,t0+1.5+k*1.9,0.5,R/2,R/2*0.8,'sine',0.12,0.7,320);
  // cover impact
  tone(ac,t0+4.55,1.4,70,40,'sine',0.5,0.7,220); noise(ac,t0+4.55,0.7,0.22,'lowpass',900,180,0.6);
  // shimmer bells on title (major-ish partials)
  [4,5,6,8].forEach((m,i)=>tone(ac,t0+7.2+i*0.12,2.2,R*m,R*m,'sine',0.06/(i+1),0.7,6000));
  // riser into quote
  noise(ac,t0+11.6,1.1,0.16,'bandpass',300,2600,1.1);
  // quote soft chime
  tone(ac,t0+12.7,2.6,R*4,R*4,'sine',0.05,0.7,5000);
  // final chord (root major triad) + whoosh
  [1,1.25,1.5,2].forEach(m=>tone(ac,t0+16.2,2.3,R*m,R*m,'triangle',0.08,0.7,2200));
  tone(ac,t0+16.2,2.3,R/2,R/2,'sine',0.14,0.7,400);
  noise(ac,t0+17.35,0.6,0.18,'bandpass',1800,600,0.9); // page turn
}

/* ---------- live playback ---------- */
let raf=0,playing=false;
function stopRaf(){cancelAnimationFrame(raf);raf=0;playing=false;}
function reset(){stopRaf();renderAt(0);$('#replay').classList.remove('show');}
function play(){
  if(playing)return; playing=true; $('#replay').classList.remove('show');
  try{actx=actx||new (window.AudioContext||window.webkitAudioContext)();actx.resume();}catch(e){actx=null;}
  const t0=actx?actx.currentTime+0.08:0; if(actx)schedule(actx,t0);
  const start=performance.now()+ (actx?80:0);
  const loop=now=>{const t=(now-start)/1000; renderAt(t);
    if(t>=DUR){stopRaf();$('#replay').classList.add('show');return;}
    raf=requestAnimationFrame(loop);};
  raf=requestAnimationFrame(loop);
}

/* ---------- wire up ---------- */
applyBook(); renderAt(0);
if(CAP){ document.body.classList.add('cap'); $('#gate').classList.add('hide'); }
else{
  $('#playBtn').onclick=()=>{$('#gate').classList.add('hide');play();};
  $('#replayBtn').onclick=()=>{reset();play();};
  $$('#langSel button').forEach(b=>b.onclick=()=>{$$('#langSel button').forEach(x=>x.classList.remove('on'));b.classList.add('on');L=b.dataset.l;reset();applyBook();});
  // tap stage to replay once finished
  $('#stage').addEventListener('click',e=>{if(!playing&&$('#gate').classList.contains('hide')&&!e.target.closest('a,button')){reset();play();}});
}
})();
