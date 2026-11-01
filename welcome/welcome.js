import {cityMarkup,esc,short} from '/shared/city.js';
document.getElementById('portalCity').innerHTML=cityMarkup('同一片城市，三种参与方式');
const stories={
  explorer:{step:'01 / DISCOVER',title:'先认识这里，再找到你的连接。',text:'走进四个场所，认识正在酝酿的生活。你的想法，可以留在一个具体的地方。',color:'#5CBBE1'},
  designer:{step:'02 / CREATE',title:'让一个场所，接上城市的整体故事。',text:'从地块开始筛选导则，对照来源与待核对条件，整理属于你的设计摘录。',color:'#027133'},
  steward:{step:'03 / CONTINUE',title:'让每一次修改，都成为下一步的依据。',text:'从整理内容到提交审阅，接续团队的工作，为规划留下清晰、可追溯的成长记录。',color:'#FF8F33'}
};
function highlight(role){const story=stories[role];if(!story)return;document.body.style.setProperty('--path-color',story.color);document.querySelectorAll('.journey').forEach(a=>a.classList.toggle('is-active',a.dataset.perspective===role));document.getElementById('storyStep').textContent=story.step;document.getElementById('storyTitle').textContent=story.title;document.getElementById('storyText').textContent=story.text;document.querySelector('.city-wheel').dataset.active=role;}
for(const link of document.querySelectorAll('.journey')){link.addEventListener('pointerenter',()=>highlight(link.dataset.perspective));link.addEventListener('focus',()=>highlight(link.dataset.perspective));link.addEventListener('click',()=>{try{sessionStorage.setItem('guide-perspective',link.dataset.perspective);}catch{}});}
// 只保存浏览偏好，不创建登录会话或赋予管理权限。
// 入口右侧双面翻转；只有角色入口负责路由跳转。
const city=document.getElementById('portalCity');let catalog,lastSite='station',flipped=false;
const catalogReady=fetch('/api/catalog').then(r=>{if(!r.ok)throw Error();return r.json();}).then(r=>catalog=r.data).catch(()=>null);
city.classList.add('portal-flip');
city.innerHTML='<div class="portal-flip-inner"><div class="flip-front">'+cityMarkup()+'</div><div class="flip-back" role="button" tabindex="-1" aria-hidden="true" inert></div></div><span class="flip-announcement" role="status" aria-live="polite"></span>';
const front=city.querySelector('.flip-front'),back=city.querySelector('.flip-back');
front.querySelector('.network-heading small').textContent='点击节点，翻看场所故事';
front.querySelectorAll('.network-node').forEach(a=>{const id=new URL(a.href).searchParams.get('place');const b=document.createElement('button');b.className=a.className;b.dataset.previewSite=id;b.innerHTML=a.innerHTML;b.setAttribute('aria-label','翻看'+short(id)+'的方案图与简介');a.replaceWith(b);});
function setFlipped(value){flipped=value;city.classList.toggle('is-flipped',value);front.inert=value;front.setAttribute('aria-hidden',String(value));back.inert=!value;back.setAttribute('aria-hidden',String(!value));back.tabIndex=value?0:-1;if(value)back.focus({preventScroll:true});else front.querySelector('[data-preview-site="'+lastSite+'"]')?.focus({preventScroll:true});}
async function showPlace(id){await catalogReady;lastSite=id;const site=catalog?.sites.find(s=>s.id===id);if(!site){city.querySelector('.flip-announcement').textContent='场所资料暂时未能读取，请刷新重试。';return;}
back.setAttribute('aria-label',site.name+'方案图与简介；再次点击或按回车翻回场所关系');
back.innerHTML=`<section class="portal-place"><div class="network-heading"><span>PLACE / ${esc(site.no)}</span><span>↶ 再次点击，翻回场所关系</span></div><h2>${esc(site.name)}</h2><p class="place-role">${esc(site.role)}</p><figure><img src="/welcome/maps/${site.id}-brand-v1.png" alt="${esc(site.name)}品牌化空间示意，依据原方案图重绘"><figcaption>品牌化空间示意 · AI 辅助重绘 · 依据 ${esc(site.plan.sourceId)} P${site.plan.page}</figcaption></figure><div class="map-key" aria-label="地图表达"><span><i class="map-building"></i>建筑</span><span><i class="map-green"></i>绿地</span><span><i class="map-public"></i>公共空间</span><span><i class="map-route"></i>联系与轴线</span></div><p>${esc(site.summary)}</p></section>`;setFlipped(true);}
city.addEventListener('click',e=>{if(flipped&&e.target.closest('.flip-back')){setFlipped(false);return;}const b=e.target.closest('[data-preview-site]');if(b&&!flipped)showPlace(b.dataset.previewSite);});
back.addEventListener('keydown',e=>{if(['Enter',' ','Escape'].includes(e.key)){e.preventDefault();setFlipped(false);}});
