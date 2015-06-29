/**
 * Created by oscar on 02/04/15.
 */
var myApp = angular.module("PromoModule",['ionic','ngCordova']);
myApp.controller( "PromoController",
    function($timeout,$scope, $http, $rootScope, $kuponServices, $db, $ionicLoading,$cordovaSocialSharing,$ionicPopup, $timeout, $ionicPopover){

    $ionicPopover.fromTemplateUrl('templates/popover.html', {
        scope: $scope,
    }).then(function(popover) {
        $scope.popover = popover;
    });

    $scope.editar = false;

    $kuponServices.getEstados().then(function(result){
        $rootScope.estados = result;
    });

    getCliente = function(){
        $db.query( DOC_USER ).then( function( result ){
            $rootScope.user = result.user;
            console.log(" id a buscar en " + CLIENTE_WS + " ::::  ", result.user.id)
            $http.post(CLIENTE_WS, {id:result.user.id}).then(function( resultClient ){
                console.log( "client :: ", resultClient.data );
                $rootScope.cliente = resultClient.data;
                if( $rootScope.cliente.estado ) {
                    console.log("estado del cliente: ", $rootScope.cliente.estado);
                    $rootScope.estadoSelected = $rootScope.cliente.estado;
                }else{
                    $rootScope.estadoSelected = 9;
                }
            },function(err){
                console.error("Error ::::: ", err);
            }).catch(function(err){
                console.error("Error al extraer el cliente :: ", err);
            });
        });
    };

    getCliente();

    $scope.actualizarCliente = function(){
        $rootScope.cliente.estado = $rootScope.estadoSelected;
        $http.post(CLIENTE_UPDATE_WS, $rootScope.cliente)
            .then(function(result){
                $scope.editar = false ;
                alert(" Su información ha sido actualizada. " );
                if(!$scope.$$phase) {
                    $scope.$apply();
                }
            })
            .catch(function(err){
                alert("Error al actualizar el cliente: " + JSON.stringify(err) );
            });
    }

    $scope.meGusta = function( promoSelected ){
        // se va a quitar la promocion del cliente
        $http.post(CLIENTE_DEF_MEGUSTA_WS,
            {id:$rootScope.cliente.id, promocionId:promoSelected.promocionId, megusta:$rootScope.megusta  })
            .then(function (result) {
                $rootScope.megusta = !$rootScope.megusta;
                if($rootScope.megusta){
                    $rootScope.cliente.promosIdsLike.push(promoSelected.promocionId);
                }else{
                    var indexPromo = $rootScope.cliente.promosIdsLike.indexOf(promoSelected.promocionId);
                    $rootScope.cliente.promosIdsLike.splice(indexPromo, 1);
                }
            })
            .catch(function (err) {
                alert("Error al actualizar el cliente: " + JSON.stringify(err));
            });
    }

    $scope.setEstado = function(id){
        $rootScope.estadoSelected = id;
    }

    $scope.getPromocion = function ( promo, index ) {
    console.log("promo :: ", promo);
    $rootScope.promoSelected = promo;
    $rootScope.indexPromoSelected = index;
    $rootScope.decuentoPorcentaje = 100 - (( promo.precioDescuento * 100 ) / promo.precioRegular);

    //Verificar si la promo tiene "megusta" por el cliente
    $rootScope.megusta = $rootScope.cliente.promosIdsLike.indexOf( promo.promocionId ) >= 0 ? true : false;
    console.log("Me gusta:: " + $rootScope.megusta);

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

      $kuponServices.initApp($rootScope.user.id).then(function(resultPromo) {
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
        $rootScope.disponibles = [];
        if($scope.promoSelected.cantidadKupones <= 10) {
            for (var i = 0; i < $scope.promoSelected.cantidadKupones; i++) {
                $rootScope.disponibles.push(i + 1);
            }
        }else{
            $rootScope.disponibles = [1,2,3,4,5,6,7,8,9,10];
        }
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
        var estadoId = localStorage[ LOCAL_ESTADO_SELECTED ];
        console.log("user logged : ", user);
        console.log("estado ID : ", estadoId);
        var request = { promocionId: $rootScope.promoSelected.promocionId,
                        subcategoriaId: $rootScope.promoSelected.subCategoriaId,
                        user: user.id,
                        estadoId: estadoId,
                        cantidad: eval($rootScope.cantidad),
                        total: ($rootScope.promoSelected.precioKupon *  $rootScope.cantidad)};

        $http.post( VENTA_WS, request ).then(function(result){
           $kuponServices.actualizarCantidadPromo( eval($rootScope.cantidad), $rootScope.indexPromoSelected )
          .then(function(resultUpd){
                $ionicLoading.hide();
                var myPopup = $ionicPopup.show({
                   template: '<b><center>Tu compra se ha realizado correctamente, podrás ver tu kupon en el apartado de Mis Kupones. Gracias por usar MisKupones</center></b>',
                   title: 'Compra Finalizada',
                   scope: $scope,
                   buttons: [
                       { text: 'Aceptar' }
                   ]
                });
                myPopup.then(function(res) {
                   console.log('Tapped!', res);
                   window.location.href = "inicio.html";
                });
                $timeout(function() {
                   myPopup.close(); //close the popup after 3 seconds for some reason
                    window.location.href = "inicio.html";
                }, 3000);
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
        $http.post(FB_SHARE+promo.promocionId).success(console.log);
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



  var BUSQUEDA_POR_ESTADO = 1
  // Para busqueda de kupones
  $scope.prepararBusqueda = function( tipo ){
      if( tipo === BUSQUEDA_POR_ESTADO ){
          // An elaborate, custom popup
          var myPopup = $ionicPopup.show({
              template: '<select ng-model="estadoSelected" ng-change="setEstado(estadoSelected)" ' +
                        'ng-options="estado.id as estado.nombre for estado in estados"> ' +
                        '</select>',
              title: 'Busqueda de kupones por estado',
              subTitle: 'Seleccione un estado',
              scope: $scope,
              buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Buscar</b>',
                      type: 'button-positive',
                      onTap: function(e) {
                          //console.log("Estado selected: ", $scope.estadoSelected);
                          localStorage[ LOCAL_ESTADO_SELECTED ] = $scope.estadoSelected;
                          return $scope.estadoSelected;
                      }
                  }
              ]
          });
          myPopup.then(function(res) {
            $ionicLoading.show({
              template: "Buscando tus kupones ..."
            });
            $kuponServices.getPromosPorEstado( res ).then(function(resultPromo) {
                console.log("actualizando promociones :: ", resultPromo);
                $rootScope.promociones = resultPromo.data;
                $scope.$broadcast('scroll.refreshComplete');
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
                $ionicLoading.hide();
            },function(error){
                $ionicLoading.hide();
                $scope.$broadcast('scroll.refreshComplete');
                if(!$scope.$$phase) {
                    $scope.$apply()
                }
                alert("Error al cargar promociones: " + JSON.stringify(error) );
            });;
          });
      }else{

      }
      $scope.popover.hide();
  }

});
