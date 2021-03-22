const navigation = require('./navigation.js')
const dropzone = require('./dropzone.js')
const chooseProduct = require('./chooseProduct.js')
let previousStep = 0;
let currentStep = 1;

let fwdButton = document.getElementById("fwdButton")
let backButton = document.getElementById("backButton")

fwdButton.addEventListener('click', () => {
    scrollItAnimate(1);
})
backButton.addEventListener('click', () => {
    scrollItAnimate(0);
})

backButton.disabled = true;
fwdButton.disabled = true;

let scrollItAnimate = (dir) => {
    // 0 = back, 1 = fwd
    if (dir == 0) {
        // hide go button
        document.querySelector('#goButton').style.display = 'none';

        if (currentStep != 4) {
            navigation.breadcrumbArray[currentStep - 1] = navigation.breadcrumbArrayBackup[currentStep - 1]
        }

        navigation.breadcrumbArray[currentStep - 2] = navigation.breadcrumbArrayBackup[currentStep - 2]
        navigation.manageBreadcrumbs();
    }
    const target = document.getElementById("scrollContainer");

    previousStep = currentStep
    if (dir == 0) {
        currentStep--
    }
    else {
        currentStep++
    }
    if (currentStep == 2) {
        clearStatusArea();
        navigation.clearChecksArea()
    }
    else if (currentStep == 3) {
        // update ad instances
        chooseProduct.adElevator.clearFilenameProperties();
        chooseProduct.adLandscape.clearFilenameProperties();
        chooseProduct.adPortrait.clearFilenameProperties();
    }
    else if (currentStep == 4) {
        navigation.clearChecksArea()
        // clear drop properties from all ad instances
        let adArray = [chooseProduct.adElevator, chooseProduct.adLandscape, chooseProduct.adPortrait]
        adArray.forEach(element => element.clearMediaDropProperties());
        dropzone.resetAllDropSources();

    }
    // move it
    const screenWidth = 640;
    currentX = (previousStep - 1) * (-screenWidth)
    destX = (currentStep - 1) * (-screenWidth)
    currentXstring = currentX + 'px'
    destXstring = destX + 'px'
    target.animate([
        { left: currentXstring },
        { left: destXstring },

    ], {
        duration: 500,
        easing: 'ease-out',
        iterations: 1,
        fill: 'forwards'
    })

    buttonVisibilityCheck();
}
let buttonVisibilityCheck = () => {
    fwdButton.disabled = true;
    if (currentStep == 1) {
        backButton.disabled = true;
    }
    else {
        backButton.disabled = false;
    }
}
let clearStatusArea = () => {
    // clear existing divs
    elL = document.getElementById("statusHolder__statusContainerL");
    while (elL.firstChild) elL.removeChild(elL.firstChild);
    elR = document.getElementById("statusHolder__statusContainerR");
    while (elR.firstChild) elR.removeChild(elR.firstChild);

    // and clear filename input
    const target = document.querySelector('#fileName_textInput');
    target.value = "";
}


buttonVisibilityCheck();

exports.fwdButton = fwdButton;
exports.backButton = backButton;
exports.buttonVisibilityCheck = buttonVisibilityCheck;