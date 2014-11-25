(function($) {

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

    // Call the form comm plugin and assert the correct effects.
    this.formContainer.framecomm(expectedOptions);
    deepEqual(mockData.defaults, expectedDefaults, 'should be called with expected defaults');
    deepEqual(mockData.options, expectedOptions, 'should be called with passed options');

    // Reset methods.
    $.extend = oldExtend;

    expect(2);
  });

}(jQuery));
