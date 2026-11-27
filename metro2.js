/* metro2.js — Dhaka metro under-line:
   1) mural pillars (July uprising, 1971, Family Card, Krishak Card, school pledge ...)
   2) a median barrier between the two carriageways with a break (gap + cross street) about every 200 m
   Loaded before game1.js. game1.js calls BPM2() once, right after it builds the pillars,
   and calls BPMED(x,z) from hit() so the median is solid. */
(function(){
const TW=256,TH=1536,NT=12,FONT='"Hind Siliguri","Noto Sans Bengali","Vrinda",sans-serif';
function RND(s){return()=>(s=(s*1664525+1013904223)%4294967296)/4294967296}
function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function txt(g,s,x,y,mw,sz,col,al,stroke){let z=sz;g.font='700 '+z+'px '+FONT;while(g.measureText(s).width>mw&&z>16){z-=2;g.font='700 '+z+'px '+FONT}g.textAlign=al||'center';g.textBaseline='middle';if(stroke){g.lineJoin='round';g.lineWidth=stroke[1];g.strokeStyle=stroke[0];g.strokeText(s,x,y)}g.fillStyle=col;g.fillText(s,x,y);return z}
function person(g,x,y,h,o){o=o||{};const s=h/100,sk=o.skin||'#d9a066',sh=o.shirt||'#4a7bc8',pa=o.pants||'#3b3b44';g.lineCap='round';
 g.fillStyle=pa;g.fillRect(x-14*s,y-42*s,12*s,42*s);g.fillRect(x+2*s,y-42*s,12*s,42*s);
 g.fillStyle=sh;rr(g,x-17*s,y-78*s,34*s,42*s,8*s);g.fill();
 g.strokeStyle=sh;g.lineWidth=9*s;
 const up=o.fist||'';
 g.beginPath();g.moveTo(x+15*s,y-72*s);g.lineTo(up==='R'||up==='B'?x+25*s:x+22*s,up==='R'||up==='B'?y-102*s:y-48*s);g.stroke();
 g.beginPath();g.moveTo(x-15*s,y-72*s);g.lineTo(up==='L'||up==='B'?x-25*s:x-22*s,up==='L'||up==='B'?y-102*s:y-48*s);g.stroke();
 g.fillStyle=sk;
 g.beginPath();g.arc(up==='R'||up==='B'?x+25*s:x+22*s,up==='R'||up==='B'?y-105*s:y-46*s,5.5*s,0,7);g.fill();
 g.beginPath();g.arc(up==='L'||up==='B'?x-25*s:x-22*s,up==='L'||up==='B'?y-105*s:y-46*s,5.5*s,0,7);g.fill();
 g.beginPath();g.arc(x,y-90*s,12*s,0,7);g.fill();
 g.fillStyle=o.hair||'#1b1b1b';g.beginPath();g.arc(x,y-93*s,12.6*s,Math.PI,0);g.fill();
 if(o.long){g.fillRect(x-12.6*s,y-93*s,5*s,22*s);g.fillRect(x+7.6*s,y-93*s,5*s,22*s)}
 if(o.beard){g.beginPath();g.arc(x,y-86*s,11*s,.1,Math.PI-.1);g.fill()}
 if(o.scarf){g.strokeStyle=o.scarf;g.lineWidth=7*s;g.beginPath();g.moveTo(x-14*s,y-78*s);g.lineTo(x+14*s,y-78*s);g.stroke()}
 if(o.band){g.fillStyle=o.band;g.fillRect(x-12.5*s,y-98*s,25*s,4.5*s)}}
function sil(g,x,y,h,fist,col){person(g,x,y,h,{skin:col||'#0d0d0d',shirt:col||'#0d0d0d',pants:col||'#0d0d0d',hair:col||'#0d0d0d',fist:fist})}
function crowd(g,y0,y1,n,seed,cols,hs,fistP){const R=RND(seed);for(let i=0;i<n;i++){const x=14+R()*(TW-28),y=y0+R()*(y1-y0),h=hs[0]+R()*(hs[1]-hs[0]);if(cols)person(g,x,y,h,{shirt:cols[Math.floor(R()*cols.length)],pants:'#2d2d36',skin:R()<.5?'#c88a56':'#e0b07c',hair:'#1a1a1a',fist:R()<fistP?(R()<.5?'R':'L'):''});else sil(g,x,y,h,R()<fistP?(R()<.5?'R':'L'):'')}}
function flag(g,x,y,w,h){g.fillStyle='#0b7a3f';g.fillRect(x,y,w,h);g.fillStyle='#d72638';g.beginPath();g.arc(x+w*.46,y+h/2,h*.3,0,7);g.fill()}
function fist(g,cx,cy,w,fill,line){const f=w/4;g.fillStyle=fill;g.strokeStyle=line;g.lineWidth=Math.max(3,w*.045);g.lineJoin='round';
 rr(g,cx-w*.5,cy-w*.12,w,w*.78,w*.14);g.fill();g.stroke();
 for(let i=0;i<4;i++){rr(g,cx-w*.5+i*f+f*.04,cy-w*.5,f*.92,w*.5,f*.4);g.fill();g.stroke()}
 rr(g,cx-w*.64,cy+w*.0,w*.3,w*.34,w*.12);g.fill();g.stroke();
 rr(g,cx-w*.38,cy+w*.6,w*.76,w*1.3,w*.1);g.fill();g.stroke()}
function pole(g,x,y,len,col){g.strokeStyle=col||'#222';g.lineWidth=5;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+len);g.stroke()}
function lines(g,arr,x,y0,gap,mw,sz,col,al){arr.forEach((s,i)=>txt(g,s,x,y0+i*gap,mw,sz,Array.isArray(col)?col[i%col.length]:col,al))}

const T=[];
/* 0 — "if you fear, you are finished; if you stand, you are Bangladesh" */
T[0]=g=>{g.fillStyle='#d4222a';g.fillRect(0,0,TW,TH);
 g.fillStyle='#111';rr(g,8,28,240,330,24);g.fill();
 lines(g,['যদি তুমি ভয় পাও','তবে তুমি শেষ','যদি তুমি রুখে দাঁড়াও','তবে তুমি বাংলাদেশ'],128,88,72,222,46,['#fff','#ffc928','#fff','#ffc928']);
 g.fillStyle='#1f7a45';g.beginPath();g.arc(150,700,120,Math.PI,0);g.fill();
 pole(g,52,520,320,'#222');flag(g,54,522,70,46);
 person(g,150,1120,560,{shirt:'#f1e6cf',pants:'#444',skin:'#c98e5b',beard:1,scarf:'#1d6b43',fist:'L'});
 crowd(g,1180,1500,16,11,['#4a7bc8','#9a6a3a','#e8d9b5','#2f8f5a','#a33'],[150,230],.25);
 g.fillStyle='rgba(90,0,0,.45)';for(let i=0;i<8;i++)g.fillRect(10+i*31,1450+(i%3)*14,12,90)};
/* 1 — Nazrul, "Bidrohi" */
T[1]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);g.fillStyle='#d9232d';g.fillRect(0,0,TW,640);
 g.strokeStyle='#fff';g.lineWidth=14;g.beginPath();g.moveTo(-10,70);g.quadraticCurveTo(120,10,270,90);g.stroke();
 g.strokeStyle='#0b7a3f';g.lineWidth=8;g.beginPath();g.moveTo(-10,100);g.quadraticCurveTo(130,40,270,120);g.stroke();
 lines(g,['আমি চির-','বিদ্রোহী বীর','বিশ্ব ছাড়ায়ে','উঠিয়াছি একা','চির-উন্নত শির!'],128,200,86,228,52,'#fff');
 fist(g,128,760,150,'#fff','#111');
 flag(g,150,1010,86,56);pole(g,150,1000,330,'#111');sil(g,100,1480,300,'');
 g.fillStyle='#0b7a3f';for(let i=0;i<10;i++){g.beginPath();g.moveTo(14+i*24,1536);g.lineTo(24+i*24,1480-(i%3)*18);g.lineTo(34+i*24,1536);g.fill()}};
