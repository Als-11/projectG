'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var typesForServiceCtrlStub = {
  index: 'typesForServiceCtrl.index',
  show: 'typesForServiceCtrl.show',
  create: 'typesForServiceCtrl.create',
  upsert: 'typesForServiceCtrl.upsert',
  patch: 'typesForServiceCtrl.patch',
  destroy: 'typesForServiceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var typesForServiceIndex = proxyquire('./index.js', {
  express: {
    Router() {
      return routerStub;
    }
  },
  './typesForService.controller': typesForServiceCtrlStub
});

describe('TypesForService API Router:', function() {
  it('should return an express router instance', function() {
    typesForServiceIndex.should.equal(routerStub);
  });

  describe('GET /api/typesForServices', function() {
    it('should route to typesForService.controller.index', function() {
      routerStub.get
        .withArgs('/', 'typesForServiceCtrl.index')
        .should.have.been.calledOnce;
    });
  });

  describe('GET /api/typesForServices/:id', function() {
    it('should route to typesForService.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'typesForServiceCtrl.show')
        .should.have.been.calledOnce;
    });
  });

  describe('POST /api/typesForServices', function() {
    it('should route to typesForService.controller.create', function() {
      routerStub.post
        .withArgs('/', 'typesForServiceCtrl.create')
        .should.have.been.calledOnce;
    });
  });

  describe('PUT /api/typesForServices/:id', function() {
    it('should route to typesForService.controller.upsert', function() {
      routerStub.put
        .withArgs('/:id', 'typesForServiceCtrl.upsert')
        .should.have.been.calledOnce;
    });
  });

  describe('PATCH /api/typesForServices/:id', function() {
    it('should route to typesForService.controller.patch', function() {
      routerStub.patch
        .withArgs('/:id', 'typesForServiceCtrl.patch')
        .should.have.been.calledOnce;
    });
  });

  describe('DELETE /api/typesForServices/:id', function() {
    it('should route to typesForService.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'typesForServiceCtrl.destroy')
        .should.have.been.calledOnce;
    });
  });
});
