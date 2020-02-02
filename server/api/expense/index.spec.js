'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var expenseCtrlStub = {
  index: 'expenseCtrl.index',
  show: 'expenseCtrl.show',
  create: 'expenseCtrl.create',
  update: 'expenseCtrl.update',
  destroy: 'expenseCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var expenseIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './expense.controller': expenseCtrlStub
});

describe('Expense API Router:', function() {

  it('should return an express router instance', function() {
    expenseIndex.should.equal(routerStub);
  });

  describe('GET /api/expenses', function() {

    it('should route to expense.controller.index', function() {
      routerStub.get
        .withArgs('/', 'expenseCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/expenses/:id', function() {

    it('should route to expense.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'expenseCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/expenses', function() {

    it('should route to expense.controller.create', function() {
      routerStub.post
        .withArgs('/', 'expenseCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/expenses/:id', function() {

    it('should route to expense.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'expenseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/expenses/:id', function() {

    it('should route to expense.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'expenseCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/expenses/:id', function() {

    it('should route to expense.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'expenseCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
