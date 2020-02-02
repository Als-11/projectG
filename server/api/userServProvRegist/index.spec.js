'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userServProvRegistCtrlStub = {
  index: 'userServProvRegistCtrl.index',
  show: 'userServProvRegistCtrl.show',
  create: 'userServProvRegistCtrl.create',
  upsert: 'userServProvRegistCtrl.upsert',
  patch: 'userServProvRegistCtrl.patch',
  destroy: 'userServProvRegistCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userServProvRegistIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './userServProvRegist.controller': userServProvRegistCtrlStub
});

describe('UserServProvRegist API Router:', function() {
  it('should return an express router instance', function() {
    userServProvRegistIndex.should.equal(routerStub);
  });

  describe('GET /api/userServProvRegists', function() {
    it('should route to userServProvRegist.controller.index', function() {
      routerStub.get
        .withArgs('/', 'userServProvRegistCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/userServProvRegists/:id', function() {
    it('should route to userServProvRegist.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'userServProvRegistCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/userServProvRegists', function() {
    it('should route to userServProvRegist.controller.create', function() {
      routerStub.post
        .withArgs('/', 'userServProvRegistCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/userServProvRegists/:id', function() {
    it('should route to userServProvRegist.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'userServProvRegistCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/userServProvRegists/:id', function() {
    it('should route to userServProvRegist.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'userServProvRegistCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/userServProvRegists/:id', function() {
    it('should route to userServProvRegist.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'userServProvRegistCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
