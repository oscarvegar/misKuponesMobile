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

.controller( "LoginController", function( $scope, $rootScope, $http, $db ){
  $scope.isLogin = true;

  $scope.switch = function(){
    $scope.user = null;
    $scope.isLogin = !$scope.isLogin;
  }

  $scope.login = function() {
    $http.post( LOGIN_WS, $scope.user).then(function(result){
      console.log("result login ...", result.data);
      //alert("result login ..." + JSON.stringify(result.data) );
      if(result.data.status === "OK"){
        localStorage["user"] = JSON.stringify(result.data.user);
        window.location.href="inicio.html";
      }else{
        $scope.errorLogin = "El usuario y/o contraseña son incorrectos";
        console.log("Error en login ");
      }
    }, function(error) {
      console.error("Error al hacer login ...", err)
      alert("Error al authenticar usuario: " + JSON.stringify(error) );
    });
  }

  $scope.registrar = function(){
    console.log("Usuario que se va a registrar :: ", $scope.user);
    $scope.user.status = 1;
    $http.post( REGISTRO_WS, $scope.user ).then(function(result) {
      console.log("Exito al registrar nuevo usuario :: ", result.data);
      localStorage["user"] = JSON.stringify(result.data.user);
      $db.db.insert( result.data).then(function(resultDB){
        console.log("User DAO inserted en touchDB ... ", resultDB );
        window.location.href="inicio.html";
      });
    }, function(error){
      console.error("Error al registrar nuevo usuario: ", error);
      alert("Error al registrar usuario: " + JSON.stringify(error) );
    });
  }


})
















