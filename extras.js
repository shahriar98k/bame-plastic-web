/* extras.js — রাস্তার ঘটনা, আবহাওয়া, রেডিও, ভাইরাল ছবি ও স্কোরবোর্ড লাইন.
   jobs.js-এর পরে চলে। game1.js এখানে বদলানো হয়নি — শুধু ছোট হুক বসানো হয়েছে। */
(function(){
if(window.__BPX||typeof G==='undefined'||typeof S==='undefined'||typeof V6==='undefined'||typeof sc==='undefined'||!window.BPJ||!window.BPJ_T)return;
window.__BPX=1;
const KM=!!window.KMODE,J=window.BPJ,T=window.BPJ_T;
const bnn=n=>bn(Math.round(n).toLocaleString('en-IN')),money=n=>'৳'+bnn(n);
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const dist=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);
const X={t:0,evCd:KM?55:40,ev:null,wx:'',w:{rain:0,fog:0,eid:0},wxT:0,maxRain:0,maxFog:0,snap:null,vir:null,virURL:'',q:[],cur:null,lastR:0,lastD:0,lastF:0,lossM:0,topM:0,jamT:55,adT:85,spdSum:0,spdN:0,voiceOn:true,voice:null};
window.BPX=X;
const roadNow=()=>((document.getElementById('rn')||{}).textContent||'').replace(/^রাস্তা:\s*/,'').replace(/^—$/,'')||(KM?'কাপ্তাইয়ের রাস্তা':'ঢাকার রাস্তা');

/* ================= ছোট UI ================= */
const css=document.createElement('style');
css.textContent='#wx,#wxd,#wxf{position:fixed;inset:0;width:100%;height:100%;pointer-events:none}#wxd{background:rgba(24,34,56,.5);opacity:0}#wxf{opacity:0}'
+'#rdo{left:50%;bottom:calc(var(--sb) + 26px);transform:translateX(-50%);display:none;align-items:center;gap:6px;max-width:50vw;font-size:13px;z-index:12;pointer-events:none}#rdo .mq{overflow:hidden;white-space:nowrap;width:min(44vw,380px)}#rdo .mq span{display:inline-block;padding-left:100%;animation:rdm var(--d,12s) linear forwards}@keyframes rdm{to{transform:translateX(-100%)}}'
+'#bRd{left:310px;bottom:calc(var(--sb) + 142px);width:52px;height:46px;font-size:18px}.pre #rdo{display:none!important}';
document.head.appendChild(css);
function mk(tag,id,cls){let e=document.getElementById(id);if(e)return e;e=document.createElement(tag);e.id=id;if(cls)e.className=cls;return e}
const vg=document.getElementById('vg'),bodyE=document.body;
const wxc=mk('canvas','wx'),wxd=mk('div','wxd'),wxf=mk('div','wxf');
for(const e of [wxc,wxd,wxf]){if(vg&&vg.parentNode)vg.parentNode.insertBefore(e,vg.nextSibling);else bodyE.appendChild(e)}
const rdo=mk('div','rdo','p'),rdt=document.createElement('span');
rdo.innerHTML='<span>📻</span><div class="mq"></div>';rdo.querySelector('.mq').appendChild(rdt);bodyE.appendChild(rdo);
const bRd=mk('button','bRd','b');bRd.textContent='📻';bodyE.appendChild(bRd);

/* ================= রেডিও + ভয়েস ================= */
let vTry=0;
function pickVoice(){try{const vs=speechSynthesis.getVoices()||[];X.voice=vs.find(v=>/^bn/i.test(v.lang))||null}catch(e){X.voice=null}}
try{pickVoice();if('speechSynthesis' in window)speechSynthesis.onvoiceschanged=pickVoice}catch(e){}
try{if(localStorage.getItem('bp_voice')==='0')X.voiceOn=false}catch(e){}
function setBtn(){bRd.textContent=X.voiceOn?'📻':'🔇';bRd.style.opacity=X.voiceOn?'1':'.6'}
setBtn();
bRd.addEventListener('pointerdown',e=>{e.preventDefault();e.stopPropagation();X.voiceOn=!X.voiceOn;setBtn();try{localStorage.setItem('bp_voice',X.voiceOn?'1':'0')}catch(_){}if(!X.voiceOn){try{speechSynthesis.cancel()}catch(_){}}else news(KM?'📻 রেডিও চালু — কাপ্তাইয়ের খবর এখন সরাসরি।':'📻 রেডিও চালু — ঢাকার জ্যাম নিয়ে সরাসরি খবর।',1)});
function speak(t){if(!X.voiceOn)return;if(!X.voice){if(vTry++<3)pickVoice();if(!X.voice)return}try{if(speechSynthesis.speaking)return;const u=new SpeechSynthesisUtterance(t.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu,'').replace(/[·—]/g,', '));u.lang=X.voice.lang;u.voice=X.voice;u.rate=1.02;speechSynthesis.speak(u)}catch(e){}}
function showNext(){if(X.cur||!X.q.length)return;const n=X.q.shift();X.cur=n;rdt.textContent=n.t;rdt.style.setProperty('--d',Math.max(8,5+n.t.length*.13)+'s');rdt.style.animation='none';void rdt.offsetWidth;rdt.style.animation='';rdo.style.display=(G.started&&!G.over)?'flex':'none';if(n.v)speak(n.t)}
rdt.addEventListener('animationend',()=>{X.cur=null;if(X.q.length)showNext();else rdo.style.display='none'});
function news(t,pri){if(X.q.length>=4){if(pri){X.q.shift()}else return}X.q.push({t,v:pri!==0});showNext()}

