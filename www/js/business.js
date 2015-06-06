angular.module('kupon.business', [])
.service('$kuponServices', function( $q, $http, $db){
	this.initApp = function( ) {
        return $http.post(GET_PROMOS_WS).then(function(result) {
            //console.log("Data >>> ", result.data );
            return $db.query( DOC_PROMOS ).then(function(doc) {
                // El documento existe, lo borramos primero
                //console.log("El documento existe, lo actualizamos");
                return $db.db.put({_id: DOC_PROMOS, _rev: doc._rev, promociones: result.data })
                    .then(function(resultUpd){
                        resultUpd.data = result.data;
                        return resultUpd;
                    });
            }, function(err) {
                if(err.status ===  404 ){
                    // El documento no existe, lo creamos
                    // console.log("El documento no existe, lo creamos");
                    return $db.insert({_id:DOC_PROMOS,promociones:result.data});
                }else{
                    throw err;
                }
            });
        });
	}
})







