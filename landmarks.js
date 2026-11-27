/* landmarks.js — ঢাকার বিখ্যাত স্থাপনা: জাতীয় সংসদ ভবন, বায়তুল মোকাররম, বঙ্গবন্ধু জাতীয় স্টেডিয়াম, শেরেবাংলা জাতীয় ক্রিকেট স্টেডিয়াম
   জায়গা পরিষ্কার করা ও সড়ক জোড়া game1.js-এর শুরুতে (BPEXC); এখানে শুধু মডেল বানানো ও সংঘর্ষ-বাক্স বসানো */
(function(){
if(window.KMODE||window.__LM||typeof sc==='undefined'||typeof THREE==='undefined'||typeof XBB==='undefined')return;
window.__LM=1;
const P=[],C=[];let rs=20261124;const rn=()=>{rs=(rs*48271)%2147483647;return rs/2147483647};
const cc={},col=h=>cc[h]||(cc[h]=(()=>{const c=new THREE.Color(h);return[c.r,c.g,c.b]})());
const tri=(a,b,c,k)=>{P.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]);for(let i=0;i<3;i++)C.push(k[0],k[1],k[2])};
const quad=(a,b,c,d,k)=>{tri(a,b,c,k);tri(a,c,d,k)};
const W3=(f,lx,ly,lz)=>[f.x+lx*Math.cos(f.a)-lz*Math.sin(f.a),ly,f.z+lx*Math.sin(f.a)+lz*Math.cos(f.a)];
const FC=[[2,3,7,6],[0,1,3,2],[4,5,7,6],[0,2,6,4],[1,3,7,5]];
function box(f,lx,ly,lz,sx,sy,sz,hex,r){const k=col(hex),c=W3(f,lx,0,lz),t=f.a+(r||0),ex=[Math.cos(t),Math.sin(t)],ez=[-Math.sin(t),Math.cos(t)],V=[];
for(const a of[-1,1])for(const b of[-1,1])for(const d of[-1,1])V.push([c[0]+ex[0]*a*sx/2+ez[0]*d*sz/2,ly+b*sy/2,c[2]+ex[1]*a*sx/2+ez[1]*d*sz/2]);
for(const q of FC)quad(V[q[0]],V[q[1]],V[q[2]],V[q[3]],k)}
function cyl(f,lx,y0,lz,r1,r2,h,hex,seg){seg=seg||12;const k=col(hex),c=W3(f,lx,0,lz),R=(a,r,y)=>[c[0]+Math.cos(a+f.a)*r,y,c[2]+Math.sin(a+f.a)*r];
for(let i=0;i<seg;i++){const a0=i/seg*6.2832,a1=(i+1)/seg*6.2832;quad(R(a0,r1,y0),R(a1,r1,y0),R(a1,r2,y0+h),R(a0,r2,y0+h),k);if(r2>0)tri([c[0],y0+h,c[2]],R(a1,r2,y0+h),R(a0,r2,y0+h),k)}}
const EP_=(cx,cz,a,b,th,y)=>[cx+a*Math.cos(th),y,cz+b*Math.sin(th)];
function ell(cx,cz,a,b,y,hex,n){const k=col(hex);for(let i=0;i<n;i++)tri([cx,y,cz],EP_(cx,cz,a,b,i/n*6.2832,y),EP_(cx,cz,a,b,(i+1)/n*6.2832,y),k)}
function ann(cx,cz,a1,b1,a2,b2,y,hex,n,fn){for(let i=0;i<n;i++){const t0=i/n*6.2832,t1=(i+1)/n*6.2832,k=col(fn?fn(i):hex);quad(EP_(cx,cz,a1,b1,t0,y),EP_(cx,cz,a2,b2,t0,y),EP_(cx,cz,a2,b2,t1,y),EP_(cx,cz,a1,b1,t1,y),k)}}
function wall(cx,cz,a,b,y0,y1,hex,n,fn){for(let i=0;i<n;i++){const t0=i/n*6.2832,t1=(i+1)/n*6.2832,k=col(fn?fn(i):hex);quad(EP_(cx,cz,a,b,t0,y0),EP_(cx,cz,a,b,t1,y0),EP_(cx,cz,a,b,t1,y1),EP_(cx,cz,a,b,t0,y1),k)}}
function arch(f,lx,y0,lz,w,h,hex){const k=col(hex),n=10,r=w/2,sh=h-r;quad(W3(f,lx-r,y0,lz),W3(f,lx+r,y0,lz),W3(f,lx+r,y0+sh,lz),W3(f,lx-r,y0+sh,lz),k);for(let i=0;i<n;i++){const a0=Math.PI*i/n,a1=Math.PI*(i+1)/n;tri(W3(f,lx,y0+sh,lz),W3(f,lx+r*Math.cos(a0),y0+sh+r*Math.sin(a0),lz),W3(f,lx+r*Math.cos(a1),y0+sh+r*Math.sin(a1),lz),k)}}
function disc(f,lx,ly,lz,r,hex){const k=col(hex),n=14;for(let i=0;i<n;i++){const a0=i/n*6.2832,a1=(i+1)/n*6.2832;tri(W3(f,lx,ly,lz),W3(f,lx+r*Math.cos(a0),ly+r*Math.sin(a0),lz),W3(f,lx+r*Math.cos(a1),ly+r*Math.sin(a1),lz),k)}}
function tri2(f,lx,y0,lz,w,h,hex){tri(W3(f,lx-w/2,y0,lz),W3(f,lx+w/2,y0,lz),W3(f,lx,y0+h,lz),col(hex))}
function reg(f,lx,lz,sx,sz,r){const c=W3(f,lx,0,lz),t=f.a+(r||0),ex=[Math.cos(t),Math.sin(t)],ez=[-Math.sin(t),Math.cos(t)],pts=[];for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1]])pts.push([c[0]+ex[0]*a*sx/2+ez[0]*b*sz/2,c[2]+ex[1]*a*sx/2+ez[1]*b*sz/2]);const xs=pts.map(q=>q[0]),zs=pts.map(q=>q[1]);XBB.push({p:pts.flat(),x0:Math.min(...xs),x1:Math.max(...xs),z0:Math.min(...zs),z1:Math.max(...zs)})}
function plane(f,lx,ly,lz,w,h,tex,rot,tr){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:!!tr,alphaTest:tr?.03:0,side:THREE.DoubleSide})),p=W3(f,lx,ly,lz);m.position.set(p[0],ly,p[2]);m.rotation.y=-f.a+(rot||0);sc.add(m);return m}
function cv(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);return t}
const flagTex=()=>cv(256,154,(x,w,h)=>{x.fillStyle='#006a4e';x.fillRect(0,0,w,h);x.fillStyle='#f42a41';x.beginPath();x.arc(w*.45,h/2,h*.3,0,6.2832);x.fill()});
const pole=(f,lx,y0,lz,h)=>{cyl(f,lx,y0,lz,.28,.28,h,'#9a9a9a',6);plane(f,lx+4.7,y0+h-3,lz,9.4,5.6,flagTex(),0)};
const onRd=(f,lx,lz)=>{if(typeof RD==='undefined')return false;const c=W3(f,lx,0,lz),x=c[0],z=c[2];for(const r of RD){const p=r[1],m=r[0]/2+4;for(let i=0;i+3<p.length;i+=2){const ax=p[i],az=p[i+1],bx=p[i+2],bz=p[i+3];if(x<Math.min(ax,bx)-m||x>Math.max(ax,bx)+m||z<Math.min(az,bz)-m||z>Math.max(az,bz)+m)continue;const dx=bx-ax,dz=bz-az,L=dx*dx+dz*dz||1,u=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/L));if(Math.hypot(x-ax-u*dx,z-az-u*dz)<m)return true}}return false};
const palm=(f,lx,y0,lz)=>{if(onRd(f,lx,lz))return;cyl(f,lx,y0,lz,.4,.3,8,'#6b4a2b',6);cyl(f,lx,y0+6,lz,4.4,0,6.5,'#2f7d32',7);cyl(f,lx,y0+9,lz,3.2,0,5.5,'#3f8f3a',7)};
const tree=(f,lx,y0,lz)=>{if(onRd(f,lx,lz))return;cyl(f,lx,y0,lz,.4,.35,5,'#6b4a2b',6);cyl(f,lx,y0+3.5,lz,3.6,0,6,'#2f7d32',7)};

