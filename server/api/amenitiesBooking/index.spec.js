'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var amenitiesBookingCtrlStub = {
  index: 'amenitiesBookingCtrl.index',
  show: 'amenitiesBookingCtrl.show',
  create: 'amenitiesBookingCtrl.create',
  update: 'amenitiesBookingCtrl.update',
  destroy: 'amenitiesBookingCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var amenitiesBookingIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './amenitiesBooking.controller': amenitiesBookingCtrlStub
});

describe('AmenitiesBooking API Router:', function() {

  it('should return an express router instance', function() {
    amenitiesBookingIndex.should.equal(routerStub);
  });

  describe('GET /api/amenitiesBookings', function() {

    it('should route to amenitiesBooking.controller.index', function() {
      routerStub.get
        .withArgs('/', 'amenitiesBookingCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/amenitiesBookings/:id', function() {

    it('should route to amenitiesBooking.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'amenitiesBookingCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/amenitiesBookings', function() {

    it('should route to amenitiesBooking.controller.create', function() {
      routerStub.post
        .withArgs('/', 'amenitiesBookingCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/amenitiesBookings/:id', function() {

    it('should route to amenitiesBooking.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'amenitiesBookingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/amenitiesBookings/:id', function() {

    it('should route to amenitiesBooking.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'amenitiesBookingCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/amenitiesBookings/:id', function() {

    it('should route to amenitiesBooking.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'amenitiesBookingCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
