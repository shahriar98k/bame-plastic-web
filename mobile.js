/* Mobile-only layout: runs only on touch phones/tablets (pointer:coarse). Desktop is untouched. */
(function(){
if(!matchMedia('(pointer:coarse)').matches)return;
document.body.classList.add('mob');
const c='top:calc(var(--st) + 6px)!important;bottom:auto!important;right:auto!important;width:36px!important;height:32px!important;font-size:15px!important;border-radius:10px!important;border-width:1px!important;';
const ids=['bE','bN','bC','bM','bRd','bS'];
let css='';
ids.forEach((id,i)=>{css+='body.mob #'+id+'{'+c+'left:calc(50% - 114px + '+i*38+'px)!important}'});
css+=
'body.mob .b small{display:none!important}'+
'body.mob #bG,body.mob #bV,body.mob #bP,body.mob #bB{right:auto!important;top:auto!important;width:68px!important;height:68px!important;font-size:24px!important;border-radius:18px!important}'+
'body.mob #bG{left:92px!important;bottom:calc(var(--sb) + 84px)!important}'+
'body.mob #bV{left:92px!important;bottom:calc(var(--sb) + 10px)!important}'+
'body.mob #bP{left:12px!important;bottom:calc(var(--sb) + 120px)!important;font-size:18px!important}'+
'body.mob #bB{left:12px!important;bottom:calc(var(--sb) + 40px)!important;font-size:18px!important}'+
'body.mob #bH{left:auto!important;top:auto!important;right:10px!important;bottom:calc(var(--sb) + 98px)!important;width:52px!important;height:52px!important;font-size:22px!important;border-radius:50%!important}'+
'body.mob #bL,body.mob #bR{top:auto!important;left:auto!important;width:80px!important;height:80px!important;bottom:calc(var(--sb) + 10px)!important;font-size:30px!important;border-radius:20px!important}'+
'body.mob #bL{right:98px!important}body.mob #bR{right:10px!important}'+
'body.mob #mm{width:96px!important;height:96px!important;top:calc(var(--st) + 6px)!important;right:6px!important;border-width:2px!important}'+
'body.mob #tr{display:none!important}'+
'body.mob #gg{right:6px!important;top:calc(var(--st) + 106px)!important;bottom:auto!important;transform:scale(.62);transform-origin:right top}'+
'body.mob #rn{top:calc(var(--st) + 6px)!important;left:6px!important;font-size:11px!important;padding:3px 8px!important;max-width:calc(50vw - 145px)!important}'+
'body.mob #ln{top:calc(var(--st) + 30px)!important;left:6px!important;font-size:14px!important;padding:2px 8px!important}'+
'body.mob #hl{top:calc(var(--st) + 62px)!important;left:6px!important;font-size:11px!important;padding:2px 8px!important}'+
'body.mob #ob{top:calc(var(--st) + 88px)!important;left:6px!important;font-size:11px!important;padding:2px 8px!important;max-width:calc(50vw - 145px)!important}'+
'body.mob #jb{top:calc(var(--st) + 114px)!important;left:6px!important;font-size:11px!important;padding:3px 8px!important;max-width:calc(50vw - 145px)!important}'+
'body.mob #jcard{left:auto!important;right:6px!important;top:calc(var(--st) + 176px)!important;width:min(34vw,200px)!important;font-size:12px!important}'+
'body.mob #rdo{bottom:auto!important;top:calc(var(--st) + 44px)!important;font-size:11px!important;padding:2px 8px!important;max-width:46vw!important}'+
'body.mob #ts{top:calc(var(--st) + 74px)!important;font-size:14px!important;padding:6px 10px!important}'+
'body.mob #rn,body.mob #ob,body.mob #jb{overflow:hidden!important;text-overflow:ellipsis!important}body.mob #nt{display:none!important}';
const s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
})();
