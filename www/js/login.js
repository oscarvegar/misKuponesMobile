// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','validation.match', 'kupon.dao', 'kupon.business'])

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

.controller( "LoginController", function( $scope, $rootScope, $http, $db, $ionicLoading, $kuponServices){
  $scope.isLogin = true;
  $scope.switch = function(){
    $scope.user = null;
    $scope.isLogin = !$scope.isLogin;
  }

  $scope.login = function(){
    $scope.mensaje = ' Verificando usuario ...';
    $ionicLoading.show({
      template: $scope.mensaje
    });
    $http.post(LOGIN_WS, $scope.user)
    .success(function(result,status){
        localStorage["user"] = JSON.stringify(result);
          $scope.mensaje = "Usuario válido, cargando datos del sistema ..."
          $kuponServices.initApp().then(function(resultPromo){
            console.log("promociones creadas :: ", resultPromo);
            $rootScope.promociones = resultPromo.data;
            $ionicLoading.hide();
            window.location.href="inicio.html";
          },function(error){
            alert("Error al cargar promociones: " + JSON.stringify(error) );
          });
    }).error(function(err){
      $ionicLoading.hide();
      $scope.errorLogin = "El usuario y/o contraseña son incorrectos";
    });
  }

  $scope.registrar = function(){ 
    $ionicLoading.show({
      template: ' Registrando nuevo usuario ...'
    });
    console.log("Usuario que se va a registrar :: ", $scope.user);
    $scope.user.status = 1;
    $scope.user.wreck = '(#$%)';
    $http.post( REGISTRO_WS, $scope.user ).then(function(result) {
      console.log("Exito al registrar nuevo usuario :: ", result.data)
      $db.insert( result.data)
      .then(function(resultDB){
        console.log("User DAO inserted en touchDB ... ", resultDB );
        $ionicLoading.hide();
        window.location.href="inicio.html";
      },function(err){
        $ionicLoading.hide();
        alert("Error a cargar datos ... " + JSON.stringify(err));
      });
    }, function(error){
      $ionicLoading.hide();
      alert("Error al intentar registrar: " + JSON.stringify(error));
      console.error("Error al registrar nuevo usuario: ", error)
    });
  }


})