/* ================= রাস্তার ঘটনা ================= */
const MT=c=>new THREE.MeshLambertMaterial({color:c});
function icon(glyph,col){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.arc(64,64,60,0,7);x.fill();x.fillStyle=col;x.beginPath();x.arc(64,64,52,0,7);x.fill();x.fillStyle='#fff';x.font='800 '+(glyph.length>5?24:glyph.length>3?30:38)+'px "Hind Siliguri","Noto Sans Bengali",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(glyph,64,68);
const m=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,depthWrite:false,sizeAttenuation:false,fog:false}),s=new THREE.Sprite(m);s.scale.set(.065,.065,1);s.renderOrder=998;s.userData.own=1;return s}
function human(kid){const f=Math.random()<.4,g=V6.mkHuman(V6.humanSpec(f,{h:kid?.72+Math.random()*.08:.95+Math.random()*.12}),true);g.userData.fem=f;g.visible=true;sc.add(g);return g}
function kill(o){if(!o)return;try{sc.remove(o)}catch(e){}const own=o.userData&&o.userData.own;o.traverse&&o.traverse(m=>{try{if(m.geometry)m.geometry.dispose();if(own&&m.material){m.material.map&&m.material.map.dispose();m.material.dispose()}}catch(e){}})}
function cow(){const g=new THREE.Group(),b=MT(0xf1e9dc),d=MT(0x7a4a24),add=(w,h,p,m,x,y,z)=>{const e=new THREE.Mesh(new THREE.BoxGeometry(w,h,p),m);e.position.set(x,y,z);g.add(e)};
add(.95,.9,1.9,b,0,1.1,0);add(.96,.5,.8,d,0,1.2,.2);add(.55,.55,.7,b,0,1.35,1.2);add(.2,.2,.2,d,.25,1.72,1.3);add(.2,.2,.2,d,-.25,1.72,1.3);
for(const q of [[.3,.7],[-.3,.7],[.3,-.7],[-.3,-.7]])add(.2,.7,.2,d,q[0],.4,q[1]);g.userData.own=1;sc.add(g);return g}
function tyre(){const g=new THREE.Group(),t=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,.35,12),MT(0x151515));t.rotation.x=Math.PI/2;t.position.y=.55;g.add(t);
const f=new THREE.Mesh(new THREE.ConeGeometry(.32,1,6),new THREE.MeshBasicMaterial({color:0xff7a1a,transparent:true,opacity:.85,fog:false}));f.position.y=1.3;g.add(f);g.userData.own=1;g.userData.flame=f;sc.add(g);return g}
function stumps(){const g=new THREE.Group();for(const x of[-.14,0,.14]){const m=new THREE.Mesh(new THREE.BoxGeometry(.04,.7,.04),MT(0xe8d9a0));m.position.set(x,.35,0);g.add(m)}g.userData.own=1;sc.add(g);return g}
const EVT=KM?[['cow',.35],['cricket',.25],['tour',.4]]:[['cow',.2],['cricket',.25],['wedding',.25],['hartal',.15],['cow',.15]];
const EVN={cow:{n:'গরু',t:'🐄 সামনে গরু রাস্তায় — ঈদের আগেই হাট বসে গেছে!',col:'#8d6e63',ttl:130},cricket:{n:'ক্রিকেট',t:'🏏 রাস্তায় ক্রিকেট চলছে — আম্পায়ার কিন্তু ট্রাফিক পুলিশ নয়!',col:'#2e7d32',ttl:140},wedding:{n:'বরযাত্রী',t:'🎺 বরযাত্রী যাচ্ছে — বাজনা ও নাচে রাস্তা বন্ধ!',col:'#c2185b',ttl:150},hartal:{n:'হরতাল',t:'🔥 সামনে হরতাল — টায়ার জ্বলছে, ঝুঁকি নিলে নিজ দায়িত্বে!',col:'#e65100',ttl:75},tour:{n:'সেলফি',t:'📸 পর্যটকরা রাস্তায় সেলফি তুলছে — লেক দেখলে সবারই মাথা খারাপ!',col:'#1976d2',ttl:140}};
function wpick(l){let t=0;for(const e of l)t+=e[1];let r=Math.random()*t;for(const e of l){r-=e[1];if(r<=0)return e[0]}return l[0][0]}
function spawnEv(){const fx=Math.sin(S.h),fz=-Math.cos(S.h);let l=T.ring(S.x,S.z,230,430,fx,fz);if(!l.length)l=T.ring(S.x,S.z,120,700,fx,fz);if(!l.length){X.evCd=20;return}
let tot=0;for(const e of l)tot+=e[1];let r=Math.random()*tot,p=l[l.length-1][0];for(const e of l){r-=e[1];if(r<=0){p=e[0];break}}
const type=wpick(EVT),I=EVN[type],ux=p[2],uz=p[3],nx=-uz,nz=ux,w=p[5],ry=Math.atan2(ux,uz);
const ev={type,I,x:p[0],z:p[1],age:0,ttl:I.ttl,objs:[],its:[],ico:icon(I.n,I.col),said:0};
const addIt=(g,r,kind,fem,extra)=>{const it=Object.assign({g,r,kind,fem:!!fem,hit:0,fall:0,run:0,ph:Math.random()*6},extra||{});ev.its.push(it);return it};
const away=(x,z,sgn)=>({x:x+nx*sgn*(w/2+4+rnd(0,2.5)),z:z+nz*sgn*(w/2+4+rnd(0,2.5))});
if(type==='cow'){const g=cow(),o=rnd(-1.5,1.5);g.position.set(p[0]+nx*o,0,p[1]+nz*o);g.rotation.y=ry+(Math.random()<.5?0:Math.PI/2);ev.objs.push(g);addIt(g,.95,'cow',0)}
else if(type==='cricket'||type==='tour'){const n=type==='cricket'?5:6,st=type==='cricket'?stumps():null;if(st){st.position.set(p[0],0,p[1]);st.rotation.y=ry;ev.objs.push(st)}
for(let i=0;i<n;i++){const g=human(type==='cricket'),a=i/n*6.28,rr=type==='cricket'?2.2+rnd(0,1.5):1.4+rnd(0,1.6),x=p[0]+Math.cos(a)*rr,z=p[1]+Math.sin(a)*rr;g.position.set(x,0,z);g.rotation.y=a+3.14;ev.objs.push(g);const sg=i%2?1:-1;addIt(g,.4,'ped',g.userData.fem,{R:34,away:away(x,z,sg)})}}
else if(type==='wedding'){for(let i=0;i<9;i++){const g=human(0),row=i%3,col=Math.floor(i/3),x=p[0]+nx*(col-1)*1.6+ux*row*1.8,z=p[1]+nz*(col-1)*1.6+uz*row*1.8;g.position.set(x,0,z);g.rotation.y=ry;ev.objs.push(g);addIt(g,.4,'ped',g.userData.fem,{R:30,march:{x:ux,z:uz},away:null,sgn:i%2?1:-1})}}
else if(type==='hartal'){const n=Math.max(4,Math.round(w/1.7));for(let i=0;i<n;i++){const o=(i-(n-1)/2)*(w/n),g=tyre();g.position.set(p[0]+nx*o,0,p[1]+nz*o);ev.objs.push(g);addIt(g,.8,'tyre',0)}
for(let i=0;i<4;i++){const g=human(0),o=(i-1.5)*2.6;g.position.set(p[0]+nx*o+ux*2.5,0,p[1]+nz*o+uz*2.5);g.rotation.y=ry+3.14;ev.objs.push(g);addIt(g,.4,'ped',g.userData.fem)}}
ev.cx=p[0];ev.cz=p[1];ev.ico.position.set(p[0],4.6,p[1]);sc.add(ev.ico);X.ev=ev;
if(typeof toast==='function')toast(I.t,3.4);
news('এইমাত্র খবর: '+roadNow()+' এলাকায় '+({cow:'গরু রাস্তায় উঠে পড়েছে',cricket:'রাস্তায় ক্রিকেট ম্যাচ চলছে',wedding:'বরযাত্রীর মিছিলে রাস্তা বন্ধ',hartal:'হরতালের সমর্থকেরা টায়ারে আগুন দিয়েছে',tour:'পর্যটকদের সেলফির ভিড়'})[type]+' — যান চলাচল ধীর।',1)}
function clearEv(){const e=X.ev;if(!e)return;for(const o of e.objs)kill(o);kill(e.ico);X.ev=null}
function hitIt(it,e){it.hit=1;const x=it.g.position.x,z=it.g.position.z;
if(it.kind==='ped'){it.g.rotation.z=1.45;it.fall=3;crime(50000,e.type==='wedding'?'🎺 বরযাত্রীতে ধাক্কা! বাজনা থেমে গেল':e.type==='cricket'?'🏏 ক্রিকেটের ছেলেকে ধাক্কা!':'🚶 পথচারীকে ধাক্কা! ছিটকে পড়ল','ped');S.vf*=.6;try{pedSnd(it.fem)}catch(_){}try{panic(x,z)}catch(_){}try{shake(.4)}catch(_){}}
else if(it.kind==='cow'){it.g.rotation.z=1.2;it.fall=3;crime(60000,'🐄 গরুকে ধাক্কা! মালিক চিৎকার করছে','prop');S.vf*=.4;try{shake(.6);crashSnd(.6)}catch(_){}}
else{it.g.visible=false;it.fall=.1;crime(9000,'🔥 হরতালের টায়ার ছিটকে গেল','prop');S.vf*=.7;try{shake(.3)}catch(_){}}}
function itTick(it,e,dt,d){if(it.fall>0){it.fall-=dt;if(it.fall<=0){it.g.visible=false}return}if(it.hit||!it.g.visible)return;const g=it.g;
if(it.kind==='tyre'){const f=g.userData.flame;if(f){f.scale.y=.8+Math.sin(X.t*18+it.ph)*.25}}
if(!it.run&&it.R&&d<it.R&&(it.away||it.march))it.run=1;
if(it.run&&it.kind==='ped'){if(!it.away){const sg=it.sgn||1,p=g.position,nx=-e.uz,nz=e.ux;it.away={x:p.x+nx*sg*7,z:p.z+nz*sg*7}}const dx=it.away.x-g.position.x,dz=it.away.z-g.position.z,dd=Math.hypot(dx,dz);if(dd>.6){g.position.x+=dx/dd*4*dt;g.position.z+=dz/dd*4*dt;g.rotation.y=Math.atan2(dx,dz);it.ph+=dt*9;V6.animH(g,it.ph,1)}else{V6.animH(g,0,0)}}
else if(it.march&&it.kind==='ped'){g.position.x+=it.march.x*1.0*dt;g.position.z+=it.march.z*1.0*dt;it.ph+=dt*6;V6.animH(g,it.ph,1)}
if(Math.abs(S.vf)>.8){const dx=g.position.x-S.x,dz=g.position.z-S.z,lat=dx*Math.cos(S.h)+dz*Math.sin(S.h),lon=dx*Math.sin(S.h)-dz*Math.cos(S.h);if(Math.abs(lat)<PV.hw+it.r&&Math.abs(lon)<PV.ol+it.r+.1)hitIt(it,e)}}
function evTick(dt){if(!X.ev){X.evCd-=dt;if(X.evCd<=0)spawnEv();return}const e=X.ev;e.age+=dt;let d=dist(S.x,S.z,e.cx,e.cz);if(e.age>e.ttl||d>950){clearEv();X.evCd=rnd(60,110);return}
if(e.its[0]){e.cx=e.its[0].g.position.x;e.cz=e.its[0].g.position.z}
if(!e.ux){const p=e.its[0];e.ux=Math.sin(p.g.rotation.y);e.uz=Math.cos(p.g.rotation.y)}
if(e.type==='wedding'&&e.its[0]&&e.its[0].march){e.ux=e.its[0].march.x;e.uz=e.its[0].march.z}
e.ico.position.set(e.cx,4.6+Math.sin(X.t*3)*.2,e.cz);
for(const it of e.its)itTick(it,e,dt,d);
if(!e.said&&d<45&&e.type==='cricket'){e.said=1;toast('🏏 ছেলেরা সরে যাচ্ছে — "আউট হইলে তুমি দায়ী!"',2.6)}
if(!e.said&&d<45&&e.type==='tour'){e.said=1;toast('📸 পর্যটকেরা সরে যাচ্ছে — "ভাই, ফ্রেমটা নষ্ট কইরেন না!"',2.6)}
if(!e.said&&d<45&&e.type==='wedding'){e.said=1;toast('🎺 বর বলছে: "আমার বিয়ে নষ্ট কইরেন না ভাই!"',2.6)}}

