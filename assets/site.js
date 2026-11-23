/* BOUHAJ TECH — small progressive enhancements shared by all pages.
   Safe to fail: nothing on the page depends on this file. */
(()=>{'use strict';
const L={ar:['نسخ','تم النسخ'],en:['Copy','Copied'],fr:['Copier','Copié']};
const words=()=>L[(document.documentElement.lang||'ar').slice(0,2)]||L.ar;

function copyButtons(){
  document.querySelectorAll('pre').forEach(pre=>{
    if(pre.querySelector('.ds-copy,.copy')||(pre.parentElement&&pre.parentElement.querySelector(':scope > .copy')))return;
    const b=document.createElement('button');
    b.type='button';b.className='ds-copy';b.textContent=words()[0];
    b.setAttribute('translate','no');
    b.addEventListener('click',async()=>{
      const text=(pre.querySelector('code')||pre).innerText.replace(/\n?$/,'\n');
      try{await navigator.clipboard.writeText(text)}catch(e){
        const t=document.createElement('textarea');t.value=text;t.style.position='fixed';t.style.opacity='0';
        document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(_){}t.remove();
      }
      b.textContent=words()[1];b.classList.add('ok');
      setTimeout(()=>{b.textContent=words()[0];b.classList.remove('ok')},1600);
    });
    pre.appendChild(b);
  });
}

function progress(){
  if(!document.querySelector('.content,.lesson,.article,.module'))return;
  if(document.documentElement.scrollHeight<window.innerHeight*2.2)return;
  const bar=document.createElement('div');bar.className='ds-progress';bar.setAttribute('aria-hidden','true');
  const fill=document.createElement('span');bar.appendChild(fill);document.body.appendChild(bar);
  let ticking=false;
  const update=()=>{ticking=false;const h=document.documentElement.scrollHeight-window.innerHeight;
    fill.style.width=(h>0?Math.min(100,window.scrollY/h*100):0)+'%'};
  window.addEventListener('scroll',()=>{if(!ticking){ticking=true;requestAnimationFrame(update)}},{passive:true});
  update();
}

function relabel(){document.querySelectorAll('.ds-copy:not(.ok)').forEach(b=>b.textContent=words()[0])}

function init(){
  copyButtons();progress();
  new MutationObserver(relabel).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
