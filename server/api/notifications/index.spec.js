'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var notificationsCtrlStub = {
  index: 'notificationsCtrl.index',
  show: 'notificationsCtrl.show',
  create: 'notificationsCtrl.create',
  update: 'notificationsCtrl.update',
  destroy: 'notificationsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var notificationsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './notifications.controller': notificationsCtrlStub
});

describe('Notifications API Router:', function() {

  it('should return an express router instance', function() {
    notificationsIndex.should.equal(routerStub);
  });

  describe('GET /api/notificationss', function() {

    it('should route to notifications.controller.index', function() {
      routerStub.get
        .withArgs('/', 'notificationsCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/notificationss/:id', function() {

    it('should route to notifications.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'notificationsCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/notificationss', function() {

    it('should route to notifications.controller.create', function() {
      routerStub.post
        .withArgs('/', 'notificationsCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/notificationss/:id', function() {

    it('should route to notifications.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'notificationsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/notificationss/:id', function() {

    it('should route to notifications.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'notificationsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/notificationss/:id', function() {

    it('should route to notifications.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'notificationsCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
