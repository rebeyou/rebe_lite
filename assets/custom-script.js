// Fix: Slick ARIA patches
(function() {
  function fixSlickAria() {
    // 1. Remove aria-selected from buttons (invalid on role="button")
    document.querySelectorAll('button[aria-selected]').forEach(function(el) {
      el.removeAttribute('aria-selected');
    });

    // 2. Fix listitem elements — remove aria-selected and invalid aria-hidden="false"
    document.querySelectorAll('li[role="listitem"]').forEach(function(el) {
      el.removeAttribute('aria-selected');
      if (el.getAttribute('aria-hidden') === 'false') {
        el.removeAttribute('aria-hidden');
      }
    });

    // 3. Also catch li.slick-active with aria-hidden="false"
    document.querySelectorAll('li.slick-active').forEach(function(el) {
      if (el.getAttribute('aria-hidden') === 'false') {
        el.removeAttribute('aria-hidden');
      }
    });

    // 4. Add aria-label to slick-track role="listbox"
    document.querySelectorAll('.slick-track[role="listbox"], .slick-track[role="region"]').forEach(function(el) {
      if (!el.getAttribute('aria-label')) {
        el.setAttribute('aria-label', 'Image carousel');
      }
    });

    // 5. Remove invalid aria attributes from presentation role slides
    document.querySelectorAll('.slick-slide[role="presentation"], li[role="presentation"]').forEach(function(el) {
      el.removeAttribute('aria-selected');
      el.removeAttribute('aria-controls');
    });

    // 6. Suppress focusable elements inside aria-hidden="true" slides
    document.querySelectorAll('.slick-slide[aria-hidden="true"], li[aria-hidden="true"]').forEach(function(slide) {
      slide.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function(el) {
        el.setAttribute('tabindex', '-1');
      });
    });

    // 7. Remove aria-controls from listitem elements
    document.querySelectorAll('li[role="listitem"][aria-controls]').forEach(function(el) {
      el.removeAttribute('aria-controls');
    });
  }

  // Hook into Slick's init event before DOMContentLoaded
  if (typeof jQuery !== 'undefined') {
    jQuery(document).on('init', '.slick-slider', fixSlickAria);
  }

  document.addEventListener('DOMContentLoaded', function() {
    fixSlickAria();
    setTimeout(fixSlickAria, 300);
    setTimeout(fixSlickAria, 800);

    if (typeof jQuery !== 'undefined') {
      jQuery('.slick-slider').on('init afterChange', fixSlickAria);
    }

    var debounceTimer;
    var observer = new MutationObserver(function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(fixSlickAria, 100);
    });
    document.querySelectorAll('.slick-slider').forEach(function(slider) {
      observer.observe(slider, { attributes: true, subtree: true, childList: true });
    });
  });
})();