/* ================= আবহাওয়া ================= */
const WXW=KM?[['clear',.5],['rain',.25],['fog',.25]]:[['clear',.42],['rain',.25],['fog',.13],['eid',.2]];
const WXT={rain:KM?'🌧️ লেকের ওপর মেঘ জমেছে — বৃষ্টি নামছে, রাস্তা পিচ্ছিল!':'🌧️ বৃষ্টি শুরু! ঢাকার রাস্তা এখন নদী — আস্তে চালান।',fog:'🌫️ কুয়াশা নামছে — সামনে দেখা কঠিন, সাবধান!',eid:'🌙 ঈদের আগের দিন! রাস্তায় মানুষের ঢল — ভাড়া দেড়গুণ, কাজও বেশি।',clear:'☀️ আকাশ পরিষ্কার হচ্ছে — আবহাওয়া এখন ভালো।'};
const WXN={rain:KM?'কাপ্তাই লেকের ওপর বৃষ্টি শুরু, পথঘাট পিচ্ছিল':'ঢাকায় ভারী বৃষ্টি শুরু; কয়েক জায়গায় জলাবদ্ধতার খবর',fog:'ঘন কুয়াশায় দৃষ্টিসীমা কমে গেছে; চালকদের সাবধানে চলার অনুরোধ',eid:'ঈদের আগের দিন: রাস্তায় যাত্রীর ঢল, ভাড়া বেড়েছে দেড়গুণ',clear:'আকাশ পরিষ্কার হয়ে আসছে'};
let fogBase=null,drops=null,rcx=null,rw=0,rh=0,wa=null;
function wxSize(){rw=Math.max(2,Math.ceil((window.innerWidth||800)/2));rh=Math.max(2,Math.ceil((window.innerHeight||400)/2));if(wxc.width!==rw||wxc.height!==rh){wxc.width=rw;wxc.height=rh}}
function wxSet(s,quiet){X.wx=s;X.wxT=rnd(150,260);if(!quiet){toast(WXT[s],3.2);news('এইমাত্র খবর: '+WXN[s]+'।',1)}}
function rainAudio(k){try{if(!wa&&k<.02)return;if(!wa){const AC2=window.AudioContext||window.webkitAudioContext;if(!AC2)return;const c=new AC2(),len=c.sampleRate*2,buf=c.createBuffer(1,len,c.sampleRate),d=buf.getChannelData(0);for(let i=0;i<len;i++)d[i]=Math.random()*2-1;const src=c.createBufferSource();src.buffer=buf;src.loop=true;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2200;const hp=c.createBiquadFilter();hp.type='highpass';hp.frequency.value=500;const gn=c.createGain();gn.gain.value=0;src.connect(lp);lp.connect(hp);hp.connect(gn);gn.connect(c.destination);src.start();wa={c,gn}}
if(wa.c.state==='suspended')wa.c.resume();wa.gn.gain.value=k*.09}catch(e){}}
function wxTick(dt){if(!X.wx){wxSize();const s=wpick(WXW);wxSet(s,s==='clear');X.w[s==='clear'?'rain':s]=s==='clear'?0:1}
X.wxT-=dt;if(X.wxT<=0){let s;do{s=wpick(WXW)}while(s===X.wx);wxSet(s)}
const goal={rain:X.wx==='rain'?1:0,fog:X.wx==='fog'?1:0,eid:X.wx==='eid'?1:0},st=dt/32;
for(const k in goal){const v=goal[k]-X.w[k];X.w[k]+=Math.abs(v)<st?v:Math.sign(v)*st}
const w=X.w;X.maxRain=Math.max(X.maxRain,w.rain);X.maxFog=Math.max(X.maxFog,w.fog);
if(!fogBase&&sc.fog)fogBase={n:sc.fog.near,f:sc.fog.far};
if(fogBase){sc.fog.near=fogBase.n*(1-.6*w.fog-.4*w.rain);sc.fog.far=fogBase.f*(1-.7*w.fog-.3*w.rain)}
wxd.style.opacity=String(w.rain*.55);wxf.style.opacity=String(w.fog*.55);wxf.style.background=(typeof NIGHT!=='undefined'&&NIGHT)?'rgba(40,52,92,1)':'rgba(222,230,240,1)';
J.mult=1+.5*w.eid;if(w.eid>.6&&J.cd>7&&!J.job&&!J.offer)J.cd=7;
rainAudio(w.rain);
if(w.rain>.02){wxSize();if(!drops){drops=[];for(let i=0;i<140;i++)drops.push({x:Math.random(),y:Math.random(),l:8+Math.random()*10,s:.9+Math.random()*.6})}
const c=rcx||(rcx=wxc.getContext('2d'));c.clearRect(0,0,rw,rh);c.strokeStyle='rgba(205,220,240,'+(.45*w.rain).toFixed(2)+')';c.lineWidth=1;c.beginPath();const n=Math.floor(140*w.rain);
for(let i=0;i<n;i++){const o=drops[i];o.y+=o.s*dt*1.3;o.x-=o.s*dt*.18;if(o.y>1){o.y=-.05;o.x=Math.random()*1.2}if(o.x<-.05)o.x=1;const px=o.x*rw,py=o.y*rh;c.moveTo(px,py);c.lineTo(px-o.l*.25,py+o.l)}c.stroke()}
else if(rcx){rcx.clearRect(0,0,rw,rh)}}

