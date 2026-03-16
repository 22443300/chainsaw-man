/* ============================================================
   CHAINSAW MAN — Fan Site JavaScript v2
   Modern interactions, particles, 3D cards, chainsaw buttons
   Pure vanilla JS — no external libraries
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     CUSTOM CURSOR — ring + dot with hover expansion
     ============================================================ */
  var cursorEl = document.getElementById('custom-cursor');
  var cursorX = 0, cursorY = 0;
  var cursorVisible = window.matchMedia('(pointer: fine)').matches;

  if (cursorEl && cursorVisible) {
    document.addEventListener('mousemove', function (e) {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursorEl.style.transform = 'translate(' + cursorX + 'px, ' + cursorY + 'px)';
    });

    // Expand cursor ring on interactive elements
    var interactives = document.querySelectorAll('a, button, .character-card, .devil-card, .chainsaw-btn, .fact-card, .theme-card');
    interactives.forEach(function (el) {
      el.addEventListener('mouseenter', function () { document.body.classList.add('cursor-hover'); });
      el.addEventListener('mouseleave', function () { document.body.classList.remove('cursor-hover'); });
    });
  }

  /* ============================================================
     FLOATING PARTICLES — blood/ember effect on canvas
     ============================================================ */
  var canvas = document.getElementById('particles-canvas');
  if (canvas) {
    var ctx = canvas.getContext('2d');
    var particles = [];
    var particleCount = 40;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    function Particle() {
      this.reset();
    }

    Particle.prototype.reset = function () {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.opacity = Math.random() * 0.4 + 0.1;
      this.life = Math.random() * 200 + 100;
      this.maxLife = this.life;
    };

    Particle.prototype.update = function () {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;
      this.opacity = (this.life / this.maxLife) * 0.4;
      if (this.life <= 0) this.reset();
    };

    Particle.prototype.draw = function () {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(204, 0, 0, ' + this.opacity + ')';
      ctx.fill();
    };

    for (var i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(function (p) {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ============================================================
     STICKY NAVIGATION — transparent → frosted glass
     ============================================================ */
  var nav = document.getElementById('main-nav');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  /* ============================================================
     MOBILE NAV TOGGLE — with animated hamburger
     ============================================================ */
  var navToggle = document.getElementById('nav-toggle');
  var navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      navToggle.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        navToggle.classList.remove('active');
      });
    });
  }

  /* ============================================================
     SMOOTH SCROLLING
     ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ============================================================
     SCROLL REVEAL — Intersection Observer for all reveal elements
     ============================================================ */
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Handle staggered delays via data-delay attribute
          var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    // Observe all revealable elements
    document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-text, .timeline-item').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ============================================================
     ANIMATED NUMBER COUNTERS
     ============================================================ */
  var counters = document.querySelectorAll('.counter');
  var countedSet = new Set();

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;
    var duration = 1800;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && counters.length > 0) {
    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !countedSet.has(entry.target)) {
          countedSet.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { counterObserver.observe(c); });
  }

  /* ============================================================
     STAT BAR ANIMATIONS (Devils section)
     ============================================================ */
  if ('IntersectionObserver' in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var fills = entry.target.querySelectorAll('.stat-fill');
          fills.forEach(function (fill) {
            var w = fill.getAttribute('data-width') || '50';
            fill.classList.add('animated');
            fill.style.width = w + '%';
          });
        }
      });
    }, { threshold: 0.3 });

    document.querySelectorAll('.devil-card, .character-card').forEach(function (card) {
      statObserver.observe(card);
    });
  }

  /* ============================================================
     CHAINSAW BUTTONS — rev animation on click
     Click makes them vibrate like a chainsaw revving,
     also triggers the hero chainsaw to rev
     ============================================================ */
  var chainsawHero = document.querySelector('.chainsaw-hero');

  document.querySelectorAll('.chainsaw-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // Add revving vibration to button
      btn.classList.add('revving');

      // Also rev the hero chainsaw if visible
      if (chainsawHero) {
        chainsawHero.classList.add('revving');
      }

      // Stop after 600ms
      setTimeout(function () {
        btn.classList.remove('revving');
        if (chainsawHero) {
          chainsawHero.classList.remove('revving');
        }
      }, 600);
    });

    // Also rev on mousedown/up for a held-down effect
    btn.addEventListener('mousedown', function () {
      btn.classList.add('revving');
      if (chainsawHero) chainsawHero.classList.add('revving');
    });

    btn.addEventListener('mouseup', function () {
      setTimeout(function () {
        btn.classList.remove('revving');
        if (chainsawHero) chainsawHero.classList.remove('revving');
      }, 200);
    });

    btn.addEventListener('mouseleave', function () {
      btn.classList.remove('revving');
    });
  });

  /* ============================================================
     HERO PARALLAX
     ============================================================ */
  var heroParallax = document.querySelector('.hero-parallax');
  if (heroParallax) {
    window.addEventListener('scroll', function () {
      var s = window.scrollY;
      if (s < window.innerHeight * 1.5) {
        heroParallax.style.transform = 'translateY(' + (s * 0.35) + 'px)';
      }
    }, { passive: true });
  }

  /* ============================================================
     DEVIL ALERT MODAL
     ============================================================ */
  var modal = document.getElementById('devil-alert-modal');
  var dismissBtn = document.getElementById('modal-dismiss');

  if (modal && dismissBtn) {
    if (!sessionStorage.getItem('devilAlertDismissed')) {
      setTimeout(function () {
        modal.classList.add('active');
        dismissBtn.focus();
      }, 1000);
    }

    function closeModal() {
      modal.classList.remove('active');
      sessionStorage.setItem('devilAlertDismissed', 'true');
    }

    dismissBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
    });
  }

  /* ============================================================
     DEVIL CARDS — interactive up/down movement on click
     Cards bounce up when clicked, click again to drop back
     ============================================================ */
  document.querySelectorAll('.devil-card, .character-card').forEach(function (card) {
    var lifted = false;
    card.addEventListener('click', function () {
      if (!lifted) {
        card.style.transform = 'translateY(-20px) scale(1.04)';
        card.style.boxShadow = '0 30px 60px rgba(204,0,0,0.3), 0 0 0 2px var(--clr-red)';
        card.style.zIndex = '10';
        lifted = true;
      } else {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.zIndex = '';
        lifted = false;
      }
    });
  });

  /* ============================================================
     THEME CARDS — expand on click to emphasize
     ============================================================ */
  document.querySelectorAll('.theme-card').forEach(function (card) {
    card.style.cursor = 'pointer';
    card.addEventListener('click', function () {
      // Toggle expanded state
      var isExpanded = card.classList.contains('expanded');
      // Close all
      document.querySelectorAll('.theme-card.expanded').forEach(function (c) {
        c.classList.remove('expanded');
        c.style.borderLeftWidth = '3px';
        c.style.paddingLeft = '';
      });
      if (!isExpanded) {
        card.classList.add('expanded');
        card.style.borderLeftWidth = '6px';
        card.style.paddingLeft = 'calc(var(--space-md) + 8px)';
      }
    });
  });

  /* ============================================================
     SCROLL-BASED CHAINSAW REV — hero chainsaw revs harder
     when user scrolls fast (scroll velocity detection)
     ============================================================ */
  var lastScroll = 0;
  var lastTime = Date.now();
  var heroSection = document.getElementById('hero');

  if (chainsawHero && heroSection) {
    window.addEventListener('scroll', function () {
      var now = Date.now();
      var dt = now - lastTime;
      if (dt < 16) return; // throttle
      var velocity = Math.abs(window.scrollY - lastScroll) / dt;
      lastScroll = window.scrollY;
      lastTime = now;

      // Only rev if hero section is visible
      var heroRect = heroSection.getBoundingClientRect();
      if (heroRect.bottom > 0 && heroRect.top < window.innerHeight) {
        if (velocity > 1.5) {
          chainsawHero.classList.add('revving');
          clearTimeout(chainsawHero._revTimeout);
          chainsawHero._revTimeout = setTimeout(function () {
            chainsawHero.classList.remove('revving');
          }, 300);
        }
      }
    }, { passive: true });
  }

})();
