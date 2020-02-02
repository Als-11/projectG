'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var complaintCtrlStub = {
  index: 'complaintCtrl.index',
  show: 'complaintCtrl.show',
  create: 'complaintCtrl.create',
  update: 'complaintCtrl.update',
  destroy: 'complaintCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var complaintIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './complaint.controller': complaintCtrlStub
});

describe('Complaint API Router:', function() {

  it('should return an express router instance', function() {
    complaintIndex.should.equal(routerStub);
  });

  describe('GET /api/complaints', function() {

    it('should route to complaint.controller.index', function() {
      routerStub.get
        .withArgs('/', 'complaintCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/complaints/:id', function() {

    it('should route to complaint.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'complaintCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/complaints', function() {

    it('should route to complaint.controller.create', function() {
      routerStub.post
        .withArgs('/', 'complaintCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/complaints/:id', function() {

    it('should route to complaint.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'complaintCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/complaints/:id', function() {

    it('should route to complaint.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'complaintCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/complaints/:id', function() {

    it('should route to complaint.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'complaintCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
