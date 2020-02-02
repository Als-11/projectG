'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var userbillserviceCtrlStub = {
  index: 'userbillserviceCtrl.index',
  show: 'userbillserviceCtrl.show',
  create: 'userbillserviceCtrl.create',
  update: 'userbillserviceCtrl.update',
  destroy: 'userbillserviceCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var userbillserviceIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './userbillservice.controller': userbillserviceCtrlStub
});

describe('Userbillservice API Router:', function() {

  it('should return an express router instance', function() {
    userbillserviceIndex.should.equal(routerStub);
  });

  describe('GET /api/userbillservices', function() {

    it('should route to userbillservice.controller.index', function() {
      routerStub.get
        .withArgs('/', 'userbillserviceCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/userbillservices/:id', function() {

    it('should route to userbillservice.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'userbillserviceCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/userbillservices', function() {

    it('should route to userbillservice.controller.create', function() {
      routerStub.post
        .withArgs('/', 'userbillserviceCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/userbillservices/:id', function() {

    it('should route to userbillservice.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'userbillserviceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/userbillservices/:id', function() {

    it('should route to userbillservice.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'userbillserviceCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/userbillservices/:id', function() {

    it('should route to userbillservice.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'userbillserviceCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
