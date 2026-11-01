window.previewMedia=id=>({"media-ppt-1":"/preview-media/media-ppt-1.jpg","media-ppt-15":"/preview-media/media-ppt-15.jpg","media-ppt-32":"/preview-media/media-ppt-32.jpg","media-ppt-33":"/preview-media/media-ppt-33.jpg","media-ppt-34":"/preview-media/media-ppt-34.jpg","media-ppt-36":"/preview-media/media-ppt-36.jpg","media-ppt-37":"/preview-media/media-ppt-37.jpg","media-ppt-39":"/preview-media/media-ppt-39.jpg","media-ppt-41":"/preview-media/media-ppt-41.jpg","media-ppt-44":"/preview-media/media-ppt-44.jpg","media-ppt-48":"/preview-media/media-ppt-48.jpg","media-ppt-51":"/preview-media/media-ppt-51.jpg","media-ppt-54":"/preview-media/media-ppt-54.jpg","media-ppt-59":"/preview-media/media-ppt-59.jpg","media-ppt-152":"/preview-media/media-ppt-152.jpg","media-ppt-167":"/preview-media/media-ppt-167.jpg","media-ppt-173":"/preview-media/media-ppt-173.jpg","media-ppt-175":"/preview-media/media-ppt-175.jpg","media-ppt-177":"/preview-media/media-ppt-177.jpg","media-ppt-180":"/preview-media/media-ppt-180.jpg","media-ppt-182":"/preview-media/media-ppt-182.jpg","media-ppt-187":"/preview-media/media-ppt-187.jpg","media-ppt-188":"/preview-media/media-ppt-188.jpg","media-ppt-193":"/preview-media/media-ppt-193.jpg","media-ppt-194":"/preview-media/media-ppt-194.jpg","media-ppt-195":"/preview-media/media-ppt-195.jpg","media-ppt-196":"/preview-media/media-ppt-196.jpg","media-ppt-197":"/preview-media/media-ppt-197.jpg","media-ppt-198":"/preview-media/media-ppt-198.jpg","media-ppt-201":"/preview-media/media-ppt-201.jpg","media-ppt-204":"/preview-media/media-ppt-204.jpg","media-ppt-205":"/preview-media/media-ppt-205.jpg","media-ppt-209":"/preview-media/media-ppt-209.jpg","media-ppt-215":"/preview-media/media-ppt-215.jpg","media-ppt-227":"/preview-media/media-ppt-227.jpg","media-ppt-228":"/preview-media/media-ppt-228.jpg","media-ppt-229":"/preview-media/media-ppt-229.jpg","media-ppt-235":"/preview-media/media-ppt-235.jpg","media-ppt-243":"/preview-media/media-ppt-243.jpg","media-ppt-253":"/preview-media/media-ppt-253.jpg","media-ppt-257":"/preview-media/media-ppt-257.jpg","media-ppt-261":"/preview-media/media-ppt-261.jpg","media-ppt-263":"/preview-media/media-ppt-263.jpg","media-ppt-265":"/preview-media/media-ppt-265.jpg","media-ppt-274":"/preview-media/media-ppt-274.jpg","media-ppt-291":"/preview-media/media-ppt-291.jpg","media-ppt-303":"/preview-media/media-ppt-303.jpg","media-ppt-355":"/preview-media/media-ppt-355.jpg","media-ppt-356":"/preview-media/media-ppt-356.jpg","media-ppt-384":"/preview-media/media-ppt-384.jpg","media-ppt-385":"/preview-media/media-ppt-385.jpg","media-ppt-387":"/preview-media/media-ppt-387.jpg","media-ppt-388":"/preview-media/media-ppt-388.jpg","media-ppt-389":"/preview-media/media-ppt-389.jpg","media-ppt-390":"/preview-media/media-ppt-390.jpg","media-ppt-391":"/preview-media/media-ppt-391.jpg","media-ppt-392":"/preview-media/media-ppt-392.jpg","media-ppt-393":"/preview-media/media-ppt-393.jpg","media-ppt-394":"/preview-media/media-ppt-394.jpg","media-station-3":"/preview-media/media-station-3.jpg","media-station-32":"/preview-media/media-station-32.jpg","media-station-36":"/preview-media/media-station-36.jpg","media-station-37":"/preview-media/media-station-37.jpg","media-station-69":"/preview-media/media-station-69.jpg","media-mill-5":"/preview-media/media-mill-5.jpg","media-mill-44":"/preview-media/media-mill-44.jpg","media-mill-53":"/preview-media/media-mill-53.jpg","media-mill-54":"/preview-media/media-mill-54.jpg","media-rail-13":"/preview-media/media-rail-13.jpg","media-rail-23":"/preview-media/media-rail-23.jpg","media-rail-46":"/preview-media/media-rail-46.jpg","media-rail-47":"/preview-media/media-rail-47.jpg","media-rail-48":"/preview-media/media-rail-48.jpg","media-rail-50":"/preview-media/media-rail-50.jpg","media-rail-51":"/preview-media/media-rail-51.jpg","media-school-6":"/preview-media/media-school-6.jpg","media-school-8":"/preview-media/media-school-8.jpg","media-school-20":"/preview-media/media-school-20.jpg","media-school-29":"/preview-media/media-school-29.jpg","media-landscape-23":"/preview-media/media-landscape-23.jpg","media-landscape-24":"/preview-media/media-landscape-24.jpg","media-landscape-31":"/preview-media/media-landscape-31.jpg","media-landscape-35":"/preview-media/media-landscape-35.jpg","media-landscape-43":"/preview-media/media-landscape-43.jpg","media-landscape-51":"/preview-media/media-landscape-51.jpg"})[id]||'/preview-media/unavailable.svg';
// Only injected into the exported, static customer preview. No writable server is deployed.
window.GUIDE_READ_ONLY_PREVIEW = true;
(() => {
  const message = '这是只读方案预览：编辑、意见提交和成果上传尚未开放。';
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, location.href);
    if (url.origin !== location.origin || !url.pathname.startsWith('/api/')) return nativeFetch(input, init);
    const method = (init.method || input.method || 'GET').toUpperCase();
    if (method !== 'GET' && method !== 'HEAD') return Promise.resolve(new Response(JSON.stringify({error: message}), {status: 403, headers: {'Content-Type':'application/json'}}));
    return nativeFetch('/preview-data/' + url.pathname.slice(5) + '.json', init);
  };
  const mutation = '#submissionForm,#opinionForm,#editorForm,form[data-review],form[data-feedback]';
  const blocked = '[data-action],[data-restore]';
  document.addEventListener('submit', e => {
    if (e.target.matches(mutation)) { e.preventDefault(); e.stopImmediatePropagation(); alert(message); }
  }, true);
  document.addEventListener('click', e => {
    if (e.target.closest(blocked) || e.target.closest('a[href^="/original/"]')) {
      e.preventDefault(); e.stopImmediatePropagation(); alert('客户预览仅包含已选用的图文摘页；完整原始资料及编辑功能请在本机工作区查看。');
    }
  }, true);
  function decorate() {
    document.querySelectorAll(mutation).forEach(form => {
      form.querySelectorAll('input,textarea,select,button[type="submit"]').forEach(el => { if (!el.disabled) el.disabled = true; });
      const submit = form.querySelector('button[type="submit"]');
      if (submit && submit.textContent !== '只读预览 · 暂未开放提交') submit.textContent = '只读预览 · 暂未开放提交';
    });
    document.querySelectorAll(blocked).forEach(el => { if (!el.disabled) el.disabled = true; });
    document.querySelectorAll('.workspace-boundary,.editor-caption,#listHint,.local-note').forEach(el => {
      if (el.textContent !== message) el.textContent = message;
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const notice = document.createElement('div'); notice.className = 'customer-preview-notice';
    notice.textContent = '方案演示 · 工作草稿待核实 · 只读预览'; notice.setAttribute('role','note');
    document.body.append(notice);
    const style = document.createElement('style');
    style.textContent = '.customer-preview-notice{position:fixed;bottom:10px;right:12px;max-width:calc(100vw - 24px);z-index:9999;padding:7px 14px;border:1px solid #02713340;border-radius:20px;background:#f4faf9ee;backdrop-filter:blur(12px);color:#075a3d;font:11px/1.5 system-ui;pointer-events:none}button:disabled{cursor:not-allowed!important}';
    document.head.append(style); decorate();
    new MutationObserver(decorate).observe(document.body,{childList:true,subtree:true});
  });
})();
