/* jobs.js — যাত্রী (রাইড), ডেলিভারি ও হালাল ইনকাম.
   game1.js-এর পরে চলে। game1.js ও kaptai.js এখানে বদলানো হয়নি — শুধু ছোট হুক বসানো হয়েছে। */
(function(){
if(window.__BPJ||typeof G==='undefined'||typeof S==='undefined'||typeof V6==='undefined'||typeof sc==='undefined')return;
window.__BPJ=1;
const KM=!!window.KMODE;
const bnn=n=>bn(Math.round(n).toLocaleString('en-IN')),money=n=>'৳'+bnn(n);
const rnd=(a,b)=>a+Math.random()*(b-a),pick=a=>a[Math.floor(Math.random()*a.length)];
const dist=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);
const slow=()=>Math.abs(S.vf)<1.8;

/* ---------- রাইড-শেয়ার অ্যাপ: রেটিং, সার্জ, ব্যান, সময়সীমা ---------- */
const mmss=t=>{t=Math.max(0,Math.round(t));return bn(String(Math.floor(t/60)).padStart(2,'0')+':'+String(t%60).padStart(2,'0'))};
const RT={a:[5,5,5,4.5,5],ban:0},avgR=()=>RT.a.reduce((x,y)=>x+y,0)/RT.a.length;
const RV={5:['দারুণ ড্রাইভার! একদম নিরাপদ, সময়মতো পৌঁছে দিল।','ঢাকায় এমন ড্রাইভার আছে জানতাম না। ৫ স্টার!','এসি-র মতো ঠান্ডা মাথা। আবার ডাকব।'],4:['ভালোই চালাইছে, একটু ঝাঁকি ছিল।','মোটামুটি ভালো। ব্রেকটা একটু আগে দিলে ভালো হতো।','পৌঁছাইছে ঠিকঠাক, তবে গান বাজাইলে আরও ভালো লাগত।'],3:['চলে। সিটবেল্ট না থাকলে হয়তো ঘুমাইয়া যাইতাম।','মাঝারি। গাড়ি না, রোলার কোস্টার।','পৌঁছাইছি এটাই বড় কথা।'],2:['ভাই, আমি এখনো কাঁপতেছি। ২ স্টার।','ব্রেক কি এই গাড়িতে আছে? দুই স্টার দিলাম, দয়া করে।','পথে দুইবার আল্লাহর নাম নিছি।'],1:['১ স্টার! এটা ড্রাইভিং না, ঢাকার পথে ক্ষেপণাস্ত্র নিক্ষেপ!','আর কখনো না! রিপোর্ট করলাম।','আমি তো যাত্রী, ক্রাশ টেস্ট ডামি না!']};
function rate(n,txt){RT.a.push(n);if(RT.a.length>20)RT.a.shift();const av=avg();toast('⭐'.repeat(n)+' '+bn(n)+'/৫ — "'+txt+'" · আপনার রেটিং '+bn(av.toFixed(2)),4);
if(av<3.5&&RT.a.length>=8&&RT.ban<=0){RT.ban=240;clearOffer();say('🚫 অ্যাকাউন্ট সাসপেন্ড! রেটিং ৩.৫-এর নিচে নামায় রাইড ও ডেলিভারি ৪ মিনিট বন্ধ। নতুন অর্ডার আসবে না।',5)}}
function avg(){return avgR()}
function unban(){RT.ban=0;RT.a=[4,4,4,4,4,4,4,4];J.cd=6;say('✅ আপিল মঞ্জুর! অ্যাকাউন্ট ফিরেছে — রেটিং ৪.০ থেকে নতুন করে শুরু।',4)}
function review(j){let st=5,why='';const r=j.t/j.dl,pax=j.type==='pax';if(j.cr>0){st-=Math.min(2,j.cr);why='cr'}
if(pax){if(j.tp>110){st-=2;why='fast'}else if(j.tp>85){st-=1;why=why||'fast'}}
if(r>.92)st-=1;if(!pax){if(j.heat<=0)st-=2;else if(j.heat<40)st-=1}
st=Math.max(1,Math.min(5,st));let txt=pick(RV[st]);if(pax&&st<=2&&why==='fast')txt='ড্রাইভার গাড়ি নয়, ক্ষেপণাস্ত্র চালায়!';rate(st,txt)}
const SG={m:1,t:0,next:rnd(50,80)};
const SGE=[['🌧️ বৃষ্টি নেমেছে',1.5,2.2],['🏢 অফিস ছুটির ভিড়',1.4,1.9],['🏏 ম্যাচ শেষ',1.6,2.4],['🌙 রাত বাড়ছে, গাড়ি কম',1.3,1.7],['🎉 উৎসবের আগের রাত',1.5,2.1]];
function svTick(dt){if(SG.m>1){SG.t-=dt;if(SG.t<=0){SG.m=1;J.mult=1;say('⚡ সার্জ শেষ — ভাড়া স্বাভাবিক',2.4)}}else{SG.next-=dt;if(SG.next<=0){const e=pick(SGE);SG.m=Math.round(rnd(e[1],e[2])*10)/10;SG.t=rnd(80,140);SG.next=rnd(120,200);J.mult=SG.m;say('⚡ সার্জ প্রাইসিং: '+e[0]+' — এখন আয় '+bn(SG.m)+'x',3.6)}}}
const hudExtra=()=>' · ⭐ '+bn(avgR().toFixed(1))+(SG.m>1?' · ⚡ '+bn(SG.m)+'x':'')+(RT.ban>0?' · 🚫 '+mmss(RT.ban):'');
/* ---------- হালাল স্কোরবোর্ড (রাইডার / ডেলিভারি ম্যান) ---------- */
let HLM=[];const hlLoad=()=>{try{return JSON.parse(localStorage.getItem('bp_hal')||'[]')}catch(e){return HLM.slice()}};
function hlSave(a){HLM=a.slice(-300);try{localStorage.setItem('bp_hal',JSON.stringify(HLM))}catch(e){}}
function submitHal(){if(J.sent)return;J.sent=1;const n=G.name||'চালক',t=Date.now(),a=hlLoad();if(J.haR>0)a.push({k:'ride',n,v:J.haR,c:J.rides,t});if(J.haD>0)a.push({k:'delivery',n,v:J.haD,c:J.dels,t});hlSave(a);
if(window.BPNET&&BPNET.enabled){if(J.haR>0)BPNET.submitHalal('ride',n,J.haR,J.rides);if(J.haD>0)BPNET.submitHalal('delivery',n,J.haD,J.dels)}}
let HK='ride',HP='d';const HAL={};
function halBox(){const K=HK,P=HP,key=K+P;let rows=null,note='এই ফোনে সংরক্ষিত স্কোর';const o=HAL[key],net=window.BPNET&&BPNET.enabled;
if(net){if(o&&o.rows){rows=o.rows.map(x=>({n:x.name,v:x.score,me:x.mine}));note='অনলাইন · সময়কালের মোট হালাল ইনকাম'}else if(!o||(o.done&&!o.rows&&Date.now()-o.t>15000)){HAL[key]={rows:null,t:Date.now()};BPNET.halalTop(K,P).then(r=>{HAL[key]={rows:r,t:Date.now(),done:1};const e=document.getElementById('sc');if(e&&e.style.display==='block')showScore()}).catch(()=>{HAL[key]={rows:null,t:Date.now(),done:1}})}else if(o&&!o.done)note='লোড হচ্ছে…'}
if(!rows){const m={};for(const x of hlLoad())if(x.k===K&&inRange(x.t,P))m[x.n]=(m[x.n]||0)+x.v;rows=Object.keys(m).map(n=>({n,v:m[n],me:n===G.name})).sort((a,b)=>b.v-a.v).slice(0,20)}
const tb=(arr,cur,at)=>'<div class="tabs ht">'+arr.map(x=>'<button data-'+at+'="'+x[0]+'" class="'+(cur===x[0]?'on':'')+'">'+x[1]+'</button>').join('')+'</div>';
const ttl={ride:{d:'আজকের সেরা রাইডার',w:'সপ্তাহের সেরা রাইডার',m:'মাসের সেরা রাইডার'},delivery:{d:'আজকের সেরা ডেলিভারি ম্যান',w:'সপ্তাহের সেরা ডেলিভারি ম্যান',m:'মাসের সেরা ডেলিভারি ম্যান'}}[K][P];
return '<div class="box"><b>✅ হালাল ইনকাম স্কোরবোর্ড</b>'+tb([['ride','🚕 রাইডার'],['delivery','📦 ডেলিভারি']],K,'hk')+tb([['d','আজ'],['w','সপ্তাহ'],['m','মাস']],P,'hp')+'<div class="pl">'+ttl+'</div><table>'+(rows.length?rows.map((x,i)=>'<tr'+(x.me?' class="me"':'')+'><td>'+bn(i+1)+'. '+esc(x.n)+'</td><td>'+fm(x.v)+'</td></tr>').join(''):'<tr><td>'+(note==='লোড হচ্ছে…'?note:'এখনো কেউ নেই')+'</td><td></td></tr>')+'</table><div class="sub">'+note+'</div></div>'}

/* ---------- state ---------- */
const J={halal:0,haR:0,haD:0,rides:0,dels:0,fails:0,tips:0,cold:0,job:null,offer:null,cd:KM?3:18,first:1,t:0};
window.BPJ=J;

/* ---------- words ---------- */
const CUST_D=['রাকিব ভাই','সুমি আপু','তানভীর ভাই','নুসরাত আপু','মিঠু ভাই','রিয়া আপু','ফাহিম ভাই','তিথি আপু','জাহিদ ভাই','লিজা আপু'];
const CUST_K=['রহিম চাচা','করিম ভাই','মিনা আপু','পরেশ দা','হাসিনা খালা','জামাল ভাই','রুবেল ভাই','তাপসী দি'];
const GREET_D=['মামা, {d} যাবেন? জ্যামের আগেই পৌঁছাইয়া দেন!','ভাই, {d}-এ যাইতে হবে। দরদাম পরে, আগে চলেন!','এই যে ভাই! {d} যাবেন? তাড়া আছে।','ভাই, {d} যামু। ভাড়া নিয়া ঝামেলা করবেন না, আগেই কইয়া দিলাম।'];
const GREET_K=['ভাই, {d} যাইবান নি? ভাড়া ঠিকঠাক দিমু।','ও ভাই, {d}-এ যাইতাম, নিয়া যাইবান?','ভাই, {d} যাইতে হইব। লেকের ধারে ধীরে চালাইয়েন।'];
const WARN=['দেখি, ধাক্কাধাক্কি করলে কিন্তু নাইমা যামু!','সাবধানে চালান ভাই, গায়ে আঁচড় লাগলে রাইড শেষ।','ঝাঁকি দিলে কিন্তু ভাড়া কাটমু।'];
const FAST=['ভাই, আস্তে! আমার বউ-বাচ্চা আছে!','এইটা কি প্লেন নাকি? আস্তে চালান!','আল্লাহ আল্লাহ! ব্রেক কই?'];
const SLOWL=['ভাই, ঘুমাইতেছেন? একটু জোরে চালান!','হাঁটলেও তো আগে পৌঁছাইতাম!'];
const IDLE=['এই রাস্তায় এত গর্ত কেন ভাই?','ভাই, গান-টান দেন না?','জানেন, এই রাস্তা আমার ছোটবেলায়ও এমনই ছিল।'];
const SCOLD_P=['ও ভাই! গাড়ি চালান না গরু খেদান? নামাইয়া দেন, ভাড়া দিমু না!','এই লাইসেন্স কি দোকান থেকে কেনা? আমি নামলাম!','আর জীবনেও আপনার গাড়িতে উঠমু না! রাইড বাতিল!','ধাক্কা দিয়া দিয়া ড্রাইভিং শিখতেছেন? আমি হাঁইটাই যামু!'];
const SCOLD_D=['📞 ভাই, প্যাকেট তো ছেঁচা! অর্ডার ক্যান্সেল, ১ স্টার দিলাম!','📞 রাস্তায় কি ফুটবল খেলতে বাইর হইছিলেন? অর্ডার বাতিল!','📞 আপনার ডেলিভারি রদ হইছে। আর কল দিমু না!'];
const SCOLD_M=['📞 ওষুধ নিয়া এই কাণ্ড! আমি অন্য কাউরে ডাকলাম।','📞 ভাই, রোগী অপেক্ষা করে, আর আপনি গাড়ি ভাঙেন?'];
const DHABA_ITEMS=['মাছ-ভাতের প্যাকেট','ভুনা খিচুড়ি','গ্রিলড লেকের মাছ','ভর্তা-ভাত'];
const MED_ITEMS=['নাপা ও স্যালাইন','শিশুর সিরাপ','প্রেসক্রিপশনের ওষুধ','ইনসুলিন ও সিরিঞ্জ'];
/* ঢাকার পরিচিত ফুড চেইন। শুধু নাম ও রং — আসল লোগো নেই। */
const CH=[
{n:'কেএফসি',c:'#e4002b',t:'#fff',it:'ফ্রায়েড চিকেন বাকেট'},
{n:'পিৎজা হাট',c:'#ee3124',t:'#fff',it:'পিৎজা'},
{n:'ডমিনোজ পিৎজা',c:'#006491',t:'#fff',it:'পিৎজা'},
{n:'বার্গার কিং',c:'#ff8732',t:'#502314',it:'বার্গার'},
{n:'কাচ্চি ভাই',c:'#1b5e20',t:'#ffd54f',it:'কাচ্চি বিরিয়ানি'},
{n:'স্টার কাবাব',c:'#b71c1c',t:'#fff',it:'কাবাব ও পরোটা'},
{n:'সুলতানস ডাইন',c:'#3e2723',t:'#ffca28',it:'কাচ্চি ও রোস্ট'},
{n:'নান্না বিরিয়ানি',c:'#e65100',t:'#fff',it:'মোরগ পোলাও'},
{n:'ফখরুদ্দীন বিরিয়ানি',c:'#0d47a1',t:'#fff',it:'বিরিয়ানি'},
{n:'চিলক্স',c:'#d81b60',t:'#fff',it:'বার্গার ও ফ্রাই'}];
/* কাপ্তাইয়ের ওষুধের দোকান — বাজারের কাছে বসে */
const MEDA=[
{pl:'নতুন বাজার',fx:-862,fz:-358,n:['জনতা ফার্মেসী','শ্যামা ফার্মেসী','হক ফার্মেসী','নতুন বাজার ফার্মেসী']},
{pl:'বোট ঘাট',fx:41,fz:44,n:['লেক সাইড ফার্মেসী','কর্ণফুলী ফার্মেসী']},
{pl:'বামতীর বাজার',fx:1320,fz:1420,n:['প্রজেক্ট ফার্মেসী','মা ও শিশু ফার্মেসী','মা-মণি ফার্মেসী','আল-শিফা ফার্মেসী']}];
const MULT={rick:.7,auto:.85,cng:1,car:1.4,bike:.9,cycle:.6,mtb:.6},PAXOK=['rick','auto','cng','car','bike'];

/* ---------- road points (built once) ---------- */
let PTS=null;
function pts(){if(PTS)return PTS;PTS=[];RD.forEach((r,ri)=>{if(r[0]<6)return;const c=CUM[ri];if(!c)return;const len=c[c.length-1];for(let s=20;s<len-20;s+=70){const a=at(ri,s);if(KM&&kElev(a[0],a[1])>.25)continue;PTS.push([a[0],a[1],a[2],a[3],ri,r[0]])}});return PTS}
function ring(cx,cz,mn,mx,fx,fz){const P=pts(),out=[];for(const p of P){const d=dist(p[0],p[1],cx,cz);if(d<mn||d>mx)continue;let w=1;if(fx!==undefined){const dot=((p[0]-cx)*fx+(p[1]-cz)*fz)/(d||1);w=.4+Math.max(0,dot+.4)}out.push([p,w])}return out}
function weighted(list){let t=0;for(const e of list)t+=e[1];if(!list.length)return null;let r=Math.random()*t;for(const e of list){r-=e[1];if(r<=0)return e[0]}return list[list.length-1][0]}
function nearestPt(x,z,maxD){let b=null,bd=maxD;for(const p of pts()){const d=dist(p[0],p[1],x,z);if(d<bd){bd=d;b=p}}return b}
function roadN(ri){if(!RNM.length)buildRN();return RNM[ri]||(RD[ri]&&RD[ri][2])||'ঢাকার সড়ক'}
function placeName(x,z,ri){if(KM&&window.KAP&&KAP.pl){let b=null,bd=160;for(const q of KAP.pl){const d=dist(q[0],q[1],x,z);if(d<bd){bd=d;b=q[2]}}if(b)return b}
if(!KM&&D.s){for(const q of D.s){if(q&&typeof q[2]==='string'&&dist(q[0],q[1],x,z)<130)return q[2]+' মেট্রো স্টেশন'}}return roadN(ri)}
function side(p){const sd=Math.random()<.5?1:-1,nx=-p[3],nz=p[2],off=p[5]/2+1.8;return{x:p[0]+nx*off*sd,z:p[1]+nz*off*sd,ry:Math.atan2(-nx*sd,-nz*sd)}}

/* ---------- 3D bits ---------- */
function icon(glyph,col,tc){const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d');x.fillStyle='#fff';x.beginPath();x.arc(64,64,60,0,7);x.fill();x.fillStyle=col;x.beginPath();x.arc(64,64,52,0,7);x.fill();x.fillStyle=tc||'#fff';x.font='800 '+(glyph.length>4?27:glyph.length>1?36:64)+'px "Hind Siliguri","Noto Sans Bengali",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(glyph,64,68);
const m=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthTest:false,depthWrite:false,sizeAttenuation:false,fog:false}),s=new THREE.Sprite(m);s.scale.set(.07,.07,1);s.renderOrder=999;s.userData.own=1;return s}
function beam(col){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,70,16,1,true),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.28,depthWrite:false,side:THREE.DoubleSide,fog:false}));b.position.y=35;g.add(b);
const r=new THREE.Mesh(new THREE.RingGeometry(3,4.2,32),new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.6,depthWrite:false,side:THREE.DoubleSide,fog:false}));r.rotation.x=-Math.PI/2;r.position.y=.2;g.add(r);g.userData.own=1;return g}
function person(x,z,ry){const g=V6.mkHuman(V6.humanSpec(Math.random()<.45,{h:.95+Math.random()*.12}),true);g.position.set(x,0,z);g.rotation.y=ry||0;g.visible=true;sc.add(g);return g}
function kill(o){if(!o)return;try{sc.remove(o)}catch(e){}const own=o.userData&&o.userData.own;o.traverse&&o.traverse(m=>{try{if(m.geometry)m.geometry.dispose();if(own&&m.material){m.material.map&&m.material.map.dispose();m.material.dispose()}}catch(e){}})}

