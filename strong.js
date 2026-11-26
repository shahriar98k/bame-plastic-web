/* strong.js — buses, trucks and double-deckers are heavy and strong.
   They never fly and never end the run. A car moves them only a little; light vehicles bounce back and feel the hit.
   game1.js npcContact() calls BPBIG(). Returns true when the hit is handled here. */
(function(){
window.BPBIG=function(v,best,T,mw){
  if(typeof PV==='undefined'||typeof S==='undefined')return false;
  const sh=Math.sin(S.h),ch=Math.cos(S.h),sg=Math.sign(S.vf||1),spd=Math.abs(S.vf);
  /* player is always pushed out of the big vehicle, the big vehicle stays where it is */
  S.x+=best.nx*(best.pen+.02);S.z+=best.nz*(best.pen+.02);
  const inw=(best.nx*sh-best.nz*ch)*sg;           /* below 0: the player is driving into it */
  v.hold=Math.max(v.hold||0,.5);
  if(inw>=0)return true;                           /* moving away: nothing more */
  if(hitCd>0){S.vf*=.55;return true}               /* still pressing on it: just slow down */
  if(spd<1.5){S.vf*=.35;return true}
  hitCd=.7;
  const M=PV.mass,mr=M/(M+mw);
  /* 1. the big vehicle slides a little: sideways (lane offset) and front/back (along the road) */
  try{
    const push=Math.min(1.1,(.12+spd*.04)*(.35+mr*1.3)),px=-best.nx*push,pz=-best.nz*push;
    if(v.ri!==undefined&&typeof at==='function'&&CUM[v.ri]){
      const a0=at(v.ri,v.s),last=CUM[v.ri][CUM[v.ri].length-1];
      v.s=Math.max(0,Math.min(last,v.s+px*a0[2]+pz*a0[3]));
      if(v.off!==undefined)v.off+=px*(a0[3]*v.dir)+pz*(-a0[2]*v.dir);
    }
  }catch(e){}
  /* 2. the player feels the hit — the lighter the vehicle, the harder */
  let shk,snd,dmg;
  if(M<=6.5){S.vf=-sg*spd*Math.min(.55,.3+spd*.015);shk=.35+Math.min(.65,spd/16);snd=.9;dmg=.4}   /* bike, cycle, auto, CNG, rickshaw: bounce back */
  else if(M<15){S.vf*=.3;shk=.15+Math.min(.4,spd/40);snd=.45;dmg=.2}                                  /* car and similar: a small jolt */
  else{S.vf*=.5;shk=.12+Math.min(.3,spd/50);snd=.4;dmg=.15}                                           /* heavy vehicle: firm but small */
  try{vehSnd();fx(v.px,2,v.pz);shake(Math.min(1,shk));crashSnd(snd);
    crime(CRK[v.type]*dmg*(.4+Math.min(1.2,spd/14)),'💥 '+T.n+'-এ ধাক্কা!','veh')}catch(e){}
  return true;
};
})();
