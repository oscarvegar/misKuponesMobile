// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'kupon.dao', 'kupon.business', 'PromoModule'])

.run(function($ionicPlatform, $kuponServices, $db, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $db.init();

  $kuponServices.getPromociones().then(function(result){
    console.log("Promociones encontradas :: ", result);
    $rootScope.promociones = result.promociones;
  },function(error){
    alert("Error al cargar promociones: " + JSON.stringify(error) );
  });
      


})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  .state('app.detalle', {
    url: "/detalle",
    views: {
      'menuContent': {
        templateUrl: "templates/detalle.html"
      }
    }
  })

  .state('app.compra', {
    url: "/compra",
    views: {
      'menuContent': {
        templateUrl: "templates/compra.html"
      }
    }
  })

  .state('app.cupones', {
    url: "/cupones",
    views: {
      'menuContent': {
        templateUrl: "templates/cupones.html"
      }
    }
  })

  .state('app.perfil', {
    url: "/perfil",
    views: {
      'menuContent': {
        templateUrl: "templates/perfil.html"
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/cupones');

})
.controller("AppController", function($scope, $http){
  $scope.salir = function(){
    ionic.Platform.exitApp();
  }
});
