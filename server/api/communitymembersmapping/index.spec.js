'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var communitymembersmappingCtrlStub = {
  index: 'communitymembersmappingCtrl.index',
  show: 'communitymembersmappingCtrl.show',
  create: 'communitymembersmappingCtrl.create',
  update: 'communitymembersmappingCtrl.update',
  destroy: 'communitymembersmappingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var communitymembersmappingIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './communitymembersmapping.controller': communitymembersmappingCtrlStub
});

describe('Communitymembersmapping API Router:', function() {

  it('should return an express router instance', function() {
    communitymembersmappingIndex.should.equal(routerStub);
  });

  describe('GET /api/communitymembersmappings', function() {

    it('should route to communitymembersmapping.controller.index', function() {
      routerStub.get
        .withArgs('/', 'communitymembersmappingCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/communitymembersmappings/:id', function() {

    it('should route to communitymembersmapping.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'communitymembersmappingCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/communitymembersmappings', function() {

    it('should route to communitymembersmapping.controller.create', function() {
      routerStub.post
        .withArgs('/', 'communitymembersmappingCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/communitymembersmappings/:id', function() {

    it('should route to communitymembersmapping.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'communitymembersmappingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/communitymembersmappings/:id', function() {

    it('should route to communitymembersmapping.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'communitymembersmappingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/communitymembersmappings/:id', function() {

    it('should route to communitymembersmapping.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'communitymembersmappingCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
