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
const W={heat:0,stars:0,cc:99,sp:0,bust:0,units:[],heli:null,gar:null,gcd:0,gmsg:0,spT:0,tk:0,sirenT:0};
const TH=[0,18,55,115,190,280],HMAX=340;
const LV=KM?['','থানা পুলিশের মোটরসাইকেল','কাপ্তাই থানা টহল','জেলা পুলিশ বাহিনী','র‍্যাব ও হেলিকপ্টার','নৌ-পুলিশ, বিজিবি ও হেলিকপ্টার']:['','ট্রাফিক পুলিশ','ডিএমপি টহল','র‍্যাব','সোয়াট ও হেলিকপ্টার','সেনা-পুলিশ যৌথ অভিযান'];
const MSG=KM?['','🚓 কাপ্তাই থানা সতর্ক! এক মোটরসাইকেল আপনার পিছু নিয়েছে','🚔 থানার টহল গাড়ি নামানো হয়েছে! পালান!','🚨 জেলা পুলিশ বাহিনী ঘিরে ফেলছে — রাস্তা বন্ধ হচ্ছে!','🚁 র‍্যাব নেমেছে, আকাশে হেলিকপ্টার! লুকানোর জায়গা খুঁজুন','⚓ নৌ-পুলিশ ও বিজিবি মাঠে! পুরো কাপ্তাই আপনাকে খুঁজছে']:['','🚓 ট্রাফিক পুলিশ আপনাকে দেখে ফেলেছে!','🚔 ডিএমপি টহল গাড়ি পিছু নিয়েছে — পালান!','🚨 র‍্যাব নেমেছে! সব মোড়ে নজরদারি','🚁 সোয়াট ও হেলিকপ্টার! আকাশ থেকে আপনাকে দেখছে','🪖 সেনা-পুলিশ যৌথ অভিযান! পুরো ঢাকা আপনার খোঁজে'];
const need=n=>({bike:n===1?1:0,car:[0,0,2,3,3,4][n],van:[0,0,0,0,1,2][n],heli:n>=4?1:0,boat:KM?[0,0,0,1,1,2][n]:0});
/* ---------- মডেল ---------- */
const GC={},geo=(w,h,l)=>{const k=w+','+h+','+l;return GC[k]||(GC[k]=new THREE.BoxGeometry(w,h,l))},MC2={},mat=c=>MC2[c]||(MC2[c]=new THREE.MeshLambertMaterial({color:c}));
const wheelG=new THREE.CylinderGeometry(.38,.38,.28,12);wheelG.rotateZ(Math.PI/2);
function mkUnit(kind){const g=new THREE.Group();let L,Wd,H,col;
if(kind==='bike'){L=2;Wd=.6;H=.6;col=0xf4f6f8}else if(kind==='van'){L=5.3;Wd=2.15;H=1.65;col=0x1d2a22}else if(kind==='boat'){L=4.6;Wd=1.8;H=.7;col=0xf4f6f8}else{L=4.4;Wd=1.9;H=1.05;col=0xf4f6f8}
const y0=kind==='boat'?.1:.5;const b=new THREE.Mesh(geo(Wd,H,L),mat(col));b.position.y=y0+H/2;g.add(b);
const st=new THREE.Mesh(geo(Wd+.03,.2,L+.03),mat(kind==='van'?0xc62828:0x1e56c8));st.position.y=y0+H*.42;g.add(st);
if(kind!=='bike'&&kind!=='boat'){const cb=new THREE.Mesh(geo(Wd*.86,.55,L*.46),mat(0x14181c));cb.position.set(0,y0+H+.27,-L*.04);g.add(cb);for(const sx of[-1,1])for(const sz of[-1,1]){const w=new THREE.Mesh(wheelG,mat(0x111111));w.position.set(sx*(Wd/2),.38,sz*L*.32);g.add(w)}}
if(kind==='bike'){const r=new THREE.Mesh(geo(.5,.8,.4),mat(0x1b3a6b));r.position.set(0,y0+H+.35,.1);g.add(r);const h=new THREE.Mesh(new THREE.SphereGeometry(.2,8,6),mat(0xeeeeee));h.position.set(0,y0+H+.9,.1);g.add(h)}
const top=y0+H+(kind==='bike'?1.1:(kind==='boat'?.4:.8));
const lm=new THREE.MeshBasicMaterial({color:0xff2020}),bm=new THREE.MeshBasicMaterial({color:0x2040ff});
const l1=new THREE.Mesh(geo(.5,.16,.3),lm),l2=new THREE.Mesh(geo(.5,.16,.3),bm);l1.position.set(-.3,top,0);l2.position.set(.3,top,0);g.add(l1);g.add(l2);
g.userData.lm=lm;g.userData.bm=bm;g.userData.own=1;sc.add(g);return{g,L,Wd,H}}
function mkHeli(){const g=new THREE.Group(),bodyM=mat(0x16233a);const b=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),bodyM);b.scale.set(1.3,1.1,2.3);g.add(b);
const t=new THREE.Mesh(geo(.3,.35,4.2),bodyM);t.position.set(0,.2,-3.6);g.add(t);const tr=new THREE.Mesh(geo(.08,1.4,.2),mat(0x222222));tr.position.set(.2,.4,-5.6);g.add(tr);
const rot=new THREE.Group();rot.position.y=1.25;const r1=new THREE.Mesh(geo(9.2,.06,.35),mat(0x1a1a1a)),r2=new THREE.Mesh(geo(.35,.06,9.2),mat(0x1a1a1a));rot.add(r1);rot.add(r2);g.add(rot);
const bg=new THREE.CylinderGeometry(.18,4.6,1,18,1,true);bg.translate(0,-.5,0);const beam=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0xfff2b0,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,fog:false}));
sc.add(beam);const lm=new THREE.MeshBasicMaterial({color:0xff2020}),l=new THREE.Mesh(geo(.4,.2,.4),lm);l.position.set(0,-1.1,.8);g.add(l);
g.userData.own=1;sc.add(g);return{g,rot,beam,lm,t:0,x:S.x,y:28,z:S.z,h:0}}
function kill(o){if(!o)return;try{sc.remove(o)}catch(e){}o.traverse&&o.traverse(m=>{try{if(m.material&&m.userData&&m.userData.dispose){m.material.dispose()}}catch(e){}})}
/* ---------- জায়গা বাছা ---------- */
function spawnPt(mn,mx,wantWater){const P=BPJ_T.pts()||[];const fx=Math.sin(S.h),fz=-Math.cos(S.h);
if(wantWater){for(let i=0;i<40;i++){const a=rnd(0,6.283),r=rnd(mn,mx),x=S.x+Math.cos(a)*r,z=S.z+Math.sin(a)*r;if(water(x,z))return{x,z,h:rnd(0,6.283)}}return null}
let best=null;for(let i=0;i<50&&P.length;i++){const p=P[Math.floor(Math.random()*P.length)],d=dist(p[0],p[1],S.x,S.z);if(d<mn||d>mx)continue;const dot=((p[0]-S.x)*fx+(p[1]-S.z)*fz)/(d||1);if(dot>.45&&d<mx*.9)continue;best=p;break}
if(!best)return null;let dx=S.x-best[0],dz=S.z-best[1];const dir=(best[2]*dx+best[3]*dz)>=0?1:-1;return{x:best[0],z:best[1],h:Math.atan2(best[2]*dir,-best[3]*dir)}}
/* ---------- ইউনিট ---------- */
function spawn(kind){if(kind==='heli'){if(W.heli)return;W.heli=mkHeli();W.heli.x=S.x+rnd(-60,60);W.heli.z=S.z+rnd(-60,60);return}
const sp=spawnPt(kind==='boat'?110:105,kind==='boat'?260:190,kind==='boat');if(!sp)return;const m=mkUnit(kind);
const u={kind,g:m.g,L:m.L,Wd:m.Wd,x:sp.x,z:sp.z,h:sp.h,v:0,stuck:0,dis:0,pref:Math.random()<.5?1:-1,hc:0,spin:0,top:0};m.g.position.set(u.x,0,u.z);m.g.rotation.y=-u.h;W.units.push(u)}
function remove(u){kill(u.g);const i=W.units.indexOf(u);if(i>=0)W.units.splice(i,1)}
function clearAll(){for(const u of W.units.slice())remove(u);if(W.heli){kill(W.heli.g);kill(W.heli.beam);W.heli=null}}
function nearest(){let b=1e9;for(const u of W.units){const d=dist(u.x,u.z,S.x,S.z);if(d<b)b=d}if(W.heli){const d=dist(W.heli.x,W.heli.z,S.x,S.z);if(d<b)b=d}return b}
const TOP=()=>(typeof PV!=='undefined'&&PV.top)||18;
function moveUnit(u,dt){const T=TOP(),pv=Math.abs(S.vf),fx=Math.sin(S.h),fz=-Math.cos(S.h);let tx=S.x+fx*Math.sign(S.vf||1)*pv*.7,tz=S.z+fz*Math.sign(S.vf||1)*pv*.7;const dp=dist(u.x,u.z,S.x,S.z);
if(u.dis>0){u.dis-=dt;u.v*=Math.pow(.2,dt);u.h+=u.spin*dt;u.spin*=.96;if(u.dis<=0)u.spin=0}
else{let tgt=Math.atan2(tx-u.x,-(tz-u.z)),base=(u.kind==='bike'?.9:u.kind==='van'?.86:.92)+.035*W.stars;if(u.kind==='boat')base=.8;
let sp=T*base;if(dp>220)sp*=1.5;else if(dp<16)sp=Math.max(pv*1.03,4);
const la=Math.max(4,u.v*.7+3);let ok=false;const offs=[0,.5*u.pref,-.5*u.pref,1*u.pref,-1*u.pref,1.6*u.pref,-1.6*u.pref];
for(const o of offs){const a=tgt+o;if(!blk(u,u.x+Math.sin(a)*la,u.z-Math.cos(a)*la)&&!blk(u,u.x+Math.sin(a)*la*.5,u.z-Math.cos(a)*la*.5)){tgt=a;ok=true;break}}
if(!ok){sp=0;tgt=u.h+u.pref*1.2}
let dh=tgt-u.h;dh=Math.atan2(Math.sin(dh),Math.cos(dh));const mt=(2.5)*Math.min(1,.35+u.v/6)*dt;u.h+=Math.max(-mt,Math.min(mt,dh));
u.v+=(sp-u.v)*Math.min(1,(sp>u.v?1.6:3)*dt)}
const nx=u.x+Math.sin(u.h)*u.v*dt,nz=u.z-Math.cos(u.h)*u.v*dt;
if(u.v>.3&&blk(u,nx+Math.sin(u.h)*u.L*.5,nz-Math.cos(u.h)*u.L*.5)){u.v*=.2;u.stuck+=dt;u.pref=-u.pref}else{u.x=nx;u.z=nz;if(u.v>1)u.stuck=Math.max(0,u.stuck-dt)}
if(u.stuck>2.6||dp>330){const sp=spawnPt(u.kind==='boat'?110:105,u.kind==='boat'?260:190,u.kind==='boat');if(sp){u.x=sp.x;u.z=sp.z;u.h=sp.h;u.v=0;u.stuck=0}else u.stuck=0}
u.g.position.set(u.x,u.kind==='boat'?Math.sin(performance.now()*.002+u.x)*.05:0,u.z);u.g.rotation.y=-u.h;u.g.rotation.z=u.dis>0?Math.sin(performance.now()*.02)*.08:0}
function contact(u,dt){if(u.kind==='boat'||G.over)return;const fx=Math.sin(S.h),fz=-Math.cos(S.h),rx=Math.cos(S.h),rz=Math.sin(S.h),dx=u.x-S.x,dz=u.z-S.z,lx=dx*rx+dz*rz,lz=dx*fx+dz*fz;
const hw=((typeof PV!=='undefined'&&PV.hw)||.9)+u.Wd*.5,hl=((typeof PV!=='undefined'&&PV.ol)||2)+u.L*.5;if(Math.abs(lx)<hw&&Math.abs(lz)<hl){
const rel=S.vf-(u.v*(Math.sin(u.h)*fx-Math.cos(u.h)*fz));const push=Math.max(0,hw-Math.abs(lx)),sgx=lx>=0?1:-1;
if(u.hc<=0){u.hc=1.1;if(Math.abs(rel)>7&&lz*Math.sign(S.vf||1)>0&&u.dis<=0){u.dis=5;u.spin=rnd(-3,3);u.v*=.4;G.loss+=120000;W.cc=0;addHeat('cop');toast('💥 পুলিশের গাড়ি উল্টে অচল! ক্ষতি '+money(120000),2.4);if(window.BPD){BPD.sparks(u.x,.8,u.z,14);BPD.puff(u.x,1,u.z,5,0x333333);BPD.hurt(.3)}S.vf*=.75;shake&&shake(.5)}
else if(u.dis<=0){S.vf*=.94;if(window.BPD)BPD.hurt(.22,lz*Math.sign(S.vf||1)<0);toast('🚔 পুলিশ ধাক্কা দিল!',1.4);shake&&shake(.35)}}
u.x+=rx*sgx*push*.6*Math.min(1,dt*8);u.z+=rz*sgx*push*.6*Math.min(1,dt*8)}u.hc-=dt}
/* ---------- তাপ ও তারা ---------- */
function starsOf(h){let n=0;for(let i=1;i<=5;i++)if(h>=TH[i])n=i;return n}
function setStars(n){const o=W.stars;if(n===o)return;W.stars=n;if(n>o){toast(MSG[n],3.8);W.spT=0}else if(n===0){toast('🕶️ পুলিশ আপনাকে হারিয়ে ফেলেছে — ওয়ান্টেড শেষ!',3.4)}else toast('⭐ ওয়ান্টেড কমে '+bn(n)+'★ — '+LV[n],2.6)}
function addHeat(k){const v={ped:34,veh:20,wall:5,prop:4,cart:7,bld:6,cop:16,speed:12}[k];if(!v)return;W.heat=Math.min(HMAX,W.heat+v*(1+W.stars*.06));W.cc=0;setStars(starsOf(W.heat))}
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
const fee=Math.min(Math.max(0,G.cash),500+W.stars*1500+Math.round(dmg*25));G.cash-=fee;const wasW=W.stars;W.heat=0;W.cc=99;setStars(0);clearAll();if(window.BPD)BPD.repair();W.gcd=75;
toast('🔧 গোপন গ্যারেজ: মেরামত হয়ে গেল'+(wasW?', পুলিশ আপনাকে হারিয়ে ফেলেছে':'')+' — ফি '+money(fee),3.6)}}}
/* ---------- সাইরেন ---------- */
let ctx=null,osc=null,gn=null;
function siren(near){try{if(!ctx){const C=window.AudioContext||window.webkitAudioContext;if(!C)return;ctx=new C();osc=ctx.createOscillator();osc.type='sawtooth';gn=ctx.createGain();gn.gain.value=0;const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1700;osc.connect(lp);lp.connect(gn);gn.connect(ctx.destination);osc.start()}
if(ctx.state==='suspended')ctx.resume();const t=ctx.currentTime,f=820+300*Math.sin(t*5.2);osc.frequency.setTargetAtTime(f,t,.03);gn.gain.setTargetAtTime(near>0?Math.min(.045,.045*near):0,t,.12)}catch(e){}}
/* ---------- HUD ---------- */
let pill=null,lastTxt='';
function mkPill(){pill=document.createElement('div');pill.id='wn';pill.className='p';pill.style.cssText='right:8px;top:calc(var(--st) + 166px);font-size:13px;display:none;z-index:12;max-width:62vw;text-align:right';document.body.appendChild(pill)}
function hudTick(){if(!pill)mkPill();if(!G.started||G.over||W.stars<=0){pill.style.display='none';lastTxt='';return}
let t='🚨 '+'★'.repeat(W.stars)+'☆'.repeat(5-W.stars);if(W.bust>.2)t+=' · ⛓️ ধরা পড়ছেন '+bn(Math.min(100,Math.round(W.bust/3.2*100)))+'%';else if(W.cc>10&&nearest()>75)t+=' · 🕶️ লুকিয়ে আছেন…';else t+=' · '+LV[W.stars];
if(t!==lastTxt){lastTxt=t;pill.textContent=t;pill.style.color=W.stars>=4?'#ff6b6b':'#ffd166'}pill.style.display='block'}
function mini(){const dmg=window.BPD?BPD.v:0;if(W.stars<=0&&dmg<20)return;if(!W.gar)return;const c=MC,ca=Math.cos(-S.h),sa=Math.sin(-S.h);c.save();c.translate(150,150);
const P=(x,z)=>{const X=(x-S.x)*K,Y=(z-S.z)*K;let px=X*ca-Y*sa,py=X*sa+Y*ca;const r=Math.hypot(px,py),lim=132;if(r>lim){px*=lim/r;py*=lim/r}return[px,py]};
for(const q of W.gar){const p=P(q.x,q.z);c.fillStyle='#a855f7';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.rect(p[0]-7,p[1]-7,14,14);c.fill();c.stroke();c.fillStyle='#fff';c.font='700 10px sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText('G',p[0],p[1]+.5)}
if(W.stars>0){const f=Math.floor(performance.now()/220)%2;for(const u of W.units){const p=P(u.x,u.z);c.fillStyle=f?'#ff3b3b':'#3b6bff';c.strokeStyle='#fff';c.lineWidth=2;c.beginPath();c.arc(p[0],p[1],5,0,7);c.fill();c.stroke()}if(W.heli){const p=P(W.heli.x,W.heli.z);c.fillStyle='#ffd60a';c.strokeStyle='#000';c.lineWidth=2;c.beginPath();c.arc(p[0],p[1],6,0,7);c.fill();c.stroke()}}
c.restore()}
/* ---------- মূল টিক ---------- */
function bustCheck(dt){if(W.stars<=0){W.bust=0;return}let n=0;for(const u of W.units)if(u.kind!=='boat'&&u.dis<=0&&dist(u.x,u.z,S.x,S.z)<8.5)n++;
if(n>=(W.stars>=3?2:1)&&Math.abs(S.vf)<2.4)W.bust+=dt;else W.bust=Math.max(0,W.bust-dt*1.5);
if(W.bust>=3.2){const fine=150000*W.stars;G.loss+=fine;toast('⛓️ ধরা পড়লেন! জরিমানা '+money(fine),3);W.bust=0;const w=LV[W.stars];W.stars=0;W.heat=0;try{endTrip('পুলিশের হাতে ধরা পড়লেন — '+w)}catch(e){console.error(e)}}}
function tick(dt){if(!G.started||G.over){siren(0);return}
W.tk+=dt;garTick(dt);const kmh=Math.abs(S.vf)*3.6;
if(kmh>110){W.sp+=dt;if(W.sp>6){W.sp=-14;addHeat('speed');if(W.stars>0)toast('📸 অতিরিক্ত গতি — পুলিশ নজর রাখছে',2)}}else if(W.sp>0&&kmh<95)W.sp=Math.max(0,W.sp-dt);
W.cc+=dt;
if(W.heat>0){const nr=nearest();if(W.cc>10){const rate=nr<75?.6:(nr>130?8:3.5);W.heat=Math.max(0,W.heat-rate*dt);setStars(starsOf(W.heat))}}
const tg=need(W.stars);W.spT-=dt;
if(W.spT<=0){W.spT=1.1;for(const k of['heli','bike','car','van','boat']){const have=k==='heli'?(W.heli?1:0):W.units.filter(u=>u.kind===k).length;if(have<tg[k]){spawn(k);break}}
if(W.stars===0&&W.units.length){for(const u of W.units.slice())if(dist(u.x,u.z,S.x,S.z)>45)remove(u)}
for(const k of['bike','car','van','boat']){const l=W.units.filter(u=>u.kind===k);if(l.length>tg[k]){l.sort((a,b)=>dist(b.x,b.z,S.x,S.z)-dist(a.x,a.z,S.x,S.z));remove(l[0])}}
if(!tg.heli&&W.heli){kill(W.heli.g);kill(W.heli.beam);W.heli=null}}
const f=Math.floor(performance.now()/170)%2;
for(const u of W.units){if(W.stars>0||u.dis>0)moveUnit(u,dt);else{u.v*=.9}contact(u,dt);const d=u.g.userData;if(d.lm){d.lm.color.setHex(f?0xff2020:0x300000);d.bm.color.setHex(f?0x101040:0x2a50ff)}}
for(let i=0;i<W.units.length;i++)for(let j=i+1;j<W.units.length;j++){const a=W.units[i],b=W.units[j],dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);if(d<3.3&&d>.01){const k=(3.3-d)*.5/d;a.x-=dx*k;a.z-=dz*k;b.x+=dx*k;b.z+=dz*k}}
const H=W.heli;if(H){H.t+=dt;const ox=Math.cos(H.t*.45)*16,oz=Math.sin(H.t*.45)*16,k=Math.min(1,dt*1.1),tx=S.x+ox+Math.sin(S.h)*Math.abs(S.vf)*.8,tz=S.z+oz-Math.cos(S.h)*Math.abs(S.vf)*.8,px=H.x,pz=H.z;H.x+=(tx-H.x)*k;H.z+=(tz-H.z)*k;
const vx=H.x-px,vz=H.z-pz;if(vx*vx+vz*vz>1e-6)H.h=Math.atan2(vx,vz);H.g.position.set(H.x,H.y+Math.sin(H.t*2)*.6,H.z);H.g.rotation.y=H.h;H.rot.rotation.y+=dt*38;H.lm.color.setHex(f?0xff2020:0x300000);
const dir=new THREE.Vector3(S.x-H.x,-H.g.position.y,S.z-H.z),len=dir.length();H.beam.position.copy(H.g.position);H.beam.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir.normalize());H.beam.scale.set(1,len,1)}
bustCheck(dt);const nr=W.stars>0?nearest():1e9;siren(W.stars>0?Math.max(0,1-nr/260):0)}
function cleanup(){clearAll();W.heat=0;W.stars=0;W.bust=0;siren(0);if(pill)pill.style.display='none'}
function after(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(null,arguments)}catch(e){console.error('BPW',name,e)}return r}}
function before(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){try{fn.apply(null,arguments)}catch(e){console.error('BPW',name,e)}return o.apply(this,arguments)}}
after('crime',function(a,m,k){addHeat(k||'prop')});after('gameTick',tick);after('hud',hudTick);after('drawMini',mini);before('endTrip',cleanup);
window.BPW={W,addHeat,spawn,tick,placeGar,starsOf,need};
})();