/* ================= খবর তৈরি (আসল সংখ্যা থেকে) ================= */
const LOSSM=[1e5,5e5,1e6,5e6,1e7,5e7,1e8,5e8],TOPM=[80,100,120,140,160];
function crimeNews(a,m,k){if(!k)return;const r=roadNow(),n=G.name||'চালক';
const t={ped:r+'-এ এক চালকের ধাক্কায় পথচারী ছিটকে পড়েছেন। ক্ষতির অঙ্ক এখন '+money(G.loss),veh:r+'-এ যানবাহনে ধাক্কা, যান চলাচল ব্যাহত। চ্যাডের খুশি '+money(G.loss),cart:r+'-এ পথের দোকান ভেঙেছে; ব্যবসায়ীরা ক্ষতিপূরণ চান',wall:r+'-এ দেয়ালে ধাক্কা; দেয়াল অক্ষত, গাড়ির মান-সম্মান ক্ষত-বিক্ষত',prop:r+'-এ খুঁটি বা বিলবোর্ডে ধাক্কা; সংশ্লিষ্ট বিভাগ ক্ষুব্ধ'}[k];
if(t&&(a>=50000||Math.random()<.45))news('এইমাত্র খবর: '+t+'।')}
function newsTick(dt){X.spdSum+=Math.abs(S.vf)*3.6*dt;X.spdN+=dt;
while(X.lossM<LOSSM.length&&G.loss>=LOSSM[X.lossM]){news('এইমাত্র খবর: চ্যাডের খুশি '+money(LOSSM[X.lossM])+' ছাড়িয়েছে। অর্থনীতিবিদরা বলছেন: "চালককে থামান!"');X.lossM++}
const top=(typeof TR!=='undefined'&&TR.top)||0;while(X.topM<TOPM.length&&top>=TOPM[X.topM]){news('গতির রেকর্ড: ঘণ্টায় '+bn(TOPM[X.topM])+' কিমি ছুঁয়েছে। এ শহরে এটাকে বলে বিমান!');X.topM++}
if(J.rides>X.lastR){X.lastR=J.rides;news('এইমাত্র খবর: এক যাত্রী নিরাপদে গন্তব্যে পৌঁছেছেন — এ শহরে এটাই এখন বড় খবর!')}
if(J.dels>X.lastD){X.lastD=J.dels;news('এইমাত্র খবর: ডেলিভারি সময়মতো পৌঁছেছে। গ্রাহক হতভম্ব!')}
if(J.fails>X.lastF){X.lastF=J.fails;news('এইমাত্র খবর: দুর্ঘটনায় রাইড/অর্ডার বাতিল। গ্রাহক ১ স্টার দিয়েছেন।')}
X.jamT-=dt;if(X.jamT<=0){X.jamT=rnd(55,80);const k=X.spdN>0?X.spdSum/X.spdN:0;X.spdSum=0;X.spdN=0;news('যানজট আপডেট: '+roadNow()+'-এ এখন '+(k<12?'তীব্র যানজট':k<30?'ধীরগতি':'যান চলাচল স্বাভাবিক')+'। চালকের গড় গতি ঘণ্টায় '+bn(Math.round(k))+' কিমি।',0)}
X.adT-=dt;if(X.adT<=0){X.adT=rnd(90,130);news(pick(KM?['বিজ্ঞাপন: কাপ্তাই ধাবা রেস্টুরেন্ট ও রিসোর্ট — লেকের ধারে বসে খান, শান্তি পান। বুকিং: ০১৮২৯-৩২৩০২৯।','বিজ্ঞাপন: কাপ্তাই ধাবা — মাছ-ভাতের স্বাদ, লেকের হাওয়া একদম ফ্রি!']:['বিজ্ঞাপন: মাথা-ঠান্ডা তেল — জ্যামে আটকালেও চুল ঝরবে না!','বিজ্ঞাপন: "জ্যামমুক্ত ঢাকা" ফ্ল্যাট — দাম মাত্র এক কোটি, রাস্তা আপনার নিজ দায়িত্বে!','বিজ্ঞাপন: হর্ন-প্রুফ কানের তুলা — ঢাকায় বসবাসের অপরিহার্য সঙ্গী!']))}}

