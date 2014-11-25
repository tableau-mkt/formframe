var Drupal = window.Drupal || {};

(function ($, Drupal) {
  // Mock out the basic form frame Drupal settings.
  Drupal.settings = {
    formframe: {
      whitelist: []
    }
  };
})(jQuery, Drupal);
