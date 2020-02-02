'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var servProvRegistCtrlStub = {
  index: 'servProvRegistCtrl.index',
  show: 'servProvRegistCtrl.show',
  create: 'servProvRegistCtrl.create',
  upsert: 'servProvRegistCtrl.upsert',
  patch: 'servProvRegistCtrl.patch',
  destroy: 'servProvRegistCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var servProvRegistIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './servProvRegist.controller': servProvRegistCtrlStub
});

describe('ServProvRegist API Router:', function() {
  it('should return an express router instance', function() {
    servProvRegistIndex.should.equal(routerStub);
  });

  describe('GET /api/servProvRegists', function() {
    it('should route to servProvRegist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'servProvRegistCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/servProvRegists/:id', function() {
    it('should route to servProvRegist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'servProvRegistCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/servProvRegists', function() {
    it('should route to servProvRegist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'servProvRegistCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/servProvRegists/:id', function() {
    it('should route to servProvRegist.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'servProvRegistCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/servProvRegists/:id', function() {
    it('should route to servProvRegist.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'servProvRegistCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/servProvRegists/:id', function() {
    it('should route to servProvRegist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'servProvRegistCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
