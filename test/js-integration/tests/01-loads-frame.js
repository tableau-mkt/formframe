casper.test.begin('Overall frame load behavior', function suite(tester) {
  // Initial checks to ensure bare minimum test requirements are there.
  casper.start(_ROOT, function() {
    tester.info('Current URI: ' + this.getCurrentUrl());
  });

  casper.then(function() {
    tester.assertExists('.formframe-container > object', 'Form frame embed code found on the page.');
    tester.assertExists('script[src="/form/frame/loader.js"]', 'Form frame loader.js included on the page.');
    tester.assertExists('.formframe-container iframe', 'Form frame loader properly loaded a form frame.');
    tester.assertExists('.formframe-container iframe[src*="bg-body="]', 'Form frame loader included bg color param.');
    tester.assertExists('.formframe-container iframe[src*="bg-input="]', 'Form frame loader included input bg param.');
    tester.assertExists('.formframe-container iframe[src*="__ffid="]', 'Form frame loader included ffid param.');
  });

  casper.run(function() {
    tester.done();
  });
});
