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

.controller( "LoginController", function( $scope, $rootScope, $http, $db, $ionicLoading, $kuponServices, $ionicPopup, $timeout){

  $scope.isLogin = true;
  $scope.user = {};
      $scope.email = null;

  $scope.switch = function(){
    $scope.user = null;
    $scope.isLogin = !$scope.isLogin;
  }

  $kuponServices.getEstados().then(function(result){
    $rootScope.estados = result;
    $rootScope.estadoSelected = 9 ;
  });

  $scope.login = function(){
    $scope.mensaje = ' Verificando usuario ...';
    $ionicLoading.show({
      template: $scope.mensaje
    });
    $http.post(LOGIN_WS, $scope.user)
    .success(function(result,status){
        localStorage["user"] = JSON.stringify(result);
          $scope.mensaje = "Usuario válido, cargando datos del sistema ..."
          $kuponServices.registraUsuario( result ).then( function(resultUser){
            $kuponServices.initApp(result.id).then(function(resultPromo) {
              console.log("promociones creadas :: ", resultPromo);
              $rootScope.promociones = resultPromo.data;
              $ionicLoading.hide();
              window.location.href="inicio.html";
            },function(error){
              $ionicLoading.hide();
              alert("Error al cargar promociones: " + JSON.stringify(error) );
            });
          });
    }).error(function(err){
      $ionicLoading.hide();
      //$scope.errorLogin = "El usuario y/o contraseña son incorrectos";
      var myPopup = $ionicPopup.show({
        template: '<b><center>El usuario y/o contraseña son incorrectos</center></b>',
        title: 'Error en datos de acceso',
        subTitle: '',
        scope: $scope,
        buttons: [
          { text: 'Aceptar' }
        ]
      });
      myPopup.then(function(res) {
        console.log('Tapped!', res);
      });
      $timeout(function() {
        myPopup.close(); //close the popup after 3 seconds for some reason
      }, 3000);

    });
  }

  $scope.registrar = function(){ 
    $ionicLoading.show({
      template: ' Registrando nuevo usuario ...'
    });
    console.log("Usuario que se va a registrar :: ", $scope.user);
    console.log("Estado seleccionado :: ", $rootScope.estadoSelected);
    $scope.user.status = 1;
    $scope.user.wreck = '(#$%)';
    $http.post( REGISTRO_WS, $scope.user ).success(function(result) {
      localStorage["user"] = JSON.stringify(result);
      $http.post( CLIENTE_CREATE_WS, { user: result.id, correo: $scope.user.email, estado: $rootScope.estadoSelected })
          .then(function(resultNuevoCliente){
            console.log("Cliente registrado:: ", resultNuevoCliente);
            //alert("Cliente nuevo");
          }).
          catch(function(err){
            console.error("err ", err);
            alert("Error en registro de cliente :: " + JSON.stringify(err) );
          });

      $kuponServices.registraUsuario( result ).then( function(resultUser){
        $kuponServices.initApp(result.id).then(function(resultPromo) {
          console.log("promociones creadas :: ", resultPromo);
          $rootScope.promociones = resultPromo.data;
          $ionicLoading.hide();
          window.location.href="inicio.html";
        },function(error){
          $ionicLoading.hide();
          alert("Error al cargar promociones: " + JSON.stringify(error) );
        });
      },function(error){
        $ionicLoading.hide();
        alert("Error al registrar usuario: " + JSON.stringify(error) );
      });

    }).error(function(error) {
      //$scope.errorRegistro = "Error al registrar: El usuario y/o correo electrónico ya existen.";
      var myPopup2 = $ionicPopup.show({
        template: '<b><center>El usuario y/o correo electrónico ya existen</center></b>',
        title: 'Error al registrar nuevo usuario',
        subTitle: '',
        scope: $scope,
        buttons: [
          {text: 'Aceptar'}
        ]
      });
      myPopup2.then(function (res) {
        console.log('Tapped!', res);
      });
      $timeout(function () {
        myPopup2.close(); //close the popup after 3 seconds for some reason
      }, 3000);
      $ionicLoading.hide();
      //alert("Error al intentar registrar: " + JSON.stringify(error));
      console.error("Error al registrar nuevo usuario: ", error)
    });
  }

  $scope.setEstado = function(id){
    $rootScope.estadoSelected = id;
  }

  $scope.toRecoverPwd = function(){
    $scope.msgErr = "";
    var myPopup2 = $ionicPopup.show({
      template: '<b><center>Por favor, ingrese su correo electronico con el cual se registro</center></b><br/>' +
                '<input type="email" name="emailRec" id="emailRec" ng-model="emailRec"  /><span id="msgErr" class="assertive">{{msgErr}}</span>',
      title: 'Recuperación de contraseña',
      subTitle: '',
      scope: $scope,
      buttons: [
        {text: 'Aceptar',
         onTap: function(e) {
           var correo = document.getElementById("emailRec").value;
           if( !correo ){
             $scope.msgErr = "El correo electrónico es obligatorio";
             e.preventDefault();
           }else{
             var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
             var isValidEmail = pattern.test(correo);  // returns a boolean
             if(isValidEmail){
               return correo;
             }else{
               $scope.msgErr = "El correo electrónico es incorrecto";
               e.preventDefault();
             }
           }
        }}
        ,{text:'Cancelar'}
      ]
    });
    myPopup2.then(function (res) {
      console.log('Tapped!', res);
      $ionicLoading.show({
        template: ' Procesando solicitud ...'
      });
      $http.post(SOLICITUD_CAMBIO_PWD_WS,{email:res}).then(function(res){
        console.log("Respuesta del server: ", res.data);
        var bodyMsg = 'Te enviamos tu nueva contraseña a tu correo electrónico que nos proporcionaste.';
        var titleMsg = 'Recuperación de contraseña';
        var subTitleMsg = '';
        if(res.data.error){
          bodyMsg = '<span class="assertive"><i class="icon ion-close-circled"></i>  ' + res.data.msg + '</span>';
          titleMsg = 'Error de recuperación de contraseña';
          subTitleMsg = 'ERROR';
        }
        var myPopup3 = $ionicPopup.show({
          template: bodyMsg,
          title: titleMsg,
          subTitle: subTitleMsg,
          scope: $scope,
          buttons: [
            {text: 'Aceptar'}
          ]
        });
        $ionicLoading.hide();
      });
    });

  }

})