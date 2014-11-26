casper.test.begin('Links within frame target parent', function suite(tester) {
  // Initial checks to ensure bare minimum test requirements are there.
  casper.start(_ROOT + '/form/frame/test-login', function() {
    tester.info('Current URI: ' + this.getCurrentUrl());
    tester.assertExists('a#linkTargetExists', 'Test link 1 exists on page');
    tester.assertExists('a#linkTargetDoesntExist', 'Test link 2 exists on page');

    // Because we're not in an iframe; link targets should remain unaltered.
    tester.assertEval(function() {
      return jQuery('a#linkTargetExists').attr('target') === 'exists';
    }, 'Test link 1 target still set to "exists"');
    tester.assertEval(function() {
      return !jQuery('a#linkTargetDoesntExist').attr('target');
    }, 'Test link 2 target still not set');
  });

  casper.thenOpen(_ROOT, function() {
    tester.info('Current URI: ' + this.getCurrentUrl());

    // Because we're on the same origin, we can do stuff like this!
    tester.assertEval(function() {
      return jQuery('iframe').contents().find('a#linkTargetExists').attr('target') === 'exists';
    }, 'Test link 1 target was not affected by the parent target script');
    tester.assertEval(function() {
      return jQuery('iframe').contents().find('a#linkTargetDoesntExist').attr('target') === '_parent';
    }, 'Test link 2 target was set to "_parent"');
  });

  casper.run(function() {
    tester.done();
  });
});
