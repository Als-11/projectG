'use strict';
(function(){

class SuperadminComponent {
  constructor($http,toastr) {
     this.$http = $http;
     this.toastr  = toastr;
     this.communitiesInfo();
    }

   communitiesInfo() {
   	var _this = this;
  this.employeeCategory = ["GUWHA_EMPLOYEE","2","3","4"] 
    _this.userscount=[];
       _this.sairam = [];
   	this.communityNameAray= [];
   	 _this.totalfloorNumbers = 0;
   	this.$http.get('/api/community/getCommunityInfo')
   	.success(function(data)
   	{
      _this.sairam = data;
      
   		for(var i=0;i<_this.sairam.length;i++) {
        for(var j=0;j<_this.sairam[i].sai.length;j++){
            console.log("hi"+_this.sairam[i].sai[j].role)
            if(_this.sairam[i].sai[j].role == "RESIDENT"){  
                console.log("hi"+_this.sairam[i].sai[j].role)
            }
            else{
               _this.sairam[i].sai.splice(j, 1);
            }
        }
      }
		
   	}).error(function(data)
   	{ 
      _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
   	})
   }

 saveSuperAdminEmployee() {
    var _this = this;
    this.$http.post('/api/approvals/saveSuperAdminEmploye',{
      firstName:this.sfirstname,
      lastName:this.lastname,
      email:this.email,
      phonenumber:this.phoneNumber,
      role:this.employeesCategory
    }).success(function(data)
    {
      _this.toastr.success('Saved!Employee credentials are sent to Mail');
    }).error(function(data)
    {
        console.log(data)
       _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
    })

   }
  
}

angular.module('guwhaApp')
  .component('superadmin', {
    templateUrl: 'app/superadmin/superadmin.html',
    controller: SuperadminComponent
  });

})();
