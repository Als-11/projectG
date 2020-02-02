'use strict';
var app = require('../..'); 
var proxyquire = require('proxyquire').noPreserveCache();

var amenityCtrlStub = {
  index: 'amenityCtrl.index',
  show: 'amenityCtrl.show',
  create: 'amenityCtrl.create',
  update: 'amenityCtrl.update',
  destroy: 'amenityCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var amenityIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './amenity.controller': amenityCtrlStub
});

describe('Amenity API Router:', function() {

  it('should return an express router instance', function() {
    amenityIndex.should.equal(routerStub);
  });

  describe('GET /api/amenities', function() {

    it('should route to amenity.controller.index', function() {
      routerStub.get
        .withArgs('/', 'amenityCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/amenities/:id', function() {

    it('should route to amenity.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'amenityCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/amenities', function() {

    it('should route to amenity.controller.create', function() {
      routerStub.post
        .withArgs('/', 'amenityCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/amenities/:id', function() {

    it('should route to amenity.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'amenityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/amenities/:id', function() {

    it('should route to amenity.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'amenityCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/amenities/:id', function() {

    it('should route to amenity.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'amenityCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