/* ================= ভাইরাল ছবি ================= */
const HEAD={ped:(r,n)=>r+'-এ '+n+'-এর ধাক্কায় পথচারী ছিটকে পড়লেন — ভিডিও ভাইরাল',veh:(r,n)=>r+'-এ '+n+'-এর গাড়ির ধাক্কা — ইনসুরেন্স কোম্পানি হতভম্ব',cart:(r,n)=>r+'-এ '+n+'-এর হাতে পথের দোকান উধাও — ক্ষতিপূরণ কে দেবে?',wall:(r,n)=>r+'-এ দেয়ালে ধাক্কা — দেয়াল বলছে "আমি ৫০ বছর ধরে আছি"',prop:(r,n)=>r+'-এ খুঁটি-বিলবোর্ডে '+n+'-এর ধাক্কা — এলাকায় অন্ধকার নেমে এল'};
function onCrime(a,m,k){crimeNews(a,m,k);if(!k)return;if(!X.vir||a>X.vir.a)X.snap={a,k,r:roadNow(),loss:G.loss}}
function capture(){const s=X.snap;if(!s)return;X.snap=null;try{const cv=document.getElementById('g');if(!cv||!cv.width)return;const w=640,h=Math.max(2,Math.round(w*cv.height/cv.width)),c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(cv,0,0,w,h);X.vir={a:s.a,k:s.k,r:s.r,loss:s.loss,c};X.virURL=''}catch(e){}}
function wrapText(x,t,mw){const ws=t.split(' '),L=[];let cur='';for(const w of ws){const tt=cur?cur+' '+w:w;if(x.measureText(tt).width>mw&&cur){L.push(cur);cur=w}else cur=tt}if(cur)L.push(cur);return L}
function buildViral(){const v=X.vir;if(!v)return'';if(X.virURL)return X.virURL;
const W=640,pad=16,f='"Hind Siliguri","Noto Sans Bengali",sans-serif',tmp=document.createElement('canvas').getContext('2d');tmp.font='700 24px '+f;
const head=(HEAD[v.k]||HEAD.prop)(v.r,G.name||'চালক'),lines=wrapText(tmp,head,W-pad*2),hh=lines.length*32+10,ph=v.c.height,H=56+hh+ph+64,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
x.fillStyle='#fff';x.fillRect(0,0,W,H);x.fillStyle='#14213d';x.fillRect(0,0,W,48);x.fillStyle='#ffd60a';x.font='800 22px '+f;x.textBaseline='middle';x.fillText('📰 বামে প্লাস্টিক নিউজ',pad,25);x.fillStyle='#cfd8ea';x.font='500 15px '+f;x.textAlign='right';x.fillText('এইমাত্র · 🌐',W-pad,25);x.textAlign='left';
x.fillStyle='#111';x.font='700 24px '+f;x.textBaseline='top';let y=56;for(const l of lines){x.fillText(l,pad,y);y+=32}y+=10;x.drawImage(v.c,0,y,W,ph);y+=ph;
const L=v.loss,r1=Math.round(L/40+120),r2=Math.round(L/25+300),r3=Math.round(L/90+40),cm=Math.round(L/300+25),sh=Math.round(L/500+10);
x.fillStyle='#f0f2f5';x.fillRect(0,y,W,64);x.fillStyle='#222';x.font='600 17px '+f;x.fillText('😮 '+bnn(r1)+'   😂 '+bnn(r2)+'   😡 '+bnn(r3),pad,y+10);x.fillStyle='#555';x.font='500 15px '+f;x.fillText('💬 '+bnn(cm)+' কমেন্ট · ↗ '+bnn(sh)+' শেয়ার · ক্ষতি '+money(v.a),pad,y+36);
try{X.virURL=c.toDataURL('image/jpeg',.82)}catch(e){X.virURL=''}return X.virURL}
X.share=function(){try{const u=X.virURL;if(!u)return;fetch(u).then(r=>r.blob()).then(b=>{const f=new File([b],'bame-plastic-viral.jpg',{type:'image/jpeg'});if(navigator.canShare&&navigator.canShare({files:[f]}))navigator.share({files:[f],title:'বামে প্লাস্টিক'});else{const a=document.createElement('a');a.href=u;a.download='bame-plastic-viral.jpg';a.click()}})}catch(e){}};