/* ---------- জাতীয় সংসদ ভবন (মানিক মিয়া এভিনিউর পাশে, ফার্মগেট–বিজয় সরণির মাঝে) ---------- */
function sangsad(){const f={x:-2420,z:-3340,a:Math.PI/2},CON='#bdbab1',CON2='#c9c6bd',BAND='#ecebe4',BRK='#8d3c2f',BRK2='#98462f',DK='#2b2e33',Y0=6.6;
box(f,0,.09,238,330,.18,215,'#4dbb3a');box(f,0,.2,238,13,.12,215,'#d4d2c8');
box(f,-158,.2,0,36,.3,250,'#4a9fcb');box(f,158,.2,0,36,.3,250,'#4a9fcb');
box(f,0,2,0,280,4,250,BRK);box(f,0,5.3,0,250,2.6,222,BRK2);
for(let k=0;k<6;k++){const h=Y0-(k+1)*1.1;box(f,0,h/2,111+2.2*k+1.1,70,h,2.2,'#a04a36')}
cyl(f,0,Y0,0,40,40,30,CON,8);cyl(f,0,Y0+30,0,36,36,1.2,'#a9a69d',8);cyl(f,0,Y0+31.2,0,27,27,9,CON2,8);cyl(f,0,Y0+40.2,0,23,23,1,'#a9a69d',8);cyl(f,0,Y0+41.2,0,15,15,5,CON,8);
for(const s of[-1,1]){box(f,s*14,Y0+36,37.6,9,8,.3,DK);box(f,s*14,Y0+24,37.6,5,12,.3,DK)}
const B=[[-88,62,66,50,28],[88,62,66,50,28],[-112,-30,56,72,24],[112,-30,56,72,24],[-60,-72,60,44,26],[60,-72,60,44,26]];
for(const[lx,lz,sx,sz,h]of B){box(f,lx,Y0+h/2,lz,sx,h,sz,CON);box(f,lx,Y0+h+.4,lz,sx+1.2,.8,sz+1.2,'#a8a59c');
for(let k=1;k<h/4.5;k++){box(f,lx,Y0+k*4.5,lz+sz/2+.06,sx+.1,.22,.12,BAND);box(f,lx,Y0+k*4.5,lz-sz/2-.06,sx+.1,.22,.12,BAND);box(f,lx+sx/2+.06,Y0+k*4.5,lz,.12,.22,sz+.1,BAND);box(f,lx-sx/2-.06,Y0+k*4.5,lz,.12,.22,sz+.1,BAND)}
for(let x=-sx/2+7;x<sx/2;x+=7)box(f,lx+x,Y0+h/2,lz+sz/2+.06,.2,h,.12,BAND)}
for(const s of[-1,1]){tri2(f,s*100,Y0+2,87.2,12,19,DK);disc(f,s*76,Y0+16,87.2,6.2,DK);tri2(f,s*118,Y0+2,87.2,10,15,DK)}
for(const s of[-1,1]){cyl(f,s*17,Y0,80,15,15,27,CON,16);for(let j=0;j<16;j+=2){const a=j/16*6.2832;box(f,s*17+Math.cos(a)*15.1,Y0+13.5,80+Math.sin(a)*15.1,.4,27,.4,BAND,-a)}cyl(f,s*17,Y0+27,80,15.6,15.6,.8,'#a8a59c',16)}
box(f,0,Y0+13.5,74,8,27,16,CON2);box(f,0,Y0+4,83.2,7,8,.3,DK);
pole(f,0,Y0,106,30);
for(let i=-5;i<=5;i++){if(!i)continue;const lx=i*21;box(f,lx,Y0+4,112,.6,8,.6,DK);box(f,lx,Y0+8.2,112,3,.5,.5,'#777')}
for(let lz=140;lz<=335;lz+=13){for(const s of[-1,1]){palm(f,s*172,0,lz);tree(f,s*186,0,lz+6)}}
for(let lz=150;lz<=330;lz+=22)for(const s of[-1,1])tree(f,s*40,0,lz);
reg(f,0,0,280,250)}

