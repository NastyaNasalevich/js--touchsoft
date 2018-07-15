/* eslint-disable no-undef */

QUnit.module('Hash changes');

QUnit.test('Check setting of configurators hash', function test(assert) {
  window.location.hash = '';
  
  document.getElementsByClassName('btn btn-red')[0].click();
  assert.ok(window.location.hash === '#configurator', 'Hash was changed!');
});

QUnit.test('Check setting of dashboards hash', function test(assert) {
    window.location.hash = '';

    document.getElementsByClassName('btn btn-red')[1].click();
    assert.ok(window.location.hash === '#dashboard', 'Hash was changed!');
  });

  QUnit.test('Check setting of about pages hash', function test(assert) {
    window.location.hash = '';
  
    document.getElementsByClassName('btn btn-red')[2].click();
    assert.ok(window.location.hash === '#about', 'Hash was changed!');
  });

QUnit.module('Appending of conntent', {
    beforeEach() {
        window.location.hash = '';
    }
  });

QUnit.test('Check appending of configurator', function test(assert) {
    var done = assert.async();
    document.getElementsByClassName('btn btn-red')[0].click();
    setTimeout(function f() {
        assert.ok(document.getElementById('config-resultScript') !== null, 'Configurator was appended!');
        done();
    }, 1000);
  });

QUnit.test('Check appending of dashboard', function test(assert) {
    var done = assert.async();
    document.getElementsByClassName('btn btn-red')[1].click();
    setTimeout(function f() {
        assert.ok(document.getElementById('dashboard-users-list') !== null, 'Dashboard was appended!');
        done();
    }, 1000);
});

QUnit.test('Check appending of about page', function test(assert) {
    var done = assert.async();
    document.getElementsByClassName('btn btn-red')[2].click();
    setTimeout(function f() {
        assert.ok(document.getElementsByClassName('about-heading')[0] !== null, 'About page was appended!');
        done();
    }, 1000);
});