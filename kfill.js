/* kfill.js — কাপ্তাইয়ের গেট বোর্ড ও কিমি-বোর্ডের পাশে বাড়ি-ঘর, দোকান, তাঁবু, গাছ ইত্যাদি।
   game1.js ও kaptai.js-এর পরে চলে; ওগুলো বদলায় না। ধাক্কা লাগে, গাছ ভাঙে। */
(function(){
if(!window.KMODE||!window.KAP||window.__KF||typeof sc==='undefined'||typeof hit!=='function'||typeof XBB==='undefined'||typeof OBS==='undefined'||!window.BPJ_T)return;
window.__KF=1;
let sd=20261121;const rn=()=>{sd=(sd*48271)%2147483647;return sd/2147483647},rr=(a,b)=>a+rn()*(b-a),pk=a=>a[Math.floor(rn()*a.length)];
const water=(x,z)=>{for(const p of KAP.w){if(inPoly(x,z,p)){for(const l of(KAP.lnd||[]))if(inPoly(x,z,l))return false;return true}}return false};
/* রাস্তা থেকে দূরত্ব (প্রস্থ বাদ দিয়ে) */
function roadClear(x,z){let best=1e9;const cx=Math.floor(x/120),cz=Math.floor(z/120);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=RSG.get((cx+a)+','+(cz+b));if(!l)continue;for(const e of l){const r=RD[e[0]],q=r[1],i=e[1]*2;for(let k=0;k<2;k++){const j=i+k*2;if(j+3>=q.length)continue;const ax=q[j],az=q[j+1],bx=q[j+2],bz=q[j+3],dx=bx-ax,dz=bz-az,L2=dx*dx+dz*dz||1,u=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/L2)),d=Math.hypot(x-ax-u*dx,z-az-u*dz)-r[0]/2;if(d<best)best=d}}}return best}
const BOX=new THREE.BoxGeometry(1,1,1),CYL=new THREE.CylinderGeometry(.5,.5,1,10),LOG=new THREE.CylinderGeometry(.4,.4,5,8).rotateZ(Math.PI/2),CONE4=new THREE.ConeGeometry(.5,1,4),CONE8=new THREE.ConeGeometry(.5,1,8),ICO=new THREE.IcosahedronGeometry(.5,0);
function Builder(){const P=[],N=[],C=[],I=[];let n=0;return{
add(geo,x,y,z,ry,sx,sy,sz,col){const pos=geo.attributes.position,nor=geo.attributes.normal,idx=geo.index,cr=Math.cos(ry),sr=Math.sin(ry),c=new THREE.Color(col),v0=n;
for(let i=0;i<pos.count;i++){const px=pos.getX(i)*sx,py=pos.getY(i)*sy,pz=pos.getZ(i)*sz;P.push(px*cr+pz*sr+x,py+y,-px*sr+pz*cr+z);const nx=nor.getX(i),nz=nor.getZ(i);N.push(nx*cr+nz*sr,nor.getY(i),-nx*sr+nz*cr);C.push(c.r,c.g,c.b)}
if(idx)for(let i=0;i<idx.count;i++)I.push(idx.getX(i)+n);else for(let i=0;i<pos.count;i++)I.push(i+n);n+=pos.count;return[v0,n]},
mesh(){if(!n)return null;const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));g.setAttribute('color',new THREE.Float32BufferAttribute(C,3));g.setIndex(I);return new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true}))}}}
const WALL=['#e6c9a0','#d9b38c','#cfd8dc','#f0e0b8','#c8e6c9','#ffcc80','#bcaaa4','#b3d4e6'],ROOF=['#6d4c41','#455a64','#8d6e63','#37474f'],AWN=['#c62828','#1565c0','#2e7d32','#f9a825','#6a1b9a','#ef6c00'],SHOPS=(window.KSHOP&&window.KSHOP.length)?window.KSHOP:['মনিহারী দোকান','চা স্টল','জেনারেল স্টোর'];
const signTex=(t,bg)=>{const c=document.createElement('canvas');c.width=512;c.height=128;const x=c.getContext('2d');x.fillStyle=bg;x.fillRect(0,0,512,128);x.strokeStyle='#fff';x.lineWidth=6;x.strokeRect(5,5,502,118);x.fillStyle='#fff';x.font='800 54px "Hind Siliguri","Noto Sans Bengali",sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText(t,256,68,480);return new THREE.CanvasTexture(c)};
let usedSigns=0;
function part(b,cx,cz,ry,lx,ly,lz,sx,sy,sz,geo,col){const cr=Math.cos(ry),sr=Math.sin(ry);return b.add(geo,cx+lx*cr+lz*sr,ly,cz-lx*sr+lz*cr,ry,sx,sy,sz,col)}
function okBox(cx,cz,w,d,ry){const cr=Math.cos(ry),sr=Math.sin(ry),pts=[[0,0],[w/2,d/2],[-w/2,d/2],[w/2,-d/2],[-w/2,-d/2],[w/2,0],[-w/2,0],[0,d/2],[0,-d/2]],rad=Math.max(w,d)/2;
for(const q of pts){const x=cx+q[0]*cr+q[1]*sr,z=cz-q[0]*sr+q[1]*cr;if(hit(x,z)||water(x,z))return false}return roadClear(cx,cz)>rad+1.5}
function reg(cx,cz,w,d,ry){const cr=Math.cos(ry),sr=Math.sin(ry),c=[[-w/2,-d/2],[w/2,-d/2],[w/2,d/2],[-w/2,d/2]].map(q=>[cx+q[0]*cr+q[1]*sr,cz-q[0]*sr+q[1]*cr]),xs=c.map(q=>q[0]),zs=c.map(q=>q[1]);XBB.push({p:c.flat(),x0:Math.min(...xs),x1:Math.max(...xs),z0:Math.min(...zs),z1:Math.max(...zs)})}
function treeAt(b,mesh,x,z){if(hit(x,z)||water(x,z)||roadClear(x,z)<3)return false;const s=rr(.9,1.3),a=b.add(CYL,x,1.3*s,z,0,.4*s,2.6*s,.4*s,'#6d4c2a'),c=b.add(ICO,x,3.5*s,z,rn()*6,3.2*s,3*s,3.2*s,pk(['#2e7d32','#388e3c','#558b2f','#1b5e20']));
const o=[x,z,.55,a[0],c[1],'tree'];mesh.push(o);return true}
/* বাড়ি/দোকান: একটাই ব্লক */
function house(b,cx,cz,ry,w,d,h,shop,front){const wall=pk(WALL);part(b,cx,cz,ry,0,h/2,0,w,h,d,BOX,wall);part(b,cx,cz,ry,0,h+.12,0,w+.5,.26,d+.5,BOX,pk(ROOF));
part(b,cx,cz,ry,0,1.05,front*(d/2+.04),1.1,2.1,.1,BOX,'#4e342e');for(const s of[-1,1]){part(b,cx,cz,ry,s*w*.3,2.3,front*(d/2+.04),1.3,1.1,.1,BOX,'#9fd3f0');if(h>4.6)part(b,cx,cz,ry,s*w*.3,4.2,front*(d/2+.04),1.3,1.1,.1,BOX,'#9fd3f0')}
if(shop)part(b,cx,cz,ry,0,2.9,front*(d/2+.75),w*.92,.14,1.5,BOX,pk(AWN))}
function addSign(g,cx,cz,ry,w,d,front,txt){if(usedSigns>=40)return;usedSigns++;const m=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(w*.85,6.4),1.2),new THREE.MeshBasicMaterial({map:signTex(txt,pk(['#0b6e4f','#b71c1c','#0d47a1','#4e342e'])),side:THREE.DoubleSide}));
const cr=Math.cos(ry),sr=Math.sin(ry),lz=front*(d/2+1.55);m.position.set(cx+lz*sr,3.7,cz+lz*cr);m.rotation.y=ry+(front<0?Math.PI:0);g.add(m)}
/* ---------- দৃশ্যের ধরন ---------- */
const KINDS={
shops(ctx){let n=0;const side=[1,-1];
if(ctx.far){for(const r of[17,31]){const cnt=Math.floor(6.283*r/12);for(let k=0;k<cnt&&n<12;k++){const a=k/cnt*6.283+rr(-.1,.1),w=rr(7.2,8.6),d=rr(6,7.2),h=rr(4.2,6.6),cx=ctx.bx+Math.cos(a)*r,cz=ctx.bz+Math.sin(a)*r,ry=Math.PI/2-a;if(!okBox(cx,cz,w,d,ry))continue;house(ctx.b,cx,cz,ry,w,d,h,true,-1);reg(cx,cz,w,d,ry);if(rn()<.7)addSign(ctx.g,cx,cz,ry,w,d,-1,pk(SHOPS));n++}}
for(let i=0;i<8;i++){const a=rr(0,6.28),r=rr(11,38);treeAt(ctx.b,ctx.trees,ctx.bx+Math.cos(a)*r,ctx.bz+Math.sin(a)*r)}return}
for(let lu=-34;lu<=34&&n<9;lu+=rr(10.5,12)){for(const s of side){if(n>=9)break;const w=rr(7.4,9),d=rr(6,7.5),h=rr(4.2,6.8),ln=s*(ctx.rw+4.2+d/2),cx=ctx.x+ctx.ux*lu+ctx.nx*ln,cz=ctx.z+ctx.uz*lu+ctx.nz*ln,ry=ctx.ry;if(!okBox(cx,cz,w,d,ry))continue;house(ctx.b,cx,cz,ry,w,d,h,true,-s);reg(cx,cz,w,d,ry);if(rn()<.7)addSign(ctx.g,cx,cz,ry,w,d,-s,pk(SHOPS));n++}}
for(let i=0;i<7;i++)treeAt(ctx.b,ctx.trees,ctx.x+ctx.ux*rr(-40,40)+ctx.nx*pk([-1,1])*(ctx.rw+rr(3,6)),ctx.z+ctx.uz*rr(-40,40)+ctx.nz*pk([-1,1])*(ctx.rw+rr(3,6)))},
camp(ctx){const sx=ctx.road?pk([-1,1])*(ctx.rw+20):22,cx0=ctx.x+ctx.nx*sx,cz0=ctx.z+ctx.nz*sx;let n=0;
for(let i=0;i<14&&n<4;i++){const a=rr(0,6.28),r=rr(4,13),x=cx0+Math.cos(a)*r,z=cz0+Math.sin(a)*r;if(!okBox(x,z,4,4,0))continue;part(ctx.b,x,z,.8,0,1.2,0,3.4,2.4,3.4,CONE4,pk(['#ef6c00','#1976d2','#2e7d32','#f9a825','#c2185b']));reg(x,z,3,3,0);n++}
if(okBox(cx0,cz0,2,2,0)){part(ctx.b,cx0,cz0,0,0,.25,0,1.6,.5,1.6,CYL,'#4e342e');part(ctx.b,cx0,cz0,0,0,.9,0,.9,1.2,.9,CONE8,'#ff7a1a')}
const hx=cx0+rr(-6,6),hz=cz0+rr(14,18);if(okBox(hx,hz,6,5,0)){house(ctx.b,hx,hz,0,6,5,3.4,true,1);reg(hx,hz,6,5,0);addSign(ctx.g,hx,hz,0,6,5,1,'ক্যাম্পিং কাউন্টার')}
for(let i=0;i<7;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-20,20),cz0+rr(-20,20))},
mill(ctx){const cx0=ctx.x+ctx.nx*(ctx.rw+22),cz0=ctx.z+ctx.nz*(ctx.rw+22);let n=0;
for(let i=0;i<10&&n<2;i++){const x=cx0+rr(-12,12),z=cz0+rr(-10,10);if(!okBox(x,z,12,8,0))continue;for(const q of[[-5.5,-3.5],[5.5,-3.5],[-5.5,3.5],[5.5,3.5]])part(ctx.b,x,z,0,q[0],1.6,q[1],.4,3.2,.4,CYL,'#5d4037');part(ctx.b,x,z,0,0,3.4,0,12.5,.3,8.5,BOX,'#78909c');for(let k=0;k<3;k++)part(ctx.b,x,z,0,rr(-3,3),.4+k*.75,rr(-1,1),1,1,1,LOG,'#8d6e63');reg(x,z,12,8,0);n++}
for(let k=0;k<3;k++){const x=cx0+rr(-14,14),z=cz0+rr(14,22);if(okBox(x,z,6,4,0)){for(let j=0;j<4;j++)part(ctx.b,x,z,0,rr(-1,1),.4+j*.75,rr(-1,1),1,1,1,LOG,'#a1887f');reg(x,z,6,4,0)}}
for(let i=0;i<5;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-25,25),cz0+rr(-25,25))},
lake(ctx){const sx=pk([-1,1])*(ctx.rw+12),cx0=ctx.x+ctx.nx*sx,cz0=ctx.z+ctx.nz*sx;if(okBox(cx0,cz0,6,4,ctx.ry)){house(ctx.b,cx0,cz0,ctx.ry,6,4,3.2,true,1);reg(cx0,cz0,6,4,ctx.ry);addSign(ctx.g,cx0,cz0,ctx.ry,6,4,1,'লেকপাড় চা ঘর')}
for(let i=0;i<2;i++){const x=cx0+rr(-8,8),z=cz0+rr(8,12);if(okBox(x,z,2.4,.8,ctx.ry)){part(ctx.b,x,z,ctx.ry,0,.45,0,2.4,.12,.7,BOX,'#6d4c2a');part(ctx.b,x,z,ctx.ry,0,.22,0,2.2,.4,.12,BOX,'#4e342e')}}
for(let i=0;i<5;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-18,18),cz0+rr(-18,18))},
forest(ctx){const sx=pk([-1,1])*(ctx.rw+16),cx0=ctx.x+ctx.nx*sx,cz0=ctx.z+ctx.nz*sx;if(okBox(cx0,cz0,10,7,ctx.ry)){part(ctx.b,cx0,cz0,ctx.ry,0,1.9,0,10,3.8,7,BOX,'#d7ccc8');part(ctx.b,cx0,cz0,ctx.ry,0,4,0,11,.4,8,BOX,'#2e7d32');part(ctx.b,cx0,cz0,ctx.ry,0,1.05,3.55,1.2,2.1,.1,BOX,'#4e342e');for(const s of[-1,1])part(ctx.b,cx0,cz0,ctx.ry,s*3,2.2,3.55,1.4,1.2,.1,BOX,'#9fd3f0');reg(cx0,cz0,10,7,ctx.ry);part(ctx.b,cx0,cz0,ctx.ry,6.5,3.5,5,.14,7,.14,CYL,'#eceff1');part(ctx.b,cx0,cz0,ctx.ry,7.3,6.4,5,1.5,.9,.05,BOX,'#d32f2f')}
for(let i=0;i<9;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-22,22),cz0+rr(-22,22))},
park(ctx){const sx=pk([-1,1])*(ctx.rw+10),cx0=ctx.x+ctx.nx*sx,cz0=ctx.z+ctx.nz*sx;if(okBox(cx0,cz0,9,3,ctx.ry)){for(const s of[-1,1])part(ctx.b,cx0,cz0,ctx.ry,s*4,2.1,0,1.2,4.2,1.2,BOX,'#6d4c41');part(ctx.b,cx0,cz0,ctx.ry,0,4.6,0,9.6,1,1.2,BOX,'#2e7d32');reg(cx0,cz0,9,3,ctx.ry)}
const bx=cx0+ctx.ux*9,bz=cz0+ctx.uz*9;if(okBox(bx,bz,3.2,3.2,ctx.ry)){part(ctx.b,bx,bz,ctx.ry,0,1.5,0,3,3,3,BOX,'#a1887f');part(ctx.b,bx,bz,ctx.ry,0,3.1,0,3.6,.25,3.6,BOX,'#37474f');reg(bx,bz,3.2,3.2,ctx.ry)}
for(let i=0;i<14;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-26,26),cz0+rr(-26,26))},
kayak(ctx){const sx=pk([-1,1])*(ctx.rw+14),cx0=ctx.x+ctx.nx*sx,cz0=ctx.z+ctx.nz*sx;if(okBox(cx0,cz0,10,6,ctx.ry)){part(ctx.b,cx0,cz0,ctx.ry,0,2,0,10,4,6,BOX,'#e3f2fd');part(ctx.b,cx0,cz0,ctx.ry,0,4.2,0,10.8,.35,6.8,BOX,'#1565c0');part(ctx.b,cx0,cz0,ctx.ry,0,1.05,3.05,1.2,2.1,.1,BOX,'#4e342e');reg(cx0,cz0,10,6,ctx.ry)}
for(let i=0;i<4;i++){const x=cx0+ctx.ux*(-6+i*3.6),z=cz0+ctx.uz*(-6+i*3.6)+ctx.nz*7;if(okBox(x,z,1,4,ctx.ry))part(ctx.b,x,z,ctx.ry,0,.45,0,.8,.3,4,BOX,pk(['#e53935','#fdd835','#43a047','#1e88e5']))}
for(let i=0;i<4;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-18,18),cz0+rr(-18,18))},
brick(ctx){const cx0=ctx.x+ctx.nx*(ctx.rw+20),cz0=ctx.z+ctx.nz*(ctx.rw+20);if(okBox(cx0,cz0,4,4,0)){part(ctx.b,cx0,cz0,0,0,7,0,2.6,14,2.6,CYL,'#8d3b2a');reg(cx0,cz0,3,3,0)}
for(let i=0;i<4;i++){const x=cx0+rr(-14,14),z=cz0+rr(6,16);if(okBox(x,z,8,5,0)){part(ctx.b,x,z,0,0,1.2,0,8,2.4,5,BOX,'#b5542f');reg(x,z,8,5,0)}}
for(let i=0;i<3;i++)treeAt(ctx.b,ctx.trees,cx0+rr(-20,20),cz0+rr(-20,20))}};
function kindOf(txt){if(/ক্যাম্পিং/.test(txt))return'camp';if(/করাতকল/.test(txt))return'mill';if(/লেক/.test(txt))return'lake';if(/ফরেস্ট/.test(txt))return'forest';if(/জাতীয় উদ্যান/.test(txt))return'park';if(/কায়াক/.test(txt))return'kayak';if(/ব্রিকফিল্ড/.test(txt))return'brick';if(/শিল্প/.test(txt))return'mill';return'shops'}
function build(x,z,txt){const kind=kindOf(txt),P=window.BPJ_T.pts();let road=null,bd=70;for(const p of P){const d=Math.hypot(p[0]-x,p[1]-z);if(d<bd){bd=d;road=p}}
if(!road)return'skip';
const ux=road[2],uz=road[3],ctx={x:road[0],z:road[1],bx:x,bz:z,far:bd>14,ux,uz,nx:-uz,nz:ux,rw:road[5]/2,ry:Math.atan2(-uz,ux),road,b:Builder(),g:new THREE.Group(),trees:[]};
try{KINDS[kind](ctx)}catch(e){console.error('kfill',kind,e)}
const m=ctx.b.mesh();if(m){sc.add(m);for(const o of ctx.trees){o.m=m;OBS.push(o)}}sc.add(ctx.g);return kind}
/* বোর্ডগুলোর পাশে বসাও */
const done=[];
for(const q of(KAP.bu||[]))done.push(build(q[0],q[1],q[3]||''));
for(const q of(KAP.gt||[]))done.push(build(q[0],q[1],q[2]||''));
window.KFILL={kinds:done};
})();
