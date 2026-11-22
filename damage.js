/* damage.js — গাড়ির ক্ষতি: চাপা খাওয়া বডি, ফাটা/ভাঙা কাচ, ধোঁয়া-আগুন, স্ফুলিঙ্গ, ইঞ্জিন দুর্বল.
   game1.js বদলানো হয়নি — শুধু crime() ও hud()-এ হুক। অন্য ফাইল: window.BPD */
(function(){
if(window.__BPD||typeof G==='undefined'||typeof S==='undefined'||typeof sc==='undefined'||typeof THREE==='undefined'||typeof bus==='undefined')return;
window.__BPD=1;
const rnd=(a,b)=>a+Math.random()*(b-a);
const U=()=>{const u=bus.userData;return u.bpd||(u.bpd={v:0,gl:null,shat:0,acc:0,c25:0,c50:0,c80:0})};
let rs=0,hcd=0;
/* ---------- কণা (ধোঁয়া, স্ফুলিঙ্গ, কাচের টুকরো) ---------- */
const TX=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,2,32,32,30);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)})();
const mkP=add=>{const m=new THREE.SpriteMaterial({map:TX,transparent:true,depthWrite:false,blending:add?THREE.AdditiveBlending:THREE.NormalBlending}),s=new THREE.Sprite(m);s.visible=false;s.userData.own=1;sc.add(s);return{s,life:0,max:1,vx:0,vy:0,vz:0,g:0,s0:1,s1:1,op:1}};
const PN=[],PA=[];for(let i=0;i<46;i++)PN.push(mkP(0));for(let i=0;i<34;i++)PA.push(mkP(1));
function emit(add,x,y,z,o){const L=add?PA:PN;let p=null;for(const q of L)if(q.life<=0){p=q;break}if(!p)return;p.s.position.set(x,y,z);p.s.material.color.setHex(o.col);p.life=p.max=o.life;p.vx=o.vx||0;p.vy=o.vy||0;p.vz=o.vz||0;p.g=o.g||0;p.s0=o.s0;p.s1=o.s1;p.op=o.op;p.s.scale.set(o.s0,o.s0,1);p.s.material.opacity=o.op;p.s.visible=true}
function parts(dt){for(const L of[PN,PA])for(const p of L){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.s.visible=false;continue}const t=1-p.life/p.max,s=p.s0+(p.s1-p.s0)*t;p.vy-=p.g*dt;const q=p.s.position;q.x+=p.vx*dt;q.y+=p.vy*dt;q.z+=p.vz*dt;if(q.y<.05&&p.g>0){q.y=.05;p.vy=0;p.vx*=.8;p.vz*=.8}p.s.scale.set(s,s,1);p.s.material.opacity=p.op*(1-t*t)}}
function sparks(x,y,z,n){for(let i=0;i<n;i++)emit(1,x,y,z,{col:i%3?0xffa726:0xfff3b0,life:rnd(.25,.6),vx:rnd(-5,5),vy:rnd(1,5),vz:rnd(-5,5),g:14,s0:.28,s1:.05,op:1})}
function puff(x,y,z,n,col){for(let i=0;i<n;i++)emit(0,x+rnd(-.3,.3),y,z+rnd(-.3,.3),{col:col||0xb0b0b0,life:rnd(.9,1.8),vx:rnd(-.6,.6),vy:rnd(1.2,2.6),vz:rnd(-.6,.6),s0:.5,s1:2.1,op:.55})}
function shards(x,y,z,n){for(let i=0;i<n;i++)emit(0,x+rnd(-.5,.5),y+rnd(-.2,.4),z+rnd(-.5,.5),{col:0xcfe8f5,life:rnd(.7,1.3),vx:rnd(-3,3),vy:rnd(1,4),vz:rnd(-3,3),g:12,s0:.16,s1:.1,op:.95})}
/* ---------- বডি চাপা খাওয়া ---------- */
const V=new THREE.Vector3(),M=new THREE.Matrix4(),MI=new THREE.Matrix4(),INV=new THREE.Matrix4();
const hash=(x,y,z)=>{const h=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return h-Math.floor(h)};
function dent(cx,cy,cz,amt,rad,dz){try{bus.updateMatrixWorld(true);INV.copy(bus.matrixWorld).invert();let n=0;
bus.traverse(m=>{if(n>40||!m.isMesh||m.isInstancedMesh||!m.geometry||(m.userData&&(m.userData.glass||m.userData.own)))return;let g=m.geometry;if(!g.boundingSphere)g.computeBoundingSphere();if(!g.boundingSphere||g.boundingSphere.radius<.14)return;if(g.type==='CylinderGeometry'&&g.boundingSphere.radius<.75)return;
if(!m.userData.bpdG){m.geometry=g=g.clone();m.userData.bpdG=1;const a=g.attributes.position;if(a)m.userData.bpo=a.array.slice()}const pos=g.attributes.position;if(!pos)return;
M.multiplyMatrices(INV,m.matrixWorld);MI.copy(M).invert();let ch=0;
for(let i=0;i<pos.count;i++){V.fromBufferAttribute(pos,i).applyMatrix4(M);const dx=V.x-cx,dy=V.y-cy,ez=V.z-cz,d=Math.sqrt(dx*dx+dy*dy+ez*ez);if(d<rad){const f=1-d/rad,k=f*f*amt,hs=hash(V.x,V.y,V.z);V.z+=dz*k*(.65+hs*.35);V.y-=k*.3;V.x+=(hs-.5)*k*.55;V.applyMatrix4(MI);pos.setXYZ(i,V.x,V.y,V.z);ch=1}}
if(ch){pos.needsUpdate=true;g.computeBoundingSphere();g.computeVertexNormals();n++;
if(!m.userData.bpdM&&m.material&&!Array.isArray(m.material)&&m.material.color){m.material=m.material.clone();m.userData.bpdM=m.material.color.clone()}
if(m.userData.bpdM){const k=(m.userData.dk||1);if(k>.5){m.material.color.multiplyScalar(.92);m.userData.dk=k*.92}}}})}catch(e){console.error('BPD dent',e)}}
/* ---------- কাচ ---------- */
let CRK=null;function crackTex(){if(CRK)return CRK;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,256,256);x.strokeStyle='#2a3238';x.lineWidth=2;
for(let s=0;s<2;s++){const cx=rnd(70,186),cy=rnd(70,186);for(let r=0;r<11;r++){const a=r/11*6.283+rnd(-.2,.2);let px=cx,py=cy;x.beginPath();x.moveTo(px,py);for(let k=0;k<5;k++){px+=Math.cos(a+rnd(-.35,.35))*rnd(14,34);py+=Math.sin(a+rnd(-.35,.35))*rnd(14,34);x.lineTo(px,py)}x.stroke()}
x.lineWidth=1;for(let k=1;k<4;k++){x.beginPath();x.arc(cx,cy,k*18,0,6.283);x.stroke()}}CRK=new THREE.CanvasTexture(c);return CRK}
function glassList(u){if(u.gl)return u.gl;u.gl=[];bus.traverse(o=>{if(o.isMesh&&o.userData&&o.userData.glass)u.gl.push(o)});return u.gl}
function crack(u){for(const g of glassList(u)){if(!g.userData.bpg&&g.material&&!Array.isArray(g.material)){const o=g.material;g.material=o.clone();g.userData.bpg={map:o.map,op:o.opacity,col:o.color&&o.color.clone(),tr:o.transparent}}const m=g.material;if(Array.isArray(m))continue;m.map=crackTex();m.transparent=true;m.opacity=Math.max(m.opacity||.5,.62);m.needsUpdate=true}}
function shatter(u){u.shat=1;for(const g of glassList(u)){g.visible=false;try{const w=new THREE.Vector3();g.getWorldPosition(w);shards(w.x,w.y,w.z,8)}catch(e){}}}
/* ---------- আঘাত ---------- */
function hurt(sev,rear){if(G.over||!G.started)return;const u=U(),v0=u.v;u.v=Math.min(100,u.v+sev*18*.05);
const L=(typeof PV!=='undefined'&&PV.ol)||2,W=(typeof PV!=='undefined'&&PV.hw)||.9,dz=rear?-1:1,cz=(rear?1:-1)*L*.92,cx=rnd(-W*.7,W*.7);
bus.updateMatrixWorld(true);const w=new THREE.Vector3(cx,.7,cz);bus.localToWorld(w);
if(sev>=.12)sparks(w.x,w.y,w.z,Math.round(6+sev*16));
if(sev>=.2)dent(cx,.7,cz,.1+sev*.3,1.0+sev*.7,dz);
if(u.v>=25&&!u.c25){u.c25=1;crack(u)}
if((u.v>=65||sev>1.3)&&!u.shat){shatter(u)}
if(u.v>=50&&!u.c50){u.c50=1;toast('💨 ইঞ্জিন থেকে ধোঁয়া বেরোচ্ছে!',2.4)}
if(u.v>=80&&!u.c80){u.c80=1;toast('🔥 গাড়ি জ্বলছে! গতি কমে গেছে — মেরামত দরকার',3)}}
const KW={wall:1,veh:.9,bld:1,prop:.55,cart:.3,ped:.1};
function onCrime(a,m,k){if(G.over)return;if(hcd>0)return;const w=KW[k]===undefined?.5:KW[k];if(w<=0)return;const f=Math.max(.15,Math.min(1.2,rs/14));hcd=.35;hurt(w*f,S.vf<0)}
/* ---------- প্রতি ফ্রেমে ---------- */
let pill=null,lastTxt='';
function mkPill(){pill=document.createElement('div');pill.id='dm';pill.className='p';pill.style.cssText='right:8px;top:calc(var(--st) + 194px);font-size:13px;display:none;z-index:12';document.body.appendChild(pill)}
function tick(dt){if(!pill)mkPill();if(!G.started||G.over){pill.style.display='none';return}
rs=Math.max(Math.abs(S.vf),rs-30*dt);hcd-=dt;parts(dt);const u=U();
if(u.shat&&u.gl)for(const g of u.gl)g.visible=false;
if(u.v>=30){u.acc+=dt*(u.v-25)/4.5;while(u.acc>=1){u.acc-=1;const L=(PV&&PV.ol)||2,w=new THREE.Vector3(rnd(-.3,.3),.95,-L*.7);bus.updateMatrixWorld(true);bus.localToWorld(w);
puff(w.x,w.y,w.z,1,u.v<60?0xbdbdbd:(u.v<85?0x4a4a4a:0x1c1c1c));if(u.v>=85&&Math.random()<.5)sparks(w.x,w.y+.2,w.z,2)}}
const hp=Math.round(100-u.v),txt='🔧 গাড়ি '+bn(hp)+'%';if(u.v>=1){if(txt!==lastTxt){lastTxt=txt;pill.textContent=txt;pill.style.color=hp>60?'#7dffa0':hp>30?'#ffd166':'#ff6b6b'}pill.style.display='block'}else pill.style.display='none'}
/* ---------- মেরামত ---------- */
function repair(){const u=U();u.v=0;u.c25=u.c50=u.c80=0;u.shat=0;
bus.traverse(m=>{if(!m.isMesh)return;const d=m.userData;if(d.bpo&&m.geometry&&m.geometry.attributes.position){const p=m.geometry.attributes.position;p.array.set(d.bpo);p.needsUpdate=true;m.geometry.computeBoundingSphere();m.geometry.computeVertexNormals()}
if(d.bpdM&&m.material&&m.material.color){m.material.color.copy(d.bpdM);d.dk=1}
if(d.bpg&&m.material&&!Array.isArray(m.material)){const o=d.bpg,mt=m.material;mt.map=o.map||null;mt.opacity=o.op;mt.transparent=o.tr;if(o.col&&mt.color)mt.color.copy(o.col);mt.needsUpdate=true;if(bus.userData.gv!==0)m.visible=true}});
if(pill)pill.style.display='none'}
{const o=window.step;if(typeof o==='function')window.step=function(dt){const r=o.apply(this,arguments);try{const u=bus.userData.bpd;if(u&&u.v>60&&!G.over&&typeof PV!=='undefined'){const cap=(PV.top||20)*(1-.38*(u.v-60)/40),a=Math.abs(S.vf);if(a>cap)S.vf=Math.sign(S.vf)*(cap+(a-cap)*Math.max(0,1-5*dt))}}catch(e){}return r}}
function after(name,fn){const o=window[name];if(typeof o!=='function')return;window[name]=function(){const r=o.apply(this,arguments);try{fn.apply(null,arguments)}catch(e){console.error('BPD',name,e)}return r}}
after('crime',onCrime);after('hud',tick);
window.BPD={hurt,repair,puff,sparks,get v(){return U().v}};
})();
