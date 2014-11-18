(function messageParentRelevantDetails($, Drupal, window) {
  var $document = $(document),
      lastHeight = 0;

  // Only relevant if we're loaded within an iframe.
  if (window.top === window.self) {
    return;
  }

  // Initialize the frame communicator.
  $document.ready(function initializeFrameComm() {
    $document.framecomm({
      whitelist: Drupal.settings.formframe.whitelist
    });

    // Every 100ms, check the document height; if different, send to parent.
    setInterval(function() {
      var height = document.getElementsByTagName('html')[0].offsetHeight;

      // Give the parent some context about ourselves. But only on change.
      if (height !== lastHeight) {
        lastHeight = height;
        $document.framecomm.send({
          height: lastHeight
        });
      }
    }, 100);
  });
})(jQuery, Drupal, window);
