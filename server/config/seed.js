/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';
import User from '../api/user/user.model';
import Community from '../api/community/community.model';
import Billservice from '../api/billservice/billservice.model';
import Slot from '../api/slot/slot.model';
import mongoose from 'mongoose';
import ExpenseType from '../models/ExpenseType.model';
import Service from '../api/service/service.model';
import Topic from '../api/topic/topic.model';

User.find({ role: "SUPER_ADMIN" }).remove()
    .then(() => {
        User.create({
            "firstName": "SuperAdmin_demo",
            "userId": 1600,
            "email": "SuperAdmin_demo@guwha.com",
            "role": "SUPER_ADMIN",
            "phoneNumber": "8143381405",
            "password": "8143381405",
            "partyId": [],
            "customerId": [],
            "lockUntil":0
        });
    });

Topic.find({}).remove()
    .then(() => {
        Topic.create({
            topicId: 1,
            title: "General Discussions"
        })

        Topic.create({
            topicId: 2,
            title: "Events"
        })
        Topic.create({
            topicId: 3,
            title: "Buying & Selling"
        })
    })

Service.find({}).remove()
    .then(() => {
        Service.create({
                serviceId: 1,
                serviceName: "Milk Service",
                serviceDesc: "Differnt types of Milk",
                serviceCategory: "Milk Service",
                active: true
            }),
            Service.create({
                serviceId: 2,
                serviceName: "Water Service",
                serviceDesc: "Good Ang Hygenic Water",
                serviceCategory: "Water Service",
                active: true
            })

    })
ExpenseType.find({}).remove()
    .then(() => {
        ExpenseType.create({
                expenseTypeId: 1,
                name: "Food",
                category: "Food",
                recurring: false
            }),
            ExpenseType.create({
                expenseTypeId: 2,
                name: "Clothes",
                category: "Clothes",
                recurring: false
            }),
            ExpenseType.create({
                expenseTypeId: 3,
                name: "Fuel",
                category: "Fuel",
                recurring: false
            }),
            ExpenseType.create({
                expenseTypeId: 4,
                name: "Service",
                category: "Service",
                recurring: true,
                recurringPeriod: "Monthly"
            }),
            ExpenseType.create({
                expenseTypeId: 5,
                name: "House",
                category: "House",
                recurring: true,
                recurringPeriod: "Monthly"
            }),
            ExpenseType.create({
                expenseTypeId: 6,
                name: "Groceries",
                category: "Groceries",
                recurring: true,
                recurringPeriod: "Monthly"
            }),
            ExpenseType.create({
                expenseTypeId: 7,
                name: "Mobile",
                category: "Mobile/Internet",
                recurring: true,
                recurringPeriod: "Monthly"
            }),
            ExpenseType.create({
                expenseTypeId: 8,
                name: "Maintenance",
                category: "Maintenance",
                recurring: true,
                recurringPeriod: "Monthly"
            }),
            ExpenseType.create({
                expenseTypeId: 9,
                name: "Transportation",
                category: "Transportation",
                recurring: true,
                recurringPeriod: "Monthly"
            }),
            ExpenseType.create({
                expenseTypeId: 10,
                name: "Others",
                category: "Others",
                recurring: false
            })
    });
