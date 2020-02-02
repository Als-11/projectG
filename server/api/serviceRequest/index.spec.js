'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var serviceRequestCtrlStub = {
  index: 'serviceRequestCtrl.index',
  show: 'serviceRequestCtrl.show',
  create: 'serviceRequestCtrl.create',
  upsert: 'serviceRequestCtrl.upsert',
  patch: 'serviceRequestCtrl.patch',
  destroy: 'serviceRequestCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var serviceRequestIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './serviceRequest.controller': serviceRequestCtrlStub
});

describe('ServiceRequest API Router:', function() {
  it('should return an express router instance', function() {
    serviceRequestIndex.should.equal(routerStub);
  });

  describe('GET /api/serviceRequests', function() {
    it('should route to serviceRequest.controller.index', function() {
      routerStub.get
        .withArgs('/', 'serviceRequestCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/serviceRequests/:id', function() {
    it('should route to serviceRequest.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'serviceRequestCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/serviceRequests', function() {
    it('should route to serviceRequest.controller.create', function() {
      routerStub.post
        .withArgs('/', 'serviceRequestCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/serviceRequests/:id', function() {
    it('should route to serviceRequest.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'serviceRequestCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/serviceRequests/:id', function() {
    it('should route to serviceRequest.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'serviceRequestCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/serviceRequests/:id', function() {
    it('should route to serviceRequest.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'serviceRequestCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
