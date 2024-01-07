var canvas;
var gl;
var program;
var canvasWidth;
var canvasHeight;

var projectionMatrix;
var modelViewMatrix;
var instanceMatrix;

var vBuffer;
var cBuffer;
var nBuffer;

var normals = [];
var vertices = [];
var colors = [];

var currentShaderType;

// --- Shader Variables
var lightAmbientModifier = 0.15;
var lightDiffuseModifier = 0.75;
var lightSpecularModifier = 0.95;

var lightPosition = vec4(1.0, 2.0, 1.0, 0.0);

var lightAmbient = vec4(
    lightAmbientModifier,
    lightAmbientModifier,
    lightAmbientModifier,
    1.0
);
var lightDiffuse = vec4(
    lightDiffuseModifier,
    lightDiffuseModifier,
    lightDiffuseModifier,
    1.0
);
var lightSpecular = vec4(
    lightSpecularModifier,
    lightSpecularModifier,
    lightSpecularModifier,
    1.0
);

var p_lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var p_lightDiffuse = vec4(0.8, 0.8, 0.8, 1.0);
var p_lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbientModifier = 1.0;
var materialDiffuseModifier = 0.58;
var materialSpecularModifier = 0.25;

var materialAmbient = vec4(
    materialAmbientModifier,
    -0.25,
    materialAmbientModifier,
    1.0
);
var materialDiffuse = vec4(
    materialDiffuseModifier,
    materialDiffuseModifier * 0.8,
    0.2,
    0.5
);
var materialSpecular = vec4(
    materialSpecularModifier,
    materialSpecularModifier * 0.8,
    0.3,
    1.0
);
var materialShininess = 250.0;

var phongAmbient = vec4(0.25, 0.05, 0.0, 1.0);
var phongDiffuse = vec4(1.0, 0.15, 0.0, 0.8);
var phongSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var ctm;
var ambientColor, diffuseColor, specularColor;

// --- Breather Parameters
// declared in global.js

//-------------------------------------------

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

//--------------------------------------------

function setupVerticesBuffer(vertexArray) {
    // Vertex Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertexArray), gl.STATIC_DRAW);

    // Associate shader variables and draw the vertex buffer
    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
}

function setupColorsBuffer(colorArray) {
    if (currentShaderType == ShaderTypes.PHONG) {
        return;
    }

    // Color Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(colorArray), gl.STATIC_DRAW);

    // Associate shader variables and draw the color buffer
    var vColor = gl.getAttribLocation(program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);
}

function zoom() {
    projectionMatrix = ortho(
        -ORTHO_VAR,
        ORTHO_VAR,
        -ORTHO_VAR,
        ORTHO_VAR,
        -ORTHO_VAR,
        ORTHO_VAR
    );

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "projectionMatrix"),
        false,
        flatten(projectionMatrix)
    );

    render();
}

function rotateSlider() {
    modelViewMatrix = mat4();

    var transformM = mat4();
    if (ROTATEX_DEGREE != 0) {
        transformM = mult(transformM, rotate(ROTATEX_DEGREE, 1, 0, 0));
    }

    if (ROTATEY_DEGREE != 0) {
        transformM = mult(transformM, rotate(ROTATEY_DEGREE, 0, 1, 0));
    }

    if (ROTATEZ_DEGREE != 0) {
        transformM = mult(transformM, rotate(ROTATEZ_DEGREE, 0, 0, 1));
    }

    modelViewMatrix = mult(modelViewMatrix, transformM);

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "modelViewMatrix"),
        false,
        flatten(modelViewMatrix)
    );

    render();
}

function setupNormalsBuffer(normalsArray) {
    // Normal Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);
}

function draw() {
    currentState();
    setupAndDrawBreather();
    render();
}

function setGourardShading() {
    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    gl.uniform4fv(
        gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct)
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct)
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "specularProduct"),
        flatten(specularProduct)
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition)
    );

    gl.uniform1f(
        gl.getUniformLocation(program, "shininess"),
        materialShininess
    );
}

