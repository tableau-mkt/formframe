casper.test.begin('Frame communication API behaviors', function suite(tester) {
  var childGlobal = '_childReceived',
      parentGlobal = '_parentReceived',
      expectedData = {
        foo: {
          fizz: 'buzz'
        }
      },
      expectedMessageCount = 3;

  casper.start(_ROOT, function() {
    tester.info('Current URI: ' + this.getCurrentUrl());

    // Set up a listener in the child context that dumps event data in a global.
    this.evaluate(function (cg) {
      var iframe = document.getElementsByTagName('iframe')[0],
          localWindow = iframe.contentWindow,
          localDoc = iframe.contentDocument,
          parentWindow = window;

      localWindow.jQuery(localDoc).bind('formframe:message', function (event, data) {
        parentWindow[cg] = parentWindow[cg] || [];
        parentWindow[cg].push(data);
      });
    }, childGlobal);
  });

  casper.then(function() {
    // Send three identical messages to the child frame.
    this.evaluate(function (count, childData) {
      for (var i = 0; i < count; i++) {
        FF.messenger(document.getElementsByTagName('iframe')[0], childData);
      }
    }, expectedMessageCount, expectedData);
  });

  casper.then(function() {
    tester.assertEvalEquals(function (cg) {
      return window[cg].length;
    }, expectedMessageCount, 'Messenger sent (and child received) the expected number of messages.', childGlobal);

    tester.assertEvalEquals(function (cg) {
      return window[cg][0].foo;
    }, expectedData.foo, 'Child received expected data.', childGlobal);

    tester.assertEvalEquals(function (cg) {
      return window[cg][0].triggeredBy;
    }, 'formframe', 'Child event included triggeredBy property.', childGlobal);
  });

  casper.thenOpen(_ROOT, function() {
    tester.info('Current URI: ' + this.getCurrentUrl());

    // Set up a listener in the parent that dumps event data in a global.
    this.evaluate(function (pg) {
      jQuery(document).bind('formframe:message', function (event, data) {
        window[pg] = window[pg] || [];
        window[pg].push(event);
      });
    }, parentGlobal);
  });

  casper.then(function() {
    // Send three identical messages to the parent window.
    this.evaluate(function (count, parentData) {
      var iframe = document.getElementsByTagName('iframe')[0],
          localWindow = iframe.contentWindow,
          localDoc = iframe.contentDocument;

      for (var i = 0; i < count; i++) {
        localWindow.jQuery(localDoc).framecomm.send(parentData);
      }
    }, expectedMessageCount, expectedData);
  });

  casper.then(function() {
    tester.assertEvalEquals(function (pg) {
      return window[pg].length;
    }, expectedMessageCount, 'Child sent (and parent received) the expected number of messages.', parentGlobal);

    tester.assertEvalEquals(function (pg) {
      return window[pg][0].detail.foo;
    }, expectedData.foo, 'Parent received expected data.', parentGlobal);

    tester.assertEvalEquals(function (pg) {
      return window[pg][0].detail.triggeredBy;
    }, 'formframe', 'Parent event included triggeredBy property.', parentGlobal);

    tester.assertEval(function (pg) {
      return typeof window[pg][0].detail.__ffid === 'string';
    }, 'Parent event included form frame id property.', parentGlobal);
  });


  casper.run(function() {
    tester.done();
  });

});
