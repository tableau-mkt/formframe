(function($, window) {

  module('drupal#formframe framecomm tests', {
    setup: function() {
      this.formContainer = $('#qunit-fixture');
    }
  });

  test('framecomm is chainable', function() {
    strictEqual(this.formContainer.framecomm({}), this.formContainer, 'is chainable');
    expect(1);
  });

  test('extends default configurations', function() {
    var oldExtend = $.extend,
        expectedOptions = {
          foo: 'bar',
          baz: 'fizz'
        },
        expectedDefaults = $.fn.framecomm.defaults,
        mockData = {};

    // Override the core extend method.
    $.extend = function(arg1, arg2, arg3) {
      mockData.defaults = arg2;
      mockData.options = arg3;
      return oldExtend.call(this, arg1, arg2, arg3);
    };

    // Call the frame comm plugin and assert the correct effects.
    this.formContainer.framecomm(expectedOptions);
    deepEqual(mockData.defaults, expectedDefaults, 'should be called with expected defaults');
    deepEqual(mockData.options, expectedOptions, 'should be called with passed options');

    // Reset methods.
    $.extend = oldExtend;

    expect(2);
  });

  test('adds window message listener', function() {
    var oldReceive = $.fn.framecomm.receive,
        mockListener = 'mockEventListener',
        expectedEvent = 'customOnMessageEvent',
        mockOptions = {
          listener: mockListener,
          event: expectedEvent
        },
        verifyReceiveCallback = 'checkCheck2',
        receivedEvent,
        receivedCallback,
        receivedParam;

    // Set up a mock event receive listener.
    $.fn.framecomm.receive = function() {
      return verifyReceiveCallback;
    };

    // Set a mock event handler on the window object.
    window[mockListener] = function(event, receiveCallback, shouldBeFalse) {
      receivedEvent = event;
      receivedCallback = receiveCallback;
      receivedParam = shouldBeFalse;
    };

    // Call the frame comm plugin and assert the correct effects.
    this.formContainer.framecomm(mockOptions);
    strictEqual(expectedEvent, receivedEvent, 'added listener with configured event');
    strictEqual(receivedCallback.call(this.formContainer), verifyReceiveCallback, 'expected listener callback attached to event');
    strictEqual(receivedParam, false, 'added listener with useCapture set to false');

    expect(3);

    // Clean everything up.
    delete window[mockListener];
    $.fn.framecomm.receive = oldReceive;
  });

  test('sends data to target', function() {
    var receivedData = '',
        receivedOrigin = '',
        fuid = $.fn.framecomm.defaults.frameUniqueId,
        mockFuidValue = 'omgwtfbbq',
        mockOptions = {
          targetFrame: {
            postMessage: function(data, origin) {
              receivedData = data;
              receivedOrigin = origin;
            }
          },
          contextual: {}
        },
        mockData = {
          foo: 'bar',
          baz: {fizz: 'buzz'}
        },
        expectedData = {};

    // Set contextual expectations.
    mockOptions.contextual[fuid] = mockFuidValue;

    // Set up expectations.
    expectedData.triggeredBy = 'formframe';
    expectedData[fuid] = mockFuidValue;
    expectedData = $.extend({}, expectedData, mockData);

    // Call the frame comm plugin and assert the correct effects.
    this.formContainer.framecomm(mockOptions);
    this.formContainer.framecomm.send(mockData);
    strictEqual(receivedData, JSON.stringify(expectedData), 'data sent to target with expected payload');
    strictEqual(receivedOrigin, '*', 'data sent with expected target origin');

    expect(2);
  });

  test('triggers event on data receipt', function() {
    var mockOptions = {
          whitelist: [
            'http://example.com'
          ]
        },
        mockEvent = {
          message: JSON.stringify({
            triggeredBy: $.fn.framecomm.defaults.triggeredBy,
            foo: 'bar',
            baz: {fizz: 'buzz'}
          }),
          origin: mockOptions.whitelist[0]
        },
        receivedCount = 0,
        receivedData = {};

    // Bind an event handler to the expected message.
    $(document).bind('formframe:message', function(event, data) {
      receivedCount++;
      receivedData = data;
    });

    // Call the frame comm plugin and assert the correct effects.
    this.formContainer.framecomm(mockOptions);
    this.formContainer.framecomm.receive(mockEvent);
    strictEqual(receivedCount, 1, 'triggered a single formframe:message event');
    deepEqual(receivedData, JSON.parse(mockEvent.message), 'received expected data payload');

    // Set the event origin to one not on the whitelist and check expectations.
    mockEvent.origin = 'http://not.example.com';
    this.formContainer.framecomm.receive(mockEvent);
    strictEqual(receivedCount, 1, 'formframe:message event not triggered for non-whitelisted origin');

    expect(3);
  });

}(jQuery, window));