/* ---------- small UI ---------- */
const st=document.createElement('style');
st.textContent='#hl{left:8px;top:calc(var(--st) + 134px);font-size:15px;color:#7dffa0;border:1px solid #7dffa066}#jb{left:8px;top:calc(var(--st) + 166px);max-width:62vw;font-size:13px;line-height:1.3;white-space:normal}#jcard{position:fixed;left:8px;top:calc(var(--st) + 214px);width:min(68vw,300px);background:#fff;color:#111;border-radius:10px;overflow:hidden;box-shadow:0 4px 16px #0008;z-index:13;display:none;pointer-events:none}.pre #hl,.pre #jb,.pre #jcard{display:none!important}';
document.head.appendChild(st);
function mkEl(id,cls){let e=document.getElementById(id);if(e)return e;e=document.createElement('div');e.id=id;if(cls)e.className=cls;e.style.display='none';document.body.appendChild(e);return e}
const hlE=mkEl('hl','p'),jbE=mkEl('jb','p'),cardE=mkEl('jcard');
let cardT=0;
function card(name,col,tc,lines){cardE.innerHTML='<div style="background:'+col+';color:'+tc+';padding:6px 10px;font-weight:800;font-size:15px">'+name+'</div><div style="padding:6px 10px;font-size:13px;line-height:1.35">'+lines+'</div>';cardE.style.display='block';clearTimeout(cardT);cardT=setTimeout(()=>{cardE.style.display='none'},4500)}
const say=(m,d)=>toast(m,d);
const say2=(m,d)=>{if(tq.length<3)toast(m,d)};


