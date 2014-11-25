(function($) {

  module('drupal#formframe child frame tests', {
    setup: function() {
      this.formContainer = $('#qunit-fixture');
    }
  });

  test('test', function() {
    equal(1, 1, '1 and 1 are the same.');
    expect(1);
  });

}(jQuery));
