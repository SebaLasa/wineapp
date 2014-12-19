'use strict';

// Declare app level module which depends on filters, and services
angular.module('vinos', [
    'ui.bootstrap',
    'vinos.controllers',
    'vinos.services',
    'vinos.filters',
    'vinos.directives',
    'ngRoute',
    'angularFileUpload',
    'ui.date',
    'uiGmapgoogle-maps'
]).
    config(function ($routeProvider, $locationProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'views/desgustaciones/list.html',
                controller: 'DesgustacionesIndexCtrl'
            }).
            when('/desgustaciones', {
                templateUrl: 'views/desgustaciones/list.html',
                controller: 'DesgustacionesIndexCtrl'
            }).
            when('/desgustaciones/create', {
                templateUrl: '/views/desgustaciones/createOrEdit.html',
                controller: 'DesgustacionesNewCtrl'
            }).
            when('/desgustaciones/edit/:id', {
                templateUrl: '/views/desgustaciones/createOrEdit.html',
                controller: 'DesgustacionesEditCtrl'
            }).
            when('/desgustaciones/delete/:id', {
                templateUrl: '/views/desgustaciones/delete.html',
                controller: 'DesgustacionesDeleteCtrl'
            }).
            when('/noticias', {
                templateUrl: 'views/noticias/list.html',
                controller: 'NoticiasIndexCtrl'
            }).
            when('/noticias/create', {
                templateUrl: '/views/noticias/createOrEdit.html',
                controller: 'NoticiasNewCtrl'
            }).
            when('/noticias/edit/:id', {
                templateUrl: '/views/noticias/createOrEdit.html',
                controller: 'NoticiasEditCtrl'
            }).
            when('/noticias/delete/:id', {
                templateUrl: '/views/noticias/delete.html',
                controller: 'NoticiasDeleteCtrl'
            }).
            otherwise({
                redirectTo: '/'
            });
    });
