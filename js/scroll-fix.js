gsap.registerPlugin(ScrollTrigger);

/* ===== Lenis 平滑滚动 ===== */
const lenis = new Lenis({ duration:1.25, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(time=>lenis.raf(time*1000));
gsap.ticker.lagSmoothing(0);

/* ===== 导航点击 → 平滑滚动 + 高亮 + 收起菜单 ===== */
const navLinksEl=document.getElementById('navLinks');
navLinksEl.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click',e=>{
    const h=a.getAttribute('href');if(!h||!h.startsWith('#'))return;
    const el=document.querySelector(h);if(!el)return;
    e.preventDefault();
    navLinksEl.classList.remove('open');
    document.querySelectorAll('.has-sub.open').forEach(o=>{o.classList.remove('open');
      o.querySelector('.sub-caret')?.setAttribute('aria-expanded','false');});
    const li=a.closest('li');
    const ch=(a.parentElement.classList.contains('dropdown'))?li.querySelector(':scope > a'):a;
    document.querySelectorAll('.nav-links > li > a').forEach(t=>t.classList.toggle('active',t===ch));
    document.querySelectorAll('.dropdown a').forEach(s=>s.classList.toggle('active',s===a));
    lenis.scrollTo(el,{offset:-70,duration:1.5});
  });
});

/* ===== 首屏电影级入场 ===== */
const tl=gsap.timeline({defaults:{ease:'power3.out'}});
tl.from('.nav',{y:-70,opacity:0,duration:.9},0.2)
  .from('.hero-title-v',{opacity:0,y:60,duration:1.2},0.4)
  .from('.hero-sub-v',{opacity:0,y:40,duration:1},0.7)
  .from('.hero-text .kicker',{opacity:0,x:-30,duration:.7},0.9)
  .from('.hero-seal',{opacity:0,scale:.6,duration:.7,ease:'back.out(2)'},1.2)
  .from('.hero-text .coord',{opacity:0,duration:.6},1.4)
  .from('.scroll-hint',{opacity:0,duration:.8},1.6);

/* ===== 章节标题：字符级揭幕 ===== */
document.querySelectorAll('[data-split]').forEach(h=>{
  const txt=h.textContent; h.textContent='';
  txt.split('').forEach(ch=>{const s=document.createElement('span');
    s.textContent=ch; s.style.display='inline-block'; h.appendChild(s);});
  gsap.from(h.children,{scrollTrigger:{trigger:h,start:'top 85%'},
    opacity:0,y:40,rotateX:-60,stagger:0.035,duration:.7,ease:'back.out(1.6)'});
});

/* ===== 章节块：3D 进入 ===== */
document.querySelectorAll('.sub-block').forEach(b=>{
  gsap.from(b,{scrollTrigger:{trigger:b,start:'top 88%'},
    opacity:0,y:60,rotateX:6,transformOrigin:'50% 100%',duration:1,ease:'power3.out'});
});

/* ===== 时间线逐项滑入 ===== */
document.querySelectorAll('.t-item').forEach((it,i)=>{
  gsap.from(it,{scrollTrigger:{trigger:it,start:'top 90%'},
    opacity:0,x:-50,duration:.8,delay:(i%3)*0.08,ease:'power3.out'});
});

/* ===== 尾声放大收尾 ===== */
gsap.from('#epilogue h2',{scrollTrigger:{trigger:'#epilogue',start:'top 70%'},
  opacity:0,scale:.9,y:50,duration:1.4,ease:'power3.out'});