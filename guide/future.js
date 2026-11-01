'use strict';
/* 视觉层：指针跟随的玻璃高光 + 总览环形图的悬停说明（纯装饰/辅助，不影响内容与交互） */
(()=>{
  const SEL='.map-card,.guide-card,.site-card,.rule-card,.aside-panel,.project-card,.doc-card,.issue-card,.draft-card,.topic-intro,.relationship,.timeline-item,.master-node,.master-inspector,.master-application,.brand-atlas,.search-result,.vision-position-panel,.vision-pilots article,.vision-system-list article,.vision-logic-chain article,.topic-tile,.collection-head,.translation-panel,.ecology-panel,.vision-phase-panel,.master-link,.common-rules,.notice,.empty,.site-banner,.vision-closing,.hero-readouts>div,.kpi,.viz-card,.orbit-wrap';
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!matchMedia('(pointer: coarse)').matches){
    let raf=0,ev=null;
    document.addEventListener('pointermove',e=>{ev=e;if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const t=ev.target.closest&&ev.target.closest(SEL);if(!t)return;const r=t.getBoundingClientRect();t.style.setProperty('--mx',(ev.clientX-r.left)+'px');t.style.setProperty('--my',(ev.clientY-r.top)+'px')})},{passive:true});
  }
  const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
  let def=null;
  function cap(n){const box=document.getElementById('orbitCaption');if(!box)return;if(!def)def=box.innerHTML;box.innerHTML=n?`<small>${esc(n.dataset.capK)}</small><strong>${esc(n.dataset.capT)}</strong><p>${esc(n.dataset.capX)}</p>`:def}
  document.addEventListener('mouseover',e=>{const n=e.target.closest&&e.target.closest('.orbit-node');if(n)cap(n)});
  document.addEventListener('focusin',e=>{const n=e.target.closest&&e.target.closest('.orbit-node');if(n)cap(n)});
  document.addEventListener('mouseout',e=>{if(e.target.closest&&e.target.closest('.orbit-node')&&!(e.relatedTarget&&e.relatedTarget.closest&&e.relatedTarget.closest('.orbit-node')))cap(null)});
  window.addEventListener('hashchange',()=>{def=null});
})();
document.addEventListener('click',e=>{const sb=document.getElementById('sidebar');if(sb&&sb.classList.contains('open')&&!e.target.closest('#sidebar,#menu'))sb.classList.remove('open')});

/* 品牌图案：取自方案 P103 的"线条生成"语言——海天蓝竖线为底，活力橙斜线聚成城市形态，交通绿斜线为连接脊 */
(()=>{
  const h=(i,j)=>{const x=Math.sin(i*127.1+j*311.7)*43758.5453;return x-Math.floor(x)};
  function weave(cols,rows){
    const P=12,W=cols*P,H=rows*P+4;let out='';
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const x=i*P+P/2,y=j*P+P/2+2,cx=cols*.42,cy=(rows-1)/2;
      const e=Math.pow((i-cx)/(cols*.4),2)+Math.pow((j-cy)/(rows*.62),2)+(h(i,j)-.5)*.28;
      const gx=cols*.67+(j-cy)*.7;const g=e<1&&Math.abs(i-gx)<1.6+(h(j,i)*1.2);
      const d=`style="animation-delay:${(i*.045).toFixed(2)}s"`;
      if(g)out+=`<line class="g" x1="${x-3.4}" y1="${y+4}" x2="${x+3.4}" y2="${y-4}" ${d}/>`;
      else if(e<1)out+=`<line class="o" x1="${x-3.4}" y1="${y-4}" x2="${x+3.4}" y2="${y+4}" ${d}/>`;
      else out+=`<line class="b" x1="${x}" y1="${y-4.6}" x2="${x}" y2="${y+4.6}" ${d}/>`;
    }
    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMinYMid meet" role="img" aria-label="品牌生成图案">${out}</svg>`;
  }
  function fill(root){(root||document).querySelectorAll('.brand-weave:empty').forEach(n=>{n.innerHTML=weave(+n.dataset.cols||40,+n.dataset.rows||4)})}
  new MutationObserver(()=>fill()).observe(document.documentElement,{childList:true,subtree:true});
  fill();
})();
