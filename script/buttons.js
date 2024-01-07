var envMapCheckbox;
var envOptionDropDown;
var textCurrent;

function initShaderButtons() {
    document.getElementById("wireframe").addEventListener("click", () => {
        disableCheckboxAndDropDown();
        setProgramWithShadersFromButtons(ShaderTypes.WIREFRAME);
        updateCurrentText();
    });

    document.getElementById("gouraud").addEventListener("click", () => {
        if (currentShaderType == ShaderTypes.WIREFRAME) {
            enableCheckboxAndDropDown();
        }
        setProgramWithShadersFromButtons(ShaderTypes.GOURAUD);
        updateCurrentText();
    });

    document.getElementById("phong").addEventListener("click", () => {
        if (currentShaderType == ShaderTypes.WIREFRAME) {
            enableCheckboxAndDropDown();
        }
        setProgramWithShadersFromButtons(ShaderTypes.PHONG);
        updateCurrentText();
    });
}

function initEnvCheckboxAndDropDown() {
    envMapCheckbox = document.getElementById("env-map");
    envMapCheckbox.addEventListener("change", (event) => {
        if (event.target.checked) {
            isEnvMappingOn = true;
        } else {
            isEnvMappingOn = false;
        }
        setProgramWithShadersFromButtons(currentShaderType);
    });

    envOptionDropDown = document.getElementById("env-opt-dropdown");
    envOptionDropDown.addEventListener("change", () => {
        var selectedOption =
            envOptionDropDown.options[envOptionDropDown.selectedIndex].value;

        if (selectedOption == "option1") {
            envMapSrc = envMapParent + envOption1;
        } else if (selectedOption == "option2") {
            envMapSrc = envMapParent + envOption2;
        } else if (selectedOption == "option3") {
            envMapSrc = envMapParent + envOption3;
        }

        setProgramWithShadersFromButtons(currentShaderType);
    });
}

function updateCurrentText() {
    textCurrent = document.getElementById("current-shading");
    textCurrent.innerHTML = `&nbsp;  ${capitalize(currentShaderType)}`;
}

function disableCheckboxAndDropDown() {
    isEnvMappingOn = false;

    envMapCheckbox.disabled = true;
    envMapCheckbox.parentNode.style.opacity = "0.5";
    envMapCheckbox.parentNode.style.cursor = "not-allowed";

    envMapCheckbox.checked = false;
    envMapCheckbox.parentNode.style.backgroundColor = "transparent";

    envOptionDropDown.disabled = true;
    envOptionDropDown.parentNode.style.opacity = "0.5";
    envOptionDropDown.parentNode.style.cursor = "not-allowed";
}

function enableCheckboxAndDropDown() {
    envMapCheckbox.disabled = false;
    envMapCheckbox.parentNode.style.opacity = "1";
    envMapCheckbox.parentNode.style.cursor = "pointer";

    envOptionDropDown.disabled = false;
    envOptionDropDown.parentNode.style.opacity = "1";
    envOptionDropDown.parentNode.style.cursor = "pointer";
}

function initButtons() {
    initShaderButtons();
    initEnvCheckboxAndDropDown();
    updateCurrentText();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