/* ---------- ওঠা-নামা, পার্সেল হাতে হাতে, রুট ---------- */
const anims=[];                                   // চলমান ছোট অ্যানিমেশন (কাজ শেষের পরও চলে)
const V3=()=>new THREE.Vector3();
const STAND={th:0,kn:0,arL:0,arR:0,tilt:0},HOLD={th:0,kn:0,arL:-1.35,arR:-1.35,tilt:0};
const SEAT={bike:{x:0,y:.78,z:.5,th:-1.15,kn:1.3,arL:-.95,arR:-.95,tilt:.1}};
const lerp=(a,b,k)=>a+(b-a)*k,ease=k=>k<0?0:k>1?1:k*k*(3-2*k);
function pose(g,p){const u=g&&g.userData;if(!u||!u.lL)return;u.lL.rotation.x=u.lR.rotation.x=p.th;u.kL.rotation.x=u.kR.rotation.x=p.kn;u.aL.rotation.x=p.arL;u.aR.rotation.x=p.arR;u.bp.rotation.x=p.tilt}
function mixPose(a,b,k){return{th:lerp(a.th,b.th,k),kn:lerp(a.kn,b.kn,k),arL:lerp(a.arL,b.arL,k),arR:lerp(a.arR,b.arR,k),tilt:lerp(a.tilt,b.tilt,k)}}
const openVeh=()=>PKIND==='bike';
function sidePt(zz){const sg=J.sg||1,v=new THREE.Vector3(sg*(PV.hw+.6),0,zz===undefined?(openVeh()?.45:0):zz);bus.updateMatrixWorld(true);return bus.localToWorld(v)}
function chooseSide(px,pz){bus.updateMatrixWorld(true);const l=bus.worldToLocal(new THREE.Vector3(px,0,pz));J.sg=l.x<0?-1:1}
function walkTo(g,tx,tz,sp,dt,o){const dx=tx-g.position.x,dz=tz-g.position.z,d=Math.hypot(dx,dz);if(d<.05)return 0;const st=Math.min(d,sp*dt);g.position.x+=dx/d*st;g.position.z+=dz/d*st;g.rotation.y=Math.atan2(dx,dz);o.ph=(o.ph||0)+dt*sp*2.2;try{V6.animH(g,o.ph,1)}catch(e){}return d-st}
function mkParcel(col){const g=new THREE.Group(),b=new THREE.Mesh(new THREE.BoxGeometry(.34,.3,.26),new THREE.MeshLambertMaterial({color:0xc8a26b})),t=new THREE.Mesh(new THREE.BoxGeometry(.35,.07,.27),new THREE.MeshLambertMaterial({color:col?new THREE.Color(col):0xe53935}));t.position.y=.17;g.add(b);g.add(t);g.userData.own=1;sc.add(g);return g}
function carryLocal(){return openVeh()?new THREE.Vector3(0,.98,.66):new THREE.Vector3(0,.9,0)}
function hand(g,k){const v=new THREE.Vector3(0,1.2,.5);g.updateMatrixWorld(true);return g.localToWorld(v)}
function addAnim(f){anims.push(f)}
function animsTick(dt){for(let i=anims.length-1;i>=0;i--){let done=true;try{done=anims[i](dt)}catch(e){console.error('BPJ anim',e)}if(done)anims.splice(i,1)}}