/* 2 — Lal Julai (red) */
T[2]=g=>{g.fillStyle='#d6252d';g.fillRect(0,0,TW,TH);
 lines(g,['লাল','জুলাই'],128,150,140,230,128,'#ffd21f',null);
 person(g,72,1060,430,{shirt:'#e0485a',pants:'#222',skin:'#f3c21a',beard:1,fist:'R',hair:'#111'});
 person(g,184,1060,410,{shirt:'#c43a52',pants:'#222',skin:'#f3c21a',fist:'L',long:1,hair:'#111'});
 g.fillStyle='#0d0d0d';g.fillRect(0,1400,TW,136);crowd(g,1330,1520,18,22,null,[130,210],.6)};
/* 3 — yellow wall with fist */
T[3]=g=>{g.fillStyle='#e8b823';g.fillRect(0,0,TW,TH);
 g.fillStyle='#d92b3a';[[40,130,90,42],[150,70,100,36],[90,260,110,40],[200,330,70,34],[40,400,80,32]].forEach(c=>{g.beginPath();g.ellipse(c[0]+c[2]/2,c[1],c[2]/2,c[3],0,0,7);g.fill()});
 pole(g,28,500,420,'#2a2a2a');flag(g,30,502,86,54);
 fist(g,138,760,150,'#101010','#e8b823');
 g.fillStyle='#14341f';crowd(g,1250,1520,14,33,null,[110,170],.55);
 g.fillStyle='#d92b3a';g.fillRect(0,1500,TW,36)};
