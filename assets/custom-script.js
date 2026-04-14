// Consolidated Slick accessibility patch.
(function() {
  function normalizeSlideshowAria(scope) {
    var root = scope || document;

    root.querySelectorAll('.slideshow .slick-track').forEach(function(track) {
      var role = track.getAttribute('role');
      // Avoid parent roles that require strict child roles (list/listbox).
      if (role === 'list' || role === 'listbox') {
        track.setAttribute('role', 'region');
      }
      if (!track.getAttribute('aria-label')) {
        track.setAttribute('aria-label', 'Slideshow');
      }
      track.removeAttribute('aria-atomic');
    });

    root.querySelectorAll('.slideshow').forEach(function(slideshow) {
      var realSlides = slideshow.querySelectorAll('.slideshow__slide:not(.slick-cloned)');

      realSlides.forEach(function(slide, index) {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-roledescription', 'slide');
        slide.setAttribute('aria-label', 'Slide ' + (index + 1) + ' of ' + realSlides.length);
      });

      // Keep hidden slides out of keyboard navigation.
      slideshow.querySelectorAll('.slick-slide').forEach(function(slide) {
        var isHidden = slide.getAttribute('aria-hidden') === 'true';

        slide.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(function(el) {
          if (el.closest('.slick-dots')) {
            return;
          }

          if (isHidden) {
            if (!el.hasAttribute('data-orig-tabindex')) {
              el.setAttribute('data-orig-tabindex', el.getAttribute('tabindex') || '');
            }
            el.setAttribute('tabindex', '-1');
            return;
          }

          if (el.hasAttribute('data-orig-tabindex')) {
            var originalTabindex = el.getAttribute('data-orig-tabindex');
            if (originalTabindex === '') {
              el.removeAttribute('tabindex');
            } else {
              el.setAttribute('tabindex', originalTabindex);
            }
            el.removeAttribute('data-orig-tabindex');
          }
        });
      });
    });

    // Dots are simple list markup; remove extra ARIA noise added by Slick.
    root.querySelectorAll('.slick-dots li').forEach(function(dot) {
      dot.removeAttribute('role');
      dot.removeAttribute('aria-hidden');
      dot.removeAttribute('aria-controls');
      dot.removeAttribute('aria-selected');
    });
  }

  function bindSlickAriaEvents() {
    if (typeof jQuery === 'undefined') {
      return;
    }

    jQuery(document).on('init reInit afterChange', '.slideshow', function() {
      normalizeSlideshowAria(this);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      bindSlickAriaEvents();
      normalizeSlideshowAria(document);
    });
  } else {
    bindSlickAriaEvents();
    normalizeSlideshowAria(document);
  }
})();

// Preserve autoplay behavior after Slick initialization.
if (typeof jQuery !== 'undefined') {
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
}
