(function(){
 "use strict";
 const button=document.getElementById("pwaInstallButton");
 const modal=document.getElementById("pwaInstallModal");
 if(!button||!modal)return;
 const $=id=>document.getElementById(id);
 let deferredPrompt=null;
 const strings={
  ar:{button:"＋ احفظ الموقع على هاتفي",ready:"تثبيت BOUHAJ TECH",external:"افتح الموقع في Chrome",title:"إضافة BOUHAJ TECH",desc:"اتبع الخطوات التالية لإضافة الموقع إلى الشاشة الرئيسية. لن تتم الإضافة إلا بعد موافقتك.",note:"قد تختلف أسماء القوائم حسب إصدار المتصفح. لا يستطيع الموقع تنفيذ التثبيت نيابةً عنك.",close:"إغلاق",steps:{instagramAndroid:["اضغط على قائمة النقاط أعلى متصفح Instagram.","اختر «فتح في متصفح خارجي» أو «Open in browser».","في Chrome اضغط ⋮ ثم «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».","أكد الإضافة في نافذة المتصفح."],instagramIOS:["افتح قائمة Instagram واختر «فتح في المتصفح» إن ظهرت.","في Safari اضغط زر المشاركة أسفل الشاشة.","اختر «إضافة إلى الشاشة الرئيسية» ثم اضغط «إضافة». "],ios:["اضغط زر المشاركة في Safari.","اختر «إضافة إلى الشاشة الرئيسية».","اضغط «إضافة» للتأكيد."],android:["افتح قائمة المتصفح ⋮.","اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية».","أكد الاختيار في نافذة المتصفح."],other:["افتح قائمة المتصفح وابحث عن «تثبيت» أو «إضافة إلى الشاشة الرئيسية».","اتبع تعليمات المتصفح لتأكيد الإضافة."]}},
  en:{button:"＋ Save to my home screen",ready:"Install BOUHAJ TECH",external:"Open this site in Chrome",title:"Add BOUHAJ TECH",desc:"Follow these steps to add the website to your home screen. Nothing is installed without your approval.",note:"Menu labels vary by browser version. A website cannot perform the installation on your behalf.",close:"Close",steps:{instagramAndroid:["Open the three-dot menu in Instagram's in-app browser.","Choose “Open in external browser” or “Open in browser”.","In Chrome, tap ⋮ then “Install app” or “Add to Home screen”.","Confirm in the browser prompt."],instagramIOS:["Open Instagram's menu and choose “Open in browser” if available.","In Safari, tap the Share button.","Choose “Add to Home Screen”, then tap “Add”."],ios:["Tap the Share button in Safari.","Choose “Add to Home Screen”.","Tap “Add” to confirm."],android:["Open your browser menu ⋮.","Choose “Install app” or “Add to Home screen”.","Confirm in the browser prompt."],other:["Open your browser menu and look for “Install” or “Add to Home Screen”.","Follow the browser instructions to confirm."]}},
  fr:{button:"＋ Ajouter à l’écran d’accueil",ready:"Installer BOUHAJ TECH",external:"Ouvrir ce site dans Chrome",title:"Ajouter BOUHAJ TECH",desc:"Suivez ces étapes pour ajouter le site à l’écran d’accueil. Rien ne sera installé sans votre accord.",note:"Les intitulés peuvent varier selon le navigateur. Un site ne peut pas effectuer l’installation à votre place.",close:"Fermer",steps:{instagramAndroid:["Ouvrez le menu à trois points du navigateur intégré à Instagram.","Choisissez « Ouvrir dans le navigateur externe ».","Dans Chrome, appuyez sur ⋮ puis « Installer l’application » ou « Ajouter à l’écran d’accueil ».","Confirmez dans la fenêtre du navigateur."],instagramIOS:["Ouvrez le menu Instagram et choisissez « Ouvrir dans le navigateur » si disponible.","Dans Safari, appuyez sur le bouton de partage.","Choisissez « Sur l’écran d’accueil », puis « Ajouter »."],ios:["Appuyez sur le bouton de partage dans Safari.","Choisissez « Sur l’écran d’accueil ».","Appuyez sur « Ajouter » pour confirmer."],android:["Ouvrez le menu du navigateur ⋮.","Choisissez « Installer l’application » ou « Ajouter à l’écran d’accueil ».","Confirmez dans la fenêtre du navigateur."],other:["Ouvrez le menu du navigateur et cherchez « Installer » ou « Ajouter à l’écran d’accueil ».","Suivez les instructions pour confirmer."]}}
 };
 const lang=()=>strings[(document.documentElement.lang||"ar").slice(0,2)]? (document.documentElement.lang||"ar").slice(0,2):"ar";
 const installed=()=>window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone===true;
 const ua=navigator.userAgent||"";
 const inInstagram=/Instagram/i.test(ua);
 const ios=/iPhone|iPad|iPod/i.test(ua)||(navigator.platform==="MacIntel"&&navigator.maxTouchPoints>1);
 const android=/Android/i.test(ua);
 function showModal(kind){
  const t=strings[lang()];
  $("pwaModalTitle").textContent=t.title;
  $("pwaModalDescription").textContent=t.desc;
  $("pwaModalNote").textContent=t.note;
  $("pwaModalClose").setAttribute("aria-label",t.close);
  const key=inInstagram?(ios?"instagramIOS":"instagramAndroid"):(ios?"ios":android?"android":"other");
  $("pwaInstallSteps").innerHTML=t.steps[key].map((line,i)=>"<li><b>"+(i+1)+"</b><span>"+line+"</span></li>").join("");
  const external=$("pwaExternalBrowser");external.hidden=!(inInstagram&&android);external.textContent=t.external;external.href="intent://go.bouhaj.com/#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Fgo.bouhaj.com%2F;end";
  modal.classList.add("open");modal.setAttribute("aria-hidden","false");$("pwaModalClose").focus();
 }
 function closeModal(){modal.classList.remove("open");modal.setAttribute("aria-hidden","true");button.focus();}
 function refresh(){
  if(installed()){button.hidden=true;return;}
  const t=strings[lang()];
  button.hidden=false;
  button.textContent=deferredPrompt?t.ready:t.button;
 }
 button.addEventListener("click",async()=>{
  if(deferredPrompt){
   const promptEvent=deferredPrompt;deferredPrompt=null;
   try{await promptEvent.prompt();await promptEvent.userChoice;}catch(e){}
   refresh();return;
  }
  showModal();
 });
 $("pwaModalClose").addEventListener("click",closeModal);
 modal.addEventListener("click",e=>{if(e.target===modal)closeModal();});
 document.addEventListener("keydown",e=>{if(e.key==="Escape"&&modal.classList.contains("open"))closeModal();});
 window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();deferredPrompt=event;refresh();
 });
 window.addEventListener("appinstalled",()=>{deferredPrompt=null;button.hidden=true;});
 window.addEventListener("pageshow",refresh);
 refresh();
 if("serviceWorker" in navigator&&location.protocol==="https:"){
  window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js",{scope:"/"}).catch(()=>{}),{once:true});
 }
})();