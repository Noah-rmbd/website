document.addEventListener('DOMContentLoaded', () => {
  initHeroNeural();
  initCyberMenu();
  initAccordions();
  initScrollNav();
  initProjectWindows();
});

/* --- 0. Machine Learning Neural Architecture Hero Canvas --- */
async function initHeroNeural() {
  const canvas = document.getElementById('neural-canvas');
  if (!canvas) return;

  try {
    const { MLNeuralEngine } = await import('./mlNeuralEngine.js');
    window.heroNeuralEngine = new MLNeuralEngine(canvas, {
      colorRgb: '56, 189, 248', // Lumon Cold Cyan
      scrollSpeed: 42,
      columnSpacing: 180
    });
  } catch (err) {
    console.warn('MLNeuralEngine could not be initialized:', err);
  }
}

/* --- 2. Fullscreen Cyber Menu --- */
function initCyberMenu() {
  const burgerBtn = document.getElementById('burger-trigger');
  const overlay = document.getElementById('cyber-menu-overlay');
  const closeBtn = document.getElementById('menu-close-btn');
  const overlayLinks = document.querySelectorAll('[data-overlay-link]');

  function openMenu() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    burgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (burgerBtn) burgerBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  overlayLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* --- 3. Accordions for Services & FAQ --- */
function initAccordions() {
  // Services Accordion
  const serviceHeaders = document.querySelectorAll('.service-header');
  serviceHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all other services
      document.querySelectorAll('.service-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.service-header').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // FAQ Accordion
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      const isActive = item.classList.contains('active');

      // Close other FAQ items
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Expandable Education / Experience rows
  const expItems = document.querySelectorAll('.exp-item.exp-expandable');
  expItems.forEach(item => {
    const trigger = item.querySelector('.exp-row');
    if (!trigger) return;

    const toggle = () => {
      const isActive = item.classList.contains('active');
      item.classList.toggle('active', !isActive);
      trigger.setAttribute('aria-expanded', String(!isActive));
    };

    trigger.addEventListener('click', toggle);
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
}

/* --- 4. ScrollSpy / Active Navigation --- */
function initScrollNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.cyber-nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.pageYOffset + 150;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const linkTarget = link.getAttribute('data-nav');
      if (!linkTarget) return;

      if (linkTarget === current || (current === 'contact-footer' && linkTarget === 'contact')) {
        link.classList.add('active');
        link.textContent = `< ${link.textContent.replace(/[<>]/g, '').trim()} >`;
      } else {
        link.classList.remove('active');
        link.textContent = link.textContent.replace(/[<>]/g, '').trim();
      }
    });
  });
}

/* --- 5. Project Window Controls ([_] and [X]) --- */
function initProjectWindows() {
  const cards = document.querySelectorAll('.retro-window-card');

  cards.forEach(card => {
    const toggleBtn = card.querySelector('.win-toggle-size');
    const closeBtn = card.querySelector('.win-close');
    const titleLink = card.querySelector('.window-title-link');
    const titleText = titleLink ? titleLink.textContent.trim() : 'Project Window';

    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const isMinimized = card.classList.toggle('is-minimized');
        if (isMinimized) {
          toggleBtn.textContent = '[+]';
          toggleBtn.setAttribute('title', 'Expand window');
          toggleBtn.setAttribute('aria-label', 'Expand window');
        } else {
          toggleBtn.textContent = '[_]';
          toggleBtn.setAttribute('title', 'Reduce window');
          toggleBtn.setAttribute('aria-label', 'Reduce window');
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        card.classList.add('is-closed');

        const banner = document.createElement('div');
        banner.className = 'window-reopen-banner';
        banner.innerHTML = `
          <span>&gt; [CLOSED] ${titleText}</span>
          <button type="button" class="reopen-btn" aria-label="Reopen project window">[REOPEN &#x21BA;]</button>
        `;

        card.parentNode.insertBefore(banner, card);

        const reopenBtn = banner.querySelector('.reopen-btn');
        reopenBtn.addEventListener('click', (ev) => {
          ev.preventDefault();
          card.classList.remove('is-closed');
          banner.remove();
        });
      });
    }
  });
}