/* 4 — Krishak Card */
T[4]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);
 g.fillStyle='#1c8a4a';g.fillRect(0,0,TW,330);g.fillStyle='#4ab36c';for(let i=0;i<14;i++){g.beginPath();g.ellipse(20+i*18,30+(i%4)*60,14,26,.5,0,7);g.fill()}
 g.save();g.translate(130,190);g.rotate(-.12);g.fillStyle='#13683a';rr(g,-90,-70,180,130,14);g.fill();g.fillStyle='#fff';rr(g,-76,-56,56,56,6);g.fill();g.fillStyle='#e8d9b5';g.fillRect(-10,-52,80,8);g.fillRect(-10,-36,80,8);g.fillRect(-10,-20,60,8);g.restore();
 g.fillStyle='#e0b07c';rr(g,20,230,120,60,26);g.fill();rr(g,10,200,70,50,20);g.fill();
 g.fillStyle='#1c8a4a';g.fillRect(0,330,TW,130);txt(g,'কৃষক কার্ড',128,395,230,70,'#ffd21f');
 txt(g,'বার্ষিক আর্থিক সহায়তা',128,505,236,36,'#111');
 g.fillStyle='#1c8a4a';g.fillRect(0,560,TW,330);lines(g,['নিবন্ধিত ভূমিহীন,','প্রান্তিক ও ক্ষুদ্র','কৃষকদের বার্ষিক','২,৫০০ টাকা','সহায়তা দেওয়া হয়।'],128,610,64,230,38,'#fff');
 txt(g,'কৃষি উপকরণ',128,950,236,44,'#1a4d2e');
 g.fillStyle='#1c8a4a';g.fillRect(0,1010,TW,330);lines(g,['সহজে সার, বীজ ও','প্রয়োজনীয় কৃষি','উপকরণ প্রাপ্তি।'],128,1100,70,230,38,'#fff');
 g.fillStyle='#1c8a4a';g.fillRect(0,1400,TW,136)};
