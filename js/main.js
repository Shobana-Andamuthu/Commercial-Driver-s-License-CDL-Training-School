/**
 * CDL Training School - Interactive Main JS
 * - Theme Switcher (Light / Dark) with LocalStorage persistence
 * - Direction Switcher (LTR / RTL) with LocalStorage persistence
 * - Mobile / iPad Hamburger Navigation Drawer with focus trap and keyboard ESC
 * - Form validation and live feedback
 * - Password visibility toggler
 * - Student dashboard simulation hooks
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initDirection();
  initPreloader();
  initMobileNav();
  initPasswordToggles();
  initFormValidation();
  initDashboardFeatures();
  initDashboardTabs();
  initDashboardMobileDrawer();
  initDropdownDismiss();
  initBackToTop();
  initFaqAccordion();
});

/* --------------------------------------------------------------------------
 * Theme Management (Light / Dark)
 * -------------------------------------------------------------------------- */
function initTheme() {
  const savedTheme = localStorage.getItem('cdl_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  applyTheme(savedTheme);

  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('cdl_theme', newTheme);
    });
  });
}

function applyTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  updateThemeButtonIcons(theme);
}

function updateThemeButtonIcons(theme) {
  const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
  toggleBtns.forEach(btn => {
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    btn.title = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    
    if (theme === 'dark') {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
    } else {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
    }
  });
}

/* --------------------------------------------------------------------------
 * Direction Management (LTR / RTL)
 * -------------------------------------------------------------------------- */
function initDirection() {
  const savedDir = localStorage.getItem('cdl_dir') || 'ltr';
  applyDirection(savedDir);

  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  dirToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
      const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
      applyDirection(newDir);
      localStorage.setItem('cdl_dir', newDir);
    });
  });
}

function applyDirection(dir) {
  document.documentElement.setAttribute('dir', dir);
  const dirToggleBtns = document.querySelectorAll('.dir-toggle-btn');
  dirToggleBtns.forEach(btn => {
    btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right layout' : 'Switch to Right-to-Left layout');
    btn.title = dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    const isDrawer = btn.closest('.drawer-preferences') !== null || btn.closest('.drawer-pref-group') !== null;
    if (isDrawer) {
      btn.innerHTML = `
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M8 3L4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"></path>
        </svg>
      `;
    } else {
      btn.textContent = dir.toUpperCase();
    }
  });
}

/* --------------------------------------------------------------------------
 * Responsive Navigation & Drawer (Hamburger on <= 1366px including iPads)
 * -------------------------------------------------------------------------- */
function initMobileNav() {
  const menuToggle = document.getElementById('menuToggle');
  const drawerClose = document.getElementById('drawerClose');
  const navBackdrop = document.getElementById('navBackdrop');
  const drawer = document.getElementById('mobileNavDrawer');

  if (!menuToggle || !drawer) return;

  function openDrawer() {
    document.body.classList.add('mobile-nav-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    drawer.removeAttribute('inert');
    if (drawerClose) drawerClose.focus();
  }

  function closeDrawer() {
    document.body.classList.remove('mobile-nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    // Requirement: "menu close panah dropdown close aagirum"
    drawer.querySelectorAll('.has-mobile-dropdown').forEach(item => {
      item.classList.remove('open');
    });
    drawer.querySelectorAll('.mobile-dropdown-btn').forEach(btn => {
      btn.setAttribute('aria-expanded', 'false');
    });
    menuToggle.focus();
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = document.body.classList.contains('mobile-nav-open');
    if (isOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (navBackdrop) {
    navBackdrop.addEventListener('click', closeDrawer);
  }

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('mobile-nav-open')) {
      closeDrawer();
    }
  });

  // Handle mobile accordion dropdowns
  const mobileDropdownBtns = drawer.querySelectorAll('.mobile-dropdown-btn');
  mobileDropdownBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = btn.closest('.has-mobile-dropdown');
      if (parent) {
        const isOpen = parent.classList.contains('open');
        parent.classList.toggle('open');
        btn.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      }
    });
  });

  // Close drawer when a navigation link is clicked
  const mobileNavLinks = drawer.querySelectorAll('a');
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* --------------------------------------------------------------------------
 * Password Visibility Toggles
 * -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggles = document.querySelectorAll('.pw-toggle-btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (!input) return;
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      btn.innerHTML = isPassword
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  });
}

/* --------------------------------------------------------------------------
 * Accessible Form Validation
 * -------------------------------------------------------------------------- */
function initFormValidation() {
  const forms = document.querySelectorAll('form[data-validate="true"]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;
      const requiredInputs = form.querySelectorAll('[required]');

      requiredInputs.forEach(input => {
        const errorEl = input.closest('.form-group')?.querySelector('.form-error-msg');
        if (!input.value.trim()) {
          input.classList.add('is-invalid');
          if (errorEl) errorEl.style.display = 'block';
          isValid = false;
        } else if (input.type === 'email' && !validateEmail(input.value)) {
          input.classList.add('is-invalid');
          if (errorEl) {
            errorEl.textContent = 'Please enter a valid email address.';
            errorEl.style.display = 'block';
          }
          isValid = false;
        } else {
          input.classList.remove('is-invalid');
          if (errorEl) errorEl.style.display = 'none';
        }

        input.addEventListener('input', () => {
          if (input.value.trim()) {
            input.classList.remove('is-invalid');
            if (errorEl) errorEl.style.display = 'none';
          }
        });
      });

      if (isValid) {
        const alertSuccess = form.querySelector('.form-alert-success');
        if (alertSuccess) {
          alertSuccess.style.display = 'block';
          alertSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          form.reset();
        } else {
          alert('Submission received! (Sample demonstration mode)');
          form.reset();
        }
      }
    });
  });
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --------------------------------------------------------------------------
 * Student Dashboard Interactive Simulation Hooks
 * -------------------------------------------------------------------------- */
