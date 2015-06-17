/**
 * Created by oscar on 02/04/15.
 */
var myApp = angular.module("PromoModule",['ionic','ngCordova']);
myApp.controller( "PromoController", function($timeout,$scope, $http, $rootScope, $kuponServices, $db, $ionicLoading,$cordovaSocialSharing){

  $rootScope.editar = false;

  getCliente = function(){
    $db.query( DOC_USER ).then( function( result ){
        $rootScope.user = result.user;
        $http.post(CLIENTE_WS, {id:result.user.id}).then(function( resultClient ){
            console.log( "client :: ", resultClient.data );
            $rootScope.cliente = resultClient.data;
        });
    });
  };

  getCliente();

  $scope.updateCliente = function() {
    $http.post( CLIENTE_UPDATE_WS, $rootScope.cliente ).then(function(result){
        console.log("Cliente ::: ", result );
        $rootScope.cliente = result.data;
    }).catch(function(err){
        alert("Error a actualizar el cliente ");
    });
  }

  $scope.getPromocion = function ( promo, index ) {
    console.log("promo :: ", promo);
    $rootScope.promoSelected = promo;
    $rootScope.indexPromoSelected = index;
    $rootScope.decuentoPorcentaje = 100 - (( promo.precioDescuento * 100 ) / promo.precioRegular);
    window.location.href = "#/app/detalle";
  }

  $scope.buscarPorNombre = function(){
      if ( $scope.criteria.length >= 3 ) {
          $kuponServices.getPromosPorTitulo( $scope.criteria ).then(function(resultPromo) {
              console.log("actualizando promociones :: ", resultPromo);
              $rootScope.promociones = resultPromo;
              if(!$scope.$$phase) {
                  $scope.$apply()
              }
          },function(error){
              alert("Error al cargar promociones: " + JSON.stringify(error) );
          });
      } else if( $scope.criteria === "" ) {
          $kuponServices.getPromosPorTitulo( "*" ).then(function(resultPromo) {
              $rootScope.promociones = resultPromo;
              console.log("actualizando promociones :: ", $rootScope.promociones );
              if(!$scope.$$phase) {
                  $scope.$apply()
              }
          },function(error){
              alert("Error al cargar promociones: " + JSON.stringify(error) );
          });
      }
  }

  $scope.actualizarLista = function(){
      $kuponServices.initApp().then(function(resultPromo) {
          console.log("actualizando promociones :: ", resultPromo);
          $rootScope.promociones = resultPromo.data;
          $scope.$broadcast('scroll.refreshComplete');
          if(!$scope.$$phase) {
              $scope.$apply()
          }
      },function(error){
          $ionicLoading.hide();
          $scope.$broadcast('scroll.refreshComplete');
          if(!$scope.$$phase) {
              $scope.$apply()
          }
          alert("Error al cargar promociones: " + JSON.stringify(error) );
      });
  }

  $scope.comprar = function() {
    window.location.href = "#/app/compra";
    $rootScope.cantidad = 1;
  }

  $scope.aplicaCantidad = function(cantidad){
    $rootScope.cantidad = cantidad;
    //alert("cantidad a aplicar :: ", $rootScope.cantidad );
  }

  $scope.confirmarCompra = function() {
    //alert("cantidad a comprar :: ", $rootScope.cantidad );
    $ionicLoading.show({
      template: "Procesando tu compra ..."
    });
    console.log("Promocion seleccionada :: ", $rootScope.promoSelected )
    var user = JSON.parse(localStorage["user"]);
    console.log("user logged : ", user);
    var request = { promocionId: $rootScope.promoSelected.promocionId,
                    subcategoriaId: $rootScope.promoSelected.subCategoriaId,
                    user: user.id,
                    cantidad: eval($rootScope.cantidad),
                    total: ($rootScope.promoSelected.precioKupon *  $rootScope.cantidad)};
    $http.post( VENTA_WS, request ).then(function(result){
      alert( "Tu compra se ha realizado correctamente, " +
      "podrás ver tu kupon en el apartado de Mis Kupones. Gracias por usar MisKupones." );
      $kuponServices.actualizarCantidadPromo( eval($rootScope.cantidad), $rootScope.indexPromoSelected )
     .then(function(resultUpd){
        window.location.href = "inicio.html";
        $ionicLoading.hide();
      },function(error){
        $ionicLoading.hide();
        alert("Error al actualiar cantidad: " + JSON.stringify(error) );
      });
    },function(error){
      $ionicLoading.hide();
      alert("Error al generar la venta: " + JSON.stringify(error) );
    });
  }

  $scope.shareViaFacebook = function(promo) {
    console.log(promo)
    try{
      $ionicLoading.show({
          template: "Compartiendo en facebook..."
        });
      $cordovaSocialSharing.shareViaFacebook(null, null, "http://miskupones.com/v/promocion/"+promo.promocionId)
      .then(function(result) {
        $ionicLoading.hide()
    }, function(err) {
        $ionicLoading.hide()
        console.error("ERROR",err);
        $ionicLoading.show({
          template: err
        });
        $timeout($ionicLoading.hide,5000)
    });;
    }catch(err){
      $ionicLoading.hide()
      $ionicLoading.show({
          template: err
        });
      $timeout($ionicLoading.hide,5000)

    }
      
  }
    


});
