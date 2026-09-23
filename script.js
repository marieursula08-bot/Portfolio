document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Repère de scroll dans la marge */
  const scrollMark = document.querySelector('.scroll-mark');
  const updateScrollMark = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight);
    if (scrollMark) scrollMark.style.height = `${Math.min(scrolled, 1) * 100}vh`;
  };
  document.addEventListener('scroll', updateScrollMark, { passive: true });
  updateScrollMark();

  const toggle = document.getElementById('navToggle');
  const rail = document.getElementById('rail');
  if (toggle && rail) {
    toggle.addEventListener('click', () => {
      const isOpen = rail.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    rail.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        rail.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const navLinks = document.querySelectorAll('.rail-nav a');
  const sections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const setActive = () => {
    let current = sections[0];
    const scrollPos = window.scrollY + window.innerHeight * 0.3;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) current = sec;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
    });
  };
  document.addEventListener('scroll', setActive, { passive: true });
  setActive();

  const revealTargets = document.querySelectorAll(
    '.section-index, .section-title, .apropos-grid, .skill-row, .project, .timeline-item, .edu-item, .watch-entry, .watch-card, .contact-title, .contact-grid'
  );
  revealTargets.forEach(el => el.classList.add('reveal'));

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('in'));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    revealTargets.forEach(el => observer.observe(el));
  }

  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        status.textContent = 'Merci de compléter tous les champs.';
        return;
      }
      status.textContent = 'Message prêt — l\u2019envoi réel sera activé prochainement.';
      form.reset();
    });
  }
});