/* ================= স্কোরবোর্ড লাইন ================= */
function totCrash(){let n=0;for(const k in(G.cr||{}))n+=G.cr[k];return n}
function title(){const km=((typeof TR!=='undefined'&&TR.d)||0)/1000,top=(typeof TR!=='undefined'&&TR.top)||0,t=(typeof TR!=='undefined'&&TR.t)||1,avg=km/(t/3600),c=totCrash(),L=G.loss||0;
if(J.halal>0&&L>0&&J.halal>=L*.5)return'হালাল চ্যাড সম্রাট';if(c>=15)return'ধাক্কা-সম্রাট';if(top>=120)return'গতির সওদাগর';if(km>.5&&avg<12)return'জ্যামের স্থায়ী বাসিন্দা';if(J.rides+J.dels>=5)return'পেশাদার চালক (প্রায়)';if(c===0&&km>.5)return'ঢাকার বিরল সজ্জন';return'নবীন চ্যাড'}
function statLines(){const km=((typeof TR!=='undefined'&&TR.d)||0)/1000,top=Math.round((typeof TR!=='undefined'&&TR.top)||0),t=(typeof TR!=='undefined'&&TR.t)||1,avg=km/(t/3600),c=totCrash(),L=G.loss||0,o={};
if(km>.05)o.dist='🛣️ '+bn(km.toFixed(2))+' কিমি পথ '+bn(Math.max(1,Math.round(t/60)))+' মিনিটে — গড় গতি '+bn(Math.round(avg))+' কিমি/ঘ। '+(avg<15?'জ্যামের সঙ্গে আপনার বন্ধুত্ব গভীর।':avg>45?'এই গতিতে ঢাকায় বাঁচার কথা নয়।':'শহরের গতিতেই চলেছেন।');
if(top>0)o.top='🏁 সর্বোচ্চ গতি '+bn(top)+' কিমি/ঘ — '+(top>=120?'ট্রাফিক পুলিশ ছবি তুলে রাখলে ফ্রেমে বাঁধাতে হতো।':top>=100?'একশ পেরিয়েছেন, আশা করি বিমা আছে।':'গতি সীমার ভেতরেই — অবিশ্বাস্য সংযম।');
if(c>0&&km>.05){const per=Math.round(km*1000/c);o.crash='💥 '+bn(c)+'টা ধাক্কা — প্রতি '+bn(per)+' মিটারে একটা। '+(per<150?'আপনি রাস্তায় না, ধাক্কার মাঠে নেমেছেন।':per<500?'ধাক্কা খাওয়া আপনার অভ্যাস।':'মাঝেমধ্যে ধাক্কা — পুরোপুরি ঢাকাবাসী।')}
if(km>.2&&L>0)o.loss='💸 প্রতি কিমিতে ক্ষতি '+money(L/km)+' — '+(L/km>300000?'এই হারে চললে ফ্লাইওভারের বাজেট আপনার একার।':'এখনো ফ্লাইওভারের বাজেটে পৌঁছাননি।');
if(J.fails>=2)o.fail='❌ '+bn(J.fails)+' বার রাইড/অর্ডার বাতিল — গ্রাহক সেবায় আপনার রেটিং ১.২।';
if(J.rides+J.dels>=5)o.jobs='🏅 '+bn(J.rides+J.dels)+'টি সফল কাজ — আপনি ঢাকার বিরল প্রজাতি: দায়িত্ববান চালক।';
if(X.maxRain>.5)o.rain='🌧️ বৃষ্টিতে চালিয়েছেন — ওয়াইপার ঠিক ছিল তো?';else if(X.maxFog>.5)o.rain='🌫️ কুয়াশায় চালিয়েছেন — সামনে কী ছিল, আপনিও জানেন না।';
const out=[];for(const k of ['crash','top','loss','jobs','fail','rain','dist'])if(o[k]&&out.length<3)out.push(o[k]);return out}
function altLine(){try{const L=G.loss||0,pk=a=>a[Math.floor(Math.random()*a.length)];return '💭 এই টাকায় যা হতে পারত: '+pk(ALT.ch)(L)}catch(e){return''}}
window.roastHTML=function(){return''};window.altHTML=function(){return''};
function score(){const e=document.getElementById('sc'),t=e&&e.querySelector('table');if(!t)return;
try{t.querySelectorAll('tr').forEach(r=>{const c=r.children[1],l=r.children[0];if(!c||!l)return;const v=c.textContent.trim();if(/⏱|📏/.test(l.textContent))return;if(/^০(\s|$)/.test(v)||v==='৳০')r.remove()})}catch(_){}
const a=t.nextElementSibling&&t.nextElementSibling.className==='box'?t.nextElementSibling:t;
let h='<div class="box"><span class="rk">🎖️ খেতাব: '+title()+'</span><br>'+statLines().map(x=>'• '+x).join('<br>')+'<div style="font-size:12px;opacity:.75;margin-top:4px">'+altLine()+'</div></div>';
const u=buildViral();if(u)h+='<div class="box"><b>📰 ভাইরাল!</b><br><img src="'+u+'" style="width:100%;border-radius:6px;margin-top:6px"><br><a href="'+u+'" download="bame-plastic-viral.jpg" style="font-weight:700;margin-right:12px">💾 ছবি সেভ</a><a href="#" onclick="BPX.share();return false" style="font-weight:700">📤 শেয়ার</a></div>';
a.insertAdjacentHTML('afterend',h)}

