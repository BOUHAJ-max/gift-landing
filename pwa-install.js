(function(){
 "use strict";
 const floating=document.getElementById("pwaFloatingInstall");
 const modal=document.getElementById("pwaInstallModal");
 const close=document.getElementById("pwaModalClose");
 const openChrome=document.getElementById("pwaExternalBrowser");
 if(!floating||!modal||!close||!openChrome)return;
 let deferredPrompt=null;
 const url="https://go.bouhaj.com/";
 const ua=navigator.userAgent||"";
 const android=/Android/i.test(ua);
 const ios=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
 const inInstagram=/Instagram/i.test(ua);
 const isChrome=/Chrome\/|CriOS\//i.test(ua)&&!/EdgA?\/|OPR\//i.test(ua);
 const installed=()=>window.matchMedia("(display-mode: standalone)").matches||navigator.standalone===true;
 function setChromeDestination(){
  if(android&&(inInstagram||!isChrome)){
   openChrome.href="intent://go.bouhaj.com/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Fgo.bouhaj.com%2F;end";
  }else if(ios&&!isChrome){
   openChrome.href="googlechrome://navigate?url=https%3A%2F%2Fgo.bouhaj.com%2F";
  }else{
   openChrome.href=url;
  }
 }
 function show(){
  setChromeDestination();
  modal.classList.add("open");
  modal.setAttribute("aria-hidden","false");
  close.focus();
 }
 function hide(){
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden","true");
  floating.focus();
 }
 function refresh(){
  if(installed()){
   floating.hidden=true;
   floating.style.setProperty("display","none","important");
  }else{
   floating.hidden=false;
   floating.style.removeProperty("display");
  }
 }
 floating.addEventListener("click",show);
 close.addEventListener("click",hide);
 modal.addEventListener("click",event=>{if(event.target===modal)hide();});
 document.addEventListener("keydown",event=>{if(event.key==="Escape"&&modal.classList.contains("open"))hide();});
 openChrome.addEventListener("click",async event=>{
  if(!deferredPrompt)return;
  event.preventDefault();
  const prompt=deferredPrompt;
  deferredPrompt=null;
  try{
   await prompt.prompt();
   const choice=await prompt.userChoice;
   if(choice&&choice.outcome==="accepted")hide();
  }catch(error){
   setChromeDestination();
   window.location.href=openChrome.href;
  }
  refresh();
 });
 window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  deferredPrompt=event;
 });
 window.addEventListener("appinstalled",()=>{
  deferredPrompt=null;
  refresh();
  hide();
 });
 window.addEventListener("pageshow",refresh);
 refresh();
 if("serviceWorker" in navigator&&location.protocol==="https:"){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(()=>{}),{once:true});
 }
})();