/* ---------- বায়তুল মোকাররম জাতীয় মসজিদ ---------- */
function baitul(){const f={x:225,z:332,a:0},CR='#ece4c9',YL='#f0d89c',MB='#f2f0ea',BK='#1c1c1c',AR='#1f6f8f';
box(f,0,.12,43,100,.24,9,'#e9e6dd');
box(f,0,22,-20,58,44,40,CR);for(const y of[31,33.6,36.2]){box(f,0,y,.06,58.2,.9,.2,BK);box(f,-29.06,y,-20,.2,.9,40.2,BK);box(f,29.06,y,-20,.2,.9,40.2,BK);box(f,0,y,-40.06,58.2,.9,.2,BK)}
box(f,0,44.3,-20,59,.6,41,'#d8cfb0');box(f,2,48,-18,16,7,14,'#3f8fd0');box(f,2,51.6,-18,17,.5,15,'#cfd8e0');
box(f,0,6,12,118,12,22,YL);box(f,0,12.3,12,119,.6,23,MB);for(const z of[3,9,15,21])box(f,0,12.65,z,118,.06,.3,'#2a2a2a');
box(f,0,7.5,24.5,34,15,4,YL);arch(f,0,0,26.6,9,9.5,AR);arch(f,-8.5,0,26.6,5,7,AR);arch(f,8.5,0,26.6,5,7,AR);
for(const s of[-1,1])for(let i=0;i<9;i++){arch(f,s*(21+i*4.1),1.4,23.2,1.7,6,'#2a2f3a')}
plane(f,0,17.2,26.8,13,4.2,cv(512,160,(x,w,h)=>{x.fillStyle=YL;x.fillRect(0,0,w,h);x.fillStyle='#b9444d';x.font='700 96px "Amiri","Scheherazade New","Noto Naskh Arabic","Times New Roman",serif';x.textAlign='center';x.textBaseline='middle';x.fillText('ٱللَّٰهُ أَكْبَر',w/2,h/2)}),0);
for(let k=0;k<6;k++){const h=3.2-k*.5;box(f,0,h/2,28+k*1.9,62,h,1.9,'#f4f3ee')}
cyl(f,-50,0,-34,2.6,2.0,34,'#f1efe6',10);cyl(f,-50,34,-34,3.4,3.4,1,'#d9d3bf',10);cyl(f,-50,35,-34,2.1,1.7,8,'#f1efe6',10);cyl(f,-50,43,-34,2.4,0,4.5,'#d7c37a',10);
pole(f,36,0,44,26);
reg(f,0,-20,58,40);reg(f,0,12,118,22);reg(f,0,31,62,12)}

