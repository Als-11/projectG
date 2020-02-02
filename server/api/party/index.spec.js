'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var partyCtrlStub = {
  index: 'partyCtrl.index',
  show: 'partyCtrl.show',
  create: 'partyCtrl.create',
  update: 'partyCtrl.update',
  destroy: 'partyCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var partyIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './party.controller': partyCtrlStub
});

describe('Party API Router:', function() {

  it('should return an express router instance', function() {
    partyIndex.should.equal(routerStub);
  });

  describe('GET /api/parties', function() {

    it('should route to party.controller.index', function() {
      routerStub.get
        .withArgs('/', 'partyCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/parties/:id', function() {

    it('should route to party.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'partyCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/parties', function() {

    it('should route to party.controller.create', function() {
      routerStub.post
        .withArgs('/', 'partyCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/parties/:id', function() {

    it('should route to party.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'partyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/parties/:id', function() {

    it('should route to party.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'partyCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/parties/:id', function() {

    it('should route to party.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'partyCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
