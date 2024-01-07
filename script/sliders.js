let AASlider;
let maxUSlider;
let maxVSlider;
let incrementUSlider;
let incrementVSlider;
let zoomSlider;
let rotateXSlider;
let rotateYSlider;
let rotateZSlider;

let textAA;
let textMAXU;
let textMAXV;
let textINCU;
let textINCV;
let textZoom;
let textRotateX;
let textRotateY;
let textRotateZ;

function initSliders() {
    initSliderText();

    AASlider = document.getElementById("AA-slider");
    AASlider.onchange = function () {
        textAA.innerHTML = this.value;

        AA = parseFloat(this.value);
        draw();
    };

    maxUSlider = document.getElementById("MAXU-slider");
    maxUSlider.onchange = function () {
        textMAXU.innerHTML = this.value;

        U_MAX = parseFloat(this.value);
        draw();
    };

    maxVSlider = document.getElementById("MAXV-slider");
    maxVSlider.onchange = function () {
        textMAXV.innerHTML = this.value;

        V_MAX = parseFloat(this.value);
        draw();
    };

    incrementUSlider = document.getElementById("INCU-slider");
    incrementUSlider.onchange = function () {
        textINCU.innerHTML = this.value;

        U_INCREMENT = parseFloat(this.value);
        draw();
    };

    incrementVSlider = document.getElementById("INCV-slider");
    incrementVSlider.onchange = function () {
        textINCV.innerHTML = this.value;
        
        V_INCREMENT = parseFloat(this.value);
        draw();
    };

    zoomSlider = document.getElementById("zoom-slider");
    zoomSlider.onchange = function () {
        textZoom.innerHTML = this.value;

        diff = parseFloat(this.value) - ORTHO_DEFAULT;
        ORTHO_VAR = ORTHO_DEFAULT - diff;
        zoom();
    };

    rotateXSlider = document.getElementById("rotateX-slider");
    rotateXSlider.onchange = function () {
        textRotateX.innerHTML = this.value;

        ROTATEX_DEGREE = parseFloat(this.value);
        rotateSlider();
    };

    rotateYSlider = document.getElementById("rotateY-slider");
    rotateYSlider.onchange = function () {
        textRotateY.innerHTML = this.value;

        ROTATEY_DEGREE = parseFloat(this.value);
        rotateSlider();
    };

    rotateZSlider = document.getElementById("rotateZ-slider");
    rotateZSlider.onchange = function () {
        textRotateZ.innerHTML = this.value;

        ROTATEZ_DEGREE = parseFloat(this.value);
        rotateSlider();
    };
}

function initSliderText() {
    textAA = document.getElementById("text-AA");
    textMAXU = document.getElementById("text-MAXU");
    textMAXV = document.getElementById("text-MAXV");
    textINCU = document.getElementById("text-INCU");
    textINCV = document.getElementById("text-INCV");
    textZoom = document.getElementById("text-zoom");
    textRotateX = document.getElementById("text-rotateX");
    textRotateY = document.getElementById("text-rotateY");
    textRotateZ = document.getElementById("text-rotateZ");
}
