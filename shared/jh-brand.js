/* 보건플레이랩 — game content and existing handlers are left untouched. */
(function(){
 'use strict';
 const script=document.currentScript;
 const assetRoot=new URL('./',script.src);
 const logoSrc=new URL('brand-logo-small.png',assetRoot).href;
 function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!==undefined)e.textContent=text;return e;}
 function mount(){
   const stage=document.querySelector('.world > .stage');
   if(stage && document.getElementById('mapImage')){
     const bar=el('div','jh-brand-map');bar.id='jh-brand-root';
     const logo=el('img');logo.src=logoSrc;logo.alt='보건플레이랩 by JH Studio';logo.draggable=false;
     const button=el('button','jh-brand-info','ⓘ 저작권 안내');button.type='button';
     bar.append(logo,button);stage.appendChild(bar);
     const overlay=el('div','jh-brand-overlay');overlay.id='jh-brand-overlay';
     const dialog=el('section','jh-brand-dialog');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-label','콘텐츠 저작권 및 이용 안내');dialog.tabIndex=-1;
     const close=el('button','jh-close','×');close.type='button';close.setAttribute('aria-label','저작권 안내 닫기');
     const heading=el('h2','', '콘텐츠 저작권 및 이용 안내');
     const noticeLogo=el('img');noticeLogo.src=logoSrc;noticeLogo.alt='보건플레이랩 by JH Studio';
     const p=el('p','', '본 웹앱은 초등학교 보건교육을 목적으로 보건교사가 기획·제작한 체험형 교육 콘텐츠입니다.');
     const warning=el('p','jh-warning', '제작자의 사전 허락 없이 본 콘텐츠와 소스코드를 무단 복제·수정·재배포하거나 상업적으로 이용하는 것을 금지합니다.');
     const copy=el('small','', '© 2026 JH Studio. All rights reserved.');
     dialog.append(close,noticeLogo,heading,p,warning,copy);overlay.appendChild(dialog);document.body.appendChild(overlay);
     let lastFocus=null;
     function dismiss(){overlay.classList.remove('open');document.removeEventListener('keydown',onKey);if(lastFocus&&lastFocus.isConnected)lastFocus.focus();}
     function onKey(e){if(e.key==='Escape'){e.preventDefault();dismiss();}else if(e.key==='Tab'){const focusables=[close];if(!focusables.includes(document.activeElement)){e.preventDefault();close.focus();}}}
     button.addEventListener('click',()=>{lastFocus=document.activeElement;overlay.classList.add('open');document.addEventListener('keydown',onKey);close.focus();});
     close.addEventListener('click',dismiss);
     overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss();});
   }else if(!document.getElementById('jh-brand-game')){
     const mark=el('span','jh-brand-game','© JH Studio');mark.id='jh-brand-game';document.body.appendChild(mark);
   }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
