# Contributing

### Running tests
There are boat loads of tests that you ought to be running, depending on what
you intend to modify. The simplest thing is to make your changes, push them up,
and open a pull request (which will trigger all tests to be run on Travis).

If you'd like to run them locally, you'll need to do the following:

#### Running JavaScript unit tests
1. [Install npm globally](https://github.com/npm/npm#fancy-install-unix) if
   needed: `curl -L https://npmjs.org/install.sh | sh`
1. [Install grunt globally](http://gruntjs.com/getting-started) if needed:
   `npm install -g grunt-cli`
1. Install node dependencies: `npm install`
1. Install bower dependencies: `bower install`
1. Run unit tests: `grunt test`

#### Running Drupal tests
1. [Install composer globally](https://getcomposer.org/doc/00-intro.md#system-requirements)
   if needed.
1. Install [drush](https://github.com/drush-ops/drush):
   `composer global require drush/drush:6.*`
1. Install form frame and simpletest modules on your drupal site:
   `drush en formframe simpletest`
1. Run the simpletest test suite: `drush test-run 'Form Frame'`

#### Running JavaScript integration tests
1. [Install PhantomJS globally](http://phantomjs.org/download.html)
1. [Install CasperJS globally](http://casperjs.readthedocs.org/en/latest/installation.html)
1. Install form frame and its companion test module:
   `drush en formframe formframe_test_defaults`
1. Run the CasperJS test suite:
   `casperjs test --host=http://your-local.host --pre=./test/js-integration/setup.js ./test/js-integration/tests` 

### Code style
Regarding code style like indentation and whitespace, **follow the conventions
you see used in the source already.**

## Submitting pull requests

1. Create a new branch, please don't work in your `master` branch directly.
1. Add failing tests for the change you want to make. Run tests (as described
   above) and make sure you see fails.
1. Fix stuff.
1. Run tests again to see if tests pass. Repeat steps 2-4 until done.
1. Update the documentation to reflect any changes.
1. Push to your fork and submit a pull request.
