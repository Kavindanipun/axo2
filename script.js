const hero = document.querySelector('#axoHero');
const products = [...hero.querySelectorAll('.hero-product')];
const dots = [...hero.querySelectorAll('.dot')];
const productName = hero.querySelector('#productName');
const stage = hero.querySelector('#productStage');
const revealItems = [...hero.querySelectorAll('.reveal')];

let current = 0;
let timer;
let paused = false;
let heroInView = true;

function showProduct(index) {
  current = (index + products.length) % products.length;

  products.forEach((product, i) => {
    product.classList.toggle('active', i === current);
    product.style.transform = '';
  });

  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });

  productName.style.opacity = '0';
  productName.style.transform = 'translateY(5px)';

  setTimeout(() => {
    productName.textContent = products[current].dataset.name;
    productName.style.opacity = '1';
    productName.style.transform = 'translateY(0)';
  }, 180);
}

function startRotation() {
  clearInterval(timer);
  timer = setInterval(() => {
    if (!paused && heroInView) showProduct(current + 1);
  }, 3000);
}

dots.forEach(dot => {
  dot.addEventListener('click', () => {
    showProduct(Number(dot.dataset.index));
    startRotation();
  });
});

stage.addEventListener('mouseenter', () => paused = true);
stage.addEventListener('mouseleave', () => {
  paused = false;
  products.forEach(product => product.style.transform = '');
});
stage.addEventListener('touchstart', () => paused = true, {passive:true});
stage.addEventListener('touchend', () => {
  paused = false;
  startRotation();
}, {passive:true});

// Desktop-only subtle parallax. Does not edit source images.
stage.addEventListener('mousemove', e => {
  if (window.innerWidth <= 700) return;
  const rect = stage.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - .5;
  const y = (e.clientY - rect.top) / rect.height - .5;
  const active = products[current];
  if (!active) return;

  active.style.transform =
    `translate(${x * 12}px, ${y * 8 - 8}px) scale(1.06) rotateY(${x * 7}deg) rotateX(${-y * 5}deg)`;
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      const i = revealItems.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(i * 100, 260)}ms`;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

revealItems.forEach(item => observer.observe(item));

const heroVisibilityObserver = new IntersectionObserver((entries) => {
  heroInView = entries[0]?.isIntersecting ?? true;
}, { threshold: 0.02 });
heroVisibilityObserver.observe(hero);

showProduct(0);
startRotation();


/* ===== NAVBAR INTERACTIONS ===== */
const axoMenuToggle = document.getElementById('axoMenuToggle');
const axoNavMenu = document.getElementById('axoNavMenu');
const axoDropdown = document.querySelector('.axo-nav-dropdown');
const axoDropdownTrigger = document.querySelector('.axo-dropdown-trigger');

axoMenuToggle?.addEventListener('click', () => {
  const isOpen = axoNavMenu.classList.toggle('show');
  axoMenuToggle.classList.toggle('open', isOpen);
  axoMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

axoDropdownTrigger?.addEventListener('click', (event) => {
  event.preventDefault();
  event.stopPropagation();
  const isOpen = axoDropdown.classList.toggle('open');
  axoDropdownTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
});

document.addEventListener('click', (event) => {
  if (axoDropdown && !axoDropdown.contains(event.target)) {
    axoDropdown.classList.remove('open');
    axoDropdownTrigger?.setAttribute('aria-expanded', 'false');
  }
});

axoNavMenu?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (window.innerWidth <= 980) {
      axoNavMenu.classList.remove('show');
      axoMenuToggle?.classList.remove('open');
      axoMenuToggle?.setAttribute('aria-expanded', 'false');
    }
  });
});


/* ===== REMOVE PAGE-LOADING CLASS AFTER INITIAL RENDER ===== */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.body.classList.remove('page-loading');
  }, 120);
});


/* ===== MOBILE HERO TAGS TOGGLE ===== */
const heroTags = document.getElementById('heroTags');
const heroTagsToggle = document.getElementById('heroTagsToggle');
const heroTagsToggleText = heroTagsToggle?.querySelector('.hero-tags-toggle-text');

function resetHeroTagsForDesktop() {
  if (!heroTags || !heroTagsToggle) return;
  if (window.innerWidth > 820) {
    heroTags.classList.remove('expanded');
    heroTagsToggle.setAttribute('aria-expanded', 'false');
    if (heroTagsToggleText) heroTagsToggleText.textContent = '+ More Products';
  }
}

heroTagsToggle?.addEventListener('click', () => {
  const expanded = heroTags.classList.toggle('expanded');
  heroTagsToggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  if (heroTagsToggleText) {
    heroTagsToggleText.textContent = expanded ? '− Show Less' : '+ More Products';
  }
});

window.addEventListener('resize', resetHeroTagsForDesktop);
resetHeroTagsForDesktop();


/* ===== MERGED ABOUT SECTION INTERACTIONS ===== */
(() => {
const section = document.querySelector('#axoAbout');
const reveals = [...section.querySelectorAll('.ab-reveal')];
const logoCore = section.querySelector('#logoCore');
const cards = [...section.querySelectorAll('[data-card]')];

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const i = reveals.indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(i * 100, 300)}ms`;
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
},{threshold:.12});

reveals.forEach(el => observer.observe(el));

// Premium 3D parallax around the logo core.
const visual = section.querySelector('.about-visual');

visual.addEventListener('mousemove', e => {
  if (window.innerWidth <= 820) return;

  const rect = visual.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - .5;
  const y = (e.clientY - rect.top) / rect.height - .5;

  logoCore.style.transform =
    `translate(-50%,-50%) rotateY(${x * 7}deg) rotateX(${-y * 7}deg) translateZ(18px)`;

  cards.forEach((card, i) => {
    const strength = 5 + i * 2;
    card.style.translate = `${x * strength}px ${y * strength}px`;
  });
});

visual.addEventListener('mouseleave', () => {
  logoCore.style.transform = '';
  cards.forEach(card => card.style.translate = '');
});

// Lightweight feature emphasis: only runs while About is visible and on larger screens.
let featureIndex = 0;
let aboutVisible = false;
const aboutVisibilityObserver = new IntersectionObserver((entries) => {
  aboutVisible = entries[0]?.isIntersecting ?? false;
  if (!aboutVisible) cards.forEach(card => card.classList.remove('active-glow'));
}, { threshold: 0.04 });
aboutVisibilityObserver.observe(section);

setInterval(() => {
  if (!aboutVisible || window.innerWidth <= 900) return;
  cards.forEach((card, i) => card.classList.toggle('active-glow', i === featureIndex));
  featureIndex = (featureIndex + 1) % cards.length;
}, 4000);

})();


/* ===== WHOLESALE BENEFITS: LIGHTWEIGHT INTERACTIONS ===== */
(() => {
  const section = document.querySelector('.axo-benefits');
  if (!section) return;

  const cards = [...section.querySelectorAll('.wb-benefit-card')];
  const reveals = [...section.querySelectorAll('.wb-reveal')];

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('wb-in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  reveals.forEach((el) => revealObserver.observe(el));

  const activate = (selected) => {
    cards.forEach((card) => card.classList.toggle('wb-is-active', card === selected));
  };

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => activate(card));
    card.addEventListener('focus', () => activate(card));
  });
})();
