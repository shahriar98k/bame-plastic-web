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

/* ---------- state ---------- */
const J={halal:0,rides:0,dels:0,fails:0,tips:0,cold:0,job:null,offer:null,cd:KM?3:18,first:1,t:0};
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
const pay=Math.round(((isPax?40+d0*.10:70+d0*.09)*mult*(J.mult||1))/5)*5;
const job={type:o.type,brand:o.brand,item:o.item,col:o.col,tc:o.tc,dest:{x:dx,z:dz,name:dName},cust,figD,d0,est,pay,t:0,heat:100,imm:2.5,chat:rnd(14,26),slowT:0,
ico:icon(isPax?'গন্তব্য':(o.type==='med'?'ওষুধ':'খাবার'),'#34d399','#073b2a'),bm:beam(0x34d399)};
job.ico.position.set(dx,3.4,dz);sc.add(job.ico);job.bm.position.set(dx,0,dz);sc.add(job.bm);
kill(o.fig);o.fig=null;kill(o.ico);o.ico=null;kill(o.beam);o.beam=null;J.offer=null;J.job=job;
if(isPax){try{actSpawn('on',1)}catch(e){}
say('🙋 যাত্রী: '+pick(KM?GREET_K:GREET_D).replace('{d}',dName),3.4);say('🙂 আপনি: উঠেন ভাই, ঠিকমতো পৌঁছে দিব।',2.2);say2('🙋 যাত্রী: '+pick(WARN),2.8)}
else{card(o.brand,o.col,o.tc,(o.type==='med'?'💊 ':'🍲 ')+o.item+'<br>গ্রাহক: '+cust+'<br>📍 '+dName+'<br>ডেলিভারি পে: '+money(pay));
say((o.type==='med'?'💊 ফার্মেসী: ':'🍽️ '+o.brand+' স্টাফ: ')+'এই নেন ভাই, '+o.item+'। সাবধানে নিয়া যাইয়েন!',3);say2('🙂 আপনি: দুর্ঘটনা ছাড়া পৌঁছে দিব।',2.2)}}

/* ---------- finish / cancel ---------- */
function endJobMarkers(j){kill(j.ico);kill(j.bm);if(j.figD){if(j.keepFig){setTimeout(()=>kill(j.figD),2500)}else kill(j.figD)}}
function complete(){const j=J.job;if(!j)return;const isPax=j.type==='pax';let pay=j.pay,tip=0,msg;
if(isPax){if(j.t<=j.est*1.15)tip=Math.round(pay*.15/5)*5;msg='🙋 যাত্রী: আলহামদুলিল্লাহ, পৌঁছাইলাম! ভাড়া '+money(pay)+(tip?'। বাকিটা রাখেন — '+money(tip)+' বখশিশ।':'।');try{actSpawn('off',1)}catch(e){}}
else{const h=Math.max(0,j.heat);if(h<=0){pay=Math.round(pay*.6);J.cold++;msg='😠 '+j.cust+': এ কী! খাবার তো বরফ হইয়া গেছে! যা পাইছেন নেন — '+money(pay)}
else{tip=Math.round(pay*.35*h/100/5)*5;msg='😊 '+j.cust+': আসছেন! '+(j.type==='med'?'ওষুধ ঠিকঠাক পৌঁছাইছে':'খাবার এখনো গরম ('+bn(Math.round(h))+'%)')+'। ধন্যবাদ! '+money(pay)+(tip?' + বখশিশ '+money(tip):'')}j.keepFig=1}
const tot=pay+tip;J.halal+=tot;J.tips+=tip;G.cash+=tot;if(isPax)J.rides++;else J.dels++;
say(msg,3.6);say('✅ হালাল ইনকাম +'+money(tot),2.4);endJobMarkers(j);J.job=null;J.cd=14}
function cancel(reason){const j=J.job;if(!j)return;J.fails++;
if(j.type==='pax')say('🙋 যাত্রী: '+pick(SCOLD_P),3.8);else say(pick(j.type==='med'?SCOLD_M:SCOLD_D).replace('{brand}',j.brand),3.8);
say('❌ '+(j.type==='pax'?'রাইড':'অর্ডার')+' বাতিল — দুর্ঘটনায় কোনো আয় নেই',2.8);endJobMarkers(j);J.job=null;J.cd=20}
function dropAll(){clearOffer();const j=J.job;if(j){endJobMarkers(j);J.job=null}}

/* ---------- per-frame ---------- */
function tick(dt){if(!G.started||G.over){return}
J.t+=dt;
if(J.job){for(const o of OBJ)if(o.k==='stop'){o.done=true;o.missed=true}if(OBJV)OBJV.t+=dt}
const j=J.job;
if(j){j.t+=dt;if(j.imm>0)j.imm-=dt;j.ico.position.y=3.4+Math.sin(J.t*3)*.25;
if(j.type!=='pax')j.heat=Math.max(0,j.heat-dt*100/(j.est*1.5));
const d=dist(S.x,S.z,j.dest.x,j.dest.z);if(d<14&&slow()){complete();return}
if(j.type==='pax'){j.chat-=dt;const kmh=Math.abs(S.vf)*3.6;if(kmh<10&&Math.abs(S.vf)>.3)j.slowT+=dt;else j.slowT=0;
if(j.chat<=0){j.chat=rnd(22,38);say2('🙋 যাত্রী: '+pick(kmh>75?FAST:(j.slowT>10?SLOWL:IDLE)),2.8)}}
return}
const o=J.offer;
if(!o){J.cd-=dt;if(J.cd<=0)makeOffer();return}
o.age+=dt;if(o.ico)o.ico.position.y=3.4+Math.sin(J.t*3)*.25;
const d=dist(S.x,S.z,o.x,o.z);
if(o.age>170||d>1100){clearOffer();J.cd=10;return}
if(d<12&&slow())startJob()}

