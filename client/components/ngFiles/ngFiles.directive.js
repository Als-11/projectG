'use strict';
//const angular = require('angular');

angular.module('guwhaApp')
    .directive('ngFiles', function ($parse) {
        return {
            template: '<div></div>',
            restrict: 'EA',
            link: function (scope, element, attrs) {
                var onChange = $parse(attrs.ngFiles);
                element.on('change', function (event) {
                     onChange(scope, {
                        $files: event.target.files
                    });
                });
            }
        };
    });