// Fix: Force autoplay after Slick has fully initialized
jQuery(window).on('load', function() {
  var $slideshow = jQuery('[data-autorotate]');
  if ($slideshow.length && $slideshow.hasClass('slick-initialized')) {
    $slideshow.slick('slickPlay');
  } else if ($slideshow.length) {
    setTimeout(function() {
      if ($slideshow.hasClass('slick-initialized')) {
        $slideshow.slick('slickPlay');
      }
    }, 800);
  }
});
document.querySelectorAll('.slick-track').forEach(function(track) {
  track.setAttribute('role', 'list');
});
document.querySelectorAll('.slick-slide').forEach(function(slide) {
  slide.setAttribute('role', 'listitem');
});
// ─── ARIA: Slick Slider Role Patch ───────────────────────────────────────────
(function patchSlickAria() {
  function applyPatches() {
    // 1. Fix slick-track: change listbox → list
    document.querySelectorAll('.slick-track').forEach(function(track) {
      track.setAttribute('role', 'list');
      track.removeAttribute('aria-atomic');
    });

    // 2. Fix slick-slide: add listitem role, clean up hidden slides
    document.querySelectorAll('.slick-slide').forEach(function(slide) {
      slide.setAttribute('role', 'listitem');
      // Slick marks cloned slides as aria-hidden; ensure non-cloned active slides are visible
      if (!slide.classList.contains('slick-cloned')) {
        if (slide.classList.contains('slick-active')) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // 3. Fix slideshow buttons: ensure <a> tags used as buttons have aria-label
    document.querySelectorAll('a.slideshow__btn').forEach(function(btn) {
      if (!btn.getAttribute('aria-label')) {
        var text = btn.innerText.trim();
        btn.setAttribute('aria-label', text || 'Slideshow button');
      }
      // If no href, demote to button role
      if (!btn.getAttribute('href') || btn.getAttribute('href') === '#') {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
      }
    });

    // 4. Fix slideshow titles: strip redundant role="heading" from native heading elements
    document.querySelectorAll('h1.slideshow__title, h2.slideshow__title, h3.slideshow__title').forEach(function(el) {
      el.removeAttribute('role');
      el.removeAttribute('aria-level'); // native element implies this
    });
  }

  // Run after Slick initializes (it fires 'init' then reInit on resize)
  function waitForSlick() {
    var slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;

    // If Slick already initialized
    if (slideshow.classList.contains('slick-initialized')) {
      applyPatches();
    }

    // Also patch on Slick's own events via jQuery if available
    if (window.jQuery) {
      jQuery('.slideshow').on('init reInit afterChange', function() {
        applyPatches();
      });
    }
  }

  // Wait for DOM + slight delay to let Slick render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(waitForSlick, 300);
    });
  } else {
    setTimeout(waitForSlick, 300);
  }
})();
// ─────────────────────────────────────────────────────────────────────────────
// ─── ARIA: Slick Slider Role Patch ───────────────────────────────────────────
(function patchSlickAria() {
  function applyPatches() {
    // 1. Fix slick-track: change listbox → list
    document.querySelectorAll('.slick-track').forEach(function(track) {
      track.setAttribute('role', 'list');
      track.removeAttribute('aria-atomic');
    });

    // 2. Fix slick-slide: add listitem role, clean up hidden slides
    document.querySelectorAll('.slick-slide').forEach(function(slide) {
      slide.setAttribute('role', 'listitem');
      // Slick marks cloned slides as aria-hidden; ensure non-cloned active slides are visible
      if (!slide.classList.contains('slick-cloned')) {
        if (slide.classList.contains('slick-active')) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // 3. Fix slideshow buttons: ensure <a> tags used as buttons have aria-label
    document.querySelectorAll('a.slideshow__btn').forEach(function(btn) {
      if (!btn.getAttribute('aria-label')) {
        var text = btn.innerText.trim();
        btn.setAttribute('aria-label', text || 'Slideshow button');
      }
      // If no href, demote to button role
      if (!btn.getAttribute('href') || btn.getAttribute('href') === '#') {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
      }
    });

    // 4. Fix slideshow titles: strip redundant role="heading" from native heading elements
    document.querySelectorAll('h1.slideshow__title, h2.slideshow__title, h3.slideshow__title').forEach(function(el) {
      el.removeAttribute('role');
      el.removeAttribute('aria-level'); // native element implies this
    });
  }

  // Run after Slick initializes (it fires 'init' then reInit on resize)
  function waitForSlick() {
    var slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;

    // If Slick already initialized
    if (slideshow.classList.contains('slick-initialized')) {
      applyPatches();
    }

    // Also patch on Slick's own events via jQuery if available
    if (window.jQuery) {
      jQuery('.slideshow').on('init reInit afterChange', function() {
        applyPatches();
      });
    }
  }

  // Wait for DOM + slight delay to let Slick render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(waitForSlick, 300);
    });
  } else {
    setTimeout(waitForSlick, 300);
  }
})();
// ─────────────────────────────────────────────────────────────────────────────
// ─── ARIA: Slick Slider Role Patch ───────────────────────────────────────────
(function patchSlickAria() {
  function applyPatches() {
    // 1. Fix slick-track: change listbox → list
    document.querySelectorAll('.slick-track').forEach(function(track) {
      track.setAttribute('role', 'list');
      track.removeAttribute('aria-atomic');
    });

    // 2. Fix slick-slide: add listitem role, clean up hidden slides
    document.querySelectorAll('.slick-slide').forEach(function(slide) {
      slide.setAttribute('role', 'listitem');
      // Slick marks cloned slides as aria-hidden; ensure non-cloned active slides are visible
      if (!slide.classList.contains('slick-cloned')) {
        if (slide.classList.contains('slick-active')) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
      }
    });

    // 3. Fix slideshow buttons: ensure <a> tags used as buttons have aria-label
    document.querySelectorAll('a.slideshow__btn').forEach(function(btn) {
      if (!btn.getAttribute('aria-label')) {
        var text = btn.innerText.trim();
        btn.setAttribute('aria-label', text || 'Slideshow button');
      }
      // If no href, demote to button role
      if (!btn.getAttribute('href') || btn.getAttribute('href') === '#') {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
      }
    });

    // 4. Fix slideshow titles: strip redundant role="heading" from native heading elements
    document.querySelectorAll('h1.slideshow__title, h2.slideshow__title, h3.slideshow__title').forEach(function(el) {
      el.removeAttribute('role');
      el.removeAttribute('aria-level'); // native element implies this
    });
  }

  // Run after Slick initializes (it fires 'init' then reInit on resize)
  function waitForSlick() {
    var slideshow = document.querySelector('.slideshow');
    if (!slideshow) return;

    // If Slick already initialized
    if (slideshow.classList.contains('slick-initialized')) {
      applyPatches();
    }

    // Also patch on Slick's own events via jQuery if available
    if (window.jQuery) {
      jQuery('.slideshow').on('init reInit afterChange', function() {
        applyPatches();
      });
    }
  }

  // Wait for DOM + slight delay to let Slick render
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(waitForSlick, 300);
    });
  } else {
    setTimeout(waitForSlick, 300);
  }
})();
// ─────────────────────────────────────────────────────────────────────────────