/* ---------- বঙ্গবন্ধু জাতীয় স্টেডিয়াম ---------- */
function bangabandhu(){const cx=308,cz=473,A=118,B=92,N=40,f={x:cx,z:cz,a:0},SEAT=['#8d9096','#8d9096','#b53a36','#8d9096','#c9482e','#8d9096'];
ell(cx,cz,47,35,.12,'#46b034',N);ann(cx,cz,47,35,58,44,.16,'#a85a3a',N);
for(let k=0;k<6;k++){const a0=108-8.5*k,b0=83-6.6*k,a1=a0-8.5,b1=b0-6.6,h=15-2*k;ann(cx,cz,a1,b1,a0,b0,h,'#8d9096',N,i=>SEAT[(i*7+k*3)%SEAT.length]);wall(cx,cz,a0,b0,h-2,h,'#7a7d83',N)}
wall(cx,cz,A,B,0,16,'#d6c9a6',N);ann(cx,cz,108,83,A,B,16.1,'#c9bd9a',N);
for(let i=0;i<N;i++){const t0=i/N*6.2832,t1=(i+1)/N*6.2832,tm=(t0+t1)/2,k=col(i%8===3?'#e8742c':'#f3efe3');
const O0=EP_(cx,cz,122,96,t0,15),O1=EP_(cx,cz,122,96,t1,15),I0=EP_(cx,cz,84,64,t0,17.5),I1=EP_(cx,cz,84,64,t1,17.5),M=EP_(cx,cz,106,82,tm,23.5);
tri(O0,O1,M,k);tri(O1,I1,M,k);tri(I1,I0,M,k);tri(I0,O0,M,k);
const m=EP_(cx,cz,122,96,t0,15);box(f,m[0]-cx,19,m[2]-cz,.5,8,.5,'#e8e8e8')}
for(const[sx,sz]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const lx=sx*(A+16),lz=sz*(B+12);box(f,lx,30,lz,1.4,60,1.4,'#8a8f96');box(f,lx,60.5,lz,11,6,1.4,'#fff9d6',Math.atan2(sz,sx))}
box(f,0,18,-B+8,26,9,1.2,'#15181c');
for(let i=0;i<20;i++){const t=(i+.5)/20*6.2832,x=(A-6)*Math.cos(t),z=(B-6)*Math.sin(t),tx=-(A-6)*Math.sin(t),tz=(B-6)*Math.cos(t);reg(f,x,z,Math.hypot(tx,tz)*6.2832/20*1.15,14,Math.atan2(tz,tx))}}

