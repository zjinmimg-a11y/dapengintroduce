/* ===== 主题 ===== */
const root=document.documentElement,themeBtn=document.getElementById('themeBtn');
function syncThemeBtn(){themeBtn.textContent=root.dataset.theme==='dark'?'☀':'☾';}
themeBtn.onclick=()=>{const n=root.dataset.theme==='dark'?'light':'dark';root.dataset.theme=n;
  localStorage.setItem('dp-theme',n);syncThemeBtn();
  document.dispatchEvent(new CustomEvent('themechange',{detail:n}));};
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{
  if(!localStorage.getItem('dp-theme')){root.dataset.theme=e.matches?'dark':'light';syncThemeBtn();
    document.dispatchEvent(new CustomEvent('themechange',{detail:root.dataset.theme}));}});
syncThemeBtn();

/* ===== 基础 ===== */
const nav=document.getElementById('nav'),topBtn=document.getElementById('top-btn');
addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>10);topBtn.classList.toggle('show',scrollY>600);},{passive:true});
topBtn.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
const menuBtn=document.getElementById('menuBtn'),navLinks=document.getElementById('navLinks');
menuBtn.onclick=()=>navLinks.classList.toggle('open');
document.querySelectorAll('.sub-caret').forEach(b=>b.addEventListener('click',e=>{
  e.stopPropagation();const li=b.closest('.has-sub');li.classList.toggle('open');
  b.setAttribute('aria-expanded',li.classList.contains('open'));}));

/* ===== 滚动高亮 ===== */
const spyMap=[['home',['home']],['overview',['overview','ov-intro','ov-mission','ov-honors']],
  ['culture',['culture','cu-timeline','cu-highlight','cu-heritage']],
  ['ecology',['ecology','eco-geo','eco-coast','eco-mangrove','eco-coral']],
  ['industry',['industry','in-bio','in-marine','in-tour','in-vision']],['epilogue',['epilogue']]];
const flat=[];spyMap.forEach(([n,ids])=>ids.forEach(id=>{const el=document.getElementById(id);
  if(el)flat.push({el,navId:n,subId:id});}));
const topLinks=[...document.querySelectorAll('.nav-links > li > a')];
const subLinks=[...document.querySelectorAll('.dropdown a')];
function spy(){let cur=flat[0];for(const f of flat){if(f.el.getBoundingClientRect().top<=140)cur=f;}
  topLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur.navId));
  subLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+cur.subId));}
addEventListener('scroll',spy,{passive:true});spy();

/* ===== 渐显 ===== */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ===== 数字滚动 ===== */
const cio=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;
  const el=e.target,tgt=+el.dataset.count,t0=performance.now(),dur=1400;
  (function tick(t){const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(tgt*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick);})(t0);
  cio.unobserve(el);}),{threshold:.6});
document.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

/* ===== 打字机 ===== */
(function(){
  const els=document.querySelectorAll('.type-target');
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(el=>{el.textContent=el.dataset.type;});return;}
  const tio=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;tio.unobserve(e.target);
    const el=e.target,txt=el.dataset.type;let i=0;
    const cur=document.createElement('span');cur.className='cursor';el.appendChild(cur);
    (function type(){if(i<txt.length){el.insertBefore(document.createTextNode(txt[i]),cur);i++;setTimeout(type,26+Math.random()*22);}else{setTimeout(()=>cur.remove(),1200);}})();
  }),{threshold:.3});
  els.forEach(el=>tio.observe(el));
})();

/* ===== 视差（±20px，作用于非首屏 3D 元素） ===== */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const items=[...document.querySelectorAll('[data-parallax]')].map(el=>({el,
    speed:parseFloat(el.getAttribute('data-parallax'))||0,
    mx:parseFloat(el.getAttribute('data-px'))||0,my:parseFloat(el.getAttribute('data-py'))||0}));
  let mX=0,mY=0;addEventListener('mousemove',e=>{mX=(e.clientX/innerWidth-.5)*2;mY=(e.clientY/innerHeight-.5)*2;},{passive:true});
  const cl=v=>Math.max(-20,Math.min(20,v));
  (function frame(){const vh=innerHeight||1;
    for(const it of items){const r=it.el.getBoundingClientRect();const rel=(r.top+r.height/2)-vh/2;
      it.el.style.transform='translate3d('+cl(mX*it.mx).toFixed(1)+'px,'+cl(rel*it.speed+mY*it.my).toFixed(1)+'px,0)';}
    requestAnimationFrame(frame);})();
})();