/* যাত্রী ওঠা */
function boardTick(j,dt){const b=j.pg;if(!b||b.st==='seated'||b.st==='in')return;b.t+=dt;const g=b.g;
if(b.t>7||Math.abs(S.vf)>6){if(openVeh()){bus.attach(g);g.position.set(SEAT.bike.x,SEAT.bike.y-.92,SEAT.bike.z);g.rotation.set(0,Math.PI,0);pose(g,SEAT.bike);b.st='seated'}else{kill(g);b.g=null;b.st='in'}return}
if(b.st==='walk'){const t=sidePt();const d=walkTo(g,t.x,t.z,2.7,dt,b);if(d<.4){b.st='climb';b.t=0;b.k=0;bus.attach(g);b.l0=g.position.clone();b.r0=g.rotation.y;try{V6.animH(g,0,0)}catch(e){}}}
else if(b.st==='climb'){b.k=Math.min(1,b.k+dt/.9);const e=ease(b.k);
if(openVeh()){const s=SEAT.bike;g.position.set(lerp(b.l0.x,s.x,e),lerp(b.l0.y,s.y-.92,e)+Math.sin(e*3.14)*.18,lerp(b.l0.z,s.z,e));g.rotation.y=lerp(b.r0,Math.PI+Math.round((b.r0-Math.PI)/6.283)*0,e);pose(g,mixPose(STAND,s,e))}
else{g.position.set(lerp(b.l0.x,0,e),b.l0.y,lerp(b.l0.z,0,e));g.scale.setScalar(Math.max(.01,1-e))}
if(b.k>=1){if(openVeh())b.st='seated';else{kill(g);b.g=null;b.st='in'}}}}
/* যাত্রী নামা */
function exitPax(b){if(!b)return;const g=b.g,open=openVeh(),sg=J.sg||1;
if(open&&g){sc.attach(g);const f=g.position.clone(),r0=g.rotation.y;const t=sidePt();let k=0,ph=0,stage=0,t2=0;const away=V3();bus.updateMatrixWorld(true);away.set(sg*8,0,0);const wd=bus.localToWorld(away);
addAnim(dt=>{if(stage===0){k=Math.min(1,k+dt/.8);const e=ease(k);g.position.set(lerp(f.x,t.x,e),lerp(f.y,0,e)+Math.sin(e*3.14)*.15,lerp(f.z,t.z,e));g.rotation.y=lerp(r0,Math.atan2(wd.x-t.x,wd.z-t.z),e);pose(g,mixPose(SEAT.bike,STAND,e));if(k>=1){stage=1;t2=0}return false}
t2+=dt;const o={ph};const d=walkTo(g,wd.x,wd.z,2.1,dt,o);ph=o.ph;if(t2>4||d<.3){kill(g);return true}return false});return}
if(g&&b.st!=='in'){kill(g)}
const t=sidePt();bus.updateMatrixWorld(true);const wd=bus.localToWorld(new THREE.Vector3(sg*9,0,.2));const h=person(t.x,t.z,Math.atan2(wd.x-t.x,wd.z-t.z));h.scale.setScalar(.01);let k=0,t2=0,o={ph:0};
addAnim(dt=>{if(k<1){k=Math.min(1,k+dt/.45);h.scale.setScalar(Math.max(.01,ease(k)));if(k<1)return false}
t2+=dt;const d=walkTo(h,wd.x,wd.z,2.1,dt,o);if(t2>4||d<.3){kill(h);return true}return false})}
/* পার্সেল হাতে হাতে: ঢোকানো (স্টাফ → আপনি) */
function beginIn(){const o=J.offer;if(!o)return;o.busy=1;chooseSide(o.fig.position.x,o.fig.position.z);
const pk=mkParcel(o.col);J.ho={mode:'in',o,staff:o.fig,pk,st:'walk',t:0,k:0,ph:0,home:{x:o.fig.position.x,z:o.fig.position.z}};o.fig=null;kill(o.ico);o.ico=null;kill(o.beam);o.beam=null;pose(J.ho.staff,HOLD)}
function startOut(){const j=J.job;if(!j||j.out)return;j.out={st:'walk',t:0,k:0,ph:0,home:{x:j.figD.position.x,z:j.figD.position.z}};chooseSide(j.figD.position.x,j.figD.position.z);j.pk&&j.pk.visible!==undefined&&(j.pk.visible=true);pose(j.figD,HOLD)}
function hoTick(dt){const h=J.ho;if(!h)return;h.t+=dt;const g=h.staff,pk=h.pk;
if(h.st==='walk'){pk.position.copy(hand(g));pk.rotation.y=g.rotation.y;const t=sidePt(0);const d=walkTo(g,t.x,t.z,2.6,dt,h);
if(d<.55||h.t>7||Math.abs(S.vf)>5){h.st='give';h.t=0;h.k=0;bus.attach(pk);h.p0=pk.position.clone();try{V6.animH(g,0,0)}catch(e){}}}
else if(h.st==='give'){h.k=Math.min(1,h.k+dt/.7);const e=ease(h.k),c=carryLocal();pk.position.set(lerp(h.p0.x,c.x,e),lerp(h.p0.y,c.y,e)+Math.sin(e*3.14)*.25,lerp(h.p0.z,c.z,e));
if(!openVeh()&&h.k>.75)pk.visible=false;
if(h.k>=1){J.pk=pk;h.pk=null;pose(g,STAND);const o=h.o;J.offer=o;h.st='back';h.t=0;const home=h.home,staff=g;J.ho=null;startJob();addAnim(dt2=>{const oo={ph:staff.userData.__ph||0};const d=walkTo(staff,home.x,home.z,1.6,dt2,oo);staff.userData.__ph=oo.ph;h.t+=dt2;if(d<.2||h.t>6){kill(staff);return true}return false})}}}
function outTick(dt){const j=J.job;if(!j||!j.out)return;const o=j.out,g=j.figD;o.t+=dt;
if(o.st==='walk'){const t=sidePt(0);const d=walkTo(g,t.x,t.z,2.5,dt,o);if(d<.55||o.t>7||Math.abs(S.vf)>5){o.st='take';o.t=0;o.k=0;const pk=J.pk;if(pk){pk.visible=true;sc.attach(pk);o.p0=pk.position.clone()}try{V6.animH(g,0,0)}catch(e){}}}
else if(o.st==='take'){o.k=Math.min(1,o.k+dt/.7);const e=ease(o.k),pk=J.pk;if(pk){const hp=hand(g);pk.position.set(lerp(o.p0.x,hp.x,e),lerp(o.p0.y,hp.y,e)+Math.sin(e*3.14)*.2,lerp(o.p0.z,hp.z,e))}
if(o.k>=1){const pk=J.pk;J.pk=null;j.keepFig=0;j.figD=null;const home=o.home,cust=g;pose(cust,HOLD);complete();
let t3=0,oo={ph:0};addAnim(dt2=>{t3+=dt2;const d=walkTo(cust,home.x,home.z,1.5,dt2,oo);if(pk){const hp=hand(cust);pk.position.copy(hp);pk.rotation.y=cust.rotation.y}if(t3>5||(d<.2&&t3>2)){kill(cust);kill(pk);return true}return false})}}}
/* রুট খোঁজা (রাস্তার জাল ধরে) */
let NG=null;const NC=new Map();
function buildNG(){NG=new Map();RD.forEach((r,ri)=>{if(r[0]<6)return;const q=r[1];for(let vi=0;vi*2+1<q.length;vi++){const k=Math.floor(q[vi*2]/8)+','+Math.floor(q[vi*2+1]/8);let l=NG.get(k);if(!l){l=[];NG.set(k,l)}l.push(ri*65536+vi)}})}
function extraNb(n){let r=NC.get(n);if(r)return r;if(!NG)buildNG();const ri=n>>16,vi=n&65535,q=RD[ri][1],cnt=q.length/2,x=q[vi*2],z=q[vi*2+1],end=(vi===0||vi===cnt-1),R=end?70:5,cx=Math.floor(x/8),cz=Math.floor(z/8),rg=Math.ceil(R/8);let best=-1,bd=1e9;r=[];
for(let a=-rg;a<=rg;a++)for(let b=-rg;b<=rg;b++){const l=NG.get((cx+a)+','+(cz+b));if(!l)continue;for(const m of l){if((m>>16)===ri)continue;const mq=RD[m>>16][1],mv=m&65535,d=Math.hypot(mq[mv*2]-x,mq[mv*2+1]-z);if(d<=R){if(end){if(d<bd){bd=d;best=m}}else r.push(m)}}}
if(best>=0)r.push(best);NC.set(n,r);return r}
function nodeXZ(n){const ri=n>>16,vi=n&65535,q=RD[ri][1];return[q[vi*2],q[vi*2+1]]}
function nearNode(x,z){let best=-1,bd=1e9;const cx=Math.floor(x/120),cz=Math.floor(z/120);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=RSG.get((cx+a)+','+(cz+b));if(!l)continue;for(const e of l){const ri=e[0],q=RD[ri][1];for(let w=0;w<2;w++){const vi=e[1]+w;if(vi*2+1>=q.length)continue;const d=(q[vi*2]-x)*(q[vi*2]-x)+(q[vi*2+1]-z)*(q[vi*2+1]-z);if(d<bd){bd=d;best=ri*65536+vi}}}}return best}
function routeTo(tx,tz){try{const s=nearNode(S.x,S.z),e=nearNode(tx,tz);if(s<0||e<0)return null;const ex=nodeXZ(e),open=[[0,s]],g=new Map([[s,0]]),from=new Map();let it=0;
const push=(f,n)=>{open.push([f,n]);let i=open.length-1;while(i>0){const p=(i-1)>>1;if(open[p][0]<=open[i][0])break;[open[p],open[i]]=[open[i],open[p]];i=p}};
const pop=()=>{const t=open[0],l=open.pop();if(open.length){open[0]=l;let i=0;for(;;){let a=i*2+1,b=a+1,m=i;if(a<open.length&&open[a][0]<open[m][0])m=a;if(b<open.length&&open[b][0]<open[m][0])m=b;if(m===i)break;[open[m],open[i]]=[open[i],open[m]];i=m}}return t};
const t0=performance.now();while(open.length&&it++<15000){if((it&127)===0&&performance.now()-t0>110)break;const cur=pop()[1];if(cur===e)break;const ri=cur>>16,vi=cur&65535,q=RD[ri][1],n=q.length/2,gc=g.get(cur),px=q[vi*2],pz=q[vi*2+1],nb=[];
if(vi>0)nb.push(cur-1);if(vi<n-1)nb.push(cur+1);const jj=JN[ri]&&JN[ri][vi];if(jj)for(const k of jj)nb.push(k[0]*65536+k[1]);for(const m of extraNb(cur))nb.push(m);
for(const nn of nb){const rr=nn>>16,vv=nn&65535,qq=RD[rr][1];if(vv*2+1>=qq.length)continue;const c=gc+Math.hypot(qq[vv*2]-px,qq[vv*2+1]-pz);if(!g.has(nn)||c<g.get(nn)){g.set(nn,c);from.set(nn,cur);push(c+Math.hypot(qq[vv*2]-ex[0],qq[vv*2+1]-ex[1]),nn)}}}
if(!from.has(e)&&s!==e)return null;const out=[];let c=e;while(c!==undefined){const p=nodeXZ(c);out.push(p[0],p[1]);if(c===s)break;c=from.get(c)}out.reverse();out.push(tx,tz);return out}catch(err){return null}}
function routeTick(dt){const t=target();if(!t){J.route=null;J.rk=null;return}const key=t.x+','+t.z;J.rt=(J.rt||0)-dt;
let off=false;const r=J.route;if(r&&r.pts){let bd=1e9;const p=r.pts;for(let i=Math.max(0,r.i-2);i<Math.min(p.length/2,r.i+40);i++){const d=Math.hypot(p[i*2]-S.x,p[i*2+1]-S.z);if(d<bd){bd=d;r.i=i}}off=bd>55}
if(J.rk!==key||off&&J.rt<=0||(!r&&J.rt<=0)){J.rk=key;J.rt=3;const pts=routeTo(t.x,t.z);J.route=pts?{pts,i:0}:{pts:[S.x,S.z,t.x,t.z],i:0,straight:1}}}
function routeDraw(c){const r=J.route;if(!r||!r.pts)return;const p=r.pts,n=p.length/2;c.save();c.translate(150,150);c.rotate(-S.h);c.lineJoin='round';c.lineCap='round';c.setLineDash(r.straight?[10,8]:[]);
for(const pass of [0,1]){c.strokeStyle=pass?'#22d3ee':'#06303a';c.lineWidth=pass?4.5:8;c.beginPath();let on=false;for(let i=r.i;i<n;i++){const X=(p[i*2]-S.x)*K,Y=(p[i*2+1]-S.z)*K;if(Math.abs(X)<250&&Math.abs(Y)<250){if(!on){c.moveTo(X,Y);on=true}else c.lineTo(X,Y)}else if(on){c.lineTo(X,Y);on=false}}c.stroke()}c.setLineDash([]);c.restore()}