/* 5 — 1971 and 2024 */
T[5]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);
 g.fillStyle='#d72638';g.beginPath();g.arc(128,260,112,0,7);g.fill();
 [[70,330,.9],[130,300,1.2],[190,340,.9]].forEach(([x,y,k])=>{sil(g,x,y,170*k,'');g.strokeStyle='#111';g.lineWidth=7;g.beginPath();g.moveTo(x-30*k,y-60*k);g.lineTo(x+40*k,y-170*k);g.stroke()});
 txt(g,'১৯৭১',128,450,230,104,'#fff',null,['#d72638',10]);txt(g,'মুক্তিযুদ্ধ',128,540,230,46,'#111');
 g.fillStyle='#0b7a3f';g.beginPath();g.moveTo(40,640);g.bezierCurveTo(10,720,60,800,50,900);g.bezierCurveTo(100,980,150,960,200,900);g.bezierCurveTo(240,820,230,720,210,650);g.bezierCurveTo(160,600,90,610,40,640);g.fill();
 g.fillStyle='#d72638';g.beginPath();g.arc(120,760,56,0,7);g.fill();
 g.fillStyle='#fff';g.beginPath();g.moveTo(70,900);g.lineTo(120,770);g.lineTo(170,900);g.closePath();g.fill();g.fillStyle='#111';g.fillRect(104,860,32,40);
 [[60,1220],[128,1190],[196,1220]].forEach(([x,y])=>person(g,x,y,260,{shirt:'#efe3c8',pants:'#333',skin:'#c98e5b',band:'#d72638',fist:'B'}));
 pole(g,214,1000,200,'#222');flag(g,168,1002,70,44);
 txt(g,'২০২৪',128,1340,230,104,'#fff',null,['#d72638',10]);txt(g,'আন্দোলন',128,1430,230,46,'#111')};
/* 6 — Bloody July */
T[6]=g=>{g.fillStyle='#d6252d';g.fillRect(0,0,TW,TH);
 g.strokeStyle='#111';g.lineWidth=5;for(let i=0;i<22;i++){g.beginPath();g.moveTo(10+i*12,0);g.lineTo(-40+i*12,330+(i%4)*30);g.stroke()}
 g.fillStyle='#f3c21a';g.beginPath();g.arc(52,300,26,0,7);g.fill();
 g.fillStyle='#111';rr(g,70,560,84,220,22);g.fill();g.fillRect(78,770,30,330);g.fillRect(116,770,30,330);
 g.fillStyle='#f3c21a';g.beginPath();g.arc(112,520,32,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(112,514,34,Math.PI,0);g.fill();
 g.save();g.translate(124,690);g.rotate(-.08);g.fillStyle='#111';rr(g,-100,-22,200,44,20);g.fill();g.fillStyle='#f3c21a';g.beginPath();g.arc(-112,-4,22,0,7);g.fill();g.fillStyle='#111';g.beginPath();g.arc(-112,-10,23,Math.PI,0);g.fill();g.fillStyle='#f3c21a';g.fillRect(100,-14,46,16);g.restore();
 g.fillStyle='#f3c21a';g.fillRect(76,1090,32,26);g.fillRect(114,1090,32,26);
 g.strokeStyle='rgba(0,0,0,.65)';g.lineWidth=3;for(let i=0;i<34;i++){const x=8+(i*37)%240,y=420+((i*83)%700);g.beginPath();g.moveTo(x,y);g.lineTo(x,y+36+(i%3)*12);g.stroke()}
 txt(g,'রক্তাক্ত জুলাই',128,1330,236,64,'#ffd21f');txt(g,'BLOODY JULY IN BANGLADESH',128,1410,238,26,'#ffd21f')};
/* 7 — Family Card */
T[7]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);
 g.fillStyle='#d72638';g.beginPath();g.arc(86,130,66,0,7);g.fill();g.fillStyle='#f6c21a';g.beginPath();g.moveTo(60,90);g.bezierCurveTo(40,120,70,170,90,190);g.bezierCurveTo(120,150,130,110,100,90);g.closePath();g.fill();
 g.save();g.translate(180,110);g.rotate(.18);g.fillStyle='#5b2a84';rr(g,-60,-40,120,80,10);g.fill();g.fillStyle='#e9c46a';g.fillRect(-48,-26,26,18);g.fillStyle='#fff';g.fillRect(-10,-6,56,6);g.fillRect(-10,8,40,6);g.restore();
 g.fillStyle='#5b2a84';g.fillRect(0,280,TW,130);txt(g,'ফ্যামিলি কার্ড',128,345,230,62,'#ffd21f');
 txt(g,'আর্থিক সহায়তা',128,470,230,40,'#111');
 g.fillStyle='#5b2a84';g.fillRect(0,540,TW,640);
 lines(g,['যোগ্য ও নির্বাচিত','প্রতিটি পরিবারকে','প্রতি মাসে'],128,610,64,230,38,'#fff');
 txt(g,'২,৫০০ টাকা',128,830,236,66,'#ffd21f');
 lines(g,['করে আর্থিক সহায়তা','প্রদান করা হবে।'],128,960,64,230,38,'#fff')};
