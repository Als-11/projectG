'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var serviceProviderDetailCtrlStub = {
  index: 'serviceProviderDetailCtrl.index',
  show: 'serviceProviderDetailCtrl.show',
  create: 'serviceProviderDetailCtrl.create',
  upsert: 'serviceProviderDetailCtrl.upsert',
  patch: 'serviceProviderDetailCtrl.patch',
  destroy: 'serviceProviderDetailCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var serviceProviderDetailIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './serviceProviderDetail.controller': serviceProviderDetailCtrlStub
});

describe('ServiceProviderDetail API Router:', function() {
  it('should return an express router instance', function() {
    serviceProviderDetailIndex.should.equal(routerStub);
  });

  describe('GET /api/serviceProviderDetails', function() {
    it('should route to serviceProviderDetail.controller.index', function() {
      routerStub.get
        .withArgs('/', 'serviceProviderDetailCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/serviceProviderDetails/:id', function() {
    it('should route to serviceProviderDetail.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'serviceProviderDetailCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/serviceProviderDetails', function() {
    it('should route to serviceProviderDetail.controller.create', function() {
      routerStub.post
        .withArgs('/', 'serviceProviderDetailCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/serviceProviderDetails/:id', function() {
    it('should route to serviceProviderDetail.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'serviceProviderDetailCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/serviceProviderDetails/:id', function() {
    it('should route to serviceProviderDetail.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'serviceProviderDetailCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/serviceProviderDetails/:id', function() {
    it('should route to serviceProviderDetail.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'serviceProviderDetailCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