/* ---------- offers ---------- */
const canDel=()=>PKIND!=='bus'&&PKIND!=='boat',canPax=()=>PAXOK.indexOf(PKIND)>=0;
function chooseType(){const l=[];if(canDel()){if(KM){l.push(['dhaba',4],['med',3])}else l.push(['food',6])}if(canPax())l.push(['pax',KM?3:4]);if(!l.length)return null;
if(KM&&J.first&&canDel()){J.first=0;return'dhaba'}J.first=0;let t=0;for(const e of l)t+=e[1];let r=Math.random()*t;for(const e of l){r-=e[1];if(r<=0)return e[0]}return l[0][0]}
function dhabaSpot(){const d=(window.KAP&&KAP.dh)||{x:3,z:18};return{x:d.x-16,z:d.z-6.5,ry:0,ri:-1,name:'কাপ্তাই ধাবা রেস্টুরেন্ট ও রিসোর্ট'}}
function makeOffer(){const type=chooseType();if(!type){J.cd=10;return}
const fx=Math.sin(S.h),fz=-Math.cos(S.h);let sp=null,o={type,age:0,fig:null,ico:null,beam:null};
if(type==='dhaba'){sp=dhabaSpot();o.brand='কাপ্তাই ধাবা';o.col='#c0261c';o.tc='#fff';o.item=pick(DHABA_ITEMS);o.where=sp.name;o.glyph='খাবার'}
else if(type==='med'){const cand=[];for(const a of MEDA){let ax=a.fx,az=a.fz;if(window.KAP&&KAP.pl)for(const q of KAP.pl)if(q[2]===a.pl){ax=q[0];az=q[1]}const p=nearestPt(ax,az,160);if(!p)continue;const d=dist(p[0],p[1],S.x,S.z);cand.push([[a,p],d>150&&d<2600?3:1])}
const w=weighted(cand);if(!w){J.cd=10;return}const s=side(w[1]);sp={x:s.x,z:s.z,ry:s.ry,ri:w[1][4]};o.brand=pick(w[0].n);o.col='#2e7d32';o.tc='#fff';o.item=pick(MED_ITEMS);o.where=w[0].pl;o.glyph='ওষুধ'}
else{const lo=type==='pax'?(KM?100:130):(KM?150:180),hi=type==='pax'?(KM?380:450):(KM?520:650);let l=ring(S.x,S.z,lo,hi,fx,fz);if(!l.length)l=ring(S.x,S.z,60,1100,fx,fz);const p=weighted(l);if(!p){J.cd=10;return}const s=side(p);sp={x:s.x,z:s.z,ry:s.ry,ri:p[4]};
if(type==='pax'){o.glyph='!';o.col='#ffc400';o.tc='#222';o.brand='যাত্রী'}else{const ch=pick(CH);o.brand=ch.n;o.col=ch.c;o.tc=ch.t;o.item=ch.it;o.glyph='খাবার'}o.where=roadN(p[4])}
o.x=sp.x;o.z=sp.z;o.fig=person(sp.x,sp.z,sp.ry);o.ico=icon(o.glyph,o.col,o.tc);o.ico.position.set(sp.x,3.4,sp.z);sc.add(o.ico);if(type==='dhaba'||type==='med'){o.beam=beam(0x34d399);o.beam.position.set(sp.x,0,sp.z);sc.add(o.beam)}
J.offer=o;
if(type==='pax')say('🙋 কেউ রাইড চাইছে — হলুদ চিহ্নের কাছে যান',3);
else{say('📞 '+o.brand+': ভাই, একটা অর্ডার আছে — এখনই আসেন!',3.2);say2('📍 '+o.where+(type==='food'?' এলাকা':''),2.4)}}
function clearOffer(){const o=J.offer;if(!o)return;kill(o.fig);kill(o.ico);kill(o.beam);J.offer=null}

