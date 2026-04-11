/**
 * Slick Slider ARIA Patch
 * Fixes three PSI/axe accessibility violations:
 * 1. aria-selected → aria-pressed on dot buttons (role=button)
 * 2. aria-selected removed from role=listitem <li> elements
 * 3. tabindex="-1" added to focusable children inside aria-hidden slides
 *
 * Drop this into your theme.js or a standalone slick-aria-patch.js snippet.
 * Requires jQuery (already a Slick dependency).
 */

(function ($) {
  'use strict';

  function patchSlickARIA($slider) {
    // ── 1. Dot buttons: aria-selected → aria-pressed ──────────────────────
    $slider.find('.slick-dots button').each(function () {
      const $btn = $(this);
      const isSelected = $btn.attr('aria-selected');

      if (isSelected !== undefined) {
        // Transfer state to aria-pressed, remove invalid attribute
        $btn.attr('aria-pressed', isSelected === 'true' ? 'true' : 'false');
        $btn.removeAttr('aria-selected');
      }
    });

    // ── 2. Dot <li> elements: remove aria-selected (invalid on listitem) ───
    $slider.find('.slick-dots li').each(function () {
      $(this).removeAttr('aria-selected');
    });

    // ── 3. aria-hidden slides: suppress focusable descendants ─────────────
    $slider.find('.slick-slide[aria-hidden="true"]').each(function () {
      $(this)
        .find('a, button, input, select, textarea, [tabindex]')
        .each(function () {
          const $el = $(this);
          // Stash original tabindex so we can restore if slide becomes visible
          if ($el.attr('data-slick-tabindex-orig') === undefined) {
            $el.attr('data-slick-tabindex-orig', $el.attr('tabindex') ?? '');
          }
          $el.attr('tabindex', '-1');
        });
    });

    // Restore tabindex on visible slides
    $slider.find('.slick-slide:not([aria-hidden="true"])').each(function () {
      $(this)
        .find('[data-slick-tabindex-orig]')
        .each(function () {
          const $el = $(this);
          const orig = $el.attr('data-slick-tabindex-orig');
          if (orig === '') {
            $el.removeAttr('tabindex');
          } else {
            $el.attr('tabindex', orig);
          }
          $el.removeAttr('data-slick-tabindex-orig');
        });
    });
  }

  // ── Hook into Slick events ───────────────────────────────────────────────
  // Covers: initial render, slide change, lazy-loaded re-renders
  $(document).on(
    'init afterChange reInit',
    '[data-slick], .slick-slider',
    function (event, slick) {
      patchSlickARIA($(this));
    }
  );

  // ── Fallback: if sliders are already initialized before this script runs ─
  $(function () {
    $('.slick-initialized').each(function () {
      patchSlickARIA($(this));
    });
  });

}(jQuery));