function setEnvironmentMapping(environmentMap) {
    var environmentMapTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, environmentMapTexture);

    for (var i = 0; i < 6; i++) {
        gl.texImage2D(
            gl.TEXTURE_CUBE_MAP_POSITIVE_X + i,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            environmentMap
        );
    }

    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // Use the environment map in the shader
    gl.useProgram(program);
    var environmentMapLocation = gl.getUniformLocation(program, "envMap");
    gl.uniform1i(environmentMapLocation, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, environmentMapTexture);
}

function setPhongShading() {
    var normalMatrixManual = [
        vec3(
            modelViewMatrix[0][0],
            modelViewMatrix[0][1],
            modelViewMatrix[0][2]
        ),
        vec3(
            modelViewMatrix[1][0],
            modelViewMatrix[1][1],
            modelViewMatrix[1][2]
        ),
        vec3(
            modelViewMatrix[2][0],
            modelViewMatrix[2][1],
            modelViewMatrix[2][2]
        ),
    ];

    gl.uniformMatrix3fv(
        gl.getUniformLocation(program, "normalMatrix"),
        false,
        flatten(normalMatrixManual)
    );

    /*
    gl.uniform4fv(
        gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition)
    );

    gl.uniform3fv(
        gl.getUniformLocation(program, "ambientColor"),
        flatten(phongAmbient)
    );

    gl.uniform3fv(
        gl.getUniformLocation(program, "diffuseColor"),
        flatten(phongDiffuse)
    );

    gl.uniform3fv(
        gl.getUniformLocation(program, "specularColor"),
        flatten(phongSpecular)
    );
    */
    gl.uniform1f(
        gl.getUniformLocation(program, "shininess"),
        false,
        flatten(materialShininess)
    );

    var ambientProduct = mult(lightAmbient, phongAmbient);
    var diffuseProduct = mult(lightDiffuse, phongDiffuse);
    var specularProduct = mult(lightSpecular, phongSpecular);

    gl.uniform4fv(
        gl.getUniformLocation(program, "ambientProduct"),
        flatten(ambientProduct)
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "diffuseProduct"),
        flatten(diffuseProduct)
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "specularProduct"),
        flatten(specularProduct)
    );
    gl.uniform4fv(
        gl.getUniformLocation(program, "lightPosition"),
        flatten(lightPosition)
    );
}

function setProgramWithShaders(shaderType) {
    if (
        shaderType != ShaderTypes.GOURAUD &&
        shaderType != ShaderTypes.PHONG &&
        shaderType != ShaderTypes.WIREFRAME &&
        shaderType != ShaderTypes.TEXTURE
    ) {
        console.log("Shader does not exist!");
        return;
    }

    currentShaderType = shaderType;
    let vertexShader = `${shaderType}-vertex-shader`;
    let fragShader = `${shaderType}-fragment-shader`;

    if (isEnvMappingOn) {
        if (currentShaderType == ShaderTypes.GOURAUD) {
            vertexShader += "-env";
        }
        fragShader += "-env";
    }

    program = initShaders(gl, vertexShader, fragShader);

    gl.useProgram(program);
}

function setProgramWithShadersFromButtons(shaderType) {
    setProgramWithShaders(shaderType);

    if (isEnvMappingOn) {
        // Load environment map
        var environmentMap = new Image();
        environmentMap.src = envMapSrc;
        environmentMap.onload = function () {
            setEnvironmentMapping(environmentMap);
            // if environment mapping is selected, make sure that render is called after image is loaded
            render();
        };
    }

    gl.enable(gl.DEPTH_TEST);

    projectionMatrix = ortho(
        -ORTHO_VAR,
        ORTHO_VAR,
        -ORTHO_VAR,
        ORTHO_VAR,
        -ORTHO_VAR,
        ORTHO_VAR
    );

    modelViewMatrix = mat4();

    var transformM = mat4();
    transformM = mult(transformM, rotate(ROTATEY_DEGREE, 0, 1, 0));
    transformM = mult(transformM, rotate(ROTATEZ_DEGREE, 0, 0, 1));

    modelViewMatrix = mult(modelViewMatrix, transformM);

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "modelViewMatrix"),
        false,
        flatten(modelViewMatrix)
    );

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "projectionMatrix"),
        false,
        flatten(projectionMatrix)
    );

    // Generate breather surface vertices
    setupBreather();
    setupVerticesBuffer(vertices);

    if (currentShaderType != ShaderTypes.WIREFRAME) {
        setupNormalsBuffer(normals);
    }

    if (!isEnvMappingOn) {
        setupColorsBuffer(colors);
    }

    gl.enable(gl.DEPTH_TEST);

    // set initial shading as gourard shading
    if (currentShaderType == ShaderTypes.GOURAUD) {
        setGourardShading();
    } else if (currentShaderType == ShaderTypes.PHONG) {
        setPhongShading();
    }

    // render new version of the breather
    if (!isEnvMappingOn) render();
}

