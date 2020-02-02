'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var communityCtrlStub = {
  index: 'communityCtrl.index',
  show: 'communityCtrl.show',
  create: 'communityCtrl.create',
  update: 'communityCtrl.update',
  destroy: 'communityCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var communityIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './community.controller': communityCtrlStub
});

describe('Community API Router:', function() {

  it('should return an express router instance', function() {
    communityIndex.should.equal(routerStub);
  });

  describe('GET /api/community', function() {

    it('should route to community.controller.index', function() {
      routerStub.get
        .withArgs('/', 'communityCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/community/:id', function() {

    it('should route to community.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'communityCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/community', function() {

    it('should route to community.controller.create', function() {
      routerStub.post
        .withArgs('/', 'communityCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/community/:id', function() {

    it('should route to community.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'communityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/community/:id', function() {

    it('should route to community.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'communityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/community/:id', function() {

    it('should route to community.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'communityCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
