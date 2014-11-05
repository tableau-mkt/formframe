(function targetParentAllAnchors($, window) {
  // Only do so if we're in an iframe.
  if (window.top !== window.self) {
    $(document).ready(function onReady() {
      // Only affect anchors that don't already have targets.
      $('a:not([target!=])').attr('target', '_parent');
    });
  }
})(jQuery, window);