/* ================= গান, ধাক্কা-আটকা, গাছ, শুরুর গাড়ি ================= */
let mPause=0;
function musicTick(){if(typeof MUS==='undefined'||!MUS.a)return;
if(mPause){if(!MUS.on){mPause=0;return}if(bustT<=0){try{MUS.a.play()}catch(e){}mPause=0;toast('🎵 গান আবার চলছে',1.6)}return}
if(MUS.on&&bustT>3){try{MUS.a.pause()}catch(e){}mPause=1;toast('🔇 জনতার হট্টগোলে গান থেমে গেল',2)}}
function musicOff(){mPause=0;if(typeof MUS!=='undefined'){MUS.on=0;if(MUS.a){try{MUS.a.pause();MUS.a.currentTime=0}catch(e){}}}}
/* হিট করা গাড়ি ১.১ সেকেন্ড "ভূত" হয়ে যায়, তাই আর আটকে থাকে না */
function ghostTick(dt){for(const v of VEH){if(v._gh>0){v._gh-=dt;if(v._gh<.7&&Math.hypot(v.px-S.x,v.pz-S.z)<6)v._gh=.7}if(v.cr)v._hc=1;else if(v._hc){v._hc=0;v._gh=1.5}}}
if(typeof npcContact==='function'){const _nc=window.npcContact;window.npcContact=function(v){if(v._gh>0)return;const x=S.x,z=S.z,r=_nc.apply(this,arguments);if(!X.noGhost&&(S.x!==x||S.z!==z)){v._gh=1.1;v.hold=0}return r}}
/* কাপ্তাইয়ের গাছ ও পাম: ধাক্কা দিলে ভাঙে (ঢাকার গাছের মতো) */
function kTrees(){if(!KM||X.treesDone||typeof OBS==='undefined')return;X.treesDone=1;const ms=sc.children.filter(o=>o.isInstancedMesh),m4=new THREE.Matrix4(),zero=new THREE.Matrix4().makeScale(0,0,0);let n=0;
for(let i=0;i<ms.length-1;i++){const a=ms[i],b=ms[i+1];if(a.geometry.type!=='CylinderGeometry'||b.count!==a.count||!(b.geometry.type==='IcosahedronGeometry'||b.geometry.type==='SphereGeometry'))continue;
const rad=b.geometry.type==='SphereGeometry'?.45:.6;
for(let j=0;j<a.count;j++){a.getMatrixAt(j,m4);const x=m4.elements[12],z=m4.elements[14];const o=[x,z,rad,0,0,'tree'];const hide=()=>{a.setMatrixAt(j,zero);b.setMatrixAt(j,zero);a.instanceMatrix.needsUpdate=true;b.instanceMatrix.needsUpdate=true};o.m={geometry:{attributes:{position:{array:{fill:hide},needsUpdate:false}}}};OBS.push(o);n++}i++}
X.treeN=n}
/* কাপ্তাইয়ের শুরুতে বাসের বদলে গাড়ি */
function kStartCar(){if(!KM||typeof PV==='undefined'||typeof setPlayer!=='function')return;const k=(PKIND&&PKIND!=='bus')?PKIND:'car';let isBus=false;try{isBus=PV.kind==='bus'||Object.values(V6.BUSES).indexOf(bus)>=0}catch(e){}if(isBus||PV.kind!==k){try{setPlayer(k,Math.floor(Math.random()*PCFG[k].models.length))}catch(e){}}}
kStartCar();kTrees();


