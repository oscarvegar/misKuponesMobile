/**
 * Created by oscar on 02/04/15.
 */
var myApp = angular.module("MisKuponesModule",['ionic','ngCordova']);
myApp.controller( "MisKuponesController", function($timeout,$scope, $http, $rootScope, $kuponServices, $db, $ionicLoading){

  $scope.loadInit = function() {
      $db.query( DOC_USER ).then( function( result ) {
          //alert("user: " + result.user.id );
          $http.post( MIS_KUPONES_WS, {userId: result.user.id})
              .then(function(result){
                  console.log("Result de mis kupones :: ", result.data);
                  $scope.miskupones = result.data;
              })
              .catch(function(err){
                  console.error("Error: ", err)
              });
      });


  }

  $scope.loadInit();

});
