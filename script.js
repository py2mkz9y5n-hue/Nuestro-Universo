(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  const intro = $('#intro');
  const enterBtn = $('#enterBtn');
  const musicBtn = $('#musicBtn');
  const soundtrack = $('#soundtrack');
  const toast = $('#toast');

  const showToast = (text) => {
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  async function playMusic() {
    try {
      await soundtrack.play();
      musicBtn.classList.add('is-playing');
    } catch (e) {
      musicBtn.classList.remove('is-playing');
      showToast('Nuestra canción todavía no está disponible, pero la historia puede continuar. ✦');
    }
  }

  enterBtn.addEventListener('click', async () => {
    intro.classList.add('is-hidden');
    await playMusic();
  });

  musicBtn.addEventListener('click', async () => {
    if (soundtrack.paused) await playMusic();
    else {
      soundtrack.pause();
      musicBtn.classList.remove('is-playing');
    }
  });

  soundtrack.addEventListener('error', () => {
    musicBtn.classList.remove('is-playing');
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.14 });
  $$('.reveal').forEach(el => io.observe(el));

  const modal = $('#loveModal');
  const modalTitle = $('#modalTitle');
  const modalCopy = $('#modalCopy');
  const modalClose = $('#modalClose');
  $$('.love-star').forEach(btn => {
    btn.addEventListener('click', () => {
      modalTitle.textContent = btn.dataset.title;
      modalCopy.textContent = btn.dataset.copy;
      modal.showModal();
    });
  });
  modalClose.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });

  const rogelioBtn = $('#rogelioBtn');
  const rogelio = $('#rogelio');
  rogelioBtn.addEventListener('click', () => {
    rogelio.hidden = !rogelio.hidden;
    rogelioBtn.textContent = rogelio.hidden ? 'Hay una estrella sospechosa por aquí ✦' : 'Ocultar toda evidencia de Rogelio ✦';
  });

  const start = new Date('2026-06-20T00:00:00');
  function updateCounter(){
    let diff = Math.max(0, Date.now() - start.getTime());
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    $('#days').textContent = days.toLocaleString('es-MX');
    $('#hours').textContent = String(hours).padStart(2,'0');
    $('#minutes').textContent = String(minutes).padStart(2,'0');
    $('#seconds').textContent = String(seconds).padStart(2,'0');
  }
  updateCounter();
  setInterval(updateCounter, 1000);

  // Star field
  const canvas = $('#stars');
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = [];
  let w = 0, h = 0, dpr = 1;

  function resize(){
    dpr = Math.min(devicePixelRatio || 1, 2);
    w = innerWidth; h = innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.min(220, Math.max(85, Math.floor((w*h)/9000)));
    stars = Array.from({length:count}, () => ({
      x:Math.random()*w,
      y:Math.random()*h,
      r:Math.random()*1.5+.2,
      a:Math.random()*.7+.25,
      tw:Math.random()*.018+.004,
      p:Math.random()*Math.PI*2
    }));
  }
  function draw(t=0){
    ctx.clearRect(0,0,w,h);
    for(const s of stars){
      const alpha = reduce ? s.a : Math.max(.18, s.a + Math.sin(t*s.tw+s.p)*.22);
      ctx.beginPath();
      ctx.fillStyle = `rgba(240,236,255,${alpha})`;
      ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
      ctx.fill();
    }
    if(!reduce) requestAnimationFrame(draw);
  }
  addEventListener('resize', resize, {passive:true});
  resize();
  if(reduce) draw(); else requestAnimationFrame(draw);
})();
