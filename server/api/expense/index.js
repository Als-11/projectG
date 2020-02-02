'use strict';

var express = require('express');
var controller = require('./expense.controller');
import * as auth from '../../auth/auth.service';
var router = express.Router();

router.post('/expensetypeInfo',auth.isAuthenticated(), controller.expensetypeInfo);
router.post('/processPayment',controller.processPayment);
router.post('/payPayment',controller.payPayment);
router.get('/getPayuIdPayments',controller.getPayuIdPayments);
router.post('/expenseSaved',auth.isAuthenticated(),controller.expenseSaved);
router.post('/expensesDetailsMonthly',auth.isAuthenticated(),controller.expensesDetailsMonthly);//userexpenses
router.post('/communityExpenses',auth.isAuthenticated(),controller.communityExpenses);//communityadmin expenses
router.get('/gettingexpensesInfo',auth.isAuthenticated(),controller.gettingexpensesInfo); //view in the table
router.post('/groupMonthlyExpenses',auth.isAuthenticated(),controller.groupMonthlyExpenses);//group by monthly expenses(users dashboard view)
router.get('/yearly',auth.isAuthenticated(),controller.yearly);//group by yearly expenses(users dashboard view)
router.post('/sixMonthsExpense',auth.isAuthenticated(),controller.sixMonthsExpense);//six months expenses
router.get('/pendingExpense',auth.isAuthenticated(),controller.pendingExpense);//pending expenses
router.post('/getRespExpenses',auth.isAuthenticated(),controller.getRespExpenses);//get respective expenses(table view)
router.get('/getuserPayments',auth.isAuthenticated(),controller.getuserPayments);//get payments (payments page)
router.post('/getShaKey',auth.isAuthenticated(),controller.getShaKey);//generation of shakey
router.post('/successPayumoney',controller.successPayumoney);//generation of shakey
router.get('/getPaidPayments',auth.isAuthenticated(),controller.getPaidPayments);

// router.post('/setTransId',controller.setTransId);//setting transcationID
// router.post('/goPayment',controller.goPayment);//generation of shakey
// router.get('/', controller.index);
// router.get('/:id', controller.show);
// router.post('/', controller.create);
// router.put('/:id', controller.update);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.destroy);

module.exports = router;
