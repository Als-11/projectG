

import UserServices from '../../models/UserServices.model';
import UserTransaction from '../../models/UserTransactions.model';
import ElectricityProviders from '../../models/ElectricityProviders.model';

import http from 'http';
import https from 'https';
// import yql from 'yql';
import moment from 'moment';
// import request from 'request';

var exports = module.exports = {};

exports.billDeskUtility =  function() {
//    new yql.exec("select * from html where url='https://www.billdesk.com/pgidsk/pgmerc/apcpdcl_confirm.jsp?uscno=101372969' and xpath='/html/body/form/table/tbody/tr[2]/td/table/tbody/tr[8]/td/table/tbody/tr[6]/td[2]'", function(response) {
//        for(var inp in response.query.results.td.input) { 
//        } 
//    });
}
// Utility function that downloads a URL and invokes
// callback with the data.
export function download(url, callback) {
  https.get(url, function(res) {
    var data = "";
    res.on('data', function (chunk) {
      data += chunk;
    });
    res.on("end", function() {
      callback(data);
    });
  }).on("error", function() {
    callback(null);
  });
}


export function paytmRequest() {
    // var request = require("request");

//    var options = { method: 'POST',
//      url: 'https://paytm.com/papi/v1/expresscart/verify',
//      headers: 
//       { 
//         'content-type': 'application/json' },
//      body: 
//       { cart_items: 
//          [ { product_id: 33683541,
//              qty: 1,
//              configuration: { recharge_number: '6064018000', price: 10 },
//              meta_data: {} } ] },
//      json: true };
//
//    request(options, function (error, response, body) {
//      if (error) throw new Error(error);
// 
//    });

}

export function recordCurrentBills() {
    var start = moment().startOf('month').toDate();
    var end = moment().endOf('day').toDate();
    UserServices.find().exec(function(err, userService) {
        if(userService.length) {
            UserTransaction.find({ userId : userService[0].userId, billDate: {$gte: start, $lt: end}  }).exec(function(err, userTransaction) {
                    if(err) { 
                    }
                    if (!userTransaction.length) {
                        var instance = new UserTransaction({
                            userId: userService[0].userId,
                            serviceId : userService[0].eProviderId,
                            billAmount: '123.00',
                            billDate: moment().toDate()
                        });
                        instance.save();
                    } else {  
                    }
            });
        }
    });
}