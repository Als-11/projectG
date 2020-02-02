'use strict';

var app = angular.module('guwhaApp');

app.controller("flipperDemo", function($scope) {
    $scope.flipped = false;
    $scope.flip = function() {
        $scope.flipped = !$scope.flipped;
    };
});


app.directive("flipper", function() {
    return {
        restrict: "E",
        template: "<div class='flipper' ng-transclude ng-class='{ flipped: flipped }'></div>",
        transclude: true,
        scope: {
            flipped: "="
        }
    };
});


app.directive("front", function() {
    return {
        restrict: "E",
        template: "<div class='front tile' ng-transclude></div>",
        transclude: true
    };
});



app.directive("back", function() {
    return {
        restrict: "E",
        template: "<div class='back tile' ng-transclude></div>",
        transclude: true
    }
});
        

