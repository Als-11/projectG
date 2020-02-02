'use strict';
(function() {

    class BrandsComponent {
        constructor($http, Auth,toastr) {
            this.$http = $http;
            this.toastr = toastr;
            this.Auth = Auth;
            this.array = ['1'];
            this.getServices();
            this.getBrands()
        }

        addBrand(){
            var _this = this;
            this.serviceCategoryArray = [];
               this.quantity = [];
                this.costs = [];
            if(this.availableService1 != undefined){
              this.serviceCategoryArray.push(this.availableService1)
               this.quantity.push(this.quantity1)
                this.costs.push(this.unitPrice1)
             }
            if(this.availableService2 != undefined){
             this.serviceCategoryArray.push(this.availableService2)
               this.quantity.push(this.quantity2)
                this.costs.push(this.unitPrice2)
             }
             if(this.availableService3 != undefined){
             this.serviceCategoryArray.push(this.availableService3)
               this.quantity.push(this.quantity3)
                this.costs.push(this.unitPrice3)
             }
            this.$http.post('/api/typesForServices/addBrand',{
                serviceCategoryArray:this.serviceCategoryArray,
                quantity:this.quantity,
                costs:this.costs,
                name:this.brandName
            }).success(function(data)
            {
                  _this.getBrands();
                this.toastr.success("Succesfully,Added the service");
            })
        }

        reset(){
            this.availableService1 = null;
            this.quantity1 = null;
            this.unitPrice1 = null;
            this.brandName = null;
            this.availableService2 = null;
            this.quantity2 = null;
            this.unitPrice2 = null;
            this.availableService3 = null;
            this.quantity3 = null;
            this.unitPrice3 = null;
        }
        getBrands(){
            var _this  = this;
            this.getBrandsArray = [];
            this.$http.get('/api/typesForServices/getBrand')
            .success(function(data)
            {
               _this.getBrandsArray = data;
               console.log(_this.getBrandsArray);

            })
            .error(function(){
                _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
            })
        }

        getServices() {          //Getting available services from particular community 
            this.availableServices = [];
            this.availServiceNames = [];
            var _this = this;
            this.$http.get('/api/services/getServices')
                .success(function(data) { 
                    for (var i = 0; i < data.length; i++) {
                        _this.availableServices.push(data[i].serviceCategory);
                        // _this.availServiceNames.push(data[i].serviceName);
                    }
                }).error(function(data) { 
                    _this.toastr.error('Sorry Something Went Wrong!', 'Failed');
                })
        }

        
    }



    angular.module('guwhaApp')
        .component('brands', {
            templateUrl: 'app/servicesdashboard/brands/brands.html',
            controller: BrandsComponent
        });

})();
