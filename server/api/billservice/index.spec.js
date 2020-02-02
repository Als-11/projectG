'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var billserviceCtrlStub = {
  index: 'billserviceCtrl.index',
  show: 'billserviceCtrl.show',
  create: 'billserviceCtrl.create',
  update: 'billserviceCtrl.update',
  destroy: 'billserviceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var billserviceIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './billservice.controller': billserviceCtrlStub
});

describe('Billservice API Router:', function() {

  it('should return an express router instance', function() {
    billserviceIndex.should.equal(routerStub);
  });

  describe('GET /api/billservices', function() {

    it('should route to billservice.controller.index', function() {
      routerStub.get
        .withArgs('/', 'billserviceCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/billservices/:id', function() {

    it('should route to billservice.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'billserviceCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/billservices', function() {

    it('should route to billservice.controller.create', function() {
      routerStub.post
        .withArgs('/', 'billserviceCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/billservices/:id', function() {

    it('should route to billservice.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'billserviceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/billservices/:id', function() {

    it('should route to billservice.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'billserviceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/billservices/:id', function() {

    it('should route to billservice.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'billserviceCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
