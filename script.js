// Navigation: highlight the section at the top of the screen
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = navLinks.map((link) => document.querySelector(link.hash));

function markCurrent() {
  const current = sections.findLastIndex((section) => section.getBoundingClientRect().top <= 160);
  navLinks.forEach((link, i) => (i === Math.max(current, 0) ? link.setAttribute('aria-current', 'true') : link.removeAttribute('aria-current')));
}

addEventListener('scroll', markCurrent, { passive: true });
addEventListener('resize', markCurrent);
markCurrent();

// Slide to a section: eases in and out, longer trips take a little longer
let slide = 0;

function slideTo(target) {
  cancelAnimationFrame(slide);
  const start = scrollY;
  const margin = parseFloat(getComputedStyle(target).scrollMarginTop);
  const limit = document.documentElement.scrollHeight - innerHeight;
  const end = Math.min(Math.max(start + target.getBoundingClientRect().top - margin, 0), limit);
  const distance = end - start;
  const duration = Math.min(700 + Math.abs(distance) * 0.4, 1200);
  let began;

  function frame(now) {
    began ??= now;
    const t = Math.min((now - began) / duration, 1);
    const eased = t < 0.5 ? 4 * t ** 3 : 1 - (2 - 2 * t) ** 3 / 2;
    scrollTo({ top: start + distance * eased, behavior: 'instant' });
    if (t < 1) slide = requestAnimationFrame(frame);
  }

  slide = requestAnimationFrame(frame);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.hash);
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!target || reduceMotion || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    history.pushState(null, '', link.hash);
    target.focus({ preventScroll: true }); // keyboard users continue from the section
    slideTo(target);
  });
});

// Scrolling by hand always wins
for (const type of ['wheel', 'touchstart', 'keydown']) {
  addEventListener(type, () => cancelAnimationFrame(slide), { passive: true });
}

// Copy email
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
}

document.getElementById('copyEmail').addEventListener('click', async () => {
  const email = document.getElementById('emailLink').href.replace('mailto:', '');
  try {
    await navigator.clipboard.writeText(email);
    showToast('Email copied to clipboard');
  } catch {
    showToast(email);
  }
});