/* ---------- start a job (pickup reached) ---------- */
function startJob(){const o=J.offer;if(!o)return;const isPax=o.type==='pax',del=!isPax;
const ex=Math.sin(S.h),ez=-Math.cos(S.h);
const lo=KM?450:650,hi=KM?1700:2300;let l=ring(o.x,o.z,lo,hi);if(!l.length)l=ring(o.x,o.z,250,hi*1.6);const p=weighted(l);if(!p){clearOffer();J.cd=8;return}
let dx=p[0],dz=p[1],cust=null,figD=null;
if(del){const s=side(p);dx=s.x;dz=s.z;cust=pick(KM?CUST_K:CUST_D);figD=person(s.x,s.z,s.ry)}
const dName=placeName(p[0],p[1],p[4]),d0=dist(o.x,o.z,dx,dz),mult=MULT[PKIND]||1,top=(PV&&PV.top)||15;
const est=d0/(.55*top)+25;
const pay=Math.round(((isPax?40+d0*.10:70+d0*.09)*mult*(J.mult||1))/5)*5;const DL=Math.max(120,Math.min(480,Math.round((100+d0/6.2+pay*.35)/5)*5));
const job={type:o.type,brand:o.brand,item:o.item,col:o.col,tc:o.tc,dest:{x:dx,z:dz,name:dName},cust,figD,d0,est,pay,dl:DL,cr:0,tp:0,warned:0,t:0,heat:100,imm:2.5,chat:rnd(14,26),slowT:0,
ico:icon(isPax?'গন্তব্য':(o.type==='med'?'ওষুধ':'খাবার'),'#34d399','#073b2a'),bm:beam(0x34d399)};
job.ico.position.set(dx,3.4,dz);sc.add(job.ico);job.bm.position.set(dx,0,dz);sc.add(job.bm);
if(isPax&&o.fig){chooseSide(o.fig.position.x,o.fig.position.z);job.pg={g:o.fig,st:'walk',t:0,k:0,ph:0};o.fig=null}else{kill(o.fig);o.fig=null}kill(o.ico);o.ico=null;kill(o.beam);o.beam=null;J.offer=null;J.job=job;
if(isPax){
say('🙋 যাত্রী: '+pick(KM?GREET_K:GREET_D).replace('{d}',dName),3.4);say('🙂 আপনি: উঠেন ভাই, ঠিকমতো পৌঁছে দিব।',2.2);say2('🙋 যাত্রী: '+pick(WARN),2.8);say2('⏱ সময়সীমা '+mmss(DL)+' — দেরি হলে যাত্রী নেমে যাবে',2.8)}
else{card(o.brand,o.col,o.tc,(o.type==='med'?'💊 ':'🍲 ')+o.item+'<br>গ্রাহক: '+cust+'<br>📍 '+dName+'<br>ডেলিভারি পে: '+money(pay)+'<br>⏱ সময়সীমা: '+mmss(DL));
say((o.type==='med'?'💊 ফার্মেসী: ':'🍽️ '+o.brand+' স্টাফ: ')+'এই নেন ভাই, '+o.item+'। সাবধানে নিয়া যাইয়েন!',3);say2('🙂 আপনি: দুর্ঘটনা ছাড়া পৌঁছে দিব।',2.2)}}

