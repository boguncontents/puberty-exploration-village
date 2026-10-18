(function(){
  'use strict';
  const $=id=>document.getElementById(id);
  const data=[
    {id:'height',image:'pic1o.webp',description:'사춘기에는 키와 몸무게가 빠르게 증가할 수 있어요.',disk:'d_pink.png'},
    {id:'skin',image:'pic2o.webp',description:'사춘기에는 땀과 피지 분비가 활발해져 여드름이 생길 수 있어요.',disk:'d_orng.png'},
    {id:'voice',image:'pic3o.webp',description:'사춘기에는 목소리가 굵어지는 변성기가 나타날 수 있어요.',disk:'d_blue.png'},
    {id:'hair',image:'pic4o.webp',description:'사춘기에는 생식기 주변과 겨드랑이에 털이 자랄 수 있어요.',disk:'d_purp.png'},
    {id:'chest',image:'pic5.webp',description:'사춘기에는 유방이 발달하고 골반이 커지는 등의 변화가 나타날 수 있어요.',disk:'d_grn.png'}
  ];
  const ROOT='../assets/lab/';
  const files=$('labFiles'), bank=$('labDiskBank'), info=$('labExplain'),infoText=$('labExplainText');
  const positions=[13.52,28.48,43.5,58.49,73.43];
  const diskPositions=[14.25,29.45,44.60,61.45,77.65];
  // Match labels remain unchanged; only the physical order of disks is mixed.
  // File 1→disk holder 3, 2→4, 3→1, 4→5, 5→2 (no identical positions).
  const diskSlotByFile=[2,3,0,4,1];
  const count=$('labCount'),feedback=$('labFeedback');
  let selected=null, solved=new Set(), tracking=null;
  const diskElements=new Map(), targetElements=new Map();
  const setFeedback=t=>{feedback.textContent=t};
  const showRobotMessage=(message,tone)=>{
    setFeedback(message);
    infoText.textContent=message;
    info.dataset.mode='feedback';
    info.dataset.tone=tone;
    info.setAttribute('aria-label','연구원 로봇 안내');
    info.hidden=false;
  };
  function closeInfo(clearSelection=false){
    info.hidden=true;info.dataset.mode='';info.dataset.tone='';
    if(clearSelection){selected=null;diskElements.forEach(el=>el.classList.remove('selected'));}
  }
  function select(id){
    if(solved.has(id))return;
    selected=id;diskElements.forEach((el,k)=>el.classList.toggle('selected',k===id));
    infoText.textContent=data.find(x=>x.id===id).description;
    info.dataset.mode='description';info.dataset.tone='';
    info.setAttribute('aria-label','선택한 디스크의 정보');
    info.hidden=false;
    setFeedback('선택한 디스크의 설명이 나타났어요. 알맞은 그림 아래 빈칸에 끌어다 놓으세요.');
  }
  function tryPlace(id){
    if(!selected){showRobotMessage('먼저 아래에서 디스크를 눌러 주세요.','retry');return;}
    if(solved.has(id)){showRobotMessage('이미 복구한 파일이에요. 다른 그림을 골라 보세요!','retry');return;}
    if(selected!==id){showRobotMessage('잘못된 자리에 넣었어요. 다시 해 보세요!','retry');return;}
    const d=data.find(x=>x.id===id);
    solved.add(id);
    const target=targetElements.get(id);
    target.classList.add('success');target.replaceChildren();
    const img=document.createElement('img');img.src=ROOT+d.disk;img.alt='복구 완료된 데이터 디스크';target.append(img);
    diskElements.get(id).classList.add('complete');
    closeInfo(true);
    count.textContent='복구 '+solved.size+' / 5';
    if(solved.size===5){
       setFeedback('성장 데이터 5개를 모두 복구했어요!');
       $('end').classList.remove('hidden');
       $('restart').focus();
    } else showRobotMessage('성장 데이터가 복구됐어요! 다음 디스크를 눌러 보세요.','success');
  }
  const viewer=(imgSrc)=>{
    const overlay=document.createElement('div');overlay.className='lab-viewer-backdrop';
    overlay.innerHTML='<div class="lab-viewer-card" role="dialog" aria-modal="true" aria-label="그림 확대 관찰"><img alt="그림 자세히 보기"><button type="button" class="lab-viewer-close">확인하고 닫기</button></div>';
    overlay.querySelector('img').src=imgSrc;
    const dismiss=()=>overlay.remove();overlay.querySelector('button').addEventListener('click',dismiss);overlay.addEventListener('click',e=>{if(e.target===overlay)dismiss()});
    document.body.append(overlay);overlay.querySelector('button').focus();
  };
  data.forEach((d,i)=>{
    const file=document.createElement('div');file.className='lab-file';file.style.left=positions[i]+'%';
    const preview=document.createElement('button');preview.type='button';preview.className='lab-file-illustration';preview.setAttribute('aria-label','성장 파일 '+(i+1)+'의 그림 확대 보기');
    const im=document.createElement('img');im.src=ROOT+d.image;im.alt='신체 변화 관찰 그림 '+(i+1);
    if(i===1||i===2||i===3)im.className='detail-crop';if(i===4)im.className='pic5';
    preview.append(im);preview.addEventListener('click',()=>viewer(im.src));
    const target=document.createElement('button');target.type='button';target.className='lab-file-target';target.dataset.id=d.id;target.setAttribute('aria-label','그림 '+(i+1)+'의 데이터 디스크 넣는 곳');
    target.innerHTML='<strong>디스크 넣기</strong>';target.addEventListener('click',()=>tryPlace(d.id));
    file.append(preview,target);files.append(file);targetElements.set(d.id,target);
    const btn=document.createElement('button');btn.type='button';btn.className='lab-disk';btn.dataset.id=d.id;
    btn.style.left=diskPositions[diskSlotByFile[i]]+'%';btn.setAttribute('aria-label','데이터 디스크 '+(i+1)+' 눌러 설명 확인');
    const image=document.createElement('img');image.src=ROOT+d.disk;image.alt='';image.draggable=false;btn.append(image);bank.append(btn);diskElements.set(d.id,btn);
    btn.addEventListener('pointerdown',e=>{
      if(e.button!==undefined&&e.button!==0)return;
      if(solved.has(d.id))return;
      const activeBefore=(selected===d.id);
      if(!activeBefore||info.dataset.mode==='feedback')select(d.id);
      tracking={id:d.id,pointerId:e.pointerId,x:e.clientX,y:e.clientY,drag:false,ghost:null,allowDrag:activeBefore};
    });
  });
  window.addEventListener('pointermove',e=>{
    if(!tracking||tracking.pointerId!==e.pointerId)return;
    if(!tracking.allowDrag)return;
    const distance=Math.hypot(e.clientX-tracking.x,e.clientY-tracking.y);
    if(!tracking.drag&&distance>11){
       tracking.drag=true;closeInfo(false);
       const ghost=document.createElement('img');ghost.className='lab-drag-clone';ghost.alt='';ghost.src=ROOT+data.find(d=>d.id===tracking.id).disk;document.body.append(ghost);tracking.ghost=ghost;
       diskElements.get(tracking.id).classList.add('dragging');
    }
    if(tracking.drag){
       e.preventDefault();tracking.ghost.style.left=e.clientX+'px';tracking.ghost.style.top=e.clientY+'px';
       const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.lab-file-target');
       targetElements.forEach(el=>el.classList.toggle('hovering',el===hit));
    }
  },{passive:false});
  const cancelDrag=()=>{
    if(tracking?.ghost)tracking.ghost.remove();
    diskElements.forEach(el=>el.classList.remove('dragging'));
    targetElements.forEach(el=>el.classList.remove('hovering'));
    tracking=null;
  };
  window.addEventListener('pointerup',e=>{
    if(!tracking||e.pointerId!==tracking.pointerId)return;
    if(tracking.drag){
       const hit=document.elementFromPoint(e.clientX,e.clientY)?.closest('.lab-file-target');
       if(hit)tryPlace(hit.dataset.id);else showRobotMessage('그림 아래 빈칸에 디스크를 넣어 주세요!','retry');
    }
    cancelDrag();
  });
  window.addEventListener('pointercancel',cancelDrag);
  $('labInfoClose').addEventListener('click',()=>closeInfo(true));
  $('begin').addEventListener('click',()=>{
    $('start').classList.add('hidden');
    document.querySelector('.scene')?.classList.remove('intro-active');
    document.querySelector('.scene')?.classList.add('lab-playing');
    $('game').classList.remove('hidden');
    document.querySelectorAll('.shell > .top,.shell > .foot').forEach(el=>el.classList.add('lab-hide-original-head'));
    $('game').scrollIntoView({block:'start',behavior:'instant'});
  });
})();
