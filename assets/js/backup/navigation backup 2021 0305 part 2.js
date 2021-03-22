
const fs = require('fs');
const path = require('path')
var myJSON;
let objectClicked = {};

let breadcrumbArrayBackup = ["", "", ""];

let breadcrumbArray = ["", "", ""];

/*
add CSS, button group so e and lp buttons say down
add chained promises for file copy, search replace, rename

1.6 3/4/2021
Included stock files in app bundle

*/

loadAllButtons();
manageBreadcrumbs();

//npm run package-mac

var Advertisement = require('./Advertisement');
var adElevator = new Advertisement("Elevator Ad", 'e')
var adLandscape = new Advertisement("Landscape Ad", 'l')
var adPortrait = new Advertisement("Portrait Ad", 'p')

const dropzone = require('./dropzone.js')
const scroller = require('./scroller.js')
const filename = require('./filename.js')


let eButton = document.getElementById("startElevator")
let lpButton = document.getElementById("startLandscapePortrait")


eButton.addEventListener('click', () => {
    showElevatorProductButtons()
    scroller.fwdButton.disabled = false;
});
lpButton.addEventListener('click', () => {
    showLandscapeAndPortraitProductButtons()
    scroller.fwdButton.disabled = false;

});


let getObjectClicked = () => {
    return objectClicked
}

let clearChecksArea = () => {
    elChecks = document.getElementById("statusHolder__checksContainer");
    while (elChecks.firstChild) elChecks.removeChild(elChecks.firstChild);
}

function manageBreadcrumbs(dir) {
    // 0=back, 1=fwd
    const target = document.getElementById('breadcrumbs');
    target.innerHTML = "";
    breadcrumbArray.forEach(element => {
        let txt1 = target.innerHTML
        let txt2 = element + " "
        let txt3 = txt1.concat(txt2)
        target.innerHTML = txt3;
    });
}

let showElevatorProductButtons = () => {
    breadcrumbArray[0] = ("<b>Elevator</b> >");
    manageBreadcrumbs();
    let eTarget = document.getElementById("productButtons__eButtons");
    let lpTarget = document.getElementById("productButtons__lpButtons");
    eTarget.classList.add('showELPDiv');
    eTarget.classList.remove('hideELPDiv');

    lpTarget.classList.remove('showELPDiv');
    lpTarget.classList.add('hideELPDiv');
}

let showLandscapeAndPortraitProductButtons = () => {
    breadcrumbArray[0] = ("<b>Landscape and Portrait</b> >");
    manageBreadcrumbs();
    let eTarget = document.getElementById("productButtons__eButtons");
    let lpTarget = document.getElementById("productButtons__lpButtons");
    lpTarget.classList.add('showELPDiv');
    lpTarget.classList.remove('hideELPDiv');

    eTarget.classList.remove('showELPDiv');
    eTarget.classList.add('hideELPDiv');
}

function loadAllButtons() {
    let eTarget = document.getElementById("productButtons__eButtons");
    let lpTarget = document.getElementById("productButtons__lpButtons");
    eTarget.classList.add('hideELPDiv');
    lpTarget.classList.add('hideELPDiv');

    // get JSON
    const jsonPath = path.join(__dirname, "../json/buttons.json");
    fs.readFile(jsonPath, function (err, data) {

        // Check for errors 
        if (err) throw err;

        // Convert to JSON 
        myJSON = JSON.parse(data);
        loadAllButtons2();
    });
}

