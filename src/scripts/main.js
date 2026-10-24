// =============================================================
//  Sabores de Casa - site behaviour
//  External dependency: GLightbox (npm) for the image gallery.
//  Own interactivity: accessible nav toggle, current-page marker,
//  and a recipe category filter.
// =============================================================
import GLightbox from 'glightbox';
import 'glightbox/dist/css/glightbox.min.css';

// ---- Accessible mobile navigation toggle ----
const initNavToggle = () => {
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('#nav-menu');
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!isOpen));
    menu.classList.toggle('is-open', !isOpen);
  });

  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
};

// ---- Mark the active page in the navigation (not colour-only) ----
const markCurrentPage = () => {
  const current = window.location.pathname.replace(/\/$/, '') || '/';
  document.querySelectorAll('#nav-menu a').forEach((link) => {
    const target = new URL(link.href).pathname.replace(/\/$/, '') || '/';
    if (target === current) link.setAttribute('aria-current', 'page');
  });
};

// ---- Recipe category filter (category page only) ----
const initFilter = () => {
  const filter = document.querySelector('[data-filter]');
  const cards = Array.from(document.querySelectorAll('[data-category]'));
  const status = document.querySelector('[data-filter-status]');
  if (!filter || cards.length === 0) return;

  filter.addEventListener('click', (event) => {
    const button = event.target.closest('.filter__btn');
    if (!button) return;

    const selected = button.dataset.value;

    filter.querySelectorAll('.filter__btn').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn === button));
    });

    let visible = 0;
    cards.forEach((card) => {
      const match = selected === 'all' || card.dataset.category === selected;
      card.hidden = !match;
      if (match) visible += 1;
    });

    if (status) {
      const plural = visible === 1 ? '' : 's';
      status.textContent = `${visible} receta${plural} mostrada${plural}.`;
    }
  });
};

// ---- GLightbox for the detail-page image gallery ----
// The anchors have no href in the HTML so the bundler leaves them alone.
// Here we point each one to its thumbnail's already-resolved URL, which
// also makes the links keyboard-focusable (progressive enhancement).
const initLightbox = () => {
  const links = document.querySelectorAll('a.glightbox');
  if (links.length === 0) return;

  links.forEach((link) => {
    const img = link.querySelector('img');
    if (img && !link.getAttribute('href')) {
      link.setAttribute('href', img.currentSrc || img.src);
    }
  });

  GLightbox({ selector: '.glightbox', loop: true });
};

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  markCurrentPage();
  initFilter();
  initLightbox();
});
