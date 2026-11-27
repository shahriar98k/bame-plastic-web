/* roads2.js — median barrier store (shared with metro2.js), dead-end repair, barrier + opening every ~200 m on every road.
   Loads BEFORE metro2.js and game1.js. game1.js calls BPR2({D}) after the metro block, before RD is built. */
(function(){
if(window.__R2)return;window.__R2=1;
/* ---------- barrier store ---------- */
const MG=new Map(),CS=16,mk=(a,b)=>a*100000+b;
function medAdd(s){const x0=Math.min(s[0],s[2])-.7,x1=Math.max(s[0],s[2])+.7,z0=Math.min(s[1],s[3])-.7,z1=Math.max(s[1],s[3])+.7;
for(let cx=Math.floor(x0/CS);cx<=Math.floor(x1/CS);cx++)for(let cz=Math.floor(z0/CS);cz<=Math.floor(z1/CS);cz++){const k=mk(cx,cz);let l=MG.get(k);if(!l){l=[];MG.set(k,l)}l.push(s)}}
const sd2=(x,z,s)=>{const dx=s[2]-s[0],dz=s[3]-s[1],L2=dx*dx+dz*dz||1;let u=((x-s[0])*dx+(z-s[1])*dz)/L2;u=u<0?0:u>1?1:u;const ex=s[0]+dx*u-x,ez=s[1]+dz*u-z;return ex*ex+ez*ez};
const raw=(x,z,r2)=>{const l=MG.get(mk(Math.floor(x/CS),Math.floor(z/CS)));if(!l)return 0;for(const s of l)if(sd2(x,z,s)<r2)return 1;return 0};
const cross=(ax,az,bx,bz,s)=>{const cx=s[0],cz=s[1],dx=s[2],dz=s[3],d1=(bx-ax)*(cz-az)-(bz-az)*(cx-ax),d2=(bx-ax)*(dz-az)-(bz-az)*(dx-ax),d3=(dx-cx)*(az-cz)-(dz-cz)*(ax-cx),d4=(dx-cx)*(bz-cz)-(dz-cz)*(bx-cx);return d1*d2<0&&d3*d4<0};
window.BPMEDADD=medAdd;
window.BPMED=function(x,z){if(!raw(x,z,.36))return 0;try{if(S&&raw(S.x,S.z,.5))return 0}catch(e){}return 1};
window.BPMEDN=function(x,z,r){const cx=Math.floor(x/CS),cz=Math.floor(z/CS),r2=r*r;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=MG.get(mk(cx+a,cz+b));if(l)for(const s of l)if(sd2(x,z,s)<r2)return 1}return 0};
/* did a move from (a,b) to (c,d) end near the barrier or cross it? (used for traffic) */
window.BPMEDX=function(a,b,c,d,r){const cx=Math.floor(c/CS),cz=Math.floor(d/CS),r2=r*r;for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++){const l=MG.get(mk(cx+i,cz+j));if(l)for(const s of l){if(sd2(c,d,s)<r2||cross(a,b,c,d,s))return 1}}return 0};
/* ---------- road grid: do other roads cross here? (also used by metro2.js) ---------- */
window.BPRG=function(roads,minW){const g=new Map(),cs=60;roads.forEach((e,id)=>{if(e[0]<minW)return;const p=e[1];for(let i=0;i+3<p.length;i+=2){const dx=p[i+2]-p[i],dz=p[i+3]-p[i+1],L=Math.hypot(dx,dz);if(L<.01)continue;const s={id,w:e[0],x0:p[i],z0:p[i+1],x1:p[i+2],z1:p[i+3],tx:dx/L,tz:dz/L},n=Math.max(1,Math.ceil(L/30)),seen=new Set();
for(let k=0;k<=n;k++){const x=p[i]+dx*k/n,z=p[i+1]+dz*k/n,key=Math.floor(x/cs)+','+Math.floor(z/cs);if(seen.has(key))continue;seen.add(key);let l=g.get(key);if(!l){l=[];g.set(key,l)}l.push(s)}}});
return{g,cross(x,z,tx,tz,sid,m){m=m===undefined?9:m;const cx=Math.floor(x/cs),cz=Math.floor(z/cs);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=g.get((cx+a)+','+(cz+b));if(l)for(const s of l){if(s.id===sid)continue;if(Math.abs(s.tx*tx+s.tz*tz)>.9)continue;const dx=s.x1-s.x0,dz=s.z1-s.z0,L2=dx*dx+dz*dz||1;let u=((x-s.x0)*dx+(z-s.z0)*dz)/L2;u=u<0?0:u>1?1:u;if(Math.hypot(s.x0+dx*u-x,s.z0+dz*u-z)<s.w/2+m)return true}}return false}}};
/* ---------- main ---------- */
const K=(x,z)=>Math.round(x/1.2)+','+Math.round(z/1.2);
function run(D){
const KM=!!window.KMODE;if(!D.x)D.x=[];
const RS=[];D.r.forEach(e=>RS.push({w:e[0],p:e[1].slice(),tail:e.slice(2),arr:0,o:1}));D.x.forEach(e=>RS.push({w:e[0],p:e[1].slice(),tail:e.slice(2),arr:1,o:1}));
const act=RS.filter(r=>r.w>=6&&r.p.length>=4);
/* 1. duplicates */
{const seen=new Set();for(const r of act){const p=r.p,n=p.length/2;let L=0;for(let i=0;i+3<p.length;i+=2)L+=Math.hypot(p[i+2]-p[i],p[i+3]-p[i+1]);const a=K(p[0],p[1]),b=K(p[n*2-2],p[n*2-1]),sig=(a<b?a+'|'+b:b+'|'+a)+'|'+n+'|'+Math.round(L/5);if(seen.has(sig))r.dup=1;else seen.add(sig)}}
const live=act.filter(r=>!r.dup);
/* geometry helpers */
const gridOf=(list)=>{const g=new Map(),cs=60;for(const r of list){const p=r.p;for(let i=0;i+3<p.length;i+=2){const s={r,i,x0:p[i],z0:p[i+1],x1:p[i+2],z1:p[i+3]},L=Math.hypot(s.x1-s.x0,s.z1-s.z0),n=Math.max(1,Math.ceil(L/30)),seen=new Set();for(let k=0;k<=n;k++){const key=Math.floor((s.x0+(s.x1-s.x0)*k/n)/cs)+','+Math.floor((s.z0+(s.z1-s.z0)*k/n)/cs);if(seen.has(key))continue;seen.add(key);let l=g.get(key);if(!l){l=[];g.set(key,l)}l.push(s)}}}return g};
/* buildings (to keep new asphalt out of them) */
const BG=new Map();{const bs=D.b||[];for(const b of bs){const q=b[2];if(!q||q.length<6)continue;let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9;for(let i=0;i<q.length;i+=2){if(q[i]<x0)x0=q[i];if(q[i]>x1)x1=q[i];if(q[i+1]<z0)z0=q[i+1];if(q[i+1]>z1)z1=q[i+1]}const o={q,x0,x1,z0,z1};for(let cx=Math.floor(x0/60);cx<=Math.floor(x1/60);cx++)for(let cz=Math.floor(z0/60);cz<=Math.floor(z1/60);cz++){const k=cx+','+cz;let l=BG.get(k);if(!l){l=[];BG.set(k,l)}l.push(o)}}}
const inB=(x,z)=>{const l=BG.get(Math.floor(x/60)+','+Math.floor(z/60));if(!l)return false;for(const o of l){if(x<o.x0||x>o.x1||z<o.z0||z>o.z1)continue;const q=o.q;let c=false;for(let i=0,j=q.length-2;i<q.length;j=i,i+=2){if((q[i+1]>z)!==(q[j+1]>z)&&x<(q[j]-q[i])*(z-q[i+1])/(q[j+1]-q[i+1])+q[i])c=!c}if(c)return true}return false};
const inW=(x,z)=>{if(!KM||typeof kWater!=='function')return false;try{return!!kWater(x,z)}catch(e){return false}};
/* new asphalt (extensions, caps, cross stubs) */
const AP=[],AC=[],ak=[.2,.21,.23],AY=.11;
const aq=(x0,z0,x1,z1,w,y)=>{const dx=x1-x0,dz=z1-z0,L=Math.hypot(dx,dz)||1,nx=-dz/L*w/2,nz=dx/L*w/2;AP.push(x0+nx,y,z0+nz,x1+nx,y,z1+nz,x0-nx,y,z0-nz,x0-nx,y,z0-nz,x1+nx,y,z1+nz,x1-nx,y,z1-nz);for(let i=0;i<6;i++)AC.push(ak[0],ak[1],ak[2])};
const acap=(x,z,r)=>{for(let q=0;q<12;q++){const a=q*.5236,b=(q+1)*.5236;AP.push(x,AY,z,x+Math.cos(a)*r,AY,z+Math.sin(a)*r,x+Math.cos(b)*r,AY,z+Math.sin(b)*r);for(let i=0;i<3;i++)AC.push(ak[0],ak[1],ak[2])}};
/* 2. dead ends: join to a near road (if nothing is in the way), else round cap */
let nSnap=0,nCap=0;const ins=new Map(),ext=[];
{const VM=new Map();for(const r of live){const n=r.p.length/2;for(let i=0;i<n;i++){const k=K(r.p[i*2],r.p[i*2+1]);let l=VM.get(k);if(!l){l=[];VM.set(k,l)}l.push(r)}}
const SG=gridOf(live);
for(const r of live){const p=r.p,n=p.length/2;for(const end of[0,1]){const i=end?n-1:0,x=p[i*2],z=p[i*2+1];if(VM.get(K(x,z)).length>1)continue;
const j=end?i-1:i+1;let tx=x-p[j*2],tz=z-p[j*2+1];const tl=Math.hypot(tx,tz)||1;tx/=tl;tz/=tl;const R=Math.max(32,r.w*2.5);let best=null;const cx=Math.floor(x/60),cz=Math.floor(z/60);
for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=SG.get((cx+a)+','+(cz+b));if(!l)continue;for(const s of l){if(s.r===r)continue;const dx=s.x1-s.x0,dz=s.z1-s.z0,L2=dx*dx+dz*dz||1;let u=((x-s.x0)*dx+(z-s.z0)*dz)/L2;u=u<0?0:u>1?1:u;const fx=s.x0+dx*u,fz=s.z0+dz*u,d=Math.hypot(fx-x,fz-z);if(d>R)continue;if(d>3&&((fx-x)*tx+(fz-z)*tz)/d<.35)continue;if(!best||d<best.d)best={s,u,fx,fz,d,L:Math.sqrt(L2)}}}
if(best){let{s,u,fx,fz,d,L}=best,vx=null;if(u*L<2.5){vx=[s.x0,s.z0];}else if((1-u)*L<2.5){vx=[s.x1,s.z1]}if(vx){fx=vx[0];fz=vx[1]}
let bad=false;for(const t of[.2,.4,.6,.8,1]){const qx=x+(fx-x)*t,qz=z+(fz-z)*t;if(inB(qx,qz)||inW(qx,qz)){bad=true;break}}
if(!bad){if(!vx){let l=ins.get(s.r);if(!l){l=[];ins.set(s.r,l)}l.push({seg:s.i,u,x:fx,z:fz})}ext.push({r,end,x:fx,z:fz});if(d>.3)aq(x,z,fx,fz,r.w,AY);nSnap++;continue}}
acap(x,z,r.w/2);nCap++}}}
for(const[r,l]of ins){l.sort((a,b)=>b.seg-a.seg||b.u-a.u);for(const q of l)r.p.splice(q.seg*2+2,0,q.x,q.z)}
for(const e of ext){if(e.end)e.r.p.push(e.x,e.z);else e.r.p.unshift(e.x,e.z)}
/* 3. junction list */
const JG=new Map();{const VM=new Map();for(const r of live){const p=r.p,n=p.length/2;for(let i=0;i<n;i++){const k=K(p[i*2],p[i*2+1]);let l=VM.get(k);if(!l){l=[];VM.set(k,l)}let tx=0,tz=0;const e=i===0||i===n-1;if(e){const j=i===0?1:n-2;tx=p[i*2]-p[j*2];tz=p[i*2+1]-p[j*2+1];const tl=Math.hypot(tx,tz)||1;tx/=tl;tz/=tl}l.push({r,e,tx,tz,x:p[i*2],z:p[i*2+1]})}}
for(const[k,l]of VM){let rad;if(l.length===1){if(!l[0].e)continue;rad=18}else{if(l.length===2&&l[0].e&&l[1].e&&Math.abs(l[0].r.w-l[1].r.w)<=3&&l[0].tx*l[1].tx+l[0].tz*l[1].tz<-.8)continue;let wm=0;for(const q of l)wm=Math.max(wm,q.r.w);rad=9+wm/2}
const ck=Math.floor(l[0].x/60)+','+Math.floor(l[0].z/60);let g=JG.get(ck);if(!g){g=[];JG.set(ck,g)}g.push([l[0].x,l[0].z,rad])}}
const nearJ=(x,z)=>{const cx=Math.floor(x/60),cz=Math.floor(z/60);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const g=JG.get((cx+a)+','+(cz+b));if(g)for(const q of g)if(Math.hypot(q[0]-x,q[1]-z)<q[2])return true}return false};
/* crossing roads that share no vertex */
const RG=window.BPRG(live.map(r=>[r.w,r.p]),6);const idOf=new Map();live.forEach((r,i)=>idOf.set(r,i));
/* metro line (its own barrier already exists) */
const MM=window.BPMETRO&&window.BPMETRO.MW,MG2=new Map();if(MM){for(let i=0;i+3<MM.length;i+=2){const key=Math.floor(MM[i]/60)+','+Math.floor(MM[i+1]/60);let l=MG2.get(key);if(!l){l=[];MG2.set(key,l)}l.push([MM[i],MM[i+1],MM[i+2],MM[i+3]])}}
const nearMetro=(x,z)=>{if(!MM)return false;const cx=Math.floor(x/60),cz=Math.floor(z/60);for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++){const l=MG2.get((cx+a)+','+(cz+b));if(l)for(const s of l)if(sd2(x,z,s)<196)return true}return false};
/* 4. barrier runs, openings every ~200 m */
const STEP=3,boxes=new Map();let nBox=0,nBrk=0,L0=0;
const extra=[];
for(const r of live){if(r.w<8)continue;const p=r.p,n=p.length/2;const cum=[0];for(let i=0;i+1<n;i++)cum.push(cum[i]+Math.hypot(p[i*2+2]-p[i*2],p[i*2+3]-p[i*2+1]));const Lt=cum[n-1];if(Lt<12)continue;
const ns=Math.max(2,Math.round(Lt/STEP)),st=Lt/ns,sid=idOf.get(r),X=new Float64Array(ns+1),Z=new Float64Array(ns+1),TX=new Float64Array(ns+1),TZ=new Float64Array(ns+1),gap=new Uint8Array(ns+1);
let k=0;for(let j=0;j<=ns;j++){const s=j*st;while(k<n-2&&cum[k+1]<s)k++;const L=(cum[k+1]-cum[k])||1,f=Math.min(1,Math.max(0,(s-cum[k])/L)),dx=p[k*2+2]-p[k*2],dz=p[k*2+3]-p[k*2+1],l=Math.hypot(dx,dz)||1;X[j]=p[k*2]+dx*f;Z[j]=p[k*2+1]+dz*f;TX[j]=dx/l;TZ[j]=dz/l;gap[j]=(nearJ(X[j],Z[j])||RG.cross(X[j],Z[j],TX[j],TZ[j],sid)||nearMetro(X[j],Z[j]))?1:0}
const runs=()=>{const o=[];let a=-1;for(let j=0;j<=ns+1;j++){const g=j>ns?1:gap[j];if(!g&&a<0)a=j;else if(g&&a>=0){o.push([a,j-1]);a=-1}}return o};
const brks=[];for(const[a,b]of runs()){const Lr=(b-a)*st;if(Lr<=170)continue;const m=Math.ceil((Lr+26)/200);for(let q=1;q<m;q++)brks.push(Math.round(a+(b-a)*q/m))}
const hw=Math.ceil(11/st);for(const jb of brks)for(let j=Math.max(0,jb-hw);j<=Math.min(ns,jb+hw);j++)gap[j]=1;
/* cross stubs at the breaks + split the road there */
const sp=[];for(const jb of brks){const bx=X[jb],bz=Z[jb],tx=TX[jb],tz=TZ[jb],nx=-tz,nz=tx;let A=r.w/2+5;if(inB(bx+nx*A,bz+nz*A)||inB(bx-nx*A,bz-nz*A))A=r.w/2+1;const sw=Math.max(7,Math.min(9,r.w*.6));
extra.push({w:sw,p:[bx-nx*A,bz-nz*A,bx,bz,bx+nx*A,bz+nz*A],tail:r.tail.slice(),arr:1});aq(bx-nx*A,bz-nz*A,bx+nx*A,bz+nz*A,sw,AY);sp.push({s:jb*st,x:bx,z:bz});nBrk++}
if(sp.length){sp.sort((a,b)=>a.s-b.s);const pcs=[];let cur=[p[0],p[1]],bi=0;for(let i=0;i+1<n;i++){while(bi<sp.length&&sp[bi].s<cum[i+1]-.05){if(sp[bi].s>cum[i]+.05){cur.push(sp[bi].x,sp[bi].z);pcs.push(cur);cur=[sp[bi].x,sp[bi].z]}bi++}cur.push(p[i*2+2],p[i*2+3])}pcs.push(cur);if(pcs.length>1){r.p=pcs[0];for(let q=1;q<pcs.length;q++)extra.push({w:r.w,p:pcs[q],tail:r.tail.slice(),arr:r.arr})}}
/* barrier boxes */
for(const[a,b]of runs()){if((b-a)*st<5)continue;let pieces=[];const sa=a*st,sb=b*st;let kk=0;while(kk<n-2&&cum[kk+1]<=sa)kk++;
for(let i=kk;i+1<n&&cum[i]<sb;i++){const s0=Math.max(sa,cum[i]),s1=Math.min(sb,cum[i+1]);if(s1-s0<.5)continue;const L=cum[i+1]-cum[i]||1,dx=(p[i*2+2]-p[i*2])/L,dz=(p[i*2+3]-p[i*2+1])/L;pieces.push([p[i*2]+dx*(s0-cum[i]),p[i*2+1]+dz*(s0-cum[i]),p[i*2]+dx*(s1-cum[i]),p[i*2+1]+dz*(s1-cum[i])])}
let cur=null;const flush=()=>{if(!cur)return;const L=Math.hypot(cur[2]-cur[0],cur[3]-cur[1]);if(L>=2){medAdd(cur);L0+=L;const mx=(cur[0]+cur[2])/2,mz=(cur[1]+cur[3])/2,ck=Math.floor(mx/240)+','+Math.floor(mz/240);let l=boxes.get(ck);if(!l){l=[];boxes.set(ck,l)}l.push([mx,mz,Math.atan2(-(cur[3]-cur[1]),cur[2]-cur[0]),L]);nBox++}cur=null};
for(const pc of pieces){if(!cur){cur=pc.slice();continue}const d1x=cur[2]-cur[0],d1z=cur[3]-cur[1],d2x=pc[2]-pc[0],d2z=pc[3]-pc[1],l1=Math.hypot(d1x,d1z)||1,l2=Math.hypot(d2x,d2z)||1;if((d1x*d2x+d1z*d2z)/(l1*l2)>.99&&l1+l2<70&&Math.hypot(pc[0]-cur[2],pc[1]-cur[3])<.5){cur[2]=pc[2];cur[3]=pc[3]}else{flush();cur=pc.slice()}}flush()}}
/* 5. write the roads back */
{const outR=[],outX=[];for(const r of RS){const e=[r.w,r.p].concat(r.tail);(r.arr?outX:outR).push(e)}for(const r of extra){const e=[r.w,r.p].concat(r.tail);(r.arr?outX:outR).push(e)}
D.r.length=0;for(const e of outR)D.r.push(e);D.x.length=0;for(const e of outX)D.x.push(e)}
/* 6. meshes */
if(typeof sc!=='undefined'&&typeof THREE!=='undefined'){
if(AP.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(AP,3));g.setAttribute('color',new THREE.Float32BufferAttribute(AC,3));g.computeVertexNormals();const m=new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));m.receiveShadow=true;sc.add(m)}
const bg=(()=>{const pos=[],nor=[],col=[];const add=(cy,sy,sz,k)=>{const b=new THREE.BoxGeometry(1,sy,sz).toNonIndexed();b.translate(0,cy,0);const a=b.attributes.position.array,nn=b.attributes.normal.array;for(let i=0;i<a.length;i++){pos.push(a[i]);nor.push(nn[i])}for(let i=0;i<a.length/3;i++)col.push(k[0],k[1],k[2])};add(.45,.9,.5,[.74,.74,.72]);add(.95,.1,.34,[.92,.8,.1]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(nor,3));g.setAttribute('color',new THREE.Float32BufferAttribute(col,3));return g})();
const mat=new THREE.MeshLambertMaterial({vertexColors:true}),M4=new THREE.Matrix4(),Q=new THREE.Quaternion(),P=new THREE.Vector3(),Sc=new THREE.Vector3(),UP=new THREE.Vector3(0,1,0);
for(const[k,l]of boxes){const im=new THREE.InstancedMesh(bg,mat,l.length);let x0=1e9,x1=-1e9,z0=1e9,z1=-1e9,ml=0;l.forEach((b,i)=>{Q.setFromAxisAngle(UP,b[2]);P.set(b[0],0,b[1]);Sc.set(b[3]+.05,1,1);M4.compose(P,Q,Sc);im.setMatrixAt(i,M4);x0=Math.min(x0,b[0]);x1=Math.max(x1,b[0]);z0=Math.min(z0,b[1]);z1=Math.max(z1,b[1]);ml=Math.max(ml,b[3])});
im.instanceMatrix.needsUpdate=true;const g2=bg.clone();g2.boundingSphere=new THREE.Sphere(new THREE.Vector3((x0+x1)/2,0,(z0+z1)/2),Math.hypot(x1-x0,z1-z0)/2+ml/2+2);im.geometry=g2;sc.add(im)}}
window.BPR2INFO={snapped:nSnap,capped:nCap,breaks:nBrk,boxes:nBox,barrierM:Math.round(L0),roads:D.r.length+D.x.length}}
window.BPR2=function(A){try{run(A.D)}catch(e){console.error('BPR2',e)}};
})();