function loadAllButtons2() {

    let numButtons = Object.keys(myJSON.Buttons).length;

    for (var i = 0; i < numButtons; i++) {
        let eTarget = document.getElementById("productButtons__eButtons");
        let lpTarget = document.getElementById("productButtons__lpButtons");
        let but = document.createElement('button');

        but.className = 'elpButton';
        but.classList.add('buttonNotClicked');
        but.type = 'button';
        but.innerHTML = myJSON.Buttons[i].product
        but.id = myJSON.Buttons[i].key
        but.index = i
        but.onclick = function () {
            objectClicked = myJSON.Buttons[this.index]
            buttonClicked();
        }
        if (myJSON.Buttons[i].format == 'e') {
            eTarget.appendChild(but);
        }
        else {
            lpTarget.appendChild(but);
        }

    }
}
function buttonClicked() {
    // when clicking product buttons, step 2
    breadcrumbArray[1] = '<b>' + objectClicked.productFullName + '</b> >';
    manageBreadcrumbs();

    // hide appropriate dropzone
    if (objectClicked.format == 'e') {
        // hide l and p
        let t1 = document.querySelector('#dropzone__l');
        t1.style.display = 'none';
        let t2 = document.querySelector('#dropzone__p');
        t2.style.display = 'none';
    }
    else if (objectClicked.numberMediaFiles == '1') {
        // if just L
        let t1 = document.querySelector('#dropzone__e');
        t1.style.display = 'none';
        let t2 = document.querySelector('#dropzone__p');
        t2.style.display = 'none';
    }
    else {
        // if l and p
        let t1 = document.querySelector('#dropzone__e');
        t1.style.display = 'none';
    }

    scroller.fwdButton.disabled = false;

    destDiv = document.getElementById("filename__example_dyn");
    destDiv.innerHTML = objectClicked.exampleSyntax;

    dropzone.resetDropzones();
    if (objectClicked.format == 'e') {
        resizeSizeDiv('e')
    }
    else if (objectClicked.format == 'lp' && objectClicked.numberMediaFiles == 1) {
        resizeSizeDiv('l');
    }
    else if (objectClicked.format == 'lp') {
        resizeSizeDiv('l');
        resizeSizeDiv('p');
    }
    setAdvertisementPropertiesButton();
}
// divInit = e,l,p string
function resizeSizeDiv(divInit) {

    let e = document.getElementById('dropzone__' + divInit)
    e.style.display = 'block'

    let t = document.getElementById('dropzone__size_' + divInit);
    t.style.display = 'block';
    let divHeight = e.clientHeight;
    let divWidth = e.clientWidth;

    var imageWidth = parseInt(objectClicked.lWidth);
    var imageHeight = parseInt(objectClicked.lHeight);

    var screenWidth = 1280;
    var screenHeight = 720;
    if (divInit == 'e') {
        screenWidth = 640;
        screenHeight = 480;
        imageWidth = parseInt(objectClicked.eWidth);
        imageHeight = parseInt(objectClicked.eHeight);
    }
    else if (divInit == 'p') {
        screenWidth = 768;
        screenHeight = 1020;
        imageWidth = parseInt(objectClicked.pWidth);
        imageHeight = parseInt(objectClicked.pHeight);
    }

    let setHeight = (imageHeight / screenHeight) * divHeight;
    let setWidth = (imageWidth / screenWidth) * divWidth;

    let tWidth = setWidth + "px";
    let tHeight = setHeight + "px";
    t.style.width = tWidth
    t.style.height = tHeight

    if (divInit == 'p') {
        t.style.width = tWidth;
        t.style.height = tHeight;
    }
}




function populateStatus() {

    // clear existing divs
    elL = document.getElementById("statusHolder__statusContainerL");
    while (elL.firstChild) elL.removeChild(elL.firstChild);
    elR = document.getElementById("statusHolder__statusContainerR");
    while (elR.firstChild) elR.removeChild(elR.firstChild);


    // get pieces:  
    let filenameArray = document.getElementById("fileName_textInput").value.split("_")

    let statusArray = ["format", "client", "identifier", "ad type", "time", "number of files", "video or image?"]
    let statusArrayR = [filenameArray[1].charAt(0), filenameArray[0], filenameArray[2], filenameArray[1].slice(3), filenameArray[1].substring(1, 3), objectClicked.numberMediaFiles, objectClicked.mediaType]
    let statusParentL = document.getElementById("statusHolder__statusContainerL");
    let statusParentR = document.getElementById("statusHolder__statusContainerR");

    for (var i = 0; i < statusArray.length; i++) {
        let newStatusLabel = document.createElement("div");
        newStatusLabel.classList.add("statusHolder__statusLabel")
        newStatusLabel.innerHTML = statusArray[i]
        statusParentL.appendChild(newStatusLabel);

        let newStatus = document.createElement("div");
        newStatus.classList.add("statusHolder__status")
        newStatus.innerHTML = statusArrayR[i]
        statusParentR.appendChild(newStatus);
    }
}