/* 8 — Hasina Palayan (faceless figures) */
T[8]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);
 lines(g,['হাসিনা','পলায়ন'],128,100,86,230,70,'#14783f');
 g.fillStyle='#f6b8cf';[[270,230],[560,230],[900,230]].forEach(b=>g.fillRect(0,b[0],TW,b[1]));
 g.fillStyle='#f4d52c';g.fillRect(0,500,TW,60);
 g.fillStyle='#b81d2b';g.fillRect(0,420,TW,90);
 crowd(g,520,620,14,81,['#d72638','#0b7a3f','#f4d52c'],[70,100],.7);
 g.fillStyle='#14783f';rr(g,120,330,110,60,6);g.fill();txt(g,'বাংলাদেশ',175,360,100,26,'#fff');sil(g,150,330,70,'R','#222');pole(g,200,260,60,'#222');flag(g,202,262,34,22);
 g.fillStyle='#161616';g.beginPath();g.moveTo(100,760);g.quadraticCurveTo(140,700,180,760);g.lineTo(200,1080);g.lineTo(80,1080);g.closePath();g.fill();
 g.fillStyle='#d9a066';g.beginPath();g.arc(140,710,30,0,7);g.fill();g.fillStyle='#161616';g.beginPath();g.arc(140,704,34,Math.PI,0);g.fill();g.fillRect(106,700,12,50);g.fillRect(162,700,12,50);
 g.fillStyle='#5a1c2a';rr(g,40,900,70,150,10);g.fill();g.strokeStyle='#222';g.lineWidth=5;g.beginPath();g.moveTo(75,900);g.lineTo(110,780);g.stroke();
 person(g,180,1330,300,{shirt:'#2f8f3a',pants:'#2f8f3a',skin:'#e0b07c',hair:'#2f8f3a'})};
/* 9 — school: education */
T[9]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);
 txt(g,'শিক্ষার উন্নয়নে',128,60,236,44,'#111');txt(g,'এগিয়ে',128,128,236,64,'#d72638');txt(g,'বাংলাদেশ',128,200,236,52,'#111');
 person(g,70,470,260,{shirt:'#3b66b8',pants:'#3b66b8',skin:'#d9a066',long:1});
 person(g,150,480,170,{shirt:'#fff',pants:'#1c3f8f',skin:'#d9a066'});person(g,205,480,170,{shirt:'#fff',pants:'#1c3f8f',skin:'#d9a066',long:1});
 g.fillStyle='#2a6fb8';g.fillRect(100,320,40,26);
 txt(g,'বিনামূল্যে পাঠ্যবই',128,540,236,34,'#111');
 person(g,150,860,230,{shirt:'#2aa365',pants:'#2aa365',skin:'#d9a066',long:1});person(g,70,880,180,{shirt:'#fff',pants:'#1c3f8f',skin:'#d9a066',long:1});
 txt(g,'উপবৃত্তি',128,940,236,44,'#111');
 g.fillStyle='#8a5a2b';g.fillRect(10,1140,236,20);person(g,80,1150,130,{shirt:'#fff',pants:'#1c3f8f',skin:'#d9a066'});person(g,176,1150,130,{shirt:'#fff',pants:'#1c3f8f',skin:'#d9a066',long:1});
 g.fillStyle='#f4d52c';g.fillRect(50,1146,40,12);txt(g,'স্কুল ফিডিং',128,1200,236,44,'#111');
 g.fillStyle='#d9534f';g.beginPath();g.moveTo(60,1330);g.lineTo(128,1280);g.lineTo(196,1330);g.fill();g.fillStyle='#f4e6c8';g.fillRect(70,1330,116,70);g.fillStyle='#8a5a2b';g.fillRect(118,1360,20,40)};
