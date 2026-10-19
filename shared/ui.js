/* Shared UI sizing and zone-specific file-board fit (no mission logic changes). */
(()=>{'use strict';
 function setViewport(){
  const virtual=document.getElementById('tablet-virtual-screen');
  const root=document.documentElement;
  const stageHeight=virtual?.clientHeight||Math.max(420,window.innerHeight);
  root.style.setProperty('--v-stage-height',stageHeight+'px');
 }
 function fitGrowthBoard(){
  const scroll=document.querySelector('#tablet-virtual-screen .scene #game:not(.hidden) .board-scroll');
  const board=scroll?.querySelector('#board');
  if(!board || scroll.clientHeight<=0)return;
  const maxWidth=Math.max(400,scroll.clientWidth-8);
  const maxHeight=Math.max(120,scroll.clientHeight-8);
  const width=Math.min(maxWidth,maxHeight*1420/510);
  board.style.setProperty('width',Math.floor(width)+'px','important');
 }
 function adjust(){setViewport();fitGrowthBoard();}
 function install(){
  adjust();
  const resize=new ResizeObserver(adjust);
  const host=document.querySelector('#tablet-virtual-screen');
  const boardScroll=document.querySelector('.board-scroll');
  if(host)resize.observe(host);
  if(boardScroll)resize.observe(boardScroll);
  window.addEventListener('resize',adjust,{passive:true});
  window.visualViewport?.addEventListener('resize',adjust,{passive:true});
  if(boardScroll){
   const game=document.getElementById('game');
   if(game)new MutationObserver(adjust).observe(game,{attributes:true,attributeFilter:['class']});
  }
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
