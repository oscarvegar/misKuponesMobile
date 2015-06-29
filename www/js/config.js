/**
 * Created by oscar on 31/05/15.
 */

//  Produccion
//var CONTEXT_PATH_WS = "http://miskupones.com/";

//  Desarrollo
var CONTEXT_PATH_WS = "http://localhost:1337/";

// GENERAL
var REGISTRO_WS = CONTEXT_PATH_WS + "auth/local/register/";
var LOGIN_WS = CONTEXT_PATH_WS + "loginapp/";
var GET_PROMOS_WS = CONTEXT_PATH_WS + "Promocion/findByLimit/";
var GET_PROMOS_ESTADO_WS = CONTEXT_PATH_WS + "Promocion/findByEstado/";
var VENTA_WS = CONTEXT_PATH_WS + "Venta/generaVenta/";
var CLIENTE_WS = CONTEXT_PATH_WS + "Cliente/findById/";
var CLIENTE_CREATE_WS = CONTEXT_PATH_WS + "Cliente/create/";
var CLIENTE_UPDATE_WS = CONTEXT_PATH_WS + "Cliente/update/";
var CLIENTE_DEF_MEGUSTA_WS = CONTEXT_PATH_WS + "Cliente/defineMeGusta/";
var ESTADOS_ALL_WS = CONTEXT_PATH_WS + "Estado/getEstados/";
var MIS_KUPONES_WS = CONTEXT_PATH_WS + "Kupon/misKupones/";
var FB_SHARE = CONTEXT_PATH_WS + "share/fb/";

// Nombres de documentos guardados en el PunchDB
var DOC_PROMOS = "promociones";
var DOC_SESION = "sesion";
var DOC_USER = "user";
var DOC_CLIENTE = "cliente";
var DOC_ESTADOS = "estados";

// Nombres para el LocalStorage

var LOCAL_ESTADO_SELECTED = "estadoSelected";

