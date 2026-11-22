/* Online leaderboard client (Supabase REST). With no config it stays off and the game uses the on-device list. */
(function(){const C=window.BP_CFG||{},on=!!(C.SUPABASE_URL&&C.SUPABASE_KEY),base=on?C.SUPABASE_URL.replace(/\/+$/,''):'';
async function rpc(fn,body){const ac=typeof AbortController!=='undefined'?new AbortController():null,tm=ac?setTimeout(()=>ac.abort(),9000):0;
try{const r=await fetch(base+'/rest/v1/rpc/'+fn,{method:'POST',headers:{'Content-Type':'application/json',apikey:C.SUPABASE_KEY,Authorization:'Bearer '+C.SUPABASE_KEY},body:JSON.stringify(body),signal:ac?ac.signal:undefined});if(!r.ok)throw new Error('HTTP '+r.status);const t=await r.text();return t?JSON.parse(t):null}finally{if(tm)clearTimeout(tm)}}
const Q='bp_pending';
function pend(){try{return JSON.parse(BPS.get(Q)||'[]')}catch(e){return[]}}
function savePend(a){try{BPS.set(Q,JSON.stringify(a.slice(-20)))}catch(e){}}
async function send(s){if(s.k)await rpc('submit_halal',{p_device:BPS.devId(),p_name:s.n,p_kind:s.k,p_amount:s.a,p_count:s.c});else await rpc('submit_score',{p_device:BPS.devId(),p_name:s.n,p_score:s.l,p_earned:s.f})}
async function flush(){const a=pend();if(!a.length)return;const keep=[];for(const s of a){try{await send(s)}catch(e){keep.push(s)}}savePend(keep)}
window.BPNET={enabled:on,
async submit(name,loss,earned){if(!on)return false;const s={n:String(name||'').slice(0,24),l:Math.max(0,Math.round(loss)),f:Math.max(0,Math.round(earned))};
try{await send(s);flush();return true}catch(e){const a=pend();a.push(s);savePend(a);return false}},
async submitHalal(kind,name,amount,count){if(!on)return false;const s={k:kind,n:String(name||'').slice(0,24),a:Math.max(0,Math.round(amount)),c:Math.max(0,Math.round(count||0))};try{await send(s);flush();return true}catch(e){const a=pend();a.push(s);savePend(a);return false}},
async halalTop(kind,period){if(!on)return null;try{flush();return await rpc('get_halal_top',{p_kind:kind,p_period:period,p_device:BPS.devId(),p_limit:20})}catch(e){return null}},
async top(period){if(!on)return null;try{flush();return await rpc('get_top',{p_period:period,p_device:BPS.devId(),p_limit:20})}catch(e){return null}}};
if(on)setTimeout(flush,3000);
if(typeof module!=='undefined')module.exports=window.BPNET})();
