'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var visitorCtrlStub = {
  index: 'visitorCtrl.index',
  show: 'visitorCtrl.show',
  create: 'visitorCtrl.create',
  update: 'visitorCtrl.update',
  destroy: 'visitorCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var visitorIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './visitor.controller': visitorCtrlStub
});

describe('Visitor API Router:', function() {

  it('should return an express router instance', function() {
    visitorIndex.should.equal(routerStub);
  });

  describe('GET /api/visitors', function() {

    it('should route to visitor.controller.index', function() {
      routerStub.get
        .withArgs('/', 'visitorCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/visitors/:id', function() {

    it('should route to visitor.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'visitorCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/visitors', function() {

    it('should route to visitor.controller.create', function() {
      routerStub.post
        .withArgs('/', 'visitorCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/visitors/:id', function() {

    it('should route to visitor.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'visitorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/visitors/:id', function() {

    it('should route to visitor.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'visitorCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/visitors/:id', function() {

    it('should route to visitor.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'visitorCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
