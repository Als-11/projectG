'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var paymentsrequestsCtrlStub = {
  index: 'paymentsrequestsCtrl.index',
  show: 'paymentsrequestsCtrl.show',
  create: 'paymentsrequestsCtrl.create',
  upsert: 'paymentsrequestsCtrl.upsert',
  patch: 'paymentsrequestsCtrl.patch',
  destroy: 'paymentsrequestsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var paymentsrequestsIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './paymentsrequests.controller': paymentsrequestsCtrlStub
});

describe('Paymentsrequests API Router:', function() {
  it('should return an express router instance', function() {
    paymentsrequestsIndex.should.equal(routerStub);
  });

  describe('GET /api/paymentsrequets', function() {
    it('should route to paymentsrequests.controller.index', function() {
      routerStub.get
        .withArgs('/', 'paymentsrequestsCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/paymentsrequets/:id', function() {
    it('should route to paymentsrequests.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'paymentsrequestsCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/paymentsrequets', function() {
    it('should route to paymentsrequests.controller.create', function() {
      routerStub.post
        .withArgs('/', 'paymentsrequestsCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/paymentsrequets/:id', function() {
    it('should route to paymentsrequests.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'paymentsrequestsCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/paymentsrequets/:id', function() {
    it('should route to paymentsrequests.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'paymentsrequestsCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/paymentsrequets/:id', function() {
    it('should route to paymentsrequests.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'paymentsrequestsCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
