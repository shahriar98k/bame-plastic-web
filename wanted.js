/* wanted.js — ওয়ান্টেড লেভেল (ঢাকা ও কাপ্তাই): ধাক্কা বাড়লে পুলিশ → বাহিনী → হেলিকপ্টার/নৌ-পুলিশ.
   পালানোর উপায়: গোপন গ্যারেজ (মানচিত্রে বেগুনি চিহ্ন) অথবা চোখের আড়ালে থেকে টানা লুকানো.
   game1.js বদলানো হয়নি — শুধু crime(), gameTick(), hud(), drawMini(), endTrip()-এ হুক। */
(function(){
if(window.__BPW||typeof G==='undefined'||typeof S==='undefined'||typeof sc==='undefined'||typeof THREE==='undefined'||!window.BPJ_T)return;
window.__BPW=1;
const KM=!!window.KMODE,rnd=(a,b)=>a+Math.random()*(b-a),dist=(ax,az,bx,bz)=>Math.hypot(ax-bx,az-bz);
const money=n=>'৳'+bn(Math.round(n).toLocaleString('en-IN'));
const water=(x,z)=>KM&&typeof kWater==='function'&&kWater(x,z);
const blocked=(x,z)=>(typeof hit==='function'&&hit(x,z))||water(x,z);
const blk=(u,x,z)=>u.kind==='boat'?!water(x,z):blocked(x,z);
const W={nx:0,rbu:[],rbs:[],rbp:null,alt:0,flat:0,ped:0,cop:0,dec:0,stars:0,cc:99,sp:0,bust:0,units:[],heli:null,gar:null,gcd:0,gmsg:0,spT:0,tk:0,sirenT:0};
const TP=[0,1,11,21,31,41],UK=['a','b','c','d','e','f','g','h','boat'],SPI=[0,10,8,6,5,5],MASS={a:1.2,b:1.7,c:2.3,d:3.2,e:4.2,f:4.6,g:4.6,h:4.8};
const LV=KM?['','কাপ্তাই থানার পিকআপ','পুলিশ নীল পিকআপ','থানার টহল গাড়ি','প্যাট্রোল, সাঁজোয়া যান ও হেলিকপ্টার','সোয়াট সাঁজোয়া বহর ও হেলিকপ্টার']:['','ডিএমপি পিকআপ টহল','পুলিশ নীল পিকআপ','ডিএমপি টহল গাড়ি','প্যাট্রোল, সাঁজোয়া যান ও হেলিকপ্টার','সোয়াট সাঁজোয়া বহর ও হেলিকপ্টার'];
const MSG=KM?['','🚓 কাপ্তাই থানার পিকআপ আপনার পিছু নিয়েছে','🚔 পুলিশের নীল পিকআপ নামানো হয়েছে! পালান!','🚨 থানার টহল গাড়ি ঘিরে ফেলছে — রাস্তা বন্ধ হচ্ছে!','🚁 সাঁজোয়া যান নেমেছে, আকাশে হেলিকপ্টার! লুকানোর জায়গা খুঁজুন','⚓ সোয়াট বহর ও নৌ-পুলিশ মাঠে! পুরো কাপ্তাই আপনাকে খুঁজছে']:['','🚓 ডিএমপি পিকআপ আপনাকে দেখে ফেলেছে!','🚔 পুলিশ নীল পিকআপ পিছু নিয়েছে — পালান!','🚨 ডিএমপি টহল গাড়ি নেমেছে! সব মোড়ে নজরদারি','🚁 প্যাট্রোল, সাঁজোয়া যান ও হেলিকপ্টার! আকাশ থেকে আপনাকে দেখছে','🪖 সোয়াট সাঁজোয়া বহর নেমেছে! পুরো ঢাকা আপনার খোঁজে'];
const need=n=>({a:n===1?3:0,b:n===2?4:0,c:n===3?5:0,d:n===4?4:0,e:n===4?3:0,f:n===5?3:0,g:n===5?3:0,h:n===5?3:0,heli:n>=4?1:0,boat:KM?[0,0,0,1,1,2][n]:0});
/* ---------- মডেল: ছবির হুবহু গাড়ি (লেভেল অনুযায়ী) ---------- */
const GC={},geo=(w,h,l)=>{const k=w+','+h+','+l;return GC[k]||(GC[k]=new THREE.BoxGeometry(w,h,l))},MC2={},mat=c=>MC2[c]||(MC2[c]=new THREE.MeshLambertMaterial({color:c})),BM={},bmat=c=>BM[c]||(BM[c]=new THREE.MeshBasicMaterial({color:c}));
const NF='"Hind Siliguri","Noto Sans Bengali",sans-serif',TXC={},PG={},WG={};
const pg=(w,h)=>PG[w+','+h]||(PG[w+','+h]=new THREE.PlaneGeometry(w,h));
const GL=0x18222c,CH=0xd5dade,nm=()=>window.KMODE?'কাপ্তাই থানা পুলিশ':'ঢাকা মেট্রোপলিটন পুলিশ';
function canv(key,w,h,draw){let m=TXC[key];if(!m){const c=document.createElement('canvas');c.width=Math.round(w*128);c.height=Math.round(h*128);draw(c.getContext('2d'),c.width,c.height);const T=new THREE.CanvasTexture(c);T.anisotropy=4;m=TXC[key]=new THREE.MeshBasicMaterial({map:T,transparent:true,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2})}return m}
const tmat=(t,w,h,col,fs,bg)=>canv('t'+t+w+h+col+fs+(bg||''),w,h,(x,W,H)=>{if(bg){x.fillStyle=bg;x.fillRect(0,0,W,H)}x.fillStyle=col;x.font='800 '+fs+'px '+NF;x.textAlign='center';x.textBaseline='middle';x.fillText(t,W/2,H/2+3)});
const emat=()=>canv('emb',.6,.6,(x,W,H)=>{x.fillStyle='#0b7a3a';x.beginPath();x.arc(W/2,H/2,W/2-2,0,7);x.fill();x.strokeStyle='#f5c518';x.lineWidth=5;x.beginPath();x.arc(W/2,H/2,W/2-10,0,7);x.stroke();x.fillStyle='#d62828';x.font='700 '+(W*.5)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('★',W/2,H/2+3)});
const smat=()=>canv('stars3',1.1,.25,(x,W,H)=>{x.fillStyle='#1d2fb0';x.fillRect(0,0,W,H);x.fillStyle='#f5c518';x.font='700 '+(H*.8)+'px sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('★ ★ ★',W/2,H/2+2)});
function side(g,m,w,h,x,y,z){const a=new THREE.Mesh(pg(w,h),m);a.position.set(x,y,z);a.rotation.y=Math.PI/2;g.add(a);const b=new THREE.Mesh(pg(w,h),m);b.position.set(-x,y,z);b.rotation.y=-Math.PI/2;g.add(b)}
function face(g,m,w,h,x,y,z,back){const a=new THREE.Mesh(pg(w,h),m);a.position.set(x,y,z);if(!back)a.rotation.y=Math.PI;g.add(a)}
function B(g){return(w,h,l,x,y,z,c,rx)=>{const m=new THREE.Mesh(geo(w,h,l),c&&c.isMaterial?c:mat(c));m.position.set(x,y,z);if(rx)m.rotation.x=rx;g.add(m);return m}}
function wheel(g,r,w,x,y,z,hub){const k=r+','+w;const G2=WG[k]||(WG[k]=new THREE.CylinderGeometry(r,r,w,14));const t=new THREE.Mesh(G2,mat(0x101010));t.rotation.z=Math.PI/2;t.position.set(x,y,z);g.add(t);const hk='h'+k,H2=WG[hk]||(WG[hk]=new THREE.CylinderGeometry(r*.6,r*.6,w+.05,12));const h=new THREE.Mesh(H2,mat(hub||0xb4bac0));h.rotation.z=Math.PI/2;h.position.set(x,y,z);g.add(h)}
function top(g,m,w,h,x,y,z){const a=new THREE.Mesh(pg(w,h),m);a.position.set(x,y,z);a.rotation.x=-Math.PI/2;g.add(a)}
function lightbar(g,x,y,z,len){const b=B(g);b(len,.06,.34,x,y-.07,z,0x1a1a1a);b(len*.42,.14,.3,x-len*.29,y,z,g.userData.bm);b(len*.16,.14,.3,x,y,z,0xdddddd);b(len*.42,.14,.3,x+len*.29,y,z,g.userData.lm)}
function lamps(g,hx,hy,hz,tz,tw){const b=B(g);for(const s of[-1,1]){b(.34,.2,.06,s*hx,hy,hz,bmat(0xfff3c4));b(.26,.18,.06,s*(tw||hx),hy,tz,bmat(0xc81818))}}
function pickup(g,o){const b=B(g),W=1.9,C=o.col;
b(W,.75,5.2,0,.675,0,C);b(W-.12,.22,1.5,0,1.16,-1.85,C);b(W-.1,.8,1.8,0,1.45,-.3,C);b(W-.03,.5,1.65,0,1.55,-.3,GL);b(W-.12,.1,1.55,0,1.9,-.3,C);
b(W-.25,.6,.08,0,1.52,-1.22,GL,.5);for(const s of[-1,1])for(const z of[-1.12,.52])b(.1,.55,.1,s*(W/2-.02),1.55,z,C);
b(W+.02,o.tarp?1.25:.9,2.5,0,o.tarp?1.67:1.5,1.4,o.can);if(o.tarp)b(W-.2,.15,2.3,0,2.35,1.4,o.can);b(W-.5,.7,.06,0,1.5,2.68,0x0c0d0e);
if(!o.tarp)for(const s of[-1,1])b(.04,.4,1.5,s*(W/2+.02),1.55,1.4,GL);
for(const s of[-1,1]){for(const z of[-1.75,1.5])b(.12,.16,1.05,s*(W/2+.02),.98,z,o.flare);b(.1,.08,2.3,s*(W/2+.03),.55,-.3,0xb8bec4);b(.07,.7,.07,s*.62,.82,-2.78,CH);b(.07,.7,.07,s*.2,.82,-2.78,CH)}
b(1.5,.07,.07,0,1.15,-2.78,CH);b(1.5,.07,.07,0,.62,-2.78,CH);b(.12,.5,.12,-.86,.9,-2.74,CH);b(.12,.5,.12,.86,.9,-2.74,CH);b(.9,.2,.05,0,.92,-2.62,0x1a1a1a);lamps(g,.62,.98,-2.62,2.63,.75);
for(const s of[-1,1]){wheel(g,.42,.3,s*.88,.42,-1.75);wheel(g,.42,.3,s*.88,.42,1.5)}lightbar(g,0,2.06,-.35,1.3);
side(g,emat(),.5,.5,W/2+.01,.72,-.75);side(g,tmat(nm(),2.6,.42,'#ffffff',44),2.6,.42,W/2+.01,.72,1.0)}
function sedan(g){const b=B(g),NV=0x16296b,WH=0xf4f6f8;
b(1.72,.6,4.4,0,.6,0,NV);b(1.64,.1,1.25,0,.97,-1.5,NV);b(1.64,.12,.95,0,.98,1.7,NV);b(1.74,.55,1.8,0,.62,.1,WH);
b(1.52,.46,2.0,0,1.17,.15,GL);b(1.5,.08,1.9,0,1.44,.15,WH);b(1.4,.5,.07,0,1.12,-.98,GL,.9);for(const s of[-1,1])for(const z of[-.82,.0,1.12])b(.08,.5,.1,s*.76,1.17,z,WH);
b(1.7,.08,.1,0,.48,-2.28,CH);b(1.7,.08,.1,0,.48,2.28,CH);lamps(g,.62,.78,-2.21,2.21,.62);face(g,tmat('১১-৭৭০২',.6,.16,'#111',22,'#f2f2f2'),.6,.16,0,.55,-2.215);
for(const s of[-1,1]){wheel(g,.33,.25,s*.82,.33,-1.4,0xc6cbd0);wheel(g,.33,.25,s*.82,.33,1.4,0xc6cbd0)}lightbar(g,0,1.54,.15,1.3);
side(g,tmat(nm(),1.55,.3,'#16296b',34),1.55,.3,.88,.68,.35);side(g,emat(),.42,.42,.88,.7,-.55)}
function patrol(g){const b=B(g),WH=0xf2f3f4,DK=0x1a1a1a;
b(1.9,.85,4.9,0,.775,0,WH);b(1.78,.18,1.5,0,1.28,-1.7,WH);b(1.85,.75,3.4,0,1.58,.5,WH);b(1.88,.5,3.3,0,1.62,.5,0x151b22);b(1.8,.07,3.3,0,2.0,.5,WH);for(const s of[-1,1])b(.05,.07,3.0,s*.8,2.07,.5,DK);
b(1.7,.6,.07,0,1.65,-1.18,GL,.55);for(const s of[-1,1]){b(.1,.08,2.4,s*.98,.5,.4,DK);b(.07,.5,.08,s*.82,.78,-2.55,CH);b(.07,.5,.08,s*.35,.78,-2.55,CH);wheel(g,.43,.3,s*.9,.43,-1.6,0xc8ccd0);wheel(g,.43,.3,s*.9,.43,1.5,0xc8ccd0);
const sp=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.12,12),bmat(0xe8dfa8));sp.rotation.x=Math.PI/2;sp.position.set(s*.45,.85,-2.58);g.add(sp)}
b(1.7,.07,.08,0,1.0,-2.55,CH);b(1.7,.07,.08,0,.55,-2.55,CH);lamps(g,.68,.98,-2.46,2.46,.7);
const pt=tmat('PATROL',1.2,.22,'#111',40,'#b9c0c6');face(g,pt,1.2,.22,0,.72,-2.6);face(g,pt,1.0,.19,0,.78,2.47,1);top(g,tmat('PATROL',1.3,.34,'#16296b',52),1.3,.34,0,1.38,-1.75);face(g,smat(),1.1,.25,0,.5,-2.6);side(g,tmat(nm(),1.9,.3,'#16296b',34),1.9,.3,.96,1.0,.4);
b(.03,.55,.03,.55,1.62,-1.15,0xcccccc);b(.02,.2,.34,.55,1.82,-.98,0x0b1020);lightbar(g,0,2.14,-.6,.9)}
function armored(g,o){const b=B(g),C=o.col,DK=0x15171a;
b(2.0,.5,5.0,0,.75,0,DK);b(2.1,.85,4.9,0,1.025,.05,C);b(1.95,.35,1.5,0,1.62,-1.75,C);b(2.05,.9,3.1,0,1.9,.7,C);b(1.7,.7,.08,0,1.9,-.88,GL,.5);
for(const s of[-1,1]){for(const z of[-.1,.7,1.5])b(.05,.4,.55,s*1.03,2.0,z,GL);b(.18,.18,1.2,s*1.0,1.0,-1.55,0x2a2d31);b(.18,.18,1.2,s*1.0,1.0,1.55,0x2a2d31);b(.14,.07,2.8,s*1.1,.7,.5,DK);b(.12,.7,.12,s*.95,.95,-2.55,DK);
wheel(g,.58,.42,s*1.0,.58,-1.6,o.hub||0x2a2d31);wheel(g,.58,.42,s*1.0,.58,1.55,o.hub||0x2a2d31);b(.05,.3,.4,s*.61,2.9,1.1,0x9fc4dd)}
b(1.2,.85,1.3,0,2.78,1.1,C);for(const s of[-1,1])b(.35,.3,.05,s*.3,2.9,.44,0x9fc4dd);
if(o.spare){const t=new THREE.Mesh(WG.sp||(WG.sp=new THREE.CylinderGeometry(.5,.5,.3,14)),mat(0x111111));t.position.set(0,2.5,-.2);g.add(t)}
b(2.25,.28,.35,0,.75,-2.55,DK);b(.7,.32,.35,0,.95,-2.5,0x2a2d31);b(2.1,.1,.1,0,1.35,-2.62,DK);b(1.0,.5,.06,0,1.35,-2.5,0x0a0a0b);lamps(g,.72,1.3,-2.5,2.5,.8);
if(o.strobe){b(.3,.14,.06,-.45,1.02,-2.54,g.userData.bm);b(.3,.14,.06,.45,1.02,-2.54,g.userData.lm);face(g,tmat('SWAT',.5,.16,'#111',26,'#f2f2f2'),.5,.16,-.7,.78,-2.74)}
if(o.swat){const sc2=o.col===0xe6e8ea?'#16296b':'#ffffff',sm=tmat('SWAT',.95,.34,sc2,50);side(g,sm,.95,.34,1.06,1.0,1.98);face(g,sm,.95,.34,0,1.2,2.52,1);top(g,sm,1.2,.42,0,1.81,-1.95)}
else lightbar(g,0,2.45,-.55,1.3);
side(g,tmat(nm(),2.4,.36,o.col===0xe6e8ea?'#16296b':'#ffffff',40),2.4,.36,1.06,1.0,.3);
if(o.gun){b(.1,.1,.9,.45,1.55,-2.2,0x111);b(.5,.2,.3,.45,1.5,-1.8,0x111)}}
function mkHeli(){const g=new THREE.Group(),b=B(g),BL=0x1e3fa6,WH=0xe9eef2;g.rotation.order='YXZ';
b(2.0,1.9,3.6,0,0,.4,BL);const nose=new THREE.Mesh(new THREE.SphereGeometry(1,14,10),mat(BL));nose.scale.set(1.0,.95,1.3);nose.position.set(0,0,1.9);g.add(nose);b(1.7,.7,.1,0,.32,2.95,GL,-.55);
b(2.04,.55,4.2,0,-.75,.2,WH);b(2.06,.1,3.6,0,-.42,.4,0xd32027);b(2.06,.08,3.6,0,-.56,.4,0x1f8a45);for(const z of[-1.0,-.2,.6,1.4])side(g,mat(0x9fc4dd),.4,.5,1.012,.5,z);
for(const s of[-1,1])b(.8,.7,1.1,s*.55,1.3,.3,0x151a20);b(.8,.5,.9,0,1.05,.9,BL);
b(.55,.62,4.0,0,.35,-3.0,BL);b(.14,1.4,.95,0,1.05,-5.0,BL,.0);b(.35,.3,.3,.18,1.0,-5.2,0x222);const tr=new THREE.Mesh(geo(.06,1.3,.2),mat(0x1a1a1a));tr.position.set(.25,1.0,-5.4);g.add(tr);
side(g,tmat(nm(),2.1,.4,'#ffffff',40),2.1,.4,1.02,.4,.9);side(g,emat(),.5,.5,1.02,.2,1.9);
for(const s of[-1,1])wheel(g,.3,.2,s*.85,-1.35,-.2,0x1e3fa6);wheel(g,.25,.2,0,-1.3,2.0,0x1e3fa6);
const rot=new THREE.Group();rot.position.y=1.95;const hub=new THREE.Mesh(new THREE.CylinderGeometry(.22,.28,.35,10),mat(0x222));rot.add(hub);
for(let i=0;i<5;i++){const bl=new THREE.Mesh(geo(.34,.05,4.6),mat(0x1a1a1a));const a=i*Math.PI*2/5;bl.position.set(Math.sin(a)*2.4,0,Math.cos(a)*2.4);bl.rotation.y=a;rot.add(bl)}g.add(rot);
const bg=new THREE.CylinderGeometry(.18,4.6,1,18,1,true);bg.translate(0,-.5,0);const beam=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,fog:false}));
sc.add(beam);const lm=new THREE.MeshBasicMaterial({color:0xff2020}),l=new THREE.Mesh(geo(.4,.2,.4),lm);l.position.set(0,-1.15,1.6);g.add(l);
g.userData.own=1;g.scale.setScalar(1.15);sc.add(g);return{g,rot,beam,lm,t:0,x:S.x,y:28,z:S.z,h:0,mode:'o',cd:rnd(7,10),dt:0}}
const DIM={a:[5.3,1.95,2.1],b:[5.3,1.95,2.1],c:[4.4,1.75,1.6],d:[4.9,1.95,2.1],e:[5.4,2.2,3.2],f:[5.4,2.2,3.2],g:[5.4,2.2,3.2],h:[5.4,2.2,3.2]};
function mkBoat(){const g=new THREE.Group(),L=4.6,Wd=1.8,H=.7,y0=.1;const b=new THREE.Mesh(geo(Wd,H,L),mat(0xf4f6f8));b.position.y=y0+H/2;g.add(b);const st=new THREE.Mesh(geo(Wd+.03,.2,L+.03),mat(0x1e56c8));st.position.y=y0+H*.42;g.add(st);
const top=y0+H+.4,lm=new THREE.MeshBasicMaterial({color:0xff2020}),bm=new THREE.MeshBasicMaterial({color:0x2040ff});const l1=new THREE.Mesh(geo(.5,.16,.3),lm),l2=new THREE.Mesh(geo(.5,.16,.3),bm);l1.position.set(-.3,top,0);l2.position.set(.3,top,0);g.add(l1);g.add(l2);
g.userData.lm=lm;g.userData.bm=bm;g.userData.own=1;sc.add(g);return{g,L,Wd,H}}
function mkUnit(kind){if(kind==='boat')return mkBoat();const g=new THREE.Group();g.userData.lm=new THREE.MeshBasicMaterial({color:0xff2020});g.userData.bm=new THREE.MeshBasicMaterial({color:0x2040ff});
if(kind==='a')pickup(g,{col:0x15181c,can:0x2b2d30,tarp:1,flare:0x3a3e42,full:1});
else if(kind==='b')pickup(g,{col:0x1f68bd,can:0x1f68bd,flare:0x1a56a0});
else if(kind==='c')sedan(g);else if(kind==='d')patrol(g);
else if(kind==='e')armored(g,{col:0x15181c,hub:0x888e94});
else if(kind==='f')armored(g,{col:0x55565b,spare:1,swat:1});
else if(kind==='g')armored(g,{col:0x4b3a33,strobe:1,swat:1});
else armored(g,{col:0xe6e8ea,gun:1,swat:1,hub:0x30343a});
const d=DIM[kind];g.userData.own=1;sc.add(g);return{g,L:d[0],Wd:d[1],H:d[2]}}
function kill(o){if(!o)return;try{sc.remove(o)}catch(e){}o.traverse&&o.traverse(m=>{try{if(m.material&&m.userData&&m.userData.dispose){m.material.dispose()}}catch(e){}})}
/* ---------- জায়গা বাছা ---------- */
function spawnPt(mn,mx,wantWater,front){const P=BPJ_T.pts()||[];const fx=Math.sin(S.h),fz=-Math.cos(S.h);
if(wantWater){for(let i=0;i<40;i++){const a=rnd(0,6.283),r=rnd(mn,mx),x=S.x+Math.cos(a)*r,z=S.z+Math.sin(a)*r;if(water(x,z))return{x,z,h:rnd(0,6.283)}}return null}
let best=null;for(let i=0;i<(front?150:50)&&P.length;i++){const p=P[Math.floor(Math.random()*P.length)],d=dist(p[0],p[1],S.x,S.z);if(d<mn||d>mx)continue;const dot=((p[0]-S.x)*fx+(p[1]-S.z)*fz)/(d||1);if(front?dot<.55:(dot>.45&&d<mx*.9))continue;best=p;break}
if(!best){if(typeof nrt==='function'){for(let i=0;i<60;i++){const a=rnd(0,6.283),r=rnd(mn,mx),x=S.x+Math.cos(a)*r,z=S.z+Math.sin(a)*r;let q=null;try{q=nrt(x,z)}catch(e){}if(q&&q[0]<q[3]/2-1&&!blocked(x,z)&&(!front||((x-S.x)*fx+(z-S.z)*fz)/r>.4))return{x,z,h:Math.atan2(S.x-x,-(S.z-z))}}}return null}let dx=S.x-best[0],dz=S.z-best[1];const dir=(best[2]*dx+best[3]*dz)>=0?1:-1;return{x:best[0],z:best[1],h:Math.atan2(best[2]*dir,-best[3]*dir),dx:best[2],dz:best[3],w:best[5]}}
/* ---------- ইউনিট ---------- */
function spawn(kind,front){if(kind==='heli'){if(W.heli)return;W.heli=mkHeli();W.heli.x=S.x+rnd(-60,60);W.heli.z=S.z+rnd(-60,60);toast('🚁 পুলিশ হেলিকপ্টার আকাশে!',2.4);return}
const sp=front&&kind!=='boat'?(spawnPt(45,95,false,true)||spawnPt(40,90,false)):spawnPt(kind==='boat'?110:105,kind==='boat'?260:190,kind==='boat');if(!sp||W.units.concat(W.rbu).some(o=>dist(o.x,o.z,sp.x,sp.z)<9))return;const m=mkUnit(kind);
const u={kind,g:m.g,L:m.L,Wd:m.Wd,x:sp.x,z:sp.z,h:sp.h,v:0,stuck:0,dis:0,pref:Math.random()<.5?1:-1,hc:0,spin:0,top:0,kx:0,kz:0};m.g.position.set(u.x,0,u.z);m.g.rotation.y=-u.h;W.units.push(u)}
function remove(u){kill(u.g);const i=W.units.indexOf(u);if(i>=0)W.units.splice(i,1)}
function clearAll(){rbClear();for(const u of W.units.slice())remove(u);if(W.heli){kill(W.heli.g);kill(W.heli.beam);W.heli=null}}
function antiStuck(dt){if(typeof inp==='undefined'||typeof VEH==='undefined')return;const go=inp.G||inp.V;if(go&&Math.abs(S.vf)<1.2)W.stk=(W.stk||0)+dt;else W.stk=Math.max(0,(W.stk||0)-dt*2);
if(W.stk>.7){W.stk=0;for(const v of VEH){if(!v.placed)continue;if(Math.hypot(v.px-S.x,v.pz-S.z)<7){if(v.rare){v.placed=false;if(v.g)v.g.visible=false}else if(typeof placeNear==='function'){if(!placeNear(v,150,330))v.hold=Math.max(v.hold||0,.6)}}}
for(const u of W.units.concat(W.rbu)){const dx=u.x-S.x,dz=u.z-S.z,d=Math.hypot(dx,dz);if(d<8&&d>.01){u.kx+=dx/d*9;u.kz+=dz/d*9}}}}
function nearestGround(){let b=1e9;for(const u of W.units){if(u.kind==='boat')continue;const d=dist(u.x,u.z,S.x,S.z);if(d<b)b=d}return b}
function nearest(){let b=1e9;for(const u of W.units){const d=dist(u.x,u.z,S.x,S.z);if(d<b)b=d}if(W.heli){const d=dist(W.heli.x,W.heli.z,S.x,S.z);if(d<b)b=d}return b}
const TOP=()=>(typeof PV!=='undefined'&&PV.top)||18;
function moveUnit(u,dt){const T=TOP(),pv=Math.abs(S.vf),fx=Math.sin(S.h),fz=-Math.cos(S.h);let tx=S.x+fx*Math.sign(S.vf||1)*pv*.7,tz=S.z+fz*Math.sign(S.vf||1)*pv*.7;const dp=dist(u.x,u.z,S.x,S.z);
if(u.dis>0){u.dis-=dt;u.v*=Math.pow(.2,dt);u.h+=u.spin*dt;u.spin*=.96;if(u.dis<=0)u.spin=0}
else{if(u.ax===undefined){u.ax=tx;u.az=tz}
const kf=Math.min(1,dt*(dp<22?4.5:2));u.ax+=(tx-u.ax)*kf;u.az+=(tz-u.az)*kf;tx=u.ax;tz=u.az;
const rx=u.x-S.x,rz=u.z-S.z,ah=rx*fx+rz*fz,hx=Math.sin(u.h),hz=-Math.cos(u.h),face=dp>1?(-rx*hx-rz*hz)/dp:0;
const appr=u.kind!=='boat'&&ah>-2&&(ah>6||u.side)&&dp<115&&pv>3&&face>.1;
if(appr){if(!u.side)u.side=(rx*(-fz)+rz*fx)>=0?1:-1;tx+=-fz*u.side*5.5;tz+=fx*u.side*5.5}else u.side=0;
const turnA=!appr&&u.kind!=='boat'&&ah<2&&(hx*fx+hz*fz)<-.2&&dp<70&&pv>3;
let tgt=Math.atan2(tx-u.x,-(tz-u.z)),base=('efgh'.indexOf(u.kind)>=0?.86:.92)+.035*W.stars;if(u.kind==='boat')base=.8;
let sp=T*base;if(appr&&dp<70)sp*=.8;if(turnA)sp=Math.min(sp,7);if(dp>220)sp*=1.5;else if(dp<16)sp=Math.max(pv*1.03,4);for(const o of W.rbu)if(dist(o.x,o.z,u.x,u.z)<11){sp=Math.min(sp,3);break}
if(u.kind!=='boat'){for(const o of W.units){if(o===u||o.kind==='boat')continue;const ox=o.x-u.x,oz=o.z-u.z;if(ox*ox+oz*oz>625)continue;const f=ox*hx+oz*hz,l=ox*-hz+oz*hx,gp=f-(u.L+o.L)*.5;if(f>0&&Math.abs(l)<(u.Wd+o.Wd)*.5+.7&&gp<4+Math.max(0,u.v)*.5){const ov=Math.max(0,o.v*(hx*Math.sin(o.h)+hz*-Math.cos(o.h)));sp=Math.min(sp,Math.max(0,ov*.9+(gp-1.2)*1.4));if(gp<6)tgt+=(l>0?-1:1)*.3}}
if(dp>10&&typeof VEH!=='undefined'&&typeof V6!=='undefined')for(const o of VEH){if(!o.placed||!o.init||o.cr)continue;const ox=o.px-u.x,oz=o.pz-u.z;if(ox*ox+oz*oz>400)continue;const f=ox*hx+oz*hz;if(f<=0||f>16)continue;const l=ox*-hz+oz*hx,T2=V6.VT[o.type];if(!T2||Math.abs(l)>(u.Wd+T2.w)*.5+.9)continue;tgt+=(l>0?-1:1)*.28;if(f<8)sp=Math.min(sp,Math.max(5,o.v+3+f*.5));break}}
const la=Math.max(4,u.v*.7+3);let ok=false;const offs=[0,.5*u.pref,-.5*u.pref,1*u.pref,-1*u.pref,1.6*u.pref,-1.6*u.pref];
for(const o of offs){const a=tgt+o;if(!blk(u,u.x+Math.sin(a)*la,u.z-Math.cos(a)*la)&&!blk(u,u.x+Math.sin(a)*la*.5,u.z-Math.cos(a)*la*.5)){tgt=a;ok=true;break}}
if(!ok){sp=0;tgt=u.h+u.pref*1.2}
let dh=tgt-u.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));const mt=(2.5)*Math.min(1,.35+u.v/6)*dt;u.h+=Math.max(-mt,Math.min(mt,dh));
if(u.rev>0){u.rev-=dt;sp=-4;u.h+=u.pref*.9*dt}u.v+=(sp-u.v)*Math.min(1,(sp>u.v?1.6:3)*dt)}
const nx=u.x+Math.sin(u.h)*u.v*dt,nz=u.z-Math.cos(u.h)*u.v*dt;
const sgv=u.v>=0?1:-1;if(Math.abs(u.v)>.3&&blk(u,nx+Math.sin(u.h)*sgv*u.L*.5,nz-Math.cos(u.h)*sgv*u.L*.5)){u.v*=.2;u.stuck+=dt;u.pref=-u.pref;if(u.stuck>1.3&&!(u.rev>0)){u.rev=1.3;u.stuck=.2}}else{u.x=nx;u.z=nz;if(u.v>1)u.stuck=Math.max(0,u.stuck-dt)}
if((u.stuck>4&&dp>60)||dp>330){const sp=spawnPt(u.kind==='boat'?110:50,u.kind==='boat'?260:110,u.kind==='boat');if(sp&&!W.units.concat(W.rbu).some(o=>o!==u&&dist(o.x,o.z,sp.x,sp.z)<9)){u.x=sp.x;u.z=sp.z;u.h=sp.h;u.v=0;u.stuck=0}else u.stuck=0}
u.g.position.set(u.x,u.kind==='boat'?Math.sin(performance.now()*.002+u.x)*.05:0,u.z);u.g.rotation.y=-u.h;u.g.rotation.z=u.dis>0?Math.sin(performance.now()*.02)*.08:0}
const RES={a:.3,b:.4,c:.45,d:.55,e:.65,f:.72,g:.72,h:.75};
function contact(u,dt){if(u.kind==='boat'||G.over)return;u.hc-=dt;const sh=Math.sin(S.h),ch=Math.cos(S.h),hw=(typeof PV!=='undefined'&&PV.hw)||.9,ol=(typeof PV!=='undefined'&&PV.ol)||2,k=u.L*.33,uf=[Math.sin(u.h),-Math.cos(u.h)],rn=u.Wd*.5;
if(dist(u.x,u.z,S.x,S.z)>ol+u.L*.5+hw+rn+1)return;
let best=null;for(const o of[-ol,-ol/2,0,ol/2,ol]){const px=S.x+sh*o,pz=S.z-ch*o;for(const q of[-k,0,k]){const dx=px-(u.x+uf[0]*q),dz=pz-(u.z+uf[1]*q),d=Math.hypot(dx,dz),pen=hw+.05+rn-d;if(pen>0&&(!best||pen>best.pen))best={pen,nx:dx/(d||1),nz:dz/(d||1)}}}
if(!best)return;
const M=MASS[u.kind]||2,cs=1/(1+M*.6),ps=1-cs,sg=Math.sign(S.vf||1),qx=S.x+best.nx*best.pen*ps,qz=S.z+best.nz*best.pen*ps;if(!blocked(qx,qz)){S.x=qx;S.z=qz}u.x-=best.nx*best.pen*cs;u.z-=best.nz*best.pen*cs;
const c=Math.max(0,-((sh*S.vf-(uf[0]*u.v+u.kx))*best.nx+(-ch*S.vf-(uf[1]*u.v+u.kz))*best.nz)),into=(best.nx*sh-best.nz*ch)*sg<0;
if(u.hc<=0&&c>1.2){u.hc=.4;const kk=Math.min(1,c/13),ks=Math.min(14,c*cs*1.5);
u.kx-=best.nx*ks*.7;u.kz-=best.nz*ks*.7;if(into){u.kx+=sh*sg*ks*.5;u.kz-=ch*sg*ks*.5}u.sp=(Math.random()<.5?-1:1)*(.8+c*.1)*cs;u.v*=1-.4*cs*kk;
if(into){S.vf*=1-RES[u.kind]*Math.min(1,.4+kk);if(M>3)S.vf-=sg*Math.min(2.5,c*.12);if(c>4)addHeat('cop')}
if(window.BPD){BPD.hurt(.1+.05*M*kk,into);if(c>5)BPD.sparks((u.x+S.x)/2,.8,(u.z+S.z)/2,10)}
if(typeof crashSnd==='function')crashSnd(Math.min(1,c/13));shake&&shake(kk*(.5+.12*M));if(c>6)toast(M>3?'🚔 শক্ত সাঁজোয়া গাড়ি — ধাক্কা সামলান!':'🚔 পুলিশের গাড়িতে ধাক্কা!',1.2)}}
function kick(u,dt){if(u.sp){u.h+=u.sp*dt;u.sp*=Math.pow(.04,dt);if(Math.abs(u.sp)<.03)u.sp=0}if(!u.kx&&!u.kz)return;const nx=u.x+u.kx*dt,nz=u.z+u.kz*dt;if(!blk(u,nx,nz)){u.x=nx;u.z=nz}const d=Math.pow(.12,dt);u.kx*=d;u.kz*=d;if(Math.abs(u.kx)+Math.abs(u.kz)<.05)u.kx=u.kz=0}
function circ(u){const k=u.L*.33,sx=Math.sin(u.h),sz=-Math.cos(u.h);return[[u.x-sx*k,u.z-sz*k],[u.x,u.z],[u.x+sx*k,u.z+sz*k]]}
function obbPen(ax,az,ah,hwa,hla,bx,bz,bh,hwb,hlb){const fa=[Math.sin(ah),-Math.cos(ah)],ra=[-fa[1],fa[0]],fb=[Math.sin(bh),-Math.cos(bh)],rb=[-fb[1],fb[0]],dx=bx-ax,dz=bz-az;let md=1e9,mx=0,mz=0;for(const u of[fa,ra,fb,rb]){const pr=dx*u[0]+dz*u[1],pa=hla*Math.abs(fa[0]*u[0]+fa[1]*u[1])+hwa*Math.abs(ra[0]*u[0]+ra[1]*u[1]),pb=hlb*Math.abs(fb[0]*u[0]+fb[1]*u[1])+hwb*Math.abs(rb[0]*u[0]+rb[1]*u[1]),o=pa+pb-Math.abs(pr);if(o<=0)return null;if(o<md){md=o;const sg=pr>=0?1:-1;mx=u[0]*sg;mz=u[1]*sg}}return[md,mx,mz]}
function sepAll(){const A=W.units.concat(W.rbu),m=.35;for(let it=0;it<2;it++)for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],b=A[j];if(a.rb&&b.rb)continue;if((a.kind==='boat')!==(b.kind==='boat'))continue;if(Math.hypot(a.x-b.x,a.z-b.z)>(a.L+b.L)*.5+2)continue;
const r=obbPen(a.x,a.z,a.h,a.Wd/2+m,a.L/2+m,b.x,b.z,b.h,b.Wd/2+m,b.L/2+m);if(!r)continue;const d=Math.min(r[0],2.5)+.02,sa=b.rb?1:(a.rb?0:.5),sb=a.rb?1:(b.rb?0:.5);
a.x-=r[1]*d*sa;a.z-=r[2]*d*sa;b.x+=r[1]*d*sb;b.z+=r[2]*d*sb;
if(!a.rb&&(Math.sin(a.h)*r[1]-Math.cos(a.h)*r[2])*a.v>0)a.v*=.8;if(!b.rb&&(-Math.sin(b.h)*r[1]+Math.cos(b.h)*r[2])*b.v>0)b.v*=.8}}
/* police hitting normal traffic: the traffic car is pushed the way the police car was moving (a mild slide, not thrown like a player hit) */
function copVeh(dt){if(typeof VEH==='undefined'||typeof V6==='undefined')return;const now=performance.now();for(const u of W.units.concat(W.rbu)){if(u.kind==='boat')continue;const mc=u.Wd*u.L*(1+.3*((MASS[u.kind]||2)-1)),R=u.L*.5+8,ufx=Math.sin(u.h),ufz=-Math.cos(u.h);
for(let vi=0;vi<VEH.length;vi++){const v=VEH[vi];if(!v.placed||!v.init||v.cr)continue;const dx=v.px-u.x,dz=v.pz-u.z;if(dx*dx+dz*dz>R*R)continue;const T=V6.VT[v.type];if(!T)continue;
const vfx=Math.sin(v.hd),vfz=-Math.cos(v.hd),f=-(dx*vfx+dz*vfz),l=-(dx*-vfz+dz*vfx);if(f>0&&f<(T.l+u.L)*.5+2.5+v.v*.8&&Math.abs(l)<(T.w+u.Wd)*.5+.4)v.hold=Math.max(v.hold||0,.35);
const r=obbPen(u.x,u.z,u.h,u.Wd/2+.1,u.L/2+.15,v.px,v.pz,v.hd,T.w/2+.1,T.l/2+.15);if(!r)continue;
const mv=T.w*T.l,sv=u.rb?1:Math.max(.3,Math.min(.9,mc/(mc+mv))),d=Math.min(r[0],2)+.02;v.px+=r[1]*d*sv;v.pz+=r[2]*d*sv;if(!u.rb){u.x-=r[1]*d*(1-sv);u.z-=r[2]*d*(1-sv)}
const cx=ufx*u.v+u.kx-vfx*v.v,cz=ufz*u.v+u.kz-vfz*v.v,c=Math.max(0,cx*r[1]+cz*r[2]);if(c<1.6||(v.chT!==undefined&&now-v.chT<700))continue;v.chT=now;
v.hold=Math.max(v.hold||0,.8);v.v*=.3;
if(c>4.5){const heavy=mv>12;v.cr={vx:r[1]*c*.55+ufx*u.v*.25,vz:r[2]*c*.55+ufz*u.v*.25,vy:Math.min(2.6,.4+c*.1),sp:(Math.random()<.5?-1:1)*(.4+c*.05),rl:heavy?0:(Math.random()<.5?-1:1)*(.3+c*.03),t:0}}
if(!u.rb){u.v*=1-.25*Math.min(1,c/12);u.kx-=r[1]*c*.1*(1-sv);u.kz-=r[2]*c*.1*(1-sv)}
const pd=dist(v.px,v.pz,S.x,S.z);if(pd<45&&typeof crashSnd==='function')crashSnd(Math.min(.8,c/12)*(1-pd/45))}}}
/* ---------- রোডব্লক ও স্পাইক ---------- */
function rbClear(){for(const u of W.rbu)kill(u.g);for(const q of W.rbs)kill(q.g);W.rbu=[];W.rbs=[];W.rbp=null}
function roadblock(){const k=W.stars>=5?['f','g','h']:W.stars>=4?['d','d','e']:['c','c'],sp=spawnPt(120,210,false,true);if(!sp||!sp.w)return false;
const nx=-sp.dz,nz=sp.dx,c=k.length,gap=Math.min(5.2,(sp.w+3)/c);let made=0;
for(let i=0;i<c;i++){const o=(i-(c-1)/2)*gap,x=sp.x+nx*o,z=sp.z+nz*o;if(blocked(x,z))continue;const m=mkUnit(k[i]),h=Math.atan2(-sp.dz,-sp.dx)+(i-(c-1)/2)*.12;
const u={kind:k[i],g:m.g,L:m.L,Wd:m.Wd,x,z,h,v:0,stuck:0,dis:0,pref:1,hc:0,spin:0,top:0,kx:0,kz:0,rb:1};m.g.position.set(x,0,z);m.g.rotation.y=-h;W.rbu.push(u);made++}
if(!made)return false;const sgn=((S.x-sp.x)*sp.dx+(S.z-sp.z)*sp.dz)>=0?1:-1;W.rbp={x:sp.x,z:sp.z,dx:sp.dx,dz:sp.dz,sgn};
if(W.stars>=4){const sx=sp.x+sp.dx*sgn*7,sz=sp.z+sp.dz*sgn*7,g=new THREE.Group(),w=sp.w+2,n=Math.floor(w/.6);const bs=new THREE.Mesh(geo(w,.05,1.1),mat(0x202225));bs.position.y=.03;g.add(bs);
if(!WG.sk)WG.sk=new THREE.ConeGeometry(.09,.34,4);for(let i=0;i<n;i++)for(const zz of[-.3,.3]){const t=new THREE.Mesh(WG.sk,mat(0xc8ccd0));t.position.set((i-(n-1)/2)*.6,.2,zz);g.add(t)}
g.position.set(sx,0,sz);g.rotation.y=Math.atan2(-nz,nx);g.userData.own=1;sc.add(g);W.rbs.push({g,x:sx,z:sz,dx:sp.dx,dz:sp.dz,nx,nz,w,hit:0})}
toast(W.stars>=4?'🚧 সামনে পুলিশের রোডব্লক — রাস্তায় স্পাইক আছে!':'🚧 সামনে পুলিশের রোডব্লক!',3);return true}
function rbTick(dt){if(W.rbp){const p=W.rbp,d=dist(p.x,p.z,S.x,S.z),side=((S.x-p.x)*p.dx+(S.z-p.z)*p.dz)*p.sgn;if(d>400||side<-70||(W.stars===0&&d>45))rbClear()}
for(const q of W.rbs){if(q.hit)continue;const ex=S.x-q.x,ez=S.z-q.z,a=ex*q.dx+ez*q.dz,b=ex*q.nx+ez*q.nz;if(Math.abs(a)<1.8&&Math.abs(b)<q.w/2+1){q.hit=1;W.flat=7;toast('🛞 স্পাইকে টায়ার ফেটে গেছে! গতি কমে গেছে',3);if(window.BPD){BPD.sparks(S.x,.3,S.z,18);BPD.hurt(.1)}shake&&shake(.5)}}
if(W.flat>0){W.flat-=dt;const cap=TOP()*.38;if(Math.abs(S.vf)>cap)S.vf=Math.sign(S.vf)*cap}}
/* ---------- ধাক্কার লেখা (ঠাস-এর বদলে) ---------- */
const HT={},HTX={ped:['সুইদ্দে','অবদ্দা','#e11d48'],veh:['সর','সুদানিরফুয়া','#f97316'],obj:['ভরি','দিইয়্যে','#16a34a']};
function hitTex(k){if(HT[k])return HT[k];const d=HTX[k],c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.translate(128,128);x.rotate(-.12);
x.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?78:122;x[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.fillStyle=d[2];x.strokeStyle='#fff';x.lineWidth=9;x.lineJoin='round';x.stroke();x.fill();
x.beginPath();for(let i=0;i<24;i++){const a=i*Math.PI/12,r=i%2?62:104;x[i?'lineTo':'moveTo'](Math.cos(a)*r,Math.sin(a)*r)}x.closePath();x.strokeStyle='rgba(255,255,255,.35)';x.lineWidth=3;x.stroke();
x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.strokeStyle='#1a1a1a';x.fillStyle='#fff';
d.slice(0,2).forEach((t,i)=>{let fs=46;x.font='800 '+fs+'px '+NF;while(x.measureText(t).width>176&&fs>22){fs-=2;x.font='800 '+fs+'px '+NF}x.lineWidth=9;x.strokeText(t,0,(i?30:-30));x.fillText(t,0,(i?30:-30))});
return HT[k]=new THREE.CanvasTexture(c)}
const hk=k=>k==='ped'?'ped':k==='veh'?'veh':'obj';
window.BPHT=function(){return hitTex(hk((performance.now()-(window.BPHK_t||0)<160)?window.BPHK:'prop'))};
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(()=>{for(const k in HT)delete HT[k];for(const k in TXC)delete TXC[k]});
/* ---------- তাপ ও তারা ---------- */
function pedStar(n){let k=0;for(let i=1;i<=5;i++)if(n>=TP[i])k=i;return k}
function starsOf(){return Math.min(5,pedStar(W.ped)+Math.floor(W.cop/5))}
function setStars(n){const o=W.stars;if(n===o)return;W.stars=n;if(n>o){toast(MSG[n],3.8);W.spT=0;if(o===0){W.nx=rnd(5.5,8);W.arr=W.nx}else W.nx=Math.min(W.nx,rnd(4,6))}else if(n===0){toast('🕶️ পুলিশ আপনাকে হারিয়ে ফেলেছে — ওয়ান্টেড শেষ!',3.4)}else toast('⭐ ওয়ান্টেড কমে '+bn(n)+'★ — '+LV[n],2.6)}
function addHeat(k){if(k==='ped')W.ped++;else if(k==='cop')W.cop++;else return;W.cc=0;W.dec=0;setStars(starsOf())}
function dropStar(){const n=starsOf();if(n<=0){W.ped=W.cop=0;return}if(W.cop>=5)W.cop-=5;else{const p=pedStar(W.ped);W.ped=p>1?TP[p-1]:0}setStars(starsOf());if(W.stars===0)W.ped=W.cop=0}
/* ---------- গোপন গ্যারেজ ---------- */
function label(txt){const c=document.createElement('canvas');c.width=256;c.height=64;const x=c.getContext('2d');x.fillStyle='rgba(76,29,149,.92)';x.beginPath();x.roundRect?x.roundRect(2,4,252,56,14):x.rect(2,4,252,56);x.fill();x.fillStyle='#fff';x.font='800 28px "Hind Siliguri","Noto Sans Bengali",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(txt,128,34);
const m=new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),transparent:true,depthWrite:false}),s=new THREE.Sprite(m);s.scale.set(9,2.25,1);s.userData.own=1;return s}
function placeGar(){const P=BPJ_T.pts()||[];if(!P.length)return;W.gar=[];const want=KM?4:9;let tries=0;while(W.gar.length<want&&tries++<600){const p=P[Math.floor(Math.random()*P.length)];if(dist(p[0],p[1],S.x,S.z)<150)continue;if(W.gar.some(q=>dist(q.x,q.z,p[0],p[1])<(KM?520:800)))continue;
const off=p[5]/2+5,x=p[0]-p[3]*off,z=p[1]+p[2]*off;if(blocked(x,z))continue;const g=new THREE.Group(),bm=new THREE.Mesh(new THREE.CylinderGeometry(2.4,2.4,60,14,1,true),new THREE.MeshBasicMaterial({color:0xa855f7,transparent:true,opacity:.26,depthWrite:false,side:THREE.DoubleSide,fog:false,blending:THREE.AdditiveBlending}));bm.position.y=30;g.add(bm);
const sh=new THREE.Mesh(geo(7,3.2,5),mat(0x4c1d95));sh.position.y=1.6;g.add(sh);const dr=new THREE.Mesh(geo(4,2.4,.15),mat(0x1a1033));dr.position.set(0,1.25,2.55);g.add(dr);const lb=label('গোপন গ্যারেজ');lb.position.y=6;g.add(lb);g.position.set(x,0,z);g.rotation.y=Math.atan2(S.x-x,S.z-z);g.userData.own=1;sc.add(g);W.gar.push({x,z,g})}}
function garTick(dt){W.gcd-=dt;W.gmsg-=dt;if(!W.gar){if(G.started)placeGar();return}
const dmg=window.BPD?BPD.v:0;for(const q of W.gar){const d=dist(q.x,q.z,S.x,S.z);q.g.visible=d<650||W.stars>0;
if(d<15&&Math.abs(S.vf)<7&&(W.stars>0||dmg>=10)){if(W.gcd>0){if(W.gmsg<=0){W.gmsg=4;toast('🔒 গ্যারেজ এখন বন্ধ — '+bn(Math.ceil(W.gcd))+' সেকেন্ড পরে আসুন',2)}continue}
if(W.stars>0&&nearest()<28){if(W.gmsg<=0){W.gmsg=3;toast('🚔 পুলিশ খুব কাছে — গ্যারেজে ঢোকা যাচ্ছে না! আগে ওদের ঝেড়ে ফেলুন',2.6)}continue}
const fee=Math.min(Math.max(0,G.cash),500+W.stars*1500+Math.round(dmg*25));G.cash-=fee;const wasW=W.stars;W.ped=W.cop=W.dec=0;W.cc=99;setStars(0);clearAll();if(window.BPD)BPD.repair();W.gcd=75;
toast('🔧 গোপন গ্যারেজ: মেরামত হয়ে গেল'+(wasW?', পুলিশ আপনাকে হারিয়ে ফেলেছে':'')+' — ফি '+money(fee),3.6)}}}
/* ---------- সাইরেন ---------- */
let ctx=null,osc=null,gn=null;
function siren(near){if(near<=0){if(!ctx||!W.sOn)return;W.sOn=0}else W.sOn=1;try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ctx=new C();osc=ctx.createOscillator();osc.type='sawtooth';gn=ctx.createGain();gn.gain.value=0;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1700;osc.connect(lp);lp.connect(gn);gn.connect(ctx.destination);osc.start()}
if(ctx.state==='suspended')ctx.resume();const t=ctx.currentTime,f=820+300*Math.sin(t*5.2);osc.frequency.setTargetAtTime(f,t,.03);gn.gain.setTargetAtTime(near>0?Math.min(.045,.045*near):0,t,.12)}catch(e){}}
/* ---------- HUD ---------- */
let pill=null,lastTxt='';
function mkPill(){pill=document.createElement('div');pill.id='wn';pill.className='p';pill.style.cssText='right:8px;top:calc(var(--st) + 166px);font-size:13px;display:none;z-index:12;max-width:62vw;text-align:right';document.body.appendChild(pill)}
function hudTick(){if(!pill)mkPill();if(!G.started||G.over||W.stars<=0){pill.style.display='none';lastTxt='';return}
let t='🚨 '+'★'.repeat(W.stars)+'☆'.repeat(5-W.stars);if(W.bust>.2)t+=' · ⛓️ ধরা পড়ছেন '+bn(Math.min(100,Math.round(W.bust/(BT[W.stars]||4)*100)))+'%';else if(W.cc>10&&nearest()>75)t+=' · 🕶️ লুকিয়ে আছেন…';else t+=' · '+LV[W.stars];
if(t!==lastTxt){lastTxt=t;pill.textContent=t;pill.style.color=W.stars>=4?'#ff6b6b':'#ffd166'}pill.style.display='block'}
function mini(){const dmg=window.BPD?BPD.v:0;if(W.stars<=0&&dmg<20)return;if(!W.gar)return;const c=MC,ca=Math.cos(-S.h),sa=Math.sin(-S.h);c.save();c.translate(150,150);
const P=(x,z)=>{const X=(x-S.x)*K,Y=(z-S.z)*K;let px=X*ca-Y*sa,py=X*sa+Y*ca;const r=Math.hypot(px,py),lim=132;if(r>lim){px*=lim/r;py*=lim/r}return[px,py]};
for(const q of W.gar){const p=P(q.x,q.z);c.fillStyle='#a855f7';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.rect(p[0]-7,p[1]-7,14,14);c.fill();c.stroke();c.fillStyle='#fff';c.font='700 10px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('G',p[0],p[1]+.5)}
if(W.stars>0){const f=Math.floor(performance.now()/220)%2;for(const u of W.units){const p=P(u.x,u.z);c.fillStyle=f?'#ff3b3b':'#3b6bff';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(p[0],p[1],5,0,7);c.fill();c.stroke()}if(W.heli){const p=P(W.heli.x,W.heli.z);c.fillStyle='#ffd60a';c.strokeStyle='#000';c.lineWidth=2;c.beginPath();c.arc(p[0],p[1],6,0,7);c.fill();c.stroke()}}
c.restore()}
/* ---------- মূল টিক ---------- */
/* ---------- ধরা পড়ার সিনেমাটিক (NFS/GTA ধাঁচ) ---------- */
let BZ=null;
const ez=t=>t<=0?0:t>=1?1:1-Math.pow(1-t,3),ezio=t=>t<=0?0:t>=1?1:t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
function bzCss(){if(document.getElementById('bpbcss'))return;const s=document.createElement('style');s.id='bpbcss';s.textContent=
'body.bpb .p,body.bpb #mm,body.bpb #gg,body.bpb .b,body.bpb #ts{opacity:0!important;pointer-events:none!important;transition:opacity .35s}'
+'body.bpb #g{filter:saturate(.7) contrast(1.1);transition:filter .8s}'
+'#bpb{position:fixed;inset:0;z-index:55;pointer-events:none;overflow:hidden;font-family:"Hind Siliguri",sans-serif;color:#fff}'
+'#bpb>div{position:absolute}'
+'#bpb .bv{inset:0;background:radial-gradient(ellipse at center,rgba(0,0,0,0) 42%,rgba(0,0,0,.78) 100%);opacity:0;transition:opacity .7s}'
+'#bpb .bl{top:0;bottom:0;width:62%;mix-blend-mode:screen;opacity:0;transition:opacity .08s}'
+'#bpb .br{left:-12%;background:radial-gradient(ellipse at 15% 50%,rgba(255,30,50,.75),rgba(255,30,50,0) 62%)}'
+'#bpb .bu{right:-12%;background:radial-gradient(ellipse at 85% 50%,rgba(40,100,255,.75),rgba(40,100,255,0) 62%)}'
+'#bpb .bt,#bpb .bb{left:0;right:0;height:0;background:#000;overflow:hidden;display:flex;align-items:center;justify-content:center;transition:height .75s cubic-bezier(.2,.8,.2,1)}'
+'#bpb .bt{top:0}#bpb .bb{bottom:0}#bpb.on .bt,#bpb.on .bb{height:11vh}'
+'#bpb .bt span,#bpb .bb span{font-weight:700;font-size:clamp(11px,2.8vw,16px);letter-spacing:.2em;color:#e8ecff;opacity:0;transition:opacity .6s .2s;padding:0 12px;text-align:center}'
+'#bpb.in .bt span,#bpb.in .bb span{opacity:.92}'
+'#bpb .bm{left:0;right:0;top:50%;transform:translateY(-54%);text-align:center}'
+'#bpb .bh{font-weight:700;font-size:min(13vw,22vh);line-height:1.05;letter-spacing:.01em;opacity:0;text-shadow:-3px 0 #ff2a3a,3px 0 #2a6bff,0 6px 30px #000}'
+'#bpb.in .bh{animation:bpbSlam .45s cubic-bezier(.2,1.2,.3,1) forwards,bpbGl 1.3s ease-in-out .45s infinite}'
+'#bpb .bln{height:3px;width:0;margin:8px auto 12px;background:linear-gradient(90deg,#ff2a3a,#2a6bff);box-shadow:0 0 14px #ff2a3a88,0 0 14px #2a6bff88;transition:width .7s cubic-bezier(.2,.8,.2,1)}'
+'#bpb.in .bln{width:min(70vw,520px)}'
+'#bpb .bs{font-size:clamp(20px,5vw,28px);letter-spacing:.3em;text-indent:.3em;min-height:1.3em}'
+'#bpb .bs i{font-style:normal;color:#ffffff30;display:inline-block;opacity:0;transform:scale(.4);transition:opacity .3s,transform .35s cubic-bezier(.2,1.6,.4,1)}'
+'#bpb.in .bs i{opacity:1;transform:none}#bpb .bs i.f{color:#ffd60a;text-shadow:0 0 14px #ffb300}'
+'#bpb .bf2{margin-top:6px;opacity:0;transform:translateY(8px);transition:opacity .45s,transform .45s}'
+'#bpb.fn .bf2{opacity:1;transform:none}'
+'#bpb .bf2 small{display:block;font-size:clamp(11px,2.8vw,14px);letter-spacing:.25em;color:#cbd5e1;font-weight:500}'
+'#bpb .bf2 b{font-weight:700;font-size:clamp(26px,7vw,40px);color:#ffd60a;text-shadow:0 2px 14px #000}'
+'#bpb .bw{inset:0;background:#fff;opacity:0}#bpb .bk2{inset:0;background:#000;opacity:0}'
+'@keyframes bpbSlam{0%{opacity:0;transform:scale(2.2)}60%{opacity:1;transform:scale(.95)}100%{opacity:1;transform:scale(1)}}'
+'@keyframes bpbGl{0%,100%{text-shadow:-3px 0 #ff2a3a,3px 0 #2a6bff,0 6px 30px #000}50%{text-shadow:3px 0 #ff2a3a,-3px 0 #2a6bff,0 6px 30px #000}}';
document.head.appendChild(s)}
function bzBoom(){try{if(typeof au==='function')au();if(typeof AC==='undefined'||!AC)return;const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(36,t+.55);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.7,t+.02);g.gain.exponentialRampToValueAtTime(.0001,t+.7);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+.75);
for(const d of[.14,.24]){const o2=AC.createOscillator(),g2=AC.createGain();o2.type='square';o2.frequency.setValueAtTime(1800,t+d);o2.frequency.exponentialRampToValueAtTime(700,t+d+.04);g2.gain.setValueAtTime(.12,t+d);g2.gain.exponentialRampToValueAtTime(.0001,t+d+.06);o2.connect(g2);g2.connect(AC.destination);o2.start(t+d);o2.stop(t+d+.08)}}catch(e){}}
function bzFl(u,f){const d=u.g.userData;if(d.lm){d.lm.color.setHex(f?0xff2020:0x300000);d.bm.color.setHex(f?0x101040:0x2a50ff)}}
function startBust(fine,w,stars){
if(BZ)return;bzCss();G.over=1;S.vf=0;W.bust=0;
const el=document.createElement('div');el.id='bpb';
let st='';for(let i=1;i<=5;i++)st+='<i class="'+(i<=stars?'f':'')+'" style="transition-delay:'+(.5+.09*i)+'s">★</i>';
el.innerHTML='<div class="bv"></div><div class="bl br"></div><div class="bl bu"></div><div class="bt"><span>🚨 '+nm()+'</span></div><div class="bb"><span>'+w+'</span></div>'
+'<div class="bm"><div class="bh">ধরা পড়লেন</div><div class="bln"></div><div class="bs">'+st+'</div><div class="bf2"><small>জরিমানা</small><b>'+money(0)+'</b></div></div><div class="bw"></div><div class="bk2"></div>';
document.body.appendChild(el);document.body.classList.add('bpb');
const ey=(typeof ELV!=='undefined'&&ELV&&ELV.y)||0,cx=cam.position.x-S.x,cz=cam.position.z-S.z;
const gu=W.units.filter(u=>u.kind!=='boat'&&dist(u.x,u.z,S.x,S.z)<160);
gu.sort((a,b)=>Math.atan2(a.z-S.z,a.x-S.x)-Math.atan2(b.z-S.z,b.x-S.x));
const n=gu.length,R=Math.max(7.6,n*6.6/6.283),a0=n?Math.atan2(gu[0].z-S.z,gu[0].x-S.x):0,ents=[];
gu.forEach((u,i)=>{u.dis=0;u.spin=0;u.kx=u.kz=0;u.v=0;const an=a0+i*6.283/n;let tx=u.x,tz=u.z;
for(const k of[1,.82,.66]){const x=S.x+Math.cos(an)*R*k,z=S.z+Math.sin(an)*R*k;if(!(typeof hit==='function'&&hit(x,z))){tx=x;tz=z;break}}
ents.push({u,x0:u.x,z0:u.z,h0:u.h,tx,tz,th:Math.atan2(S.x-tx,-(S.z-tz))+(i%2?.22:-.22)})});
BZ={t:0,el,q:s=>el.querySelector(s),ents,ey,cy:cam.position.y,a0:Math.atan2(cz,cx),r0:Math.hypot(cx,cz)||12,fov0:cam.fov,fine,w,done:0,on:0,ti:0,fn:0};
try{shake(1.1);if(typeof crashSnd==='function')crashSnd(1);sfxPlay(['pakad'],2)}catch(e){}
}
function bzEnd(){const z=BZ;if(!z)return;BZ=null;try{z.el.remove()}catch(e){}document.body.classList.remove('bpb')}
function bzFinish(){const z=BZ;if(!z||z.done)return;z.done=1;W.bust=0;W.stars=0;W.ped=W.cop=W.dec=0;
try{endTrip('পুলিশের হাতে ধরা পড়লেন — '+z.w)}catch(e){console.error(e)}
const k=z.q('.bk2');if(k){k.style.transition='opacity .7s';setTimeout(()=>{k.style.opacity=0},80)}setTimeout(bzEnd,900)}
window.BPBUSTCAM=function(dt){const z=BZ;if(!z||z.done)return;
if(!G.started){bzEnd();return}
z.t+=dt;const t=z.t,f=Math.floor(performance.now()/170)%2;
if(!z.on){z.on=1;void z.el.offsetWidth;z.el.classList.add('on')}
/* কামেরা: বর্তমান অবস্থান থেকে মসৃণভাবে গাড়ির চারপাশে ঘুরে */
const e=ezio(t/1.1),pe=Math.max(0,t-1.1);let r=z.r0+((10.8-.45*pe)-z.r0)*e;const ang=z.a0+t*.34,cy=z.cy+((2.7-.22*pe+z.ey)-z.cy)*e;
let px=S.x+Math.cos(ang)*r,pz=S.z+Math.sin(ang)*r;
for(let k=0;k<4&&typeof hit==='function'&&hit(px,pz);k++){r*=.8;px=S.x+Math.cos(ang)*r;pz=S.z+Math.sin(ang)*r}
cam.position.set(px,cy,pz);cam.lookAt(S.x,z.ey+1,S.z);cam.fov=z.fov0+(38-z.fov0)*e-3*Math.min(1,pe/3);
/* পুলিশ গাড়ি ঘিরে ফেলে */
const ce=ez(t/1.25);
for(const o of z.ents){const u=o.u;u.x=o.x0+(o.tx-o.x0)*ce;u.z=o.z0+(o.tz-o.z0)*ce;let dh=o.th-o.h0;dh=Math.atan2(Math.sin(dh),Math.cos(dh));u.h=o.h0+dh*ce;u.g.position.set(u.x,0,u.z);u.g.rotation.y=-u.h}
for(const u of W.units)bzFl(u,f);for(const u of W.rbu)bzFl(u,f);
const H=W.heli;if(H){H.t+=dt;const tx=S.x+Math.cos(H.t*.5)*15,tz=S.z+Math.sin(H.t*.5)*15,k=Math.min(1,dt*1.3),qx=H.x,qz=H.z;H.x+=(tx-H.x)*k;H.z+=(tz-H.z)*k;H.y+=(24-H.y)*k;const vx=H.x-qx,vz=H.z-qz;if(vx*vx+vz*vz>1e-6)H.h=Math.atan2(vx,vz);H.g.position.set(H.x,H.y+Math.sin(H.t*2)*.4,H.z);H.g.rotation.y=H.h;H.rot.rotation.y+=dt*38;H.lm.color.setHex(f?0xff2020:0x300000);const dir=new THREE.Vector3(S.x-H.x,-H.g.position.y,S.z-H.z),len=dir.length();H.beam.position.copy(H.g.position);H.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir.normalize());H.beam.scale.set(1,len,1)}
/* পর্দার প্রভাব */
const q=z.q;q('.bw').style.opacity=Math.max(0,.9-t*3.5);if(t>.1)q('.bv').style.opacity=1;
q('.br').style.opacity=t>.3?(f?.8:.12):0;q('.bu').style.opacity=t>.3?(f?.12:.8):0;
if(t>=.85&&!z.ti){z.ti=1;z.el.classList.add('in');bzBoom();try{shake(.6)}catch(x){}}
if(t>=1.4&&!z.fn){z.fn=1;z.el.classList.add('fn')}
if(t>=1.5){const b=q('.bf2 b');if(b)b.textContent=money(z.fine*ez((t-1.5)/1.2))}
if(t>4.35)q('.bk2').style.opacity=Math.min(1,(t-4.35)/.65);
if(t>=5)bzFinish()};
/* camera never ends up inside a police/traffic car: it rises over the roof (GTA/NFS style) */
window.BPCAMY=0;
window.BPCAMCLR=function(dt){if(BZ&&!BZ.done){window.BPCAMY=0;return}const px=cam.position.x,pz=cam.position.z,py=(typeof ELV!=='undefined'?ELV.y:0)+(typeof PV!=='undefined'?PV.ch*.6:1.9)+Math.abs(S.vf)*.01;let need=-1e9;
const t=(x,z,h,L,Wd,hd)=>{const dx=px-x,dz=pz-z;if(dx*dx+dz*dz>144)return;const fx=Math.sin(hd),fz=-Math.cos(hd),lf=dx*fx+dz*fz,lr=-dx*fz+dz*fx;if(Math.abs(lf)<L/2+1.2&&Math.abs(lr)<Wd/2+1.2)need=Math.max(need,h+1.1-py)};
for(const u of W.units)if(u.kind!=='boat')t(u.x,u.z,(DIM[u.kind]||[0,0,2.4])[2],u.L,u.Wd,u.h);
if(typeof VEH!=='undefined'&&typeof V6!=='undefined')for(const v of VEH){if(!v.placed||!v.init)continue;const T=V6.VT[v.type];if(T)t(v.px,v.pz,T.l>7?3.3:T.l>4.6?2:1.8,T.l,T.w,v.hd)}
const goal=need>-1e8?Math.max(0,Math.min(4.5,need)):0;window.BPCAMY+=(goal-window.BPCAMY)*Math.min(1,(goal>window.BPCAMY?16:1.6)*dt)};
/* police shout "পাকড়াও" now and then while chasing, with an on-screen call-out */
let shT=8,shEl=null;
const SHCSS='#bpsh{position:fixed;left:50%;top:14%;transform:translate(-50%,-16px) scale(.96);z-index:30;pointer-events:none;opacity:0;transition:opacity .2s,transform .28s cubic-bezier(.2,1.4,.4,1);display:flex;align-items:center;gap:11px;padding:8px 18px 10px 9px;border-radius:14px;background:linear-gradient(90deg,rgba(10,16,42,.9),rgba(26,10,12,.9));border:1px solid rgba(255,255,255,.14);box-shadow:0 10px 30px rgba(0,0,0,.5);font-family:"Hind Siliguri",sans-serif;color:#fff;overflow:hidden}#bpsh.on{opacity:1;transform:translate(-50%,0) scale(1);animation:bpshGl .36s steps(2) infinite}#bpsh i{width:40px;height:40px;border-radius:11px;display:grid;place-items:center;font-style:normal;font-size:21px;background:linear-gradient(135deg,#d6252b 0 50%,#2a6bff 50% 100%)}#bpsh small{display:block;font-size:11px;letter-spacing:.14em;color:#9fb4ff;font-weight:600}#bpsh b{font-size:20px;font-weight:700;letter-spacing:.02em}#bpsh:after{content:"";position:absolute;left:0;bottom:0;height:3px;width:100%;background:linear-gradient(90deg,#ff2a3a,#2a6bff);transform-origin:left;animation:bpshBar 2.4s linear forwards}@keyframes bpshBar{from{transform:scaleX(1)}to{transform:scaleX(0)}}@keyframes bpshGl{0%{box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 0 2px rgba(255,42,58,.55)}100%{box-shadow:0 10px 30px rgba(0,0,0,.5),0 0 0 2px rgba(42,107,255,.55)}}body.bpb #bpsh{display:none}';
const shSeen=new Set();let shLast=0,shPend=0,shNew=0;
function shout(dt){if(W.stars<=0){shSeen.clear();shLast=0;shPend=0;shT=0;return}shT-=dt;
if(W.stars>shLast){shPend=1;shNew=0}shLast=W.stars;
for(const u of W.units){if(!shSeen.has(u.kind)&&dist(u.x,u.z,S.x,S.z)<160){shSeen.add(u.kind);shPend=1;shNew=1}}
if(W.heli&&!shSeen.has('heli')){shSeen.add('heli');shPend=1;shNew=1}
if(!shPend||shT>0)return;shPend=0;shT=3;
try{sfxPlay(['pakad'],1)}catch(e){}
if(!shEl){const st=document.createElement('style');st.textContent=SHCSS;document.head.appendChild(st);shEl=document.createElement('div');shEl.id='bpsh';document.body.appendChild(shEl)}
const L=shNew?['বড় স্যার এসে গেছেন! পাকড়াও ওকে!','নতুন ফোর্স চলে এসেছে — ঘিরে ফেলো!']:['পাকড়াও ওকে!','ধরো! পালাতে দিয়ো না!','থামাও গাড়িটা!','ঘিরে ফেলো ওকে!'];shEl.innerHTML='<i>🚓</i><div><small>পুলিশ রেডিও · '+nm()+'</small><b>“'+L[Math.floor(Math.random()*L.length)]+'”</b></div>';
shEl.classList.remove('on');void shEl.offsetWidth;shEl.classList.add('on');clearTimeout(shEl._t);shEl._t=setTimeout(()=>shEl.classList.remove('on'),2400)}
const BT=[0,16,16,15,14,14];
function bustCheck(dt){if(W.stars<=0){W.bust=0;return}let n=0;for(const u of W.units)if(u.kind!=='boat'&&u.dis<=0&&dist(u.x,u.z,S.x,S.z)<8.5)n++;
const nd=W.stars>=3?2:1,v=Math.abs(S.vf),T=BT[W.stars]||4;
if(n>=nd&&v<2)W.bust+=dt*Math.min(1.4,1+.1*(n-nd));else if(n>=nd&&v<4){}else W.bust=Math.max(0,W.bust-dt*(v>6?3:1.5));
if(W.bust>=T&&!BZ){const fine=100000*W.stars,w=LV[W.stars],stars=W.stars;G.loss+=fine;W.bust=0;
try{startBust(G.loss,w,stars)}catch(e){console.error(e);bzEnd();W.stars=0;W.ped=W.cop=W.dec=0;try{endTrip('পুলিশের হাতে ধরা পড়লেন — '+w)}catch(x){console.error(x)}}}}
function tick(dt){if(!G.started||G.over){siren(0);return}if(W.stars>0&&typeof MOB!=='undefined'&&MOB>0)MOB=.001;shout(dt);
W.tk+=dt;garTick(dt);antiStuck(dt);const kmh=Math.abs(S.vf)*3.6;
if(kmh>110){W.sp+=dt;if(W.sp>6){W.sp=-14;addHeat('speed');if(W.stars>0)toast('📸 অতিরিক্ত গতি — পুলিশ নজর রাখছে',2)}}else if(W.sp>0&&kmh<95)W.sp=Math.max(0,W.sp-dt);
W.cc+=dt;
if((W.ped||W.cop)&&W.cc>10){const nr=nearest(),rate=nr<75?.6:(nr>130?8:3.5);W.dec+=rate*dt;if(W.dec>=60){W.dec=0;dropStar()}}
const tg=need(W.stars);W.spT-=dt;
if(W.stars>0){W.nx-=dt;W.arr=Math.max(0,(W.arr||0)-dt);if(!W.arr&&nearestGround()>110)W.nx=Math.min(W.nx,1.2);if(tg.heli&&!W.heli)spawn('heli');
if(W.nx<=0){let k=null;for(const q of UK)if(q!=='boat'&&W.units.filter(u=>u.kind===q).length<tg[q]){k=q;break}
if(!k)W.nx=2;else{W.nx=SPI[W.stars];W.alt=!W.alt;if(!(W.stars>=3&&W.alt&&!W.rbu.length&&roadblock()))spawn(k,Math.random()<.5)}}}
if(W.spT<=0){W.spT=1.1;if(tg.boat&&W.units.filter(u=>u.kind==='boat').length<tg.boat)spawn('boat');
if(W.stars===0&&W.units.length){for(const u of W.units.slice())if(dist(u.x,u.z,S.x,S.z)>45)remove(u)}
for(const k of UK){const l=W.units.filter(u=>u.kind===k);if(l.length>tg[k]){l.sort((a,b)=>dist(b.x,b.z,S.x,S.z)-dist(a.x,a.z,S.x,S.z));if(dist(l[0].x,l[0].z,S.x,S.z)>70)remove(l[0])}}
if(!tg.heli&&W.heli){kill(W.heli.g);kill(W.heli.beam);W.heli=null}}
const f=Math.floor(performance.now()/170)%2;
const fl=u=>{const d=u.g.userData;if(d.lm){d.lm.color.setHex(f?0xff2020:0x300000);d.bm.color.setHex(f?0x101040:0x2a50ff)}};
for(const u of W.units){if(W.stars>0||u.dis>0)moveUnit(u,dt);else{u.v*=.9}kick(u,dt);contact(u,dt);fl(u)}
for(const u of W.rbu){kick(u,dt);contact(u,dt);u.g.position.set(u.x,0,u.z);u.g.rotation.y=-u.h;fl(u)}
sepAll();copVeh(dt);rbTick(dt);
const H=W.heli;if(H){H.t+=dt;H.cd-=dt;let ty=28,k=Math.min(1,dt*1.1),tx,tz;const sx=Math.sin(S.h),sz=-Math.cos(S.h);
if(H.mode==='o'&&H.cd<=0&&!G.over){H.mode='d';H.dt=0;H.hit=0;toast('🚁 হেলিকপ্টার ঝাঁপ দিচ্ছে — সরুন!',2.2)}
if(H.mode==='d'){H.dt+=dt;ty=3.4;k=Math.min(1,dt*2.4);tx=S.x+sx*S.vf*.45;tz=S.z+sz*S.vf*.45;
if(!H.hit&&H.y<8&&dist(H.x,H.z,S.x,S.z)<5){H.hit=1;if(window.BPD){BPD.hurt(.3,true);BPD.sparks(S.x,1.5,S.z,16)}S.vf*=.55;shake&&shake(1);toast('🚁 হেলিকপ্টার ধাক্কা দিল!',2.4);H.mode='c';H.cd=rnd(8,12)*(W.stars>=5?.7:1)}
else if(H.dt>3.8){H.mode='c';H.cd=rnd(8,12)*(W.stars>=5?.7:1)}}
else{ty=28;tx=S.x+Math.cos(H.t*.45)*16+sx*Math.abs(S.vf)*.8;tz=S.z+Math.sin(H.t*.45)*16+sz*Math.abs(S.vf)*.8;if(H.mode==='c'&&H.y>23)H.mode='o'}
const px=H.x,pz=H.z;H.x+=(tx-H.x)*k;H.z+=(tz-H.z)*k;H.y+=(ty-H.y)*Math.min(1,dt*(H.mode==='d'?1.7:1.2));
const vx=H.x-px,vz=H.z-pz;if(vx*vx+vz*vz>1e-6)H.h=Math.atan2(vx,vz);H.g.position.set(H.x,H.y+Math.sin(H.t*2)*.4,H.z);H.g.rotation.y=H.h;H.g.rotation.x+=((H.mode==='d'?.3:.06)-H.g.rotation.x)*Math.min(1,dt*4);H.rot.rotation.y+=dt*38;H.lm.color.setHex(f?0xff2020:0x300000);
const dir=new THREE.Vector3(S.x-H.x,-H.g.position.y,S.z-H.z),len=dir.length();H.beam.position.copy(H.g.position);H.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir.normalize());H.beam.scale.set(1,len,1)}
bustCheck(dt);const ng=W.stars>0?nearestGround():1e9;siren(ng<100?Math.max(0,1-ng/100):0)}
function cleanup(){clearAll();W.flat=0;W.nx=0;W.arr=0;W.ped=W.cop=W.dec=0;W.stars=0;W.bust=0;siren(0);if(pill)pill.style.display='none'}
function after(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(null,arguments)}catch(e){console.error('BPW',name,e)}return r}}
function before(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){try{fn.apply(null,arguments)}catch(e){console.error('BPW',name,e)}return o.apply(this,arguments)}}
after('crime',function(a,m,k){window.BPHK=k||'prop';window.BPHK_t=performance.now();if(typeof FXL!=='undefined'){const t=hitTex(hk(window.BPHK));for(const f of FXL)if(f.t<.05&&f.s.material.map!==t){f.s.material.map=t;f.s.material.needsUpdate=true}}addHeat(k||'prop')});after('gameTick',tick);after('hud',hudTick);after('drawMini',mini);before('endTrip',cleanup);
window.BPW={W,addHeat,spawn,tick,placeGar,starsOf,need,roadblock};
})();
