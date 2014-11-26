var _ROOT = casper.cli.get('host') === undefined ? 'http://localhost' : casper.cli.get('host');

casper.echo('Setting global variables');
casper.echo('URI Root: ' + _ROOT);
casper.test.done();
