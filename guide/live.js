const designerMode=new URLSearchParams(location.search).get('perspective')==='designer';
if(designerMode){document.body.classList.add('designer-reading');window.addEventListener('DOMContentLoaded',()=>{const link=document.querySelector('.top-actions a[href="/"]');if(link){link.href='/design/';link.textContent='返回设计桌';}const rule=new URLSearchParams(location.search).get('rule');if(rule){const el=document.getElementById('rule-'+rule);el?.scrollIntoView({block:'center'});el?.querySelector('details')?.setAttribute('open','');}});}
document.addEventListener('click',event=>{
  const button=event.target.closest('#newEntrySide,[data-revise],[data-new-entry]');
  if(!button)return;
  event.preventDefault();event.stopImmediatePropagation();
  if(designerMode)return;
  location.href='/admin/#rules'+(button.dataset.revise?'/'+encodeURIComponent(button.dataset.revise):'');
},true);
let seenSequence=window.GUIDE_SEQUENCE;
window.addEventListener('focus',async()=>{
  try{const res=await fetch('/api/health');if(!res.ok)return;const data=await res.json();if(data.sequence!==seenSequence&&!document.querySelector('.content-update')){
    const notice=document.createElement('button');notice.className='content-update button primary';notice.textContent='内容已更新 · 点击载入最新版本';notice.onclick=()=>location.reload();document.body.append(notice);
  }}catch{}
});
