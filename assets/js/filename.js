const navigation = require('./navigation.js')
const scroller = require('./scroller.js')
const chooseProduct = require('./chooseProduct.js')
const fs = require('fs');
const path = require('path')
const homedir = require('os').homedir();
var goodFileNameFromTraffic = '';

let filenameButton = document.getElementById("fileName_textInputButton");
filenameButton.addEventListener('click', () => {
    preliminaryFilenameCheck()
})

let deleteDupButton = document.getElementById("fileName_removeFolderButton");
deleteDupButton.disabled = true;
deleteDupButton.addEventListener('click', () => {
    deleteDuplicateFolder();
})

deleteDupButton.disabled = true;
function deleteDuplicateFolder() {
    fs.rmdir(destFolder, { recursive: true }, (err) => {
        if (err) {
            console.log("error " + err);
        }

        console.log(`${destFolder} is deleted!`);
        document.getElementById("fileName_removeFolderButton").disabled = true;
    });

}

function getGoodFileNameFromTraffic() {
    return goodFileNameFromTraffic;
}
// run when check filename button is clicked
function preliminaryFilenameCheck() {

    // clear all divs from 
    el = document.getElementById("statusHolder__checksContainer");
    while (el.firstChild) el.removeChild(el.firstChild);

    // get text from input box
    let myText = document.getElementById("fileName_textInput").value

    // create heading
    var obj = chooseProduct.getObjectClicked();
    if (obj.format == 'e') {
        navigation.createCheck(false, "Elevator Filename", true)
    }
    else {
        navigation.createCheck(false, "L+P Filename Checks", true)
    }
    var doIt = true;

    const bannedCharactersArray = [" ", "__", "-"]
    let charErrorCount = 0;
    bannedCharactersArray.forEach(element => {
        if (myText.includes(element)) {
            charErrorCount++;
        }

    })
    if (charErrorCount > 0) {
        doIt = false;
        navigation.createCheck(true, "banned char found, " + bannedCharactersArray, false)
    }
    else {
        navigation.createCheck(false, "no banned chars found", false)
    }

    // make sure filenameIdentifier is there
    // required strings [filenameidentifier, [_us_, _fr_, _ca_]]
    if (!myText.includes(obj.filenameIdentifier)) {
        doIt = false;
        navigation.createCheck(true, obj.filenameIdentifier + " missing", false)
    }
    else {
        navigation.createCheck(false, obj.filenameIdentifier + " found", false)
    }
    // last 3 characters
    const compareArray = obj.lastCharacters
    console.log("compareArray = " + compareArray)
    const numCharacters = (compareArray[0].length) * -1
    const fnLast = myText.slice(numCharacters)
    if (compareArray.includes(fnLast)) {
        navigation.createCheck(false, " ends with " + fnLast, false)
    }
    else {
        doIt = false;
        navigation.createCheck(true, "suffix not in " + compareArray, false)
    }
    console.log(fnLast)



    // check the number of underscores
    let a = myText.split("_")
    let aLength = a.length;

    let underscorsExpectded = parseInt(obj.underscores);
    let underscoresReceived = aLength - 1;

    if (underscorsExpectded != underscoresReceived) {
        doIt = false;
        navigation.createCheck(true, underscorsExpectded + " ' _ ' expected but " + underscoresReceived + " received", false)
    }
    else {
        navigation.createCheck(false, "correct number of ' _ ' " + underscorsExpectded, false)
    }

    // check if folder already exists


    destFolder = path.join(homedir, '/Downloads/', myText);
    if (fs.existsSync(destFolder)) {
        // Do something
        console.log("path exists")
        doIt = false;
        document.getElementById("fileName_removeFolderButton").disabled = false;
    }
    else {
        console.log("path does not exist")
    }


    if (doIt) {
        goodFileNameFromTraffic = myText;

        // all good
        scroller.fwdButton.disabled = false;
        // update breadcrumbs
        navigation.breadcrumbArray[2] = '<b>' + myText + '</b>';
        navigation.manageBreadcrumbs();



        let filenameArray = myText.split("_")
        if (obj.format == 'e') {
            chooseProduct.adElevator.trafficFilename = myText;
            chooseProduct.adElevator.client = filenameArray[0];
            chooseProduct.adElevator.descriptor = filenameArray[2];
            chooseProduct.adElevator.filenameCheckOK = true;
            chooseProduct.adElevator.lowerCaseFilename = myText.toLowerCase();
            chooseProduct.adElevator.htmlFileName = (myText + '.html').toLowerCase();
            chooseProduct.adElevator.manifestFileName = myText + '.manifest'
        }
        else {
            chooseProduct.adLandscape.trafficFilename = myText;
            chooseProduct.adLandscape.client = filenameArray[0];
            chooseProduct.adLandscape.descriptor = filenameArray[2];
            chooseProduct.adLandscape.filenameCheckOK = true;
            chooseProduct.adLandscape.lowerCaseFilename = myText.toLowerCase();
            chooseProduct.adLandscape.htmlFileName = (myText + '.html').toLowerCase();
            chooseProduct.adLandscape.manifestFileName = myText + '.manifest'

            chooseProduct.adPortrait.trafficFilename = myText;
            chooseProduct.adPortrait.client = filenameArray[0];
            chooseProduct.adPortrait.descriptor = filenameArray[2];
            chooseProduct.adPortrait.filenameCheckOK = true;
            chooseProduct.adPortrait.lowerCaseFilename = myText.toLowerCase();
            chooseProduct.adPortrait.htmlFileName = (myText + '.html').toLowerCase();
            chooseProduct.adPortrait.manifestFileName = myText + '.manifest'

        }
    }
}

exports.getGoodFileNameFromTraffic = getGoodFileNameFromTraffic;