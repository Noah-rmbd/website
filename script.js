/**
 * Noah Raimbaud - Portfolio Website Scripts
 * Pure Vanilla JavaScript: Navigation, Scroll Tracking, Mobile Drawer & Copy Actions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbarHeader = document.getElementById('main-header');
  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const desktopLinks = document.querySelectorAll('.nav-menu .nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyTextSpan = document.getElementById('copy-text');

  // Categories & Sections to track
  const sectionIds = ['about', 'projects', 'education', 'experience'];
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean);

  /* --------------------------------------------------------------------------
     1. Sticky Navbar Visual State
     -------------------------------------------------------------------------- */
  const handleScrollNavbar = () => {
    if (window.scrollY > 20) {
      navbarHeader.classList.add('scrolled');
    } else {
      navbarHeader.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScrollNavbar, { passive: true });
  handleScrollNavbar();

  /* --------------------------------------------------------------------------
     2. Mobile Drawer Navigation Toggle
     -------------------------------------------------------------------------- */
  const openMobileMenu = () => {
    mobileToggle.classList.add('is-active');
    mobileToggle.setAttribute('aria-expanded', 'true');
    mobileDrawer.classList.add('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeMobileMenu = () => {
    mobileToggle.classList.remove('is-active');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileDrawer.classList.remove('is-open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('is-open');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Close drawer on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer.classList.contains('is-open')) {
      closeMobileMenu();
    }
  });

  // Handle mobile drawer link navigation
  mobileLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetHref);

        // Close menu
        closeMobileMenu();

        if (targetSection) {
          // Smooth scroll to target section with offset
          const navHeight = navbarHeader.offsetHeight || 76;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Update active states
          const sectionId = targetHref.replace('#', '');
          updateActiveNavLink(sectionId);
          history.pushState(null, '', targetHref);
        }
      }
    });
  });

  // Handle desktop nav links smooth scroll
  desktopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        e.preventDefault();
        const targetSection = document.querySelector(targetHref);
        if (targetSection) {
          const navHeight = navbarHeader.offsetHeight || 76;
          const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - navHeight - 16;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          const sectionId = targetHref.replace('#', '');
          updateActiveNavLink(sectionId);
          history.pushState(null, '', targetHref);
        }
      }
    });
  });

  /* --------------------------------------------------------------------------
     3. Active Category Highlighting on Scroll (Intersection Observer)
     -------------------------------------------------------------------------- */
  const updateActiveNavLink = (activeId) => {
    desktopLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    mobileLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      if (href === activeId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  };

  if ('IntersectionObserver' in window && sections.length > 0) {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateActiveNavLink(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
  } else {
    // Fallback on scroll
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 120;
        const sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          updateActiveNavLink(sectionId);
        }
      });
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     4. Back to Top Button
     -------------------------------------------------------------------------- */
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. Copy Email to Clipboard
     -------------------------------------------------------------------------- */
  if (copyEmailBtn && copyTextSpan) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = copyEmailBtn.getAttribute('data-email') || 'noah.raimbaud@example.com';
      try {
        await navigator.clipboard.writeText(email);
        const originalText = copyTextSpan.textContent;
        copyTextSpan.textContent = 'Copied!';
        copyEmailBtn.style.borderColor = 'var(--accent-emerald)';
        copyEmailBtn.style.color = 'var(--accent-emerald)';

        setTimeout(() => {
          copyTextSpan.textContent = originalText;
          copyEmailBtn.style.borderColor = '';
          copyEmailBtn.style.color = '';
        }, 2200);
      } catch (err) {
        // Fallback prompt
        window.prompt('Copy email:', email);
      }
    });
  }
});
