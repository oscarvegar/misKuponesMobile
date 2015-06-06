angular.module('kupon.dao', [])

.factory('$db', function($q) {
    var self = this;
    self.db = null;
    
    self.init = function() {
        console.log("inicializando base de datos");
        self.db = new PouchDB('kuponDB');;
        console.log("esquema de base de datos creado!!");
    };

    self.insert = function( object ) {
        return self.db.put( object);
    };

    self.query = function( document ){
        return self.db.get(document);
    }

    self.delete = function( document ){
        return self.db.remove( document );
    }

    return self;
    
})