let createCheck = (bad, txt, justLabel) => {
    populateStatus();
    // turn off fwd button if error
    if (bad) {
        scroller.buttonVisibilityCheck();
    }

    // where is the new div going?
    checkParent = document.getElementById("statusHolder__checksContainer");

    // create the new single line and drop it into the parent
    let newCheck = document.createElement("div");
    newCheck.classList.add("statusHolder__errorHolder");
    checkParent.appendChild(newCheck);

    if (!justLabel) {

        // drop in either an x box or a check box
        if (bad) {
            let newXbox = document.createElement("div");
            newXbox.classList.add("statusHolder__xHolder");
            newCheck.appendChild(newXbox);
        }
        else {
            let newCheckBox = document.createElement("div");
            newCheckBox.classList.add("statusHolder__checkHolder");
            newCheck.appendChild(newCheckBox);
        }
    }

    // then drop in a text box
    let newTextBox = document.createElement("div");
    if (!justLabel) {
        newTextBox.classList.add("statusHolder__errorHolder");
    }
    else {
        newTextBox.classList.add("statusHolder__label");
    }

    newTextBox.innerHTML = txt;
    newCheck.appendChild(newTextBox);

}

function setAdvertisementPropertiesButton() {
    // clear all button properties for all 3 objects
    let adArray = [adElevator, adLandscape, adPortrait]
    adArray.forEach(element => element.clearButtonProperties());

    //htmlFileName = null
    //manifestFileName = null;

    // elevator
    if (objectClicked.format == 'e') {
        adElevator.product = objectClicked.productKey;
        adElevator.time = objectClicked.time;
        adElevator.mediaType = objectClicked.mediaType;
        adElevator.mediaWidth = objectClicked.eWidth;
        adElevator.mediaHeight = objectClicked.eHeight;
        adElevator.mediaSize = objectClicked.eSize;

        if (adElevator.mediaType == 'video') {
            adElevator.videoFPS = objectClicked.mediaFPS;
            adElevator.videoCodec = objectClicked.mediaCodec;
            adElevator.videoDuration = objectClicked.time;
        }
        adElevator.activeForThisProject = true;
    }
    else {
        adLandscape.product = objectClicked.productKey;
        adLandscape.time = objectClicked.time;
        adLandscape.mediaType = objectClicked.mediaType;
        adLandscape.mediaWidth = objectClicked.lWidth;
        adLandscape.mediaHeight = objectClicked.lHeight;
        adLandscape.mediaSize = objectClicked.lSize;

        if (adLandscape.mediaType == 'video') {
            adLandscape.videoFPS = objectClicked.mediaFPS;
            adLandscape.videoCodec = objectClicked.mediaCodec;
            adLandscape.videoDuration = objectClicked.time;
        }
        adLandscape.activeForThisProject = true;

        adPortrait.product = objectClicked.productKey;
        adPortrait.time = objectClicked.time;
        adPortrait.mediaType = objectClicked.mediaType;
        adPortrait.mediaWidth = objectClicked.pWidth;
        adPortrait.mediaHeight = objectClicked.pHeight;
        adPortrait.mediaSize = objectClicked.pSize;

        if (adPortrait.mediaType == 'video') {
            adPortrait.videoFPS = objectClicked.mediaFPS;
            adPortrait.videoCodec = objectClicked.mediaCodec;
            adPortrait.videoDuration = objectClicked.time;
        }
        adPortrait.activeForThisProject = true;
    }
}

exports.createCheck = createCheck;
exports.clearChecksArea = clearChecksArea;
exports.adElevator = adElevator;
exports.adLandscape = adLandscape;
exports.adPortrait = adPortrait;
exports.getObjectClicked = getObjectClicked;


exports.breadcrumbArray = breadcrumbArray;
exports.breadcrumbArrayBackup = breadcrumbArrayBackup;
exports.manageBreadcrumbs = manageBreadcrumbs;

exports.objectClicked = objectClicked;