/* ---------- HUD / minimap / score ---------- */
function target(){const j=J.job;if(j)return{x:j.dest.x,z:j.dest.z,col:'#34d399'};const o=J.offer;if(o)return{x:o.x,z:o.z,col:o.col};return null}
let lastHL='',lastJB='';
function jhud(){const on=G.started&&!G.over;hlE.style.display=on?'block':'none';if(!on){jbE.style.display='none';return}
const h='✅ হালাল ইনকাম '+money(J.halal);if(h!==lastHL){hlE.textContent=h;lastHL=h}
const t=target();if(!t){jbE.style.display='none';return}
const dx=t.x-S.x,dz=t.z-S.z,m=Math.round(Math.hypot(dx,dz)),j=J.job,o=J.offer;let tx;
if(j){tx=j.type==='pax'?'🚕 '+j.dest.name:(j.type==='med'?'💊 ':'📦 ')+j.cust+' · '+j.dest.name;tx+=' · '+bn(m)+' মি';tx+=j.type==='pax'?' · '+money(j.pay):' · '+(j.type==='med'?'⏳ ':'🍲 ')+bn(Math.round(j.heat))+'% · '+money(j.pay);$('ob').style.display='none'}
else tx=(o.type==='pax'?'🙋 যাত্রী ডাকছে':(o.type==='med'?'💊 ':'📞 ')+o.brand+' · অর্ডার')+' · '+bn(m)+' মি';
const rot=Math.atan2(dx,-dz)-S.h;jbE.style.display='block';const key=tx;if(key!==lastJB){jbE.innerHTML='<span id="jba" style="display:inline-block;color:#6ee7b7">▲</span> '+tx;lastJB=key}
const a=document.getElementById('jba');if(a)a.style.transform='rotate('+rot+'rad)'}
function mini(){const t=target();if(!t)return;const c=MC;c.save();c.translate(150,150);const X=(t.x-S.x)*K,Y=(t.z-S.z)*K,ca=Math.cos(-S.h),sa=Math.sin(-S.h);let px=X*ca-Y*sa,py=X*sa+Y*ca;const r=Math.hypot(px,py),lim=132;if(r>lim){px*=lim/r;py*=lim/r}
c.fillStyle=t.col;c.strokeStyle='#fff';c.lineWidth=3;c.beginPath();c.arc(px,py,9,0,7);c.fill();c.stroke();c.restore()}
function pctTxt(p){return bn(p<1?p.toFixed(3):p.toFixed(1))+'%'}
function scoreLine(){const l=(typeof LBREC!=='undefined'&&LBREC&&LBREC.l)||G.loss||0,h=J.halal;
if(h<=0)return'হালাল ইনকাম ৳০। চ্যাডের খুশির পুরোটাই হারাম খরচ — একটা রাইড বা ডেলিভারিও করেননি!';
if(l<=0)return'ক্ষতি ছাড়াই '+money(h)+' হালাল ইনকাম! এমন চ্যাড ঢাকায় বিরল।';
const p=h/l*100,s='চ্যাডের খুশি '+money(l)+', হালাল ইনকাম '+money(h)+' — ';
if(p<.01)return s+'ক্ষতির মাত্র '+pctTxt(p)+' পূরণ হলো। মামা, এইভাবে দেশ চলে?';
if(p<1)return s+'ক্ষতির '+pctTxt(p)+' ফেরত দিলেন। অন্তত চেষ্টা তো করলেন!';
if(p<10)return s+'ক্ষতির '+pctTxt(p)+' পূরণ। পথ এখনো অনেক বাকি, ভাই।';
if(p<100)return s+'ক্ষতির '+pctTxt(p)+' পূরণ! হারামের চেয়ে হালাল এখনো পিছিয়ে।';
return s+'হালাল ইনকামে পুরো ক্ষতি পূরণ! ঢাকার ইতিহাসে প্রথম হালাল চ্যাড!'}
function score(){const e=document.getElementById('sc'),t=e&&e.querySelector('table');if(!t)return;
let r='<tr><td>✅ হালাল ইনকাম (রাইড ও ডেলিভারি)</td><td>'+fm(J.halal)+'</td></tr>';
if(J.rides)r+='<tr><td>🚕 সফল রাইড</td><td>'+bn(J.rides)+' টি</td></tr>';if(J.dels)r+='<tr><td>📦 সফল ডেলিভারি</td><td>'+bn(J.dels)+' টি</td></tr>';
if(J.tips)r+='<tr><td>🎁 বখশিশ</td><td>'+fm(J.tips)+'</td></tr>';if(J.cold)r+='<tr><td>🥶 ঠান্ডা খাবারের অভিযোগ</td><td>'+bn(J.cold)+' বার</td></tr>';if(J.fails)r+='<tr><td>❌ দুর্ঘটনায় বাতিল</td><td>'+bn(J.fails)+' বার</td></tr>';
t.insertAdjacentHTML('beforeend',r);t.insertAdjacentHTML('afterend','<div class="box">✅ '+scoreLine()+'</div>')}

/* ---------- hooks on game1.js functions ---------- */
function after(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(null,arguments)}catch(e){console.error('BPJ',name,e)}return r}}
function before(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){try{fn.apply(null,arguments)}catch(e){console.error('BPJ',name,e)}return o.apply(this,arguments)}}
after('gameTick',tick);
after('hud',jhud);
after('drawMini',mini);
after('showScore',score);
after('crime',function(a,m,k){if(J.job&&J.job.imm<=0)cancel(k)});
before('endTrip',dropAll);
window.BPJ_T={tick,startJob,makeOffer,complete,cancel,pts,ring,placeName,jhud,scoreLine};
})();