/* 10 — city pledge */
T[10]=g=>{g.fillStyle='#fff';g.fillRect(0,0,TW,TH);
 g.fillStyle='#1c6b3f';g.fillRect(0,0,TW,330);
 lines(g,['ঢাকা শহরে একজন','দায়িত্বশীল নাগরিক','হিসেবে আমি','অঙ্গীকার করছি:'],128,60,70,232,40,'#fff');
 const items=[['সবুজ, ওপেন স্পেস','দখল করব না।'],['সরকারি সম্পদ','রক্ষা করব।'],['সহযাত্রীদের প্রতি','শ্রদ্ধাশীল ও','সহনশীল থাকব।']];let y=420;
 items.forEach((it,i)=>{g.fillStyle='#d72638';g.beginPath();g.arc(30,y+8,18,0,7);g.fill();txt(g,['১','২','৩'][i],30,y+10,30,26,'#fff');it.forEach((l,j)=>txt(g,l,142,y+j*50,190,36,'#1b1b1b'));y+=it.length*50+90});
 g.fillStyle='#d72638';g.beginPath();g.arc(128,1250,70,0,7);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(128,1250,50,0,7);g.fill();g.fillStyle='#0b7a3f';g.beginPath();g.arc(128,1250,32,0,7);g.fill();
 g.fillStyle='#d72638';g.fillRect(112,1236,32,28);txt(g,'ঢাকা উত্তর সিটি কর্পোরেশন',128,1370,236,30,'#1c6b3f')};
/* 11 — in memory of the martyrs */
T[11]=g=>{g.fillStyle='#0f5a3a';g.fillRect(0,0,TW,TH);
 g.fillStyle='#d72638';g.beginPath();g.arc(128,640,150,0,7);g.fill();
 txt(g,'জুলাই ২০২৪',128,130,236,72,'#fff');txt(g,'শহীদদের স্মরণে',128,230,236,54,'#ffd21f');
 fist(g,128,560,130,'#fff','#111');
 txt(g,'আমরা ভুলব না',128,1000,236,58,'#fff');
 g.fillStyle='#ffd21f';for(let i=0;i<9;i++){g.beginPath();const cx=22+i*26,cy=1120;for(let k=0;k<10;k++){const a=k*Math.PI/5-Math.PI/2,r=k%2?4:10;g[k?'lineTo':'moveTo'](cx+Math.cos(a)*r,cy+Math.sin(a)*r)}g.fill()}
 crowd(g,1300,1520,16,111,null,[110,190],.6)};

function drawAtlas(c){const g=c.getContext('2d');
 for(let k=0;k<NT;k++){g.save();g.translate(k*TW,0);g.beginPath();g.rect(0,0,TW,TH);g.clip();
  try{T[k](g)}catch(e){console.error('mural',k,e)}
  g.fillStyle='rgba(0,0,0,.07)';for(let x=0;x<TW;x+=14)g.fillRect(x,0,3,TH);
  g.fillStyle='rgba(255,255,255,.05)';for(let x=3;x<TW;x+=14)g.fillRect(x,0,2,TH);
  g.restore()}}