// bill services seed.js starts here
Billservice.find({})
    .then(function(data) {
        if (data !== null) { 
        } else {

            Billservice.create({
                    "billServiceId": 1,
                    "category": 'Prepaid',
                    "provider": "Airtel",
                    "opCode": "1"
                }),
                Billservice.create({
                    "billServiceId": 26,
                    "category": 'Postpaid',
                    "provider": "AircelPostpaid",
                    "opCode": "94"
                }),
                Billservice.create({
                    "billServiceId": 41,
                    "category": 'DTH',
                    "provider": "Airtel DTH",
                    "opCode": "22"
                }),
                Billservice.create({
                    "billServiceId": 47,
                    "category": 'Electricity',
                    "provider": "APPower",
                    "opCode": "83"
                }),
                Billservice.create({
                    "billServiceId": 81,
                    "category": 'Gas',
                    "provider": "Adani Gas Limited",
                    "opCode": "128"
                }),
                Billservice.create({
                    "billServiceId": 86,
                    "category": 'Data Card',
                    "provider": "MTS MBlaze",
                    "opCode": "71"
                }),
                Billservice.create({
                    "billServiceId": 2,
                    "category": 'Prepaid',
                    "provider": "BSNL",
                    "opCode": "2"
                }),
                Billservice.create({
                    "billServiceId": 3,
                    "category": 'Prepaid',
                    "provider": "Reliance GSM",
                    "opCode": "3"
                }),
                Billservice.create({
                    "billServiceId": 4,
                    "category": 'Prepaid',
                    "provider": "Idea",
                    "opCode": "4"
                }),
                Billservice.create({
                    "billServiceId": 5,
                    "category": 'Prepaid',
                    "provider": "Vodafone",
                    "opCode": "5"
                }),
                Billservice.create({
                    "billServiceId": 6,
                    "category": 'Prepaid',
                    "provider": "Tata",
                    "opCode": "6"
                }),
                Billservice.create({
                    "billServiceId": 7,
                    "category": 'Prepaid',
                    "provider": "Loop Mobile",
                    "opCode": "7"
                }),
                Billservice.create({
                    "billServiceId": 8,
                    "category": 'Prepaid',
                    "provider": "MTNL",
                    "opCode": "8"
                }),
                Billservice.create({
                    "billServiceId": 9,
                    "category": 'Prepaid',
                    "provider": "S Tel",
                    "opCode": "9"
                }),
                Billservice.create({
                    "billServiceId": 10,
                    "category": 'Prepaid',
                    "provider": "Spice",
                    "opCode": "10"
                }),
                Billservice.create({
                    "billServiceId": 11,
                    "category": 'Prepaid',
                    "provider": "AirCel",
                    "opCode": "11"
                }),
                Billservice.create({
                    "billServiceId": 12,
                    "category": 'Prepaid',
                    "provider": "Uninor",
                    "opCode": "12"
                }),
                Billservice.create({
                    "billServiceId": 13,
                    "category": 'Prepaid',
                    "provider": "Docomo",
                    "opCode": "13"
                }),
                Billservice.create({
                    "billServiceId": 14,
                    "category": 'Prepaid',
                    "provider": "Videocon",
                    "opCode": "14"
                }),
                Billservice.create({
                    "billServiceId": 15,
                    "category": 'Prepaid',
                    "provider": "MTS",
                    "opCode": "16"
                }),
                Billservice.create({
                    "billServiceId": 16,
                    "category": 'Prepaid',
                    "provider": "Virgin CDMA",
                    "opCode": "28"
                }),
                Billservice.create({
                    "billServiceId": 17,
                    "category": 'Prepaid',
                    "provider": "Reliance CDMA",
                    "opCode": "29"
                }),
                Billservice.create({
                    "billServiceId": 18,
                    "category": 'Prepaid',
                    "provider": "Videocon Special",
                    "opCode": "30"
                }),
                Billservice.create({
                    "billServiceId": 19,
                    "category": 'Prepaid',
                    "provider": "Docomo Special",
                    "opCode": "31"
                }),
                Billservice.create({
                    "billServiceId": 20,
                    "category": 'Prepaid',
                    "provider": "BSNL Special",
                    "opCode": "32"
                }),
                Billservice.create({
                    "billServiceId": 21,
                    "category": 'Prepaid',
                    "provider": "Uninor Special",
                    "opCode": "46"
                }),
                Billservice.create({
                    "billServiceId": 22,
                    "category": 'Prepaid',
                    "provider": "MTNL DL Topup",
                    "opCode": "54"
                }),
                Billservice.create({
                    "billServiceId": 23,
                    "category": 'Prepaid',
                    "provider": "MTNL DL Special",
                    "opCode": "55"
                }),
                Billservice.create({
                    "billServiceId": 24,
                    "category": 'Prepaid',
                    "provider": "Tata Indicom Prepaid",
                    "opCode": "63"
                }),
                Billservice.create({
                    "billServiceId": 25,
                    "category": 'Prepaid',
                    "provider": "T24 Special",
                    "opCode": "96"
                }),

                Billservice.create({
                    "billServiceId": 27,
                    "category": 'Postpaid',
                    "provider": "AirtelLandline",
                    "opCode": "86"
                }),
                Billservice.create({
                    "billServiceId": 28,
                    "category": 'Postpaid',
                    "provider": "Airtel Postpaid",
                    "opCode": "35"
                }),
                Billservice.create({
                    "billServiceId": 29,
                    "category": 'Postpaid',
                    "provider": "BSNL Postpaid",
                    "opCode": "36"
                })
            Billservice.create({
                "billServiceId": 30,
                "category": 'Postpaid',
                "provider": "Docomo CDMA Postpaid",
                "opCode": "97"
            })
            Billservice.create({
                    "billServiceId": 31,
                    "category": 'Postpaid',
                    "provider": "Docomo Landline",
                    "opCode": "116"
                }),
                Billservice.create({
                    "billServiceId": 32,
                    "category": 'Postpaid',
                    "provider": "DOCOMO Postpaid",
                    "opCode": "49"
                }),
                Billservice.create({
                    "billServiceId": 33,
                    "category": 'Postpaid',
                    "provider": "Idea postpaid",
                    "opCode": "42"
                }),
                Billservice.create({
                    "billServiceId": 34,
                    "category": 'Postpaid',
                    "provider": "Loop Postpaid",
                    "opCode": "48"
                }),
                Billservice.create({
                    "billServiceId": 35,
                    "category": 'Postpaid',
                    "provider": "MTNL LANDLINE",
                    "opCode": "114"
                }),
                Billservice.create({
                    "billServiceId": 36,
                    "category": 'Postpaid',
                    "provider": "Reliance CDMA Bill",
                    "opCode": "26"
                }),
                Billservice.create({
                    "billServiceId": 37,
                    "category": 'Postpaid',
                    "provider": "Reliance GSM Bill",
                    "opCode": "34"
                }),
                Billservice.create({
                    "billServiceId": 38,
                    "category": 'Postpaid',
                    "provider": "Reliance Landline",
                    "opCode": "115"
                }),
                Billservice.create({
                    "billServiceId": 39,
                    "category": 'Postpaid',
                    "provider": "Tata Indicom Postpaid",
                    "opCode": "37"
                }),
                Billservice.create({
                    "billServiceId": 40,
                    "category": 'Postpaid',
                    "provider": "Vodafone Postpaid",
                    "opCode": "33"
                }),

                Billservice.create({
                    "billServiceId": 42,
                    "category": 'DTH',
                    "provider": "Big TV",
                    "opCode": "18"
                }),
                Billservice.create({
                    "billServiceId": 43,
                    "category": 'DTH',
                    "provider": "Dish TV",
                    "opCode": "17"
                }),
                Billservice.create({
                    "billServiceId": 44,
                    "category": 'DTH',
                    "provider": "Sun Direct",
                    "opCode": "20"
                }),
                Billservice.create({
                    "billServiceId": 45,
                    "category": 'DTH',
                    "provider": "Tata Sky",
                    "opCode": "19"
                }),
                Billservice.create({
                    "billServiceId": 46,
                    "category": 'DTH',
                    "provider": "Videocon D2h",
                    "opCode": "21"
                }),

                Billservice.create({
                    "billServiceId": 48,
                    "category": 'Electricity',
                    "provider": "Bangalore Electricity Supply(BESCOM)",
                    "opCode": "125"
                }),
                Billservice.create({
                    "billServiceId": 49,
                    "category": 'Electricity',
                    "provider": "BEST",
                    "opCode": "107"
                }),
                Billservice.create({
                    "billServiceId": 50,
                    "category": 'Electricity',
                    "provider": "BSES Rajdhani",
                    "opCode": "98"
                }),
                Billservice.create({
                    "billServiceId": 51,
                    "category": 'Electricity',
                    "provider": "BSES Yamuna",
                    "opCode": "99"
                }),
                Billservice.create({
                    "billServiceId": 52,
                    "category": 'Electricity',
                    "provider": "Calcutta Electric Supply Corporation",
                    "opCode": "139"
                }),
                Billservice.create({
                    "billServiceId": 53,
                    "category": 'Electricity',
                    "provider": "Chattisgarh Elecricity Board",
                    "opCode": "108"
                }),
                Billservice.create({
                    "billServiceId": 54,
                    "category": 'Electricity',
                    "provider": "Dakshin Gujarat Vij Company",
                    "opCode": "103"
                }),
                Billservice.create({
                    "billServiceId": 55,
                    "category": 'Electricity',
                    "provider": "Dakshin Haryana Bijli Vitaran Nigam Ltd.",
                    "opCode": "131"
                }),
                Billservice.create({
                    "billServiceId": 56,
                    "category": 'Electricity',
                    "provider": "Dakshinanchal Vidyut Vitaran Nigam Ltd.",
                    "opCode": "136"
                }),
                Billservice.create({
                    "billServiceId": 57,
                    "category": 'Electricity',
                    "provider": "Jaipur Vidyut Vitran Nigam Ltd",
                    "opCode": "110"
                }),
                Billservice.create({
                    "billServiceId": 58,
                    "category": 'Electricity',
                    "provider": "Jemshedpur Utilites & Services (JUSCO)",
                    "opCode": "124"
                }),
                Billservice.create({
                    "billServiceId": 59,
                    "category": 'Electricity',
                    "provider": "Jodhpur Vidyut Vitran Nigam Ltd",
                    "opCode": "111"
                }),
                Billservice.create({
                    "billServiceId": 60,
                    "category": 'Electricity',
                    "provider": "Madhya Gujarat Vij Company",
                    "opCode": "102"
                }),
                Billservice.create({
                    "billServiceId": 61,
                    "category": 'Electricity',
                    "provider": "Madhya Pradesh Madhya Kshetra Vidyut Vitaran Company Ltd.",
                    "opCode": "133"
                }),
                Billservice.create({
                    "billServiceId": 62,
                    "category": 'Electricity',
                    "provider": "Madhyanchal Vidyut Vitaran Nigam Ltd.",
                    "opCode": "135"
                }),
                Billservice.create({
                    "billServiceId": 63,
                    "category": 'Electricity',
                    "provider": "MP Pashchim Vidyut Vitaran - INDORE    ",
                    "opCode": "123"
                }),
                Billservice.create({
                    "billServiceId": 64,
                    "category": 'Electricity',
                    "provider": "MSEB Mumbai",
                    "opCode": "100"
                }),
                Billservice.create({
                    "billServiceId": 65,
                    "category": 'Electricity',
                    "provider": "Noida Power Company",
                    "opCode": "109"
                }),
                Billservice.create({
                    "billServiceId": 66,
                    "category": 'Electricity',
                    "provider": "North Bihar Power Distribution Company Ltd",
                    "opCode": "149"
                }),
                Billservice.create({
                    "billServiceId": 67,
                    "category": 'Electricity',
                    "provider": "North Delhi Power Limited",
                    "opCode": "101"
                }),
                Billservice.create({
                    "billServiceId": 68,
                    "category": 'Electricity',
                    "provider": "Paschim Gujarat Vij Company",
                    "opCode": "104"
                }),
                Billservice.create({
                    "billServiceId": 69,
                    "category": 'Electricity',
                    "provider": "Purvanchal Vidyut Vitaran Nigam Ltd.",
                    "opCode": "134"
                }),
                Billservice.create({
                    "billServiceId": 70,
                    "category": 'Electricity',
                    "provider": "Reliance Energy (Mumbai)",
                    "opCode": "82"
                }),
                Billservice.create({
                    "billServiceId": 71,
                    "category": 'Electricity',
                    "provider": "   South bihar Power Listribution Company Ltd",
                    "opCode": "148"
                }),
                Billservice.create({
                    "billServiceId": 72,
                    "category": 'Electricity',
                    "provider": "Southern Power Distribution Company of A.P Ltd",
                    "opCode": "106"
                }),
                Billservice.create({
                    "billServiceId": 73,
                    "category": 'Electricity',
                    "provider": "Southern Power Distribution Company of Telangana Ltd",
                    "opCode": "157"
                }),
                Billservice.create({
                    "billServiceId": 74,
                    "category": 'Electricity',
                    "provider": "Tata Power",
                    "opCode": "112"
                }),
                Billservice.create({
                    "billServiceId": 75,
                    "category": 'Electricity',
                    "provider": "Tata Power Limited (Mumbai)",
                    "opCode": "129"
                }),
                Billservice.create({
                    "billServiceId": 76,
                    "category": 'Electricity',
                    "provider": "TORRENT POWER",
                    "opCode": "130"
                }),
                Billservice.create({
                    "billServiceId": 77,
                    "category": 'Electricity',
                    "provider": "Uttar Gujarat Vij Company",
                    "opCode": "105"
                }),
                Billservice.create({
                    "billServiceId": 78,
                    "category": 'Electricity',
                    "provider": "Uttar Haryana Bijli Vitaran Nigam Ltd",
                    "opCode": "132"
                }),
                Billservice.create({
                    "billServiceId": 79,
                    "category": 'Electricity',
                    "provider": "Uttarakhand Power Corporation Ltd.",
                    "opCode": "137"
                }),
                Billservice.create({
                    "billServiceId": 80,
                    "category": 'Electricity',
                    "provider": "West Bengal State Electricity Distribution Company Limited",
                    "opCode": "138"
                }),

                Billservice.create({
                    "billServiceId": 82,
                    "category": 'Gas',
                    "provider": "GSPC Gas Company",
                    "opCode": "127"
                }),
                Billservice.create({
                    "billServiceId": 83,
                    "category": 'Gas',
                    "provider": "Gujarat Gas Company Limited",
                    "opCode": "1255"
                }),
                Billservice.create({
                    "billServiceId": 84,
                    "category": 'Gas',
                    "provider": "Indraprastha Gas",
                    "opCode": "126"
                }),
                Billservice.create({
                    "billServiceId": 85,
                    "category": 'Gas',
                    "provider": "Mahanagar Gas Limited",
                    "opCode": "91"
                }),
                Billservice.create({
                    "billServiceId": 87,
                    "category": 'Data Card',
                    "provider": "Reliance NetConnect 3G",
                    "opCode": "74"
                }),
                Billservice.create({
                    "billServiceId": 88,
                    "category": 'Data Card',
                    "provider": "Tata Photon+",
                    "opCode": "77"
                }),
                Billservice.create({
                    "billServiceId": 89,
                    "category": 'Data Card',
                    "provider": "Vodafone Netcruise",
                    "opCode": "87"
                })
        }
    })


