// --- Breather Parameters
var AA = 0.4;
var U_MAX = 14.0;
var V_MAX = 37.0;
var U_INCREMENT = 0.5;
var V_INCREMENT = 0.5;

// --- Zoom Parameter
var ORTHO_VAR = 8;
const ORTHO_DEFAULT = 8;

// --- Rotation Parameters
var ROTATEX_DEGREE = 0;
var ROTATEY_DEGREE = 40;
var ROTATEZ_DEGREE = 40;

var isEnvMappingOn = false;
var envMapParent = "../env-img/";
var envOption1 = "env.png";
var envOption2 = "env.jpg";
var envOption3 = "env3.jpg";

var envMapSrc = envMapParent + envOption1;

function currentState() {
    console.log(
        `AA = ${AA}, U_MAX = ${U_MAX}, V_MAX = ${V_MAX}, U_INCREMENT = ${U_INCREMENT}, V_INCREMENT = ${V_INCREMENT}`
    );
}
