'use strict';
var app = require('../..'); 
var proxyquire = require('proxyquire').noPreserveCache();

var apartmentCtrlStub = {
  index: 'apartmentCtrl.index',
  show: 'apartmentCtrl.show',
  create: 'apartmentCtrl.create',
  update: 'apartmentCtrl.update',
  destroy: 'apartmentCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var apartmentIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './apartment.controller': apartmentCtrlStub
});

describe('Apartment API Router:', function() {

  it('should return an express router instance', function() {
    apartmentIndex.should.equal(routerStub);
  });

  describe('GET /api/apartments', function() {

    it('should route to apartment.controller.index', function() {
      routerStub.get
        .withArgs('/', 'apartmentCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/apartments/:id', function() {

    it('should route to apartment.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'apartmentCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/apartments', function() {

    it('should route to apartment.controller.create', function() {
      routerStub.post
        .withArgs('/', 'apartmentCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/apartments/:id', function() {

    it('should route to apartment.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'apartmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/apartments/:id', function() {

    it('should route to apartment.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'apartmentCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/apartments/:id', function() {

    it('should route to apartment.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'apartmentCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