function murals(){
 const m=window.MPILM;if(!m||!m.geometry)return;
 const pos=m.geometry.attributes.position,uv=m.geometry.attributes.uv;if(!pos||!uv)return;
 const nF=pos.count/6|0,fc=[];
 for(let f=0;f<nF;f++){let x=0,z=0;for(let i=0;i<6;i++){x+=pos.getX(f*6+i);z+=pos.getZ(f*6+i)}fc.push([x/6,z/6])}
 for(let f=0;f<nF;f++){const p=f>>2,f2=f&3;let px=0,pz=0;for(let j=0;j<4;j++){const q=fc[p*4+j];if(!q)continue;px+=q[0]/4;pz+=q[1]/4}
  let ox=fc[f][0]-px,oz=fc[f][1]-pz;const L=Math.hypot(ox,oz)||1;ox/=L;oz/=L;const rx=oz,rz=-ox;   /* viewer's right */
  const k=(p*5+f2*3)%NT;
  for(let i=0;i<6;i++){const vi=f*6+i,d=(pos.getX(vi)-fc[f][0])*rx+(pos.getZ(vi)-fc[f][1])*rz,y=pos.getY(vi);
   uv.setXY(vi,(k+(d>0?1:0))/NT,y>5?1:0)}}
 uv.needsUpdate=true;
 const c=document.createElement('canvas');c.width=TW*NT;c.height=TH;drawAtlas(c);
 const t=new THREE.CanvasTexture(c);t.minFilter=THREE.LinearFilter;t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;t.anisotropy=4;
 m.material.map=t;m.material.needsUpdate=true;
 const again=()=>{drawAtlas(c);t.needsUpdate=true};
 try{if(document.fonts&&document.fonts.load){document.fonts.load('700 40px "Hind Siliguri"','আমি ক').then(again).catch(()=>{});if(document.fonts.ready)document.fonts.ready.then(again).catch(()=>{})}}catch(e){}
 window.METROART={tiles:NT,faces:nF}}

/* ---------- median barrier + breaks every ~200 m ---------- */
const medAdd=s=>window.BPMEDADD&&window.BPMEDADD(s);

