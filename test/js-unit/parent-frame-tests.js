(function($, window) {

  module('drupal#formframe loader tests', {
    setup: function() {
      this.formConfig = $('#qunit-fixture');
      this.expectedWidth = $('param[name="width"]').attr('value');
      this.expectedFormName = $('param[name="formName"]').attr('value');
      this.expectedCustomReal = $('param[name="customReal"]').attr('value');
    }
  });

  test('loader url base construction', function() {
    var oldSettings = FF.settings,
        expectedBaseUrl = 'http://example.com/',
        expectedFormName = 'test-form-name',
        expectedFullUrl = expectedBaseUrl + 'form/frame/' + expectedFormName,
        receivedUrl;

    // Set a base URL.
    FF.settings.baseUrl = expectedBaseUrl;

    // Call the constructUrl method and assert expected results.
    receivedUrl = FF.constructUrl({formName: expectedFormName});
    equal(receivedUrl, expectedFullUrl, 'returned expected form frame url');

    expect(1);

    // Clean up everything.
    FF.settings = oldSettings;
  });

  test('loader url param construction', function() {
    var oldSettings = FF.settings,
        formSettings = {
          formName: 'some-name',
          width: 480,
          foo: 'foo',
          bar: 'bar'
        },
        url;

    // Call the constructUrl method and assert expected results.
    url = FF.constructUrl(formSettings);
    strictEqual(url.indexOf('width='), -1, 'width parameter ignored in param constructor');
    strictEqual(url.indexOf('formName='), -1, 'formName parameter ignored in param constructor');
    ok(url.indexOf('foo=foo'), 'foo parameter added in param constructor');
    ok(url.indexOf('bar=bar'), 'bar parameter added in param constructor');
    notStrictEqual(url.substring(url.length -1), '&', 'param constructor truncated ending ampersand');

    expect(5);

    FF.settings = oldSettings;
  });

  test('loader settings getter defaults', function() {
    var gotSettings;

    // Call the getSettings method and assert expected results.
    gotSettings = FF.getSettings(this.formConfig[0]);
    equal(gotSettings.width, this.expectedWidth, 'returned configured width without drupal dynamic settings');
    equal(gotSettings.formName, this.expectedFormName, 'returned configured formName without drupal dynamic settings');
    ok(gotSettings['__ffid'], 'returned an ffid param setting');
    ok(gotSettings['__ffid'].substring(0, 2) !== '0.', 'returned ffid is a valid html id');

    expect(4);
  });

  test('loader settings getter custom params', function() {
    var gotSettings;

    // Configure the settings getter to pull in specific custom params.
    FF.drupalDynamicSettings = {
      customReal: 'expectedQueryParamName'
    };

    // Call the getSettings method and assert expected results.
    gotSettings = FF.getSettings(this.formConfig[0]);
    equal(gotSettings[FF.drupalDynamicSettings.customReal], this.expectedCustomReal, 'returned custom param for configured drupal dynamic setting');
    strictEqual(typeof gotSettings.customFake, 'undefined', 'ignored existing custom parameter on-page that was not included in the drupal dynamic setting');

    expect(2);

    // Clean everything up.
    delete FF.drupalDynamicSettings;
  });

  test('loader messenger', function() {
    var oldSettings = FF.settings,
        receivedPayload = '',
        receivedOrigin = '',
        mockIframe = {
          contentWindow: {
            postMessage: function(payload, origin) {
              receivedPayload = payload;
              receivedOrigin = origin;
            }
          }
        },
        mockPayload = {
          foo: 'bar',
          baz: {
            fizz: 'buzz'
          }
        },
        parsed;

    // Call the messenger method and assert expected results.
    FF.settings.baseUrl = 'http://example.com';
    FF.messenger(mockIframe, mockPayload);
    parsed = JSON.parse(receivedPayload);
    strictEqual(parsed.triggeredBy, 'formframe', 'payload included triggeredBy property');
    strictEqual(receivedOrigin, FF.settings.baseUrl, 'payload origin pulled from FF.settings');
    strictEqual(parsed.foo, mockPayload.foo, 'payload included simple custom data');
    deepEqual(parsed.baz, mockPayload.baz, 'payload included nested custom data');

    expect(4);

    // Clean everything up.
    FF.settings = oldSettings;
  });

  test('loader listener', function() {
    var oldSettings = FF.settings,
        expectedOrigin = 'http://example.com',
        expectedHeight = 400,
        mockEvent = {
          message: JSON.stringify({
            triggeredBy: 'formframe',
            height: expectedHeight,
            __ffid: 'testId'
          }),
          origin: expectedOrigin
        },
        receivedData;

    // Create an event listener to listen for the triggered event.
    $(document).bind('formframe:message', function(event) {
      // Hmm...
      receivedData = event.originalEvent.detail;
    });

    // Call the messenger method and assert expected results.
    FF.settings.baseUrl = expectedOrigin + '/';
    FF.listener(mockEvent);
    equal(document.getElementById('testId').height, expectedHeight, 'given height was applied');
    deepEqual(receivedData, JSON.parse(mockEvent.message), 'triggered formframe:message event');

    expect(2);

    // Clean everything up.
    FF.settings = oldSettings;
  });

  test('loader loader', function() {
    var oldAppendChild = Node.prototype.appendChild,
        $iframe;

    // Mock out the appendChild function.
    Node.prototype.appendChild = function(obj) {
      $iframe = $(obj);
    };

    // Call the loader method and assert expected results.
    FF.loader();
    equal($iframe.attr('width'), this.expectedWidth, 'generated iframe with expected width');
    equal($iframe.attr('scrolling'), 'no', 'generated iframe with no scrolling allowed');
    equal($iframe.attr('frameborder'), 0, 'generated iframe with no frameborder');
    ok($iframe.attr('src').indexOf('__ffid=' + $iframe.attr('id')), 'generated iframe where id matches passed ffid');

    expect(4);

    // Clean everything up.
    Node.prototype.appendChild = oldAppendChild;
  });

  test('loader initializer does not reinitialize', function () {
    var oldLoader = FF.loader,
        loaded = 0;

    // Mock out the loader.
    FF.loader = function() {
      loaded++;
    };

    // Call the initializer method and assert expected results.
    FF.settings.initialized = true;
    FF.initialize();
    strictEqual(loaded, 0, 'loader initializer did not reinitialize');

    expect(1);

    // Clean everything up.
    FF.loader = oldLoader;
  });

  test('loader initializer properly initializes', function() {
    var oldLoader = FF.loader,
        oldListener = FF.listener,
        oldAddListener = window.addEventListener,
        verifyListenerCallback = 'omgwtfbbq1337',
        loaded = 0,
        receivedHandler,
        receivedListener,
        receivedParam;

    // Mock out the loader.
    FF.loader = function() {
      loaded++;
    };

    // Mock out the listener.
    FF.listener = function() {
      return verifyListenerCallback;
    };

    // Mock out a window event listener.
    window.addEventListener = function(handler, listener, shouldBeFalse) {
      receivedHandler = handler;
      receivedListener = listener;
      receivedParam = shouldBeFalse;
    };

    // Call the initializer method and assert expected results.
    FF.settings.initialized = false;
    FF.initialize();
    strictEqual(loaded, 1, 'loader initializer did not reinitialize');
    strictEqual(FF.settings.initialized, true, 'loader set itself as initialized');
    strictEqual(receivedHandler, FF.settings.handleMessage, 'loader added event listener with expected handler');
    strictEqual(receivedListener.call(), verifyListenerCallback, 'loader added event listener with expected listener');
    strictEqual(receivedParam, false, 'loader added event listener with useCapture set to false');

    expect(5);

    // Clean everything up.
    FF.loader = oldLoader;
    FF.listener = oldListener;
    window.addEventListener = oldAddListener;
  });

}(jQuery, window));
