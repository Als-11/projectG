'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var approvalCtrlStub = {
  index: 'approvalCtrl.index',
  show: 'approvalCtrl.show',
  create: 'approvalCtrl.create',
  upsert: 'approvalCtrl.upsert',
  patch: 'approvalCtrl.patch',
  destroy: 'approvalCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var approvalIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './approval.controller': approvalCtrlStub
});

describe('Approval API Router:', function() {
  it('should return an express router instance', function() {
    approvalIndex.should.equal(routerStub);
  });

  describe('GET /api/approvals', function() {
    it('should route to approval.controller.index', function() {
      routerStub.get
        .withArgs('/', 'approvalCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/approvals/:id', function() {
    it('should route to approval.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'approvalCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/approvals', function() {
    it('should route to approval.controller.create', function() {
      routerStub.post
        .withArgs('/', 'approvalCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/approvals/:id', function() {
    it('should route to approval.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'approvalCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/approvals/:id', function() {
    it('should route to approval.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'approvalCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/approvals/:id', function() {
    it('should route to approval.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'approvalCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