/* ---------- finish / cancel ---------- */
function endJobMarkers(j){kill(j.ico);kill(j.bm);if(j.figD){if(j.keepFig){setTimeout(()=>kill(j.figD),2500)}else kill(j.figD)}}
function complete(){const j=J.job;if(!j)return;const isPax=j.type==='pax';let pay=j.pay,tip=0,msg;
if(isPax){if(j.t<=j.est*1.15)tip=Math.round(pay*.15/5)*5;msg='🙋 যাত্রী: আলহামদুলিল্লাহ, পৌঁছাইলাম! ভাড়া '+money(pay)+(tip?'। বাকিটা রাখেন — '+money(tip)+' বখশিশ।':'।');exitPax(j.pg);j.pg=null}
else{const h=Math.max(0,j.heat);if(h<=0){pay=Math.round(pay*.6);J.cold++;msg='😠 '+j.cust+': এ কী! খাবার তো বরফ হইয়া গেছে! যা পাইছেন নেন — '+money(pay)}
else{tip=Math.round(pay*.35*h/100/5)*5;msg='😊 '+j.cust+': আসছেন! '+(j.type==='med'?'ওষুধ ঠিকঠাক পৌঁছাইছে':'খাবার এখনো গরম ('+bn(Math.round(h))+'%)')+'। ধন্যবাদ! '+money(pay)+(tip?' + বখশিশ '+money(tip):'')}j.keepFig=1}
const tot=pay+tip;J.halal+=tot;J.tips+=tip;G.cash+=tot;if(isPax){J.rides++;J.haR+=tot}else{J.dels++;J.haD+=tot}
say(msg,3.6);say('✅ হালাল ইনকাম +'+money(tot),2.4);review(j);endJobMarkers(j);J.job=null;J.cd=14}
function killVis(j){if(j){if(j.pg){if(j.pg.g&&j.pg.st!=='in')kill(j.pg.g);j.pg=null}kill(j.figD);j.figD=null}kill(J.pk);J.pk=null;if(J.ho){kill(J.ho.staff);kill(J.ho.pk);J.ho=null}}
function cancel(reason){const j=J.job;if(!j)return;J.fails++;const late=reason==='late';if(j.pg){exitPax(j.pg);j.pg=null}
if(late){say(j.type==='pax'?'🙋 যাত্রী: আর অপেক্ষা করতে পারব না, অন্য গাড়ি ডাকলাম!':'📞 '+(j.cust||'গ্রাহক')+': এত দেরি! অর্ডার ক্যান্সেল করলাম।',3.8)}else if(j.type==='pax')say('🙋 যাত্রী: '+pick(SCOLD_P),3.8);else say(pick(j.type==='med'?SCOLD_M:SCOLD_D).replace('{brand}',j.brand),3.8);
say(late?'⏰ সময় শেষ — '+(j.type==='pax'?'রাইড':'অর্ডার')+' বাতিল, কোনো আয় নেই':'❌ '+(j.type==='pax'?'রাইড':'অর্ডার')+' বাতিল — দুর্ঘটনায় কোনো আয় নেই',2.8);rate(1,late?'ড্রাইভার এত দেরি করে, আমার ফ্লাইট মিস!':pick(RV[1]));killVis(j);endJobMarkers(j);J.job=null;J.cd=20}
function dropAll(){clearOffer();const j=J.job;killVis(j);if(j){endJobMarkers(j);J.job=null}anims.length=0;J.route=null}

/* ---------- per-frame ---------- */
function tick(dt){if(!G.started||G.over){return}
J.t+=dt;svTick(dt);animsTick(dt);hoTick(dt);outTick(dt);routeTick(dt);
if(J.job){for(const o of OBJ)if(o.k==='stop'){o.done=true;o.missed=true}if(OBJV)OBJV.t+=dt}
if(RT.ban>0&&!J.job){RT.ban-=dt;if(RT.ban<=0)unban();if(J.offer)clearOffer();return}
const j=J.job;
if(j){j.t+=dt;if(j.imm>0)j.imm-=dt;j.tp=Math.max(j.tp,Math.abs(S.vf)*3.6);if(!j.out){const left=j.dl-j.t;if(left<=30&&!j.warned){j.warned=1;say('⏰ আর ৩০ সেকেন্ড! তাড়াতাড়ি করুন',2.4)}if(left<=0){cancel('late');return}}j.ico.position.y=3.4+Math.sin(J.t*3)*.25;
if(j.pg)boardTick(j,dt);if(j.type!=='pax'&&!j.out)j.heat=Math.max(0,j.heat-dt*100/(j.est*1.5));
const d=dist(S.x,S.z,j.dest.x,j.dest.z);if(d<14&&slow()){if(j.type==='pax'){complete();return}else if(!j.out)startOut()}
if(j.type==='pax'){j.chat-=dt;const kmh=Math.abs(S.vf)*3.6;if(kmh<10&&Math.abs(S.vf)>.3)j.slowT+=dt;else j.slowT=0;
if(j.chat<=0){j.chat=rnd(22,38);say2('🙋 যাত্রী: '+pick(kmh>75?FAST:(j.slowT>10?SLOWL:IDLE)),2.8)}}
return}
const o=J.offer;
if(!o){J.cd-=dt;if(J.cd<=0)makeOffer();return}
if(o.busy)return;o.age+=dt;if(o.ico)o.ico.position.y=3.4+Math.sin(J.t*3)*.25;
const d=dist(S.x,S.z,o.x,o.z);
if(o.age>170||d>1100){clearOffer();J.cd=10;return}
if(d<12&&slow()){if(o.type==='pax')startJob();else beginIn()}}