/* ================= মানচিত্র বদল: আগে মসৃণ ফেড, তারপর রিলোড ================= */
document.addEventListener('click',function(e){const b=e.target&&e.target.closest&&e.target.closest('#mp button');if(!b)return;const cur=window.BPMAP==='k'?'k':'d',m=b.dataset.m;if(m===cur)return;e.stopPropagation();e.preventDefault();
let ov=document.getElementById('swp');if(!ov){ov=document.createElement('div');ov.id='swp';ov.style.cssText="position:fixed;inset:0;z-index:99;background:#0d1b2a;color:#ffd60a;display:flex;align-items:center;justify-content:center;font:800 24px 'Hind Siliguri',sans-serif;opacity:0;transition:opacity .22s";document.body.appendChild(ov)}
ov.textContent=(m==='k'?'কাপ্তাই':'ঢাকা')+' লোড হচ্ছে…';void ov.offsetWidth;ov.style.opacity='1';try{sessionStorage.setItem('bp_sw',m)}catch(_){}
setTimeout(function(){try{BPS.set('bp_map',m)}catch(_){}location.reload()},240)},true);

/* ================= হুক ================= */
function tick(dt){if(!G.started)return;ghostTick(dt);musicTick();if(G.over)return;X.t+=dt;evTick(dt);wxTick(dt);newsTick(dt)}
function mini(){const e=X.ev;if(!e)return;const c=MC,Xp=(e.cx-S.x)*K,Yp=(e.cz-S.z)*K,ca=Math.cos(-S.h),sa=Math.sin(-S.h);let px=Xp*ca-Yp*sa,py=Xp*sa+Yp*ca;const r=Math.hypot(px,py),lim=132;if(r>lim){px*=lim/r;py*=lim/r}
c.save();c.translate(150,150);c.fillStyle='#ff8a00';c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.moveTo(px,py-10);c.lineTo(px+9,py+7);c.lineTo(px-9,py+7);c.closePath();c.fill();c.stroke();c.restore()}
function cleanup(){musicOff();clearEv();try{speechSynthesis.cancel()}catch(e){}X.q.length=0;X.cur=null;rdo.style.display='none';if(wa){try{wa.gn.gain.value=0}catch(e){}}if(fogBase&&sc.fog){sc.fog.near=fogBase.n;sc.fog.far=fogBase.f}wxd.style.opacity='0';wxf.style.opacity='0';if(rcx)rcx.clearRect(0,0,rw,rh)}
function after(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(null,arguments)}catch(e){console.error('BPX',name,e)}return r}}
function before(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){try{fn.apply(null,arguments)}catch(e){console.error('BPX',name,e)}return o.apply(this,arguments)}}
after('gameTick',tick);after('hud',capture);after('drawMini',mini);after('crime',onCrime);after('showScore',score);before('endTrip',cleanup);
window.BPX_T={tick,spawnEv,clearEv,wxTick,news,statLines,title,buildViral,capture,onCrime};
})();
