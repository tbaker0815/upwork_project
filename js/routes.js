'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');
        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('project', {
                url: '/project',
                templateUrl: 'templates/project.html'
            })
            .state('customer', {
                url: '/customer',
                templateUrl: 'templates/customer.html'
            });
    }
]);