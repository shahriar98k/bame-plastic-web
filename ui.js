/* start-screen helpers: Enter key starts the game, name box scrolls into view above the keyboard */
(function(){const u=document.getElementById('un'),go=document.getElementById('go');if(!u||!go)return;
u.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();u.blur();go.click()}});
u.addEventListener('focus',()=>{setTimeout(()=>{try{u.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}},350)});
go.addEventListener('touchend',()=>{try{u.blur()}catch(e){}},{passive:true})})();

/* start-screen leaderboard: opens from the 🏆 button, same daily / weekly / monthly lists as the score screen */
(function(){const P=document.getElementById('lbp'),B=document.getElementById('lbo');if(!P||!B)return;
let tab='d',C={};const T={d:'দিনের সেরা ২০টা চ্যাড',w:'সপ্তাহের শ্রেষ্ঠ ২০ চ্যাডবাজ',m:'মাসিক সর্বশ্রেষ্ঠ ২০ চ্যাড সম্রাট'};
function local(){try{return lbLoad().filter(x=>inRange(x.t,tab)).sort((a,b)=>b.l-a.l).slice(0,20).map(x=>({n:x.n,l:x.l}))}catch(e){return[]}}
function draw(){const c=C[tab],on=BPNET.enabled,rows=c&&c.rows?c.rows.map(x=>({n:x.name,l:x.score,me:x.mine})):(on&&(!c||!c.done)?null:local());
let h='<div class="paper"><h2>🏆 লিডারবোর্ড</h2><div class="tabs">'+[['d','আজ'],['w','সপ্তাহ'],['m','মাস']].map(x=>'<button data-k="'+x[0]+'" class="'+(tab===x[0]?'on':'')+'">'+x[1]+'</button>').join('')+'</div><div class="pl">'+PL[tab]+'</div><table>';
h+=rows===null?'<tr><td>লোড হচ্ছে…</td><td></td></tr>':(rows.length?rows.map((x,i)=>'<tr'+(x.me?' class="me"':'')+'><td>'+bn(i+1)+'. '+esc(x.n)+'</td><td>'+fm(x.l)+'</td></tr>').join(''):'<tr><td>এখনো কেউ নেই</td><td></td></tr>');
h+='</table><div class="sub">'+(c&&c.rows?T[tab]:(on?'অনলাইন স্কোরবোর্ড এখন পাওয়া যাচ্ছে না — আপাতত এই ফোনের স্কোর দেখানো হচ্ছে।':'স্কোরবোর্ড শুধু এই ফোনে সংরক্ষিত।'))+'</div><button class="again" id="lbx">বন্ধ করুন</button></div>';
P.innerHTML=h;P.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{tab=b.dataset.k;load()});document.getElementById('lbx').onclick=()=>{P.style.display='none'}}
function load(){const t=tab;draw();if(!BPNET.enabled)return;const c=C[t];if(c&&c.done&&Date.now()-c.t<15000)return;C[t]={rows:c?c.rows:null,t:Date.now()};BPNET.top(t).then(r=>{C[t]={rows:r,t:Date.now(),done:1};if(P.style.display==='block'&&tab===t)draw()})}
B.onclick=()=>{P.style.display='block';P.scrollTop=0;load()};
B.addEventListener('touchend',()=>{try{document.getElementById('un').blur()}catch(e){}},{passive:true})})();
