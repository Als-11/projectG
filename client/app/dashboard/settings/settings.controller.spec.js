'use strict';

describe('Component: SettingsComponent', function () {

  // load the controller's module
  beforeEach(module('guwhaApp'));

  var SettingsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($componentController) {
    SettingsComponent = $componentController('settings', {});
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