/* ===== 生态 3D 地形 ===== */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const scene=document.getElementById('ecoScene');if(!scene)return;
  const layers=scene.querySelectorAll('.eco-3d-layer');
  (function animate(){const r=scene.getBoundingClientRect();const vh=innerHeight||1;
    const rel=(r.top+r.height/2-vh/2)/vh;
    layers.forEach(l=>{const depth=parseFloat(l.dataset.depth)||0;
      l.style.transform=`translateY(${rel*40*depth}px) rotateX(${rel*8*depth}deg) translateZ(${depth*50}px)`;});
    requestAnimationFrame(animate);})();
})();

/* ===== 产业卡片 3D 倾斜 ===== */
(function(){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',e=>{if(!card.classList.contains('in'))return;
      const r=card.getBoundingClientRect();const nx=(e.clientX-r.left)/r.width-.5,ny=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(1000px) rotateX(${-ny*12}deg) rotateY(${nx*16}deg) translateZ(10px)`;},{passive:true});
    card.addEventListener('mouseleave',()=>{card.style.transform='perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';});
  });
})();

/* ===== 溪流孤舟 ===== */
(function(){
  const river=document.getElementById('river'),riverG=document.getElementById('riverG'),boat=document.getElementById('boat'),rips=document.getElementById('rips'),epi=document.getElementById('epilogue');
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),MID=75;
  function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  const rnd=mulberry32(20260919),segs=[];let acc=0;
  for(let i=0;i<8;i++){const dy=190+rnd()*150,A=13+rnd()*26;segs.push({y0:acc,dy,A,sg:(i%2?-1:1)});acc+=dy;}
  const PATTERN=acc;
  let d='M'+MID+','+(-PATTERN);
  for(let b=-1;b*PATTERN<1000+PATTERN;b++){for(const s of segs){const y0=b*PATTERN+s.y0;
    d+=' Q'+(MID+s.sg*2*s.A)+','+(y0+s.dy/2)+' '+MID+','+(y0+s.dy);}}
  document.querySelectorAll('.river-path').forEach(p=>p.setAttribute('d',d));
  let ru='';for(let b=-1;b*PATTERN<1000+PATTERN;b++){for(const s of segs){
    ru+='<use href="#rip" x="'+(MID+s.sg*s.A)+'" y="'+(b*PATTERN+s.y0+s.dy/2)+'"/>';}}
  rips.innerHTML=ru;
  function segAt(yy){for(const s of segs){if(yy<s.y0+s.dy)return s;}return segs[segs.length-1];}
  function riverX(y){const yy=((y%PATTERN)+PATTERN)%PATTERN,s=segAt(yy),t=(yy-s.y0)/s.dy;return MID+s.sg*4*s.A*t*(1-t);}
  function riverSlope(y){const yy=((y%PATTERN)+PATTERN)%PATTERN,s=segAt(yy),t=(yy-s.y0)/s.dy;return s.sg*4*s.A*(1-2*t)/s.dy;}
  function update(){
    const vh=innerHeight||1,W=river.clientWidth||150,kx=W/150,ky=vh/1000,sy=scrollY;
    const epiTop=epi.getBoundingClientRect().top+sy;
    const stopAt=epiTop-vh*2.0,fadeStart=epiTop-vh*1.4,fadeEnd=epiTop-vh*1.0;
    const s=(Math.min(sy,stopAt)*(1000/vh))%PATTERN;
    riverG.setAttribute('transform','translate(0,'+(-s)+')');
    const fade=clamp((sy-fadeStart)/((fadeEnd-fadeStart)||1),0,1),fadeE=fade*fade*(3-2*fade);
    river.style.opacity=1-fadeE;river.style.visibility=fadeE>=1?'hidden':'visible';
    const bx=riverX(500+s),sl=riverSlope(500+s);
    const deg=clamp(Math.atan(sl*kx/ky)*180/Math.PI*0.45,-14,14);
    boat.style.left=(bx*kx)+'px';boat.style.top='50%';
    boat.style.transform='translate(-50%,-50%) rotate('+deg.toFixed(2)+'deg)';
    boat.classList.toggle('parked',sy>=stopAt);
  }
  addEventListener('scroll',update,{passive:true});addEventListener('resize',update);addEventListener('load',update);update();
})();