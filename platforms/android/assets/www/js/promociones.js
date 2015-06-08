/**
 * Created by oscar on 02/04/15.
 */
var myApp = angular.module("PromoModule",['ionic']);
myApp.controller( "PromoController", function($scope, $http, $rootScope, $kuponServices, $db, $ionicLoading){

  $scope.getPromocion = function ( promo ) {
    console.log("promo :: ", promo);
    $rootScope.promoSelected = promo;
    $rootScope.decuentoPorcentaje = 100 - (( promo.precioDescuento * 100 ) / promo.precioRegular);
    window.location.href = "#/app/detalle";
  }

  $scope.comprar = function() {
    window.location.href = "#/app/compra";
    $rootScope.cantidad = 1;
  }

  $scope.confirmarCompra = function() {
    $ionicLoading.show({
      template: "Procesando tu compra ..."
    });
    console.log("Promocion seleccionada :: ", $rootScope.promoSelected )
    var user = JSON.parse(localStorage["user"]);
    console.log("user logged : ", user);
    var request = { promocionId: $rootScope.promoSelected.promocionId,
                    subcategoriaId: $rootScope.promoSelected.subCategoriaId,
                    user: user.id,
                    cantidad: $rootScope.cantidad,
                    total: ($rootScope.promoSelected.precioKupon *  $rootScope.cantidad)};
    $http.post( VENTA_WS, request ).then(function(result){
      alert( "Tu compra se ha realizado correctamente, " +
      "podrás ver tu kupon en el apartado de Mis Kupones. Gracias por usar MisKupones." );
      window.location.href = "inicio.html";
      $ionicLoading.hide();
    },function(error){
      $ionicLoading.hide();
      alert("Error al generar la venta: " + JSON.stringify(error) );
    });
  }


});
