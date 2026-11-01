'use strict';
/* 品牌图形层 —— 取自方案「品牌设计」章节(P76–P125)
   1. 九色体系  2. 线性图标库(蒙版着色)  3. 天际线线稿  4. 像素条形矩阵(可交互画布)  */
(()=>{
  const A=window.BK_ASSETS||{icons:{},sky:[],logo:''};
  const C={blue:'#5CBBE1',tech:'#5AE0CF',biz:'#2F6DF7',green:'#027133',eco:'#60BF34',inno:'#2FAF66',orange:'#FF8F33',sun:'#FFCC3B',red:'#FF4B33'};
  window.BK={C};

  /* ---------- 图标 / 天际线 / logo ---------- */
  const st=document.createElement('style');
  st.textContent=Object.entries(A.icons).map(([k,v])=>`.bi[data-i="${k}"]{--m:url(${v})}`).join('')
    +A.sky.map((v,i)=>`.sky[data-s="${i+1}"]{--m:url(${v})}`).join('')
    +`.brand-logo{background-image:url(${A.logo})}`;
  document.head.appendChild(st);
  window.BI=(n,c='')=>`<i class="bi ${c}" data-i="${n}" aria-hidden="true"></i>`;
  window.SKY=(n,color,h)=>`<i class="sky" data-s="${n}" style="--c:${color};--h:${h}px" aria-hidden="true"></i>`;

  /* ---------- 工具 ---------- */
  const hash=(i,j,s=0)=>{const x=Math.sin(i*127.1+j*311.7+s*74.7)*43758.5453;return x-Math.floor(x)};
  const smooth=t=>t*t*(3-2*t);
  const vn=(x,s)=>{const i=Math.floor(x),f=x-i;return hash(i,0,s)*(1-smooth(f))+hash(i+1,0,s)*smooth(f)};
  const pick=(arr,r)=>arr[Math.min(arr.length-1,Math.floor(r*arr.length))];

  /* ---------- 场函数：返回 {ang, col, wave} ---------- */
  function heroField(cols,rows,seed){
    const cells=new Array(cols*rows);
    const prof=new Array(cols);
    for(let i=0;i<cols;){
      const w=3+Math.floor(hash(i,1,seed)*5),h=Math.floor(rows*(.2+hash(i,2,seed)*.4)),step=hash(i,3,seed)>.55;
      for(let k=0;k<w&&i<cols;k++,i++)prof[i]=h-(step&&k>=w/2?Math.floor(rows*.06):0);
    }
    const sx=Math.floor(cols*.7),sw=Math.max(5,Math.floor(cols*.075)),sh=Math.floor(rows*.66);
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const fb=rows-1-j,seaEnd=Math.floor(rows*(.27+.07*vn(i*.09,seed)));
      let ang=0,col=C.blue,wave=false;const r=hash(i,j,seed+9);
      if(j<seaEnd){wave=true;ang=i%2?45:-45;col=r<.1?C.tech:C.blue}
      else if(fb<prof[i]){ang=r<.14?0:-45;col=r<.74?C.orange:r<.84?C.sun:r<.93?C.red:C.inno}
      else{ang=0;col=r<.07?C.tech:C.blue}
      const hw=sw/2*(1-.55*Math.min(1,fb/sh));
      if(Math.abs(i-sx)<hw&&fb<sh&&fb>=0){ang=45;col=r<.6?C.green:r<.85?C.inno:C.eco;wave=false}
      cells[j*cols+i]={ang,col,wave};
    }
    return cells;
  }
  function ambientField(cols,rows,seed){
    const cells=new Array(cols*rows);
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const n=vn(i*.07+j*.045,seed),m=vn(j*.09-i*.03,seed+5),r=hash(i,j,seed+2);
      const t=n*.55+(j/rows)*.45;
      let col=t<.3?C.blue:t<.45?C.tech:t<.62?C.inno:t<.82?C.orange:C.red;
      if(r<.06)col=pick([C.biz,C.sun,C.eco],hash(j,i,seed));
      const skip=m<.34||r<.22;
      const ang=m>.66?(i%2?45:-45):(r>.7?-45:0);
      cells[j*cols+i]={ang,col,wave:m>.66,skip};
    }
    return cells;
  }
  function stripField(cols,rows,pal,seed){
    const cells=new Array(cols*rows);
    const P=pal&&pal.length?pal:[C.blue,C.inno,C.orange];
    for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const t=(i/cols)*(P.length-.001)+(vn(i*.12+j*.7,seed)-.5)*.9;
      let col=P[Math.max(0,Math.min(P.length-1,Math.floor(t)))];
      const r=hash(i,j,seed+3);
      if(r<.022)col=pick([C.blue,C.tech,C.green,C.orange,C.sun,C.red,C.biz],hash(j,i,seed));
      const kind=(j+Math.floor(vn(i*.05,seed)*3))%3;
      const ang=kind===0?(i%2?45:-45):kind===1?0:-45;
      cells[j*cols+i]={ang,col,wave:kind===0};
    }
    return cells;
  }

  /* ---------- 画布引擎 ---------- */
  const fields=new Set();let raf=0,last=0;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.target._bf)e.target._bf.vis=e.isIntersecting}),{rootMargin:'80px'});
  const ro=new ResizeObserver(es=>es.forEach(e=>{if(e.target._bf)build(e.target._bf)}));

  function build(f){
    const el=f.el,w=el.clientWidth,h=el.clientHeight;if(!w||!h)return;
    const dpr=Math.min(2,window.devicePixelRatio||1);
    f.dpr=dpr;f.w=w;f.h=h;f.c.width=Math.round(w*dpr);f.c.height=Math.round(h*dpr);
    const hero=f.preset==='hero',amb=f.preset==='ambient';
    f.p=amb?(w<700?26:34):hero?(w<700?12:w<1100?14:16):(w<700?10:12);
    f.cols=Math.ceil(w/f.p);f.rows=Math.ceil(h/f.p);
    f.cells=amb?ambientField(f.cols,f.rows,f.seed):hero?heroField(f.cols,f.rows,f.seed):stripField(f.cols,f.rows,f.pal,f.seed);
    if(f.hud)f.hud.base=`FIELD ${f.cols}×${f.rows} · ${f.cells.length} UNITS`;
    f.ang=new Float32Array(f.cells.length);
    f.groups={};f.cells.forEach((c,k)=>{(f.groups[c.col]=f.groups[c.col]||[]).push(k)});
    draw(f,0);
  }
  function draw(f,t){
    const ctx=f.ctx,p=f.p,cols=f.cols,dpr=f.dpr;
    ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,f.c.width,f.c.height);
    const amb=f.preset==='ambient';ctx.globalAlpha=amb?.28:1;
    const bw=p*(amb?.22:.3),bl=p*(amb?.6:.76),R=f.r,px=f.px,py=f.py,on=f.on;
    for(const col in f.groups){
      ctx.fillStyle=col;
      for(const k of f.groups[col]){
        const c=f.cells[k];if(c.skip)continue;const i=k%cols,j=(k/cols)|0,x=(i+.5)*p,y=(j+.5)*p;
        let a=c.ang;
        if(!reduce){a+=(c.wave?15:5)*Math.sin(t*(c.wave?1.15:.6)+i*.27+j*.19)}
        let L=bl,k2=0;
        if(on){
          const dx=px-x,dy=py-y,d=Math.hypot(dx,dy);
          if(d<R){k2=smooth(1-d/R);
            let tg=Math.atan2(dx,-dy)*180/Math.PI;           // 指向光标的角度
            let da=((tg-a)%180+270)%180-90;                    // 取 ±90° 内最短转角
            a+=da*k2*.92;L=bl*(1+.55*k2)}
        }
        const r=a*Math.PI/180,cs=Math.cos(r)*dpr,sn=Math.sin(r)*dpr;
        ctx.setTransform(cs,sn,-sn,cs,x*dpr,y*dpr);
        ctx.fillRect(-bw/2,-L/2,bw,L);
      }
    }
  }
  function loop(ts){
    raf=requestAnimationFrame(loop);
    if(document.hidden||ts-last<33)return;last=ts;
    const t=ts/1000;
    for(const f of fields){
      if(!f.el.isConnected){fields.delete(f);io.unobserve(f.el);ro.unobserve(f.el);continue}
      if(f.preset==='ambient'){if(ts-(f.lt||0)<70)continue;f.lt=ts}
      if(f.vis&&f.cells)draw(f,t);
    }
  }
  function mount(el){
    if(el._bf)return;
    const c=document.createElement('canvas');c.setAttribute('aria-hidden','true');el.prepend(c);
    const f={el,c,ctx:c.getContext('2d'),preset:el.dataset.preset||'strip',seed:+el.dataset.seed||7,
      pal:(el.dataset.pal||'').split(',').filter(Boolean).map(k=>C[k]||k),r:130,on:false,px:0,py:0,vis:true};
    el._bf=f;fields.add(f);io.observe(el);ro.observe(el);build(f);if(f.hud)f.hud.el.textContent=f.hud.base;
    const root=f.preset==='ambient'?document.documentElement:(el.closest('[data-bf-root]')||el);
    if(f.preset==='ambient')f.r=240;
    if(f.preset==='hero'){const h=document.createElement('div');h.className='hud';h.setAttribute('aria-hidden','true');el.parentElement.appendChild(h);f.hud={el:h,base:''};build(f)}
    root.addEventListener('pointermove',e=>{const b=el.getBoundingClientRect();f.px=e.clientX-b.left;f.py=e.clientY-b.top;f.on=true;if(f.hud)f.hud.el.textContent=`${f.hud.base}  ·  CURSOR ${String(Math.max(0,f.px|0)).padStart(4,'0')},${String(Math.max(0,f.py|0)).padStart(4,'0')}`;if(reduce)draw(f,0)},{passive:true});
    root.addEventListener('pointerleave',()=>{f.on=false;if(f.hud)f.hud.el.textContent=f.hud.base;if(reduce)draw(f,0)});
    if(!raf&&!reduce)raf=requestAnimationFrame(loop);
  }
  window.BK.mount=mount;

  /* ---------- 路由配色 ---------- */
  const TOPIC={space:['blue','tech','biz'],brand:['green','inno','eco'],art:['orange','sun','red'],furniture:['biz','blue','tech'],events:['red','orange','sun']};
  const SITE={station:['green','blue','eco'],mill:['orange','red','sun'],school:['blue','biz','tech'],rail:['eco','green','blue']};
  function pal(){
    const v=document.body.dataset.view;let k;
    try{
      if(v==='topics')k=TOPIC[view.topic];
      else if(v==='site')k=SITE[view.site];
    }catch(e){}
    return (k||({sites:['blue','green','orange'],library:['blue','tech','biz'],archive:['green','inno','eco'],collection:['orange','sun','red']}[v])||['blue','green','orange']).join(',');
  }
  const SEEDS={sites:3,site:5,topics:9,library:11,archive:13,collection:17};

  /* ---------- 页面增强：图标 / 色条 / 色带 ---------- */
  const TI={space:'bridge',brand:'cosmos',art:'cloudnet',furniture:'cafe',events:'show'};
  const TC={space:C.blue,brand:C.green,art:C.orange,furniture:C.biz,events:C.red};
  const SI={station:'station',mill:'factory',school:'books',rail:'seabridge'};
  const SC={station:C.green,mill:C.orange,school:C.blue,rail:C.eco};
  const PI={sites:'cityrail',library:'books',archive:'sail',collection:'shop'};
  const PC={sites:C.blue,library:C.biz,archive:C.eco,collection:C.orange};
  const wide=n=>n==='station'||n==='TOD'?' wide':'';
  function enhance(app){
    const v=document.body.dataset.view;
    const ph=app.querySelector('.page-heading:not([data-enh])');
    if(ph){ph.dataset.enh='1';let n,c;
      if(v==='site'){n=SI[view.site];c=SC[view.site]}else{n=PI[v];c=PC[v]}
      if(n)ph.insertAdjacentHTML('beforeend',`<div class="ph-ico${wide(n)}" style="--ic:${c}">${BI(n)}</div>`);
      if(c)ph.style.setProperty('--lp',c)}
    const ti=app.querySelector('.topic-intro:not([data-enh])');
    if(ti){ti.dataset.enh='1';const id=view.topic;ti.style.setProperty('--tc',TC[id]);ti.insertAdjacentHTML('afterbegin',`<div class="ti-ico" style="--ic:${TC[id]}">${BI(TI[id])}</div>`)}
    app.querySelectorAll('.topic-nav button:not([data-enh])').forEach(b=>{b.dataset.enh='1';const id=(b.dataset.go||'').split('/')[1];if(TI[id]){b.style.setProperty('--ic',TC[id]);b.insertAdjacentHTML('afterbegin',BI(TI[id],'tn-ico'))}});
    app.querySelectorAll('.topic-tile:not([data-enh])').forEach(b=>{b.dataset.enh='1';const id=(b.dataset.go||'').split('/')[1];if(TC[id])b.style.setProperty('--tc',TC[id])});
    app.querySelectorAll('.site-card:not([data-enh])').forEach(a=>{a.dataset.enh='1';const g=a.querySelector('[data-go]');const id=g&&g.dataset.go.split('/')[1];if(!SI[id])return;a.style.setProperty('--tc',SC[id]);const cv=a.querySelector('.cover');if(cv)cv.insertAdjacentHTML('beforeend',`<span class="cover-ico${wide(SI[id])}" style="--ic:${SC[id]}">${BI(SI[id])}</span>`)});
    // 条带颜色
    const s=app.querySelector('.bar-field.strip:not(.tall)');
    if(s&&!s.dataset.cols){const cols=(s.dataset.pal||'').split(',').map(k=>C[k]||k);s.dataset.cols='1';s.style.setProperty('--s1',cols[0]||C.blue);s.style.setProperty('--s2',cols[1]||C.green);s.style.setProperty('--s3',cols[2]||C.orange)}
  }

  /* ---------- 磨砂科技层：环境条形场 / 光标辉光 / 路由进度 / 数字计数 ---------- */
  function mountAmbient(){document.querySelectorAll('.ambient-field:not([data-bf])').forEach(el=>{el.dataset.bf='1';mount(el)})}
  const glow=document.querySelector('.cursor-glow');
  if(glow&&!reduce)addEventListener('pointermove',e=>{glow.style.setProperty('--gx',e.clientX+'px');glow.style.setProperty('--gy',e.clientY+'px')},{passive:true});
  const rbar=document.createElement('i');rbar.className='route-bar';rbar.setAttribute('aria-hidden','true');document.body.appendChild(rbar);
  addEventListener('hashchange',()=>{rbar.classList.remove('go');void rbar.offsetWidth;rbar.classList.add('go')});
  const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;cio.unobserve(e.target);countUp(e.target)}),{threshold:.4});
  function countUp(el){
    const n=parseInt(el.dataset.cu,10),t0=performance.now(),d=1100;
    if(reduce){el.textContent=n;return}
    (function step(t){const k=Math.min(1,(t-t0)/d),v=Math.round(n*(1-Math.pow(1-k,3)));el.textContent=v;if(k<1)requestAnimationFrame(step)})(t0);
  }
  function counters(app){
    app.querySelectorAll('.kpi>b,.hero-readouts b,.vision-growth-formula b,.site-metrics .kpi>b').forEach(el=>{
      if(el.dataset.cu||!/^\d+$/.test(el.textContent.trim())||+el.textContent.trim()<10)return;
      el.dataset.cu=el.textContent.trim();el.textContent='0';cio.observe(el)});
  }
  function decorate(){
    const app=document.getElementById('app');if(!app)return;
    app.querySelectorAll('.bar-field:not([data-bf])').forEach(el=>{el.dataset.bf='1';mount(el)});
    enhance(app);counters(app);
    if(!app.querySelector('.bar-field:not(.inline)')){
      const v=document.body.dataset.view;
      app.insertAdjacentHTML('afterbegin',`<div class="bar-field strip" data-preset="strip" data-pal="${pal()}" data-seed="${SEEDS[v]||7}" data-bf-root aria-hidden="true"></div>`);
      const el=app.querySelector('.bar-field:not(.inline)');el.dataset.bf='1';mount(el);enhance(app);
    }
  }
  mountAmbient();
  const app=document.getElementById('app');
  if(app){new MutationObserver(()=>decorate()).observe(app,{childList:true});decorate()}
})();
