angular.module('kupon.business', [])
.service('$kuponServices', function( $q, $http, $db){
	this.initApp = function( ) {
        return $http.post(GET_PROMOS_WS).then(function(result) {
            console.log("Data >>> ", result.data );
            return $db.query( DOC_PROMOS ).then(function(doc) {
                // El documento existe, lo borramos primero
                console.log("El documento existe con estas promociones :: ", doc);
                console.log("El documento existe, lo actualizamos");
                return $db.db.put({_id: DOC_PROMOS, _rev: doc._rev, promociones: result.data })
                    .then(function(resultUpd){
                        resultUpd.data = result.data;
                        return resultUpd;
                    });
            }, function(err) {
                if(err.status ===  404 ){
                    // El documento no existe, lo creamos
                    console.log("El documento no existe, lo creamos");
                    return $db.insert({_id:DOC_PROMOS,promociones:result.data});
                }else{
                    throw err;
                }
            });
        });
	}

    this.registraUsuario = function( user ) {
        return $db.query( DOC_USER ).then(function(doc) {
            // El documento existe, lo borramos primero
            console.log("El documento del usuario existe :: ", doc);
            console.log("El documento existe, lo actualizamos");
            return $db.db.put({_id: DOC_USER, _rev: doc._rev, user: user })
                .then(function(resultUpd){
                    resultUpd.data = result.data;
                    return resultUpd;
                });
        }, function(err) {
            if(err.status ===  404 ){
                // El documento no existe, lo creamos
                console.log("El documento no existe, lo creamos");
                return $db.insert({_id:DOC_USER,user:user});
            }else{
                throw err;
            }
        });
    }

    this.actualizarCantidadPromo = function( cantidad, index){
        console.log("Actualizando la promo con index :: " + index + " y la cantdiad:: " + cantidad );
        return $db.query( DOC_PROMOS ).then( function(result){
            console.log("Promos encontradas: ", result)
            result.promociones[index].cantidadCreados += eval(cantidad);
            console.log("nueva cantidad en creados: ", result.promociones[index].cantidadCreados )
            return $db.db.put({_id: DOC_PROMOS, _rev: result._rev, promociones: result.promociones })
                .then(function(resultUpd){
                    resultUpd.data = result.data;
                    return resultUpd;
                });
        });
    }

    this.getPromociones = function(){
        return $db.query( DOC_PROMOS );
    }

})







