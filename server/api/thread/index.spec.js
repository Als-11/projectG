'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var threadCtrlStub = {
  index: 'threadCtrl.index',
  show: 'threadCtrl.show',
  create: 'threadCtrl.create',
  update: 'threadCtrl.update',
  destroy: 'threadCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var threadIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './thread.controller': threadCtrlStub
});

describe('Thread API Router:', function() {

  it('should return an express router instance', function() {
    threadIndex.should.equal(routerStub);
  });

  describe('GET /api/threads', function() {

    it('should route to thread.controller.index', function() {
      routerStub.get
        .withArgs('/', 'threadCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/threads/:id', function() {

    it('should route to thread.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'threadCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/threads', function() {

    it('should route to thread.controller.create', function() {
      routerStub.post
        .withArgs('/', 'threadCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/threads/:id', function() {

    it('should route to thread.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'threadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/threads/:id', function() {

    it('should route to thread.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'threadCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/threads/:id', function() {

    it('should route to thread.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'threadCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