/* ---------- HUD / minimap / score ---------- */
function target(){const j=J.job;if(j)return{x:j.dest.x,z:j.dest.z,col:'#34d399'};const o=J.offer;if(o)return{x:o.x,z:o.z,col:o.col};return null}
let lastHL='',lastJB='';
function jhud(){const on=G.started&&!G.over;hlE.style.display=on?'block':'none';if(!on){jbE.style.display='none';return}
const h='✅ হালাল ইনকাম '+money(J.halal)+hudExtra();if(h!==lastHL){hlE.textContent=h;lastHL=h}
const t=target();if(!t){jbE.style.display='none';return}
const dx=t.x-S.x,dz=t.z-S.z,m=Math.round(Math.hypot(dx,dz)),j=J.job,o=J.offer;let tx;
if(j){tx=j.type==='pax'?'🚕 '+j.dest.name:(j.type==='med'?'💊 ':'📦 ')+j.cust+' · '+j.dest.name;tx+=' · '+bn(m)+' মি';tx+=j.type==='pax'?' · '+money(j.pay):' · '+(j.type==='med'?'⏳ ':'🍲 ')+bn(Math.round(j.heat))+'% · '+money(j.pay);tx+=' · ⏱ '+mmss(Math.max(0,j.dl-j.t));$('ob').style.display='none'}
else tx=(o.type==='pax'?'🙋 যাত্রী ডাকছে':(o.type==='med'?'💊 ':'📞 ')+o.brand+' · অর্ডার')+' · '+bn(m)+' মি';
const rot=Math.atan2(dx,-dz)-S.h;jbE.style.display='block';const key=tx;if(key!==lastJB){jbE.innerHTML='<span id="jba" style="display:inline-block;color:#6ee7b7">▲</span> '+tx;lastJB=key}
const a=document.getElementById('jba');if(a)a.style.transform='rotate('+rot+'rad)'}
function mini(){const t=target();if(!t)return;const c=MC;routeDraw(c);c.save();c.translate(150,150);const X=(t.x-S.x)*K,Y=(t.z-S.z)*K,ca=Math.cos(-S.h),sa=Math.sin(-S.h);let px=X*ca-Y*sa,py=X*sa+Y*ca;const r=Math.hypot(px,py),lim=132;if(r>lim){px*=lim/r;py*=lim/r}
c.fillStyle=t.col;c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(px,py,9,0,7);c.fill();c.stroke();c.restore()}
function pctTxt(p){return bn(p<1?p.toFixed(3):p.toFixed(1))+'%'}
function scoreLine(){const l=(typeof LBREC!=='undefined'&&LBREC&&LBREC.l)||G.loss||0,h=J.halal;
if(h<=0)return'হালাল ইনকাম ৳০। মাস্তানির জরিমানার পুরোটাই হারাম খরচ — একটা রাইড বা ডেলিভারিও করেননি!';
if(l<=0)return'ক্ষতি ছাড়াই '+money(h)+' হালাল ইনকাম! এমন চ্যাড ঢাকায় বিরল।';
const p=h/l*100,s='মাস্তানির জরিমানা '+money(l)+', হালাল ইনকাম '+money(h)+' — ';
if(p<.01)return s+'ক্ষতির মাত্র '+pctTxt(p)+' পূরণ হলো। মামা, এইভাবে দেশ চলে?';
if(p<1)return s+'ক্ষতির '+pctTxt(p)+' ফেরত দিলেন। অন্তত চেষ্টা তো করলেন!';
if(p<10)return s+'ক্ষতির '+pctTxt(p)+' পূরণ। পথ এখনো অনেক বাকি, ভাই।';
if(p<100)return s+'ক্ষতির '+pctTxt(p)+' পূরণ! হারামের চেয়ে হালাল এখনো পিছিয়ে।';
return s+'হালাল ইনকামে পুরো ক্ষতি পূরণ! ঢাকার ইতিহাসে প্রথম হালাল চ্যাড!'}
function score(){const e=document.getElementById('sc'),t=e&&e.querySelector('table');if(!t)return;
let r='<tr><td>✅ হালাল ইনকাম (রাইড ও ডেলিভারি)</td><td>'+fm(J.halal)+'</td></tr>';
if(J.rides)r+='<tr><td>🚕 সফল রাইড</td><td>'+bn(J.rides)+' টি</td></tr>';if(J.dels)r+='<tr><td>📦 সফল ডেলিভারি</td><td>'+bn(J.dels)+' টি</td></tr>';
if(J.tips)r+='<tr><td>🎁 বখশিশ</td><td>'+fm(J.tips)+'</td></tr>';if(J.cold)r+='<tr><td>🥶 ঠান্ডা খাবারের অভিযোগ</td><td>'+bn(J.cold)+' বার</td></tr>';if(J.fails)r+='<tr><td>❌ দুর্ঘটনায় বাতিল</td><td>'+bn(J.fails)+' বার</td></tr>';
t.insertAdjacentHTML('beforeend',r);t.insertAdjacentHTML('afterend','<div class="box">✅ '+scoreLine()+'</div>'+halBox());document.querySelectorAll('#sc .ht button').forEach(b=>b.onclick=()=>{if(b.dataset.hk)HK=b.dataset.hk;if(b.dataset.hp)HP=b.dataset.hp;showScore()})}

/* ---------- hooks on game1.js functions ---------- */
function after(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(null,arguments)}catch(e){console.error('BPJ',name,e)}return r}}
function before(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){try{fn.apply(null,arguments)}catch(e){console.error('BPJ',name,e)}return o.apply(this,arguments)}}
after('gameTick',tick);
after('hud',jhud);
after('drawMini',mini);
after('showScore',score);
after('crime',function(a,m,k){if(J.job){J.job.cr++;if(J.job.imm<=0)cancel(k)}});
before('endTrip',function(){try{submitHal()}catch(e){console.error(e)}dropAll()});
setTimeout(()=>{try{if(!NG)buildNG()}catch(e){}},2500);
window.BPJ_T={tick,startJob,makeOffer,complete,cancel,pts,ring,placeName,jhud,scoreLine,clearOffer,beginIn,routeTo};
})();
