
const fs = require('fs');
const path = require('path')

let breadcrumbArrayBackup = ["", "", ""];
let breadcrumbArray = ["", "", ""];

/*
add CSS, button group so e and lp buttons stay down
search replace, rename

1.6 3/4/2021
Included stock files in app bundle

git remote add origin https://github.com/kmcg101/2021-captivate-ad-creator.git
git branch -M main
git push -u origin main

*/

manageBreadcrumbs();

//npm run package-mac

const dropzone = require('./dropzone.js')
const scroller = require('./scroller.js')
const filename = require('./filename.js')
const chooseProduct = require('./chooseProduct.js')

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
function populateStatus() {

    // clear existing divs
    elL = document.getElementById("statusHolder__statusContainerL");
    while (elL.firstChild) elL.removeChild(elL.firstChild);
    elR = document.getElementById("statusHolder__statusContainerR");
    while (elR.firstChild) elR.removeChild(elR.firstChild);

    let obj = chooseProduct.getObjectClicked();
    // get pieces:  
    let filenameArray = document.getElementById("fileName_textInput").value.split("_")

    let statusArray = ["format", "client", "identifier", "ad type", "time", "number of files", "video or image?"]
    let statusArrayR = [filenameArray[1].charAt(0), filenameArray[0], filenameArray[2], filenameArray[1].slice(3), filenameArray[1].substring(1, 3), obj.numberMediaFiles, obj.mediaType]
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

exports.createCheck = createCheck;
exports.clearChecksArea = clearChecksArea;

exports.breadcrumbArray = breadcrumbArray;
exports.breadcrumbArrayBackup = breadcrumbArrayBackup;
exports.manageBreadcrumbs = manageBreadcrumbs;











