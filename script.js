/**
 * Vanilla JavaScript (ES6+) - Personal Portfolio Architecture
 * Modular, dependency-free, and performance-focused.
 */

(() => {
  'use strict';

  /* ==========================================================================
     Application Initialization
     ========================================================================== */
  document.addEventListener('DOMContentLoaded', () => {
    initFooterYear();
    initMobileNav();
    initScrollReveal();
    initScrollSpy();
    initContactForm();
  });

  /* ==========================================================================
     1. Footer Dynamic Year
     ========================================================================== */
  function initFooterYear() {
    const yearEl = document.getElementById('current-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ==========================================================================
     2. Mobile Navigation Toggle & Accessibility
     ========================================================================== */
  function initMobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!navToggle || !navMenu) return;

    const toggleMenu = (isOpen) => {
      const willOpen = typeof isOpen === 'boolean' ? isOpen : !navMenu.classList.contains('is-open');
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navMenu.classList.toggle('is-open', willOpen);
    };

    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      toggleMenu(!expanded);
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside of the header
    document.addEventListener('click', (event) => {
      if (!event.target.closest('.site-header') && navMenu.classList.contains('is-open')) {
        toggleMenu(false);
      }
    });

    // Close on Escape key for keyboard accessibility
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        toggleMenu(false);
        navToggle.focus();
      }
    });
  }

  /* ==========================================================================
     3. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // Respect user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));
  }

  /* ==========================================================================
     4. Scroll-Spy: Active Navigation Link Highlight
     ========================================================================== */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav .nav-link');
    if (!sections.length || !navLinks.length) return;

    if (!('IntersectionObserver' in window)) return;

    const navMap = new Map();
    navLinks.forEach(link => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        navMap.set(hash.substring(1), link);
      }
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => link.classList.remove('active'));
          const activeLink = navMap.get(id);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    }, {
      root: null,
      threshold: 0.35,
      rootMargin: '-10% 0px -40% 0px'
    });

    sections.forEach(section => observer.observe(section));
  }

  /* ==========================================================================
     5. Contact Form: Validation, UX Feedback & Simulated Async Submission
     ========================================================================== */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const feedbackBox = document.getElementById('form-feedback');

    const fields = {
      name: {
        input: document.getElementById('contact-name'),
        errorEl: document.getElementById('name-error'),
        validate: (val) => {
          if (!val.trim()) return 'El nombre es obligatorio.';
          if (val.trim().length < 2) return 'El nombre debe tener al menos 2 caracteres.';
          return '';
        }
      },
      email: {
        input: document.getElementById('contact-email'),
        errorEl: document.getElementById('email-error'),
        validate: (val) => {
          if (!val.trim()) return 'El correo electrónico es obligatorio.';
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val.trim())) return 'Ingresa una dirección de correo válida.';
          return '';
        }
      },
      subject: {
        input: document.getElementById('contact-subject'),
        errorEl: document.getElementById('subject-error'),
        validate: (val) => {
          if (!val.trim()) return 'El asunto es obligatorio.';
          if (val.trim().length < 4) return 'El asunto debe contener al menos 4 caracteres.';
          return '';
        }
      },
      message: {
        input: document.getElementById('contact-message'),
        errorEl: document.getElementById('message-error'),
        validate: (val) => {
          if (!val.trim()) return 'El mensaje no puede estar vacío.';
          if (val.trim().length < 15) return 'Por favor amplía un poco más tu mensaje (mínimo 15 caracteres).';
          return '';
        }
      }
    };

    // Helper: Validate a single field and update its UI state
    const validateField = (fieldName) => {
      const field = fields[fieldName];
      if (!field || !field.input) return true;

      const errorMessage = field.validate(field.input.value);
      const isValid = errorMessage === '';

      if (isValid) {
        field.input.classList.remove('is-invalid');
        field.input.removeAttribute('aria-invalid');
        if (field.errorEl) field.errorEl.textContent = '';
      } else {
        field.input.classList.add('is-invalid');
        field.input.setAttribute('aria-invalid', 'true');
        if (field.errorEl) field.errorEl.textContent = errorMessage;
      }

      return isValid;
    };

    // Attach real-time input listeners to clear errors once user types valid content
    Object.keys(fields).forEach(key => {
      const field = fields[key];
      if (field.input) {
        field.input.addEventListener('input', () => {
          if (field.input.classList.contains('is-invalid')) {
            validateField(key);
          }
        });
        field.input.addEventListener('blur', () => {
          validateField(key);
        });
      }
    });

    // Form Submission Handler
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      // Reset prior feedback
      feedbackBox.hidden = true;
      feedbackBox.textContent = '';
      feedbackBox.className = 'form-feedback';

      // Validate all fields
      let isFormValid = true;
      let firstInvalidInput = null;

      Object.keys(fields).forEach(key => {
        const isValid = validateField(key);
        if (!isValid) {
          isFormValid = false;
          if (!firstInvalidInput) {
            firstInvalidInput = fields[key].input;
          }
        }
      });

      if (!isFormValid) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        return;
      }

      // Enter Loading State
      setButtonLoading(submitBtn, true);

      try {
        // Simulate async network request (1.2s delay)
        await simulateAsyncSubmission();

        // Render Success Feedback
        feedbackBox.textContent = '¡Mensaje recibido con éxito! Me pondré en contacto contigo a la brevedad.';
        feedbackBox.classList.add('success');
        feedbackBox.hidden = false;

        // Reset form inputs & validation states
        form.reset();
        Object.keys(fields).forEach(key => {
          const field = fields[key];
          field.input.classList.remove('is-invalid');
          field.input.removeAttribute('aria-invalid');
          if (field.errorEl) field.errorEl.textContent = '';
        });

      } catch (err) {
        // Render Error Feedback
        feedbackBox.textContent = 'Ocurrió un error al intentar enviar el mensaje. Por favor intenta de nuevo.';
        feedbackBox.classList.add('error');
        feedbackBox.hidden = false;
      } finally {
        setButtonLoading(submitBtn, false);
      }
    });
  }

  // Toggle button loading indicator & accessibility state
  function setButtonLoading(button, isLoading) {
    if (!button) return;
    const btnText = button.querySelector('.btn-text');

    if (isLoading) {
      button.disabled = true;
      button.classList.add('is-loading');
      if (btnText) btnText.textContent = 'Enviando...';
    } else {
      button.disabled = false;
      button.classList.remove('is-loading');
      if (btnText) btnText.textContent = 'Enviar Mensaje';
    }
  }

  // Simulated server submission promise
  function simulateAsyncSubmission() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, timestamp: Date.now() });
      }, 1200);
    });
  }
})();
