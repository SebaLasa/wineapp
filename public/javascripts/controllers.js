'use strict';

angular.module('vinos.controllers', []).
    controller('AlertDemoCtrl', function ($scope, $timeout) {
        $scope.alerts = [];

        // when receives an alert message displays the object on the notification section.
        $scope.$on("alert", function (event, alert) {
            $scope.alerts.push(alert);

            // after 5 seconds the message disappears.
            $timeout(function () {
                $scope.alerts.shift();
            }, 5000);
        });
    }).
    controller('DesgustacionesIndexCtrl', function ($scope, $http) {
        $http.get('/api/desgustaciones')
            .success(function (data, status, headers, config) {
                $scope.desgustaciones = data;
            }).error(function (data, status, headers, config) {
                alertService.broadcast(data);
            });
    }).
    controller('DesgustacionesNewCtrl', function ($scope, $http, $location, $upload ,alertService) {
        var lat;
        var longit;

        $scope.map = {center: {latitude: -34.6077252, longitude: -58.4408608 }, zoom: 10 };

        function createByAddress(address) {
           var markId = 0;
           var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : address}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var firstAddress = results[0];
                    lat = firstAddress.geometry.location.k;
                    longit = firstAddress.geometry.location.B;
                    $scope.map = {
                        center: {  
                                 latitude: lat,
                                 longitude: longit
                                }, 
                        zoom: 15 
                        };
                    $scope.marker = {
                        id: markId++, 
                        coords: {   latitude: lat,
                                    longitude: longit
                                },
                        options: { draggable: false }
                    };
                      } else {
                    alert("Unknown address: " + address);
                }
            });
        }          

         $scope.codeAddress = function () {
           createByAddress($scope.desgustacion.direccion);
        };

         $scope.onFileSelect = function (files) {
           $scope.desgustacion.file = files[0];
        };
        $scope.save = function () {
            $scope.desgustacion.latitud = lat;
            $scope.desgustacion.longitud = longit;
            if($scope.desgustacion.latitud && $scope.desgustacion.longitud){
            $scope.upload = $upload.upload({
                url: '/api/desgustaciones',
                method: "POST",
                data: {desgustacion: $scope.desgustacion},
                file: $scope.desgustacion.file // or list of files ($files) for html5 only
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                $location.path('desgustaciones');
            });  
            }else{
                 alert("Debe buscar la dirección");
            }
        };
    }).
    controller('DesgustacionesEditCtrl', function ($scope, $http, $location, $routeParams, $upload ,alertService) {

         var lat;
        var longit;

        function createByAddress(address) {
           var markId = 0;
           var geocoder = new google.maps.Geocoder();
            geocoder.geocode({'address' : address}, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                    var firstAddress = results[0];
                    lat = firstAddress.geometry.location.k;
                    longit = firstAddress.geometry.location.B;
                    $scope.map = {
                        center: {  
                                 latitude: lat,
                                 longitude: longit
                                }, 
                        zoom: 15 
                        };
                    $scope.marker = {
                        id: markId++, 
                        coords: {   latitude: lat,
                                    longitude: longit
                                },
                        options: { draggable: false }
                    };
                      } else {
                    alert("Unknown address: " + address);
                }
            });
        }          

         $scope.codeAddress = function () {
           createByAddress($scope.desgustacion.direccion);
            $scope.desgustacion.latitud = lat;
            $scope.desgustacion.longitud = longit;
        };
       
       $http.get('/api/desgustaciones/' + $routeParams.id)
            .success(function (data, status, headers, config) {
                $scope.desgustacion = data;
                $scope.desgustacion.fecha = data.fecha.substr(0,10);
                $scope.desgustacion.latitud = data.latitud;
                $scope.desgustacion.longitud = data.longitud;
                $scope.map = {center: {latitude: data.latitud, longitude: data.longitud }, zoom: 15 };
                $scope.marker = {id: 1, coords: {   latitude: data.latitud, longitude:  data.longitud}, options: { draggable: false }};
                        
            }).error(function (data, status, headers, config) {
                alertService.broadcast(data);
            });
        console.log($location);

         $scope.onFileSelect = function ($files) {
           $scope.desgustacion.file = $files[0];
        };

        $scope.save = function () {

            $scope.upload = $upload.upload({
                url: '/api/desgustaciones/' + $routeParams.id,
                method: "PUT" ,
                data: {desgustacion: $scope.desgustacion},
                file: $scope.desgustacion.file // or list of files ($files) for html5 only
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                $location.path('desgustaciones');
            }); 

        };
    }).
    controller('DesgustacionesDeleteCtrl', function ($scope, $http, $location, $routeParams, alertService) {
        $http.get('/api/desgustaciones/' + $routeParams.id)
            .success(function (data, status, headers, config) {
                $scope.desgustacion = data;
            }).error(function (data, status, headers, config) {
                alertService.broadcast(data);
            });
        console.log($location);
        $scope.delete = function () {
            $http.delete("/api/desgustaciones/" + $routeParams.id, $scope.desgustacion)
                .success(function () {
                    alertService.broadcast("desgustacion deleted successfully.");
                    $location.path("/desgustaciones");
                });
        };
    }).
    controller('NoticiasIndexCtrl', function ($scope, $http, alertService) {
        $http.get('/api/noticias')
            .success(function (data, status, headers, config) {
                $scope.noticias = data;
            }).error(function (data, status, headers, config) {
                alertService.broadcast(data);
            });
    }).
    controller('NoticiasNewCtrl', function ($scope, $http, $location, $upload, alertService) {
         $scope.onFileSelect = function (files) {
           $scope.noticia.file = files[0];
        };
        $scope.save = function () {
            var today = new Date();
            today.setFullYear(today.getFullYear(), today.getMonth(), today.getDate() - 1);
            $scope.noticia.fecha = today;
            $scope.upload = $upload.upload({
                url: '/api/noticias',
                method: "POST",
                data: {noticia: $scope.noticia},
                file: $scope.noticia.file // or list of files ($files) for html5 only
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                $location.path('noticias');
            });  
        };
    }).
    controller('NoticiasEditCtrl', function ($scope, $http, $location, $routeParams, $upload, alertService) {
        $http.get('/api/noticias/' + $routeParams.id)
            .success(function (data, status, headers, config) {
                $scope.noticia = data;
            }).error(function (data, status, headers, config) {
                alertService.broadcast(data);
            });
        console.log($location);

         $scope.onFileSelect = function ($files) {
           $scope.noticia.file = $files[0];
        };

        $scope.save = function () {
            $scope.noticia.fecha = new Date();
            $scope.upload = $upload.upload({
                url: '/api/noticias/' + $routeParams.id,
                method: "PUT" ,
                data: {noticia: $scope.noticia},
                file: $scope.noticia.file // or list of files ($files) for html5 only
            }).progress(function (evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                $location.path('noticias');
            });  
        };
    }).
    controller('NoticiasDeleteCtrl', function ($scope, $http, $location, $routeParams, alertService) {
        $http.get('/api/noticias/' + $routeParams.id)
            .success(function (data, status, headers, config) {
                $scope.noticia = data;
            }).error(function (data, status, headers, config) {
                $scope.name = 'Error!'
            });
        $scope.delete = function () {
            $http.delete("/api/noticias/" + $routeParams.id, $scope.noticia)
                .success(function () {
                    alertService.broadcast("noticia deleted successfully.");
                    $location.path("/noticias");
                });
        };
    });