function breaks(A){
 const {D,MW,CU,TL,PIL,quad,Mesher}=A,BS=A.BS||[],nS=MW.length/2-1;
 const ptAt=d=>{let s=0;while(s<CU.length-2&&CU[s+1]<d)s++;const L=(CU[s+1]-CU[s])||1,f=(d-CU[s])/L,dx=MW[s*2+2]-MW[s*2],dz=MW[s*2+3]-MW[s*2+1],l=Math.hypot(dx,dz)||1;return{x:MW[s*2]+dx*f,z:MW[s*2+1]+dz*f,tx:dx/l,tz:dz/l,s}};
 const pilNear=(x,z)=>{let m=1e9;for(const p of PIL){const d=Math.abs(p[0]-x)+Math.abs(p[1]-z);if(d<m)m=d}return m};
 const cand=[];for(const arr of[D.r,D.x])for(const e of arr)if(e[0]>=20&&e[1].length>=4)cand.push([arr,e]);
 const findRoad=(x,z,tx,tz)=>{let best=null,bd=6;for(const[arr,e]of cand){const p=e[1];for(let i=0;i+3<p.length;i+=2){const dx=p[i+2]-p[i],dz=p[i+3]-p[i+1],L=Math.hypot(dx,dz)||1;if(Math.abs((dx*tx+dz*tz)/L)<.85)continue;let u=((x-p[i])*dx+(z-p[i+1])*dz)/(L*L);u=Math.max(0,Math.min(1,u));const qx=p[i]+dx*u,qz=p[i+1]+dz*u,d=Math.hypot(qx-x,qz-z);if(d<bd){bd=d;best={arr,e,i,u,qx,qz,L}}}}return best};
 const splitAt=h=>{const{arr,e,i,u,qx,qz,L}=h,p=e[1];let bx,bz,vi=-1;
  if(u*L<4)vi=i/2;else if((1-u)*L<4)vi=i/2+1;
  if(vi>=0){bx=p[vi*2];bz=p[vi*2+1];if(vi===0||vi*2+2>=p.length)return[bx,bz]}else{bx=qx;bz=qz}
  const p1=vi>=0?p.slice(0,vi*2+2):p.slice(0,i+2).concat([bx,bz]),p2=vi>=0?p.slice(vi*2):[bx,bz].concat(p.slice(i+2));
  const e1=[e[0],p1].concat(e.slice(2)),e2=[e[0],p2].concat(e.slice(2)),k=arr.indexOf(e);if(k<0)return null;arr[k]=e1;arr.push(e2);
  const ci=cand.findIndex(c=>c[1]===e);cand.splice(ci,1,[arr,e1],[arr,e2]);return[bx,bz]};
 const brk=[],zl=[];
 for(let t=200;t<TL-60;t+=200){let got=null;
  for(const o of[0,6,-6,12,-12,18,-18,24,-24,30,-30,36,-36,42,-42]){const d=t+o;if(d<30||d>TL-30)continue;const q=ptAt(d);
   if(!(BS[q.s]&&BS[q.s+1]))continue;if(pilNear(q.x,q.z)<16)continue;
   const h=findRoad(q.x,q.z,q.tx,q.tz);if(!h)continue;got={d,q,h};break}
  if(!got)continue;
  const sp=splitAt(got.h);if(!sp)continue;
  const bx=sp[0],bz=sp[1],tx=got.q.tx,tz=got.q.tz,nx=-tz,nz=tx;
  /* cross street through the median opening, so traffic can turn or change side */
  D.x.push([10,[bx-nx*17,bz-nz*17,bx,bz,bx+nx*17,bz+nz*17],'মেট্রোর নিচের মোড়']);
  quad([bx-nx*17,bz-nz*17],[bx+nx*17,bz+nz*17],10,.1,[.22,.23,.25]);
  /* opening in the median island, with stop lines */
  quad([bx-tx*9.5,bz-tz*9.5],[bx+tx*9.5,bz+tz*9.5],6.4,.42,[.22,.23,.25]);
  for(const sgn of[-1,1]){const cx=bx+tx*9*sgn,cz=bz+tz*9*sgn;quad([cx-nx*3.1,cz-nz*3.1],[cx+nx*3.1,cz+nz*3.1],.35,.44,[.95,.95,.95])}
  brk.push({x:bx,z:bz,d:got.d});zl.push({x:bx,z:bz,tx,tz,w:Math.min(24,got.h.e[0])})}
 /* barrier between the two carriageways, with a gap at every break */
 window.BPMETRO={MW};const RGX=window.BPRG?window.BPRG(D.r.concat(D.x),6):null;
 const M=new Mesher(),gx=new THREE.BoxGeometry(1,1,1),ks={};let segs=0;
 for(let k=0;k<nS;k++){if(!(BS[k]&&BS[k+1]))continue;const dm=(CU[k]+CU[k+1])/2;let gap=false;for(const b of brk)if(Math.abs(dm-b.d)<11){gap=true;break}if(gap)continue;
  const x0=MW[k*2],z0=MW[k*2+1],x1=MW[k*2+2],z1=MW[k*2+3],L=Math.hypot(x1-x0,z1-z0);if(L<1)continue;if(RGX&&RGX.cross((x0+x1)/2,(z0+z1)/2,(x1-x0)/L,(z1-z0)/L,-1,9))continue;
  const ry=Math.atan2(-(z1-z0),x1-x0),mx=(x0+x1)/2,mz=(z0+z1)/2;
  M.geo(gx,mx,.45,mz,L+.05,.9,.5,[.74,.74,.72],ry);M.geo(gx,mx,.95,mz,L+.05,.1,.34,[.92,.8,.1],ry);
  medAdd([x0,z0,x1,z1]);ks[k]=[x0,z0,x1,z1,ry];segs++}
 const capAt=(x,z,ry)=>{M.geo(gx,x,.6,z,1.1,1.2,1.1,[.95,.42,.05],ry);M.geo(gx,x,1.25,z,1.12,.25,1.12,[.97,.97,.97],ry)};
 for(const k in ks){const q=ks[k],i=+k;if(!ks[i-1])capAt(q[0],q[1],q[4]);if(!ks[i+1])capAt(q[2],q[3],q[4])}
 if(window.BPZEBRA)window.BPZEBRA(zl);
 if(segs&&typeof sc!=='undefined')sc.add(M.mesh());
 window.METROBRK={count:brk.length,segments:segs,list:brk.map(b=>[Math.round(b.x),Math.round(b.z),Math.round(b.d)])}}

window.BPM2=function(A){
 try{murals()}catch(e){console.error('BPM2 murals',e)}
 try{breaks(A)}catch(e){console.error('BPM2 breaks',e)}};
})();