/* ---------- শেরেবাংলা জাতীয় ক্রিকেট স্টেডিয়াম (মিরপুর ১০ মেট্রো থেকে ১৫০ মি পূর্বে) ---------- */
function cricket(){const cx=-4014,cz=-8470,A=138,B=112,N=44,f={x:cx,z:cz,a:0},SEAT=['#2d5fa8','#2d5fa8','#b53a36','#8d9096','#2d5fa8','#c9a52e'];
ell(cx,cz,70,57,.12,'#52c03f',N);ann(cx,cz,69,56,70,57,.2,'#f4f4f0',N);box(f,0,.3,0,3.4,.1,22,'#cdb98a');
for(const z of[-9.5,9.5])box(f,0,.36,z,4.6,.06,.12,'#fff');
for(let k=0;k<7;k++){const a0=126-9*k,b0=101-7*k,a1=a0-9,b1=b0-7,h=18-2.2*k;ann(cx,cz,a1,b1,a0,b0,h,'#2d5fa8',N,i=>SEAT[(i*5+k*2)%SEAT.length]);wall(cx,cz,a0,b0,h-2.2,h,'#6c7078',N)}
wall(cx,cz,A,B,0,17,'#9b4636',N);for(const y of[4.5,9,13.5])wall(cx,cz,A+.06,B+.06,y,y+.35,'#7e3a2c',N);
wall(cx,cz,A+.1,B+.1,17,20,'#d8d0b0',N);
for(let i=0;i<N;i++){const t0=i/N*6.2832,t1=(i+1)/N*6.2832,tm=(t0+t1)/2;
if(Math.cos(tm)<-.15){const k=col('#f4f2eb'),k2=col('#d9d9d4'),O0=EP_(cx,cz,142,116,t0,19),O1=EP_(cx,cz,142,116,t1,19),I0=EP_(cx,cz,92,72,t0,22),I1=EP_(cx,cz,92,72,t1,22),M=EP_(cx,cz,118,94,tm,30),M2=EP_(cx,cz,100,78,tm,27);
tri(O0,O1,M,k);tri(O1,I1,M2,k);tri(I1,I0,M2,k);tri(I0,O0,M,k);tri(O0,M,M2,k2);tri(O1,M,M2,k2)}
else{ann(cx,cz,112,92,A+4,B+4,20.2,'#a9adb2',N)}}
wall(cx,cz,A+4,B+4,19,20.2,'#6c7078',N);
box(f,112,24,0,2,9,24,'#15181c');box(f,112,24,-27,1.6,7,10,'#15181c');
for(let i=0;i<6;i++){const t=(i+.5)/6*6.2832,x=(A+14)*Math.cos(t),z=(B+12)*Math.sin(t);box(f,x,31,z,1.4,62,1.4,'#8a8f96');box(f,x,62,z,12,6,1.4,'#fff9d6',t+1.5708)}
for(let i=0;i<22;i++){const t=(i+.5)/22*6.2832,x=(A-7)*Math.cos(t),z=(B-7)*Math.sin(t),tx=-(A-7)*Math.sin(t),tz=(B-7)*Math.cos(t);reg(f,x,z,Math.hypot(tx,tz)*6.2832/22*1.15,14,Math.atan2(tz,tx))}
/* দেয়ালের নাম-ফলক: বাঁকা ফিতা, ইটের দেয়াল ঘেঁষে */
const tex=cv(2048,256,(x,w,h)=>{x.clearRect(0,0,w,h);x.textAlign='center';x.textBaseline='middle';x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=6;x.shadowOffsetY=4;x.fillStyle='#e9e9e6';x.font='700 104px Arial,Helvetica,sans-serif';if('letterSpacing'in x)x.letterSpacing='5px';x.fillText('SHER-E-BANGLA NATIONAL CRICKET STADIUM',w/2,92);
x.shadowBlur=3;x.fillStyle='#d8d8d4';x.font='700 58px Arial,Helvetica,sans-serif';if('letterSpacing'in x)x.letterSpacing='2px';x.fillText('Bangladesh Cricket Board',w/2+120,196);
x.shadowBlur=0;x.fillStyle='#1f8f4e';x.beginPath();x.moveTo(w/2-420,150);x.lineTo(w/2-340,150);x.lineTo(w/2-340,205);x.quadraticCurveTo(w/2-380,246,w/2-420,205);x.closePath();x.fill();x.lineWidth=6;x.strokeStyle='#e0b83a';x.stroke();x.fillStyle='#e98a2a';x.beginPath();x.arc(w/2-380,184,20,0,6.2832);x.fill()});
const g=new THREE.BufferGeometry(),pp=[],uu=[],ii=[],M=14,span=.5;
for(let j=0;j<=M;j++){const th=Math.PI+(.5-j/M)*span,x=cx+(A+.45)*Math.cos(th),z=cz+(B+.45)*Math.sin(th);pp.push(x,6.5,z,x,15.1,z);uu.push(j/M,0,j/M,1);if(j<M){const a=2*j;ii.push(a,a+2,a+1,a+1,a+2,a+3)}}
g.setAttribute('position',new THREE.Float32BufferAttribute(pp,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uu,2));g.setIndex(ii);g.computeVertexNormals();
sc.add(new THREE.Mesh(g,new THREE.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.03,side:THREE.DoubleSide})))}

for(const fn of[sangsad,baitul,bangabandhu,cricket]){try{fn()}catch(e){console.error('landmark',fn.name,e)}}
if(P.length){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.setAttribute('color',new THREE.Float32BufferAttribute(C,3));g.computeVertexNormals();sc.add(new THREE.Mesh(g,new THREE.MeshLambertMaterial({vertexColors:true,side:THREE.DoubleSide})))}
window.LANDMARKS={tris:P.length/9}
})();
