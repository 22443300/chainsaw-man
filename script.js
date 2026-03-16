/* ============================================================
   CHAINSAW MAN — Fan Site JavaScript
   Pure vanilla JS — no external libraries
   ============================================================ */

(function () {
  'use strict';

  /* ============================================================
     CUSTOM CURSOR
     ============================================================ */
  const cursor = document.getElementById('custom-cursor');

  if (cursor && window.matchMedia('(pointer: fine)').matches) {
    document.addEventListener('mousemove', function (e) {
      cursor.style.transform =
        'translate(' + (e.clientX - 12) + 'px, ' + (e.clientY - 12) + 'px)';
    });
  }

  /* ============================================================
     STICKY NAVIGATION — transparent → frosted glass on scroll
     ============================================================ */
  const nav = document.getElementById('main-nav');

  function handleNavScroll() {
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  /* ============================================================
     MOBILE NAV TOGGLE
     ============================================================ */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });
  }

  /* ============================================================
     SMOOTH SCROLLING for all anchor links
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
     INTERSECTION OBSERVER — timeline nodes & general reveal
     ============================================================ */
  var timelineItems = document.querySelectorAll('.timeline-item');

  if ('IntersectionObserver' in window) {
    var timelineObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    timelineItems.forEach(function (item) {
      timelineObserver.observe(item);
    });
  } else {
    // Fallback: just show everything
    timelineItems.forEach(function (item) {
      item.classList.add('visible');
    });
  }

  /* ============================================================
     ANIMATED NUMBER COUNTERS
     Counts up when the element scrolls into view
     ============================================================ */
  var counters = document.querySelectorAll('.counter');
  var countedSet = new Set();

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    if (isNaN(target)) return;

    var duration = 1500; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease-out quad
      var eased = 1 - (1 - progress) * (1 - progress);
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
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !countedSet.has(entry.target)) {
            countedSet.add(entry.target);
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      counterObserver.observe(counter);
    });
  }

  /* ============================================================
     CHARACTER CAROUSEL — arrow controls + touch/swipe
     ============================================================ */
  var carouselTrack = document.querySelector('.carousel-track');
  var btnLeft = document.querySelector('.carousel-btn--left');
  var btnRight = document.querySelector('.carousel-btn--right');

  if (carouselTrack) {
    var scrollAmount = 310; // card width + gap

    if (btnLeft) {
      btnLeft.addEventListener('click', function () {
        carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      });
    }

    if (btnRight) {
      btnRight.addEventListener('click', function () {
        carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      });
    }

    // Touch/swipe support
    var touchStartX = 0;
    var touchEndX = 0;
    var isSwiping = false;

    carouselTrack.addEventListener(
      'touchstart',
      function (e) {
        touchStartX = e.changedTouches[0].screenX;
        isSwiping = true;
      },
      { passive: true }
    );

    carouselTrack.addEventListener(
      'touchmove',
      function () {
        // Let the browser handle native scroll
      },
      { passive: true }
    );

    carouselTrack.addEventListener(
      'touchend',
      function (e) {
        if (!isSwiping) return;
        isSwiping = false;
        touchEndX = e.changedTouches[0].screenX;
        var diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            carouselTrack.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          } else {
            carouselTrack.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
          }
        }
      },
      { passive: true }
    );
  }

  /* ============================================================
     HERO PARALLAX EFFECT
     ============================================================ */
  var heroParallax = document.querySelector('.hero-parallax');

  if (heroParallax) {
    window.addEventListener(
      'scroll',
      function () {
        var scrolled = window.scrollY;
        // Only apply parallax when hero is in view
        if (scrolled < window.innerHeight * 1.5) {
          heroParallax.style.transform = 'translateY(' + scrolled * 0.4 + 'px)';
        }
      },
      { passive: true }
    );
  }

  /* ============================================================
     DEVIL ALERT MODAL — fires once per session
     ============================================================ */
  var modal = document.getElementById('devil-alert-modal');
  var dismissBtn = document.getElementById('modal-dismiss');

  if (modal && dismissBtn) {
    // Only show if not previously dismissed in this session
    if (!sessionStorage.getItem('devilAlertDismissed')) {
      // Small delay so the page loads first
      setTimeout(function () {
        modal.classList.add('active');
        dismissBtn.focus();
      }, 800);
    }

    dismissBtn.addEventListener('click', function () {
      modal.classList.remove('active');
      sessionStorage.setItem('devilAlertDismissed', 'true');
    });

    // Also dismiss on overlay click (outside the card)
    modal.addEventListener('click', function (e) {
      if (e.target === modal) {
        modal.classList.remove('active');
        sessionStorage.setItem('devilAlertDismissed', 'true');
      }
    });

    // Dismiss on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        sessionStorage.setItem('devilAlertDismissed', 'true');
      }
    });
  }
})();