// Community.find({}).remove() // Removes entire community records and create a new community with given records
//   .then(() => {
//     Community.create({
//     "communityId" : 1001,
//     "emailId" : "demo2@guwha.com",
//     "communityName" : "Aparna Apartments",
// "blocks" : [ 
//     {
//         "blockName" : "Block-A",
//         "floors" : [ 
//             {
//                 "floorNumber" : 1,
//                 "flatNumbers" : [ 
//                     "101",
//                     "102",
//                     "103"
//                 ]
//             }, 
//             {
//                 "floorNumber" : 2,
//                 "flatNumbers" : [ 
//                     "201", 
//                     "202", 
//                     "203"
//                 ]
//             }
//         ]
//     }, 
//     {
//         "blockName" : "Block-B",
//         "floors" : [ 
//             {
//                 "floorNumber" : 3,

//                 "flatNumbers" : [ 
//                     "301", 
//                     "302", 
//                     "303"
//                 ]
//             }, 
//             {
//                 "floorNumber" : 4,

//                 "flatNumbers" : [ 
//                     "401", 
//                     "402", 
//                     "403"
//                 ]
//             }
//         ]
//     }, 
// ],
//     "address" : {
//         "address1" : "Ayyappa Society",
//         "address2" : "street 5",
//         "locality" : "Madhapur",
//         "landmark" : "Near Petrol Bunk",
//         "city" : "Hyderabad",
//         "pincode" : "500081"
//     },
//     "emailVerified" : false
//     });
//   });