function initDashboardFeatures() {
  const bookPracticeBtns = document.querySelectorAll('#btnBookPractice, #dashActionBtn');
  bookPracticeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      alert('Book Drive Time: Behind-the-Wheel practice slot requested! Your instructor will confirm the booking within 2 hours. (Demo Simulation Mode)');
    });
  });

  const profileBtn = document.getElementById('dashProfileBtn');
  const profileMenu = document.getElementById('dashProfileMenu');
  if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (profileMenu) {
        const isHidden = profileMenu.style.display === 'none' || !profileMenu.style.display;
        profileMenu.style.display = isHidden ? 'block' : 'none';
      } else {
        alert('Trainee Profile: Jordan Davis (#CDL-8492)\nStatus: Active Class A Tractor-Trailer Program\nYard: Main Logistics Range');
      }
    });

    document.addEventListener('click', () => {
      if (profileMenu) profileMenu.style.display = 'none';
    });
  }

  const checkResultsBtn = document.getElementById('btnCheckResults');
  if (checkResultsBtn) {
    checkResultsBtn.addEventListener('click', () => {
      alert('Verification status: All endorsements verified on state registry. (Demo mode)');
    });
  }
}

/* --------------------------------------------------------------------------
 * Dashboard Tabbed Single-Page Application Views
 * -------------------------------------------------------------------------- */
function initDashboardTabs() {
  const dashLinks = document.querySelectorAll('.dash-menu-link[data-view]');
  const dashViews = document.querySelectorAll('.dash-tab-view');
  if (!dashLinks.length || !dashViews.length) return;

  function switchView(targetViewId) {
    dashLinks.forEach(btn => {
      if (btn.getAttribute('data-view') === targetViewId) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    dashViews.forEach(view => {
      if (view.id === targetViewId) {
        view.classList.add('active');
        view.style.display = 'block';
      } else {
        view.classList.remove('active');
        view.style.display = 'none';
      }
    });
  }

  dashLinks.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = btn.getAttribute('data-view');
      if (targetView) {
        switchView(targetView);
        try {
          history.replaceState(null, null, `#${targetView}`);
        } catch (err) {}
      }
    });
  });

  // Handle hash deep-links (e.g. #viewLogs, #viewSkills, #viewExams, #viewCompliance)
  const currentHash = window.location.hash.replace('#', '');
  if (currentHash && document.getElementById(currentHash) && document.getElementById(currentHash).classList.contains('dash-tab-view')) {
    switchView(currentHash);
  } else {
    switchView('viewOverview');
  }
}

/* --------------------------------------------------------------------------
 * Dropdown Dismiss on Outside Click & Navigation Cleanup
 * -------------------------------------------------------------------------- */
function initDropdownDismiss() {
  const hasDropdowns = document.querySelectorAll('.has-dropdown');
  
  // Close any focused dropdown when clicking anywhere outside
  document.addEventListener('click', (e) => {
    hasDropdowns.forEach(item => {
      if (!item.contains(e.target)) {
        const link = item.querySelector('.nav-link');
        if (link) link.blur();
      }
    });
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hasDropdowns.forEach(item => {
        const link = item.querySelector('.nav-link');
        if (link) link.blur();
      });
    }
  });
}

/* --------------------------------------------------------------------------
 * Back To Top Floating Arrow Button
 * -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 280) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
 * Dashboard Mobile Drawer System
 * -------------------------------------------------------------------------- */
function initDashboardMobileDrawer() {
  const mobileToggle = document.getElementById('dashMobileToggle');
  const sidebar = document.getElementById('dashSidebar');
  const backdrop = document.getElementById('dashSidebarBackdrop');
  const closeBtn = document.getElementById('dashSidebarClose');

  if (!mobileToggle || !sidebar) return;

  function openDrawer() {
    sidebar.classList.add('mobile-open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    sidebar.classList.remove('mobile-open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Close drawer when a tab menu link is selected on mobile
  const tabLinks = sidebar.querySelectorAll('.dash-menu-link');
  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        closeDrawer();
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-open')) {
      closeDrawer();
    }
  });
}

/* --------------------------------------------------------------------------
 * Attractive Animated Apex Preloader
 * -------------------------------------------------------------------------- */
function initPreloader() {
  const preloader = document.getElementById('apexPreloader');
  if (!preloader) return;

  function dismiss() {
    if (!preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
      setTimeout(() => {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 450);
    }
  }

  // Fade out smoothly once window is ready or maximum 600ms
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 300);
  } else {
    window.addEventListener('load', () => {
      setTimeout(dismiss, 300);
    });
    setTimeout(dismiss, 700);
  }
}

/* --------------------------------------------------------------------------
 * Contact Page Interactive FAQ Accordion (One-by-One Dropdown)
 * -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  if (!faqItems.length) return;

  faqItems.forEach((item, index) => {
    const btn = item.querySelector('.faq-accordion-btn');
    if (!btn) return;

    // Open first item by default for demonstration
    if (index === 0) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all other items (strictly one-by-one dropdown)
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherBtn = other.querySelector('.faq-accordion-btn');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}