window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    canvasHeight = canvas.height;
    canvasWidth = canvas.width;

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();

    // gl.enable(gl.CULL_FACE);
    // gl.frontFace(gl.BACK);

    //
    //  Load shaders and initialize attribute buffers
    //
    setProgramWithShaders(ShaderTypes.PHONG);

    instanceMatrix = mat4();

    projectionMatrix = ortho(
        -ORTHO_VAR,
        ORTHO_VAR,
        -ORTHO_VAR,
        ORTHO_VAR,
        -ORTHO_VAR,
        ORTHO_VAR
    );

    modelViewMatrix = mat4();

    var transformM = mat4();
    transformM = mult(transformM, rotate(ROTATEY_DEGREE, 0, 1, 0));
    transformM = mult(transformM, rotate(ROTATEZ_DEGREE, 0, 0, 1));

    modelViewMatrix = mult(modelViewMatrix, transformM);

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "modelViewMatrix"),
        false,
        flatten(modelViewMatrix)
    );

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "projectionMatrix"),
        false,
        flatten(projectionMatrix)
    );

    initSliders();
    initButtons();

    // Generate breather surface vertices
    setupBreather();
    setupVerticesBuffer(vertices);
    setupNormalsBuffer(normals);
    setupColorsBuffer(colors);

    gl.enable(gl.DEPTH_TEST);

    // set initial shading as gourard shading
    if (currentShaderType == ShaderTypes.GOURAUD) {
        setGourardShading();
    } else if (currentShaderType == ShaderTypes.PHONG) {
        setPhongShading();
    }

    gl.uniformMatrix4fv(
        gl.getUniformLocation(program, "projectionMatrix"),
        false,
        flatten(projectionMatrix)
    );

    render();
};

function setupBreather() {
    vertices = [];
    normals = [];
    colors = [];

    var breatherSurface = generateBreatherVertices2(
        AA,
        U_INCREMENT,
        V_INCREMENT,
        U_MAX,
        V_MAX
    );

    vertices = breatherSurface.vertices;
    normals = breatherSurface.normals;

    // Generate colors for the vertices
    for (var i = 0; i < vertices.length; i++) {
        colors.push(vec4(0.8, 0.0, 0.0, 1.0));
        continue;

        if ((i + 1) % 2 == 0) {
            colors.push(vec4(0.0, 0.0, 0.0, 1.0));
        } else if ((i + 1) % 3 == 0) {
            colors.push(vec4(1.0, 0.0, 0.0, 1.0));
        } else if ((i + 1) % 5 == 0) {
            colors.push(vec4(1.0, 1.0, 1.0, 1.0));
        } else {
            colors.push(vec4(0.0, 0.0, 1.0, 1.0));
        }
    }
}

function clearBuffer(buffer) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten([]), gl.STATIC_DRAW);
}

function setupAndDrawBreather() {
    // CLEAR VERTICES, NORMALS AND COLORS HERE
    clearBuffer(vBuffer);
    clearBuffer(cBuffer);
    clearBuffer(nBuffer);

    vBuffer = gl.createBuffer();
    cBuffer = gl.createBuffer();
    nBuffer = gl.createBuffer();

    setupBreather();
    setupVerticesBuffer(vertices);

    if (currentShaderType != ShaderTypes.WIREFRAME) {
        setupNormalsBuffer(normals);
    }

    if (!isEnvMappingOn) {
        setupColorsBuffer(colors);
    }
}

var render = function () {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Enable depth testing
    gl.enable(gl.DEPTH_TEST);

    if (currentShaderType == ShaderTypes.WIREFRAME) {
        gl.drawArrays(gl.LINE_STRIP, 0, vertices.length);
    } else {
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertices.length);
    }
};
