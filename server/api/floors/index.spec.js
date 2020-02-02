'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var floorsCtrlStub = {
  index: 'floorsCtrl.index',
  show: 'floorsCtrl.show',
  create: 'floorsCtrl.create',
  update: 'floorsCtrl.update',
  destroy: 'floorsCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var floorsIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './floors.controller': floorsCtrlStub
});

describe('Floors API Router:', function() {

  it('should return an express router instance', function() {
    floorsIndex.should.equal(routerStub);
  });

  describe('GET /api/floors', function() {

    it('should route to floors.controller.index', function() {
      routerStub.get
        .withArgs('/', 'floorsCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/floors/:id', function() {

    it('should route to floors.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'floorsCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/floors', function() {

    it('should route to floors.controller.create', function() {
      routerStub.post
        .withArgs('/', 'floorsCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/floors/:id', function() {

    it('should route to floors.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'floorsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/floors/:id', function() {

    it('should route to floors.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'floorsCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/floors/:id', function() {

    it('should route to floors.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'floorsCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
