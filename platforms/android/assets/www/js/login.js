// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','validation.match', 'kupon.dao'])

.run(function($ionicPlatform, $db) {
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
})

.controller( "LoginController", function( $scope, $rootScope, $http, $db){
  $scope.isLogin = true;
  $scope.switch = function(){
    $scope.user = null;
    $scope.isLogin = !$scope.isLogin;
  }

  $scope.login = function(){
    $http.post(LOGIN_WS, $scope.user)
    .success(function(result,status){
        console.log(status)
        localStorage["user"] = JSON.stringify(result);
        window.location.href="inicio.html";
    }).error(function(err){
      $scope.errorLogin = "El usuario y/o contraseña son incorrectos";
    });
  }

  $scope.registrar = function(){
    console.log("Usuario que se va a registrar :: ", $scope.user);
    $scope.user.status = 1;
    $http.post( REGISTRO_WS, $scope.user ).then(function(result) {
      console.log("Exito al registrar nuevo usuario :: ", result.data)
      $db.db.insert( result.data).then(function(resultDB){
        console.log("User DAO inserted en touchDB ... ", resultDB );
        window.location.href="inicio.html";
      });
    }, function(error){
      console.error("Error al registrar nuevo usuario: ", error)
    });
  }


})
















