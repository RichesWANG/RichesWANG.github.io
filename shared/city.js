export function cityMarkup(){
 const sites=[['station','01','站前广场','抵达 · 公共客厅'],['mill','02','国棉六厂','记忆 · 公众共创'],['school','03','山大附校','成长 · 日常美育'],['rail','04','铁路遗址公园','铁路 · 连续体验']];
 return '<div class="city-network"><div class="network-heading"><span>QINGDAO NORTH / 场所关系</span><small>点击节点，走进场所</small></div><div class="network-chart"><svg viewBox="0 0 600 470" preserveAspectRatio="none" aria-hidden="true"><path d="M140 110L300 235L460 110M140 360L300 235L460 360"/><ellipse cx="300" cy="235" rx="210" ry="175"/><circle cx="300" cy="235" r="95"/></svg><div class="network-center"><small>ART CITY</small><strong>青岛北站片区</strong><span>四个场所 · 共同的城市故事</span></div>'+sites.map(([id,n,name,desc],i)=>'<a class="network-node n'+i+'" href="/explore/?place='+id+'#'+id+'"><b>'+n+'</b><strong>'+name+'</strong><small>'+desc+'</small></a>').join('')+'</div><div class="network-caption"><span><i></i>场所与片区的叙事联系</span><small>关系示意，非地理位置图</small></div></div>';
}
export const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const short=id=>({station:'站前广场',mill:'国棉六厂',school:'山大附校',rail:'铁路遗址公园'}[id]||id);
