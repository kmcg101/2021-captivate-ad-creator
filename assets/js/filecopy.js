const fs = require('fs');
const util = require('util')
const path = require('path')
const homedir = require('os').homedir();
const navigation = require('./navigation.js')
const filename = require('./filename.js')
const chooseProduct = require('./chooseProduct.js')
let destFolder = null;
// for testing
const sourceDir = path.join(homedir, '/htmlStockFiles/')
// for production
// const sourceDir = path.join(__dirname, '..', 'htmlStockFiles')

function promiseMakeFolderFunction(dirName) {

    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data
        fs.mkdir(dirName, (err) => {
            if (err) {
                reject("error making folder " + err)
            }
            else {
                resolve("mkdir complete")
            }
        });
    })
}
function promiseCopyFileFunction(fromLoc, toLoc) {

    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data
        fs.copyFile(fromLoc, toLoc, (err) => {
            if (err) {
                reject("error copying " + err)
            }
            else {
                resolve("copy complete")
            }
        });
    })
}

function promiseOpenFileFunction(fileToOpen) {

    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data
        fs.readFile(fileToOpen, 'utf8', function (err, data) {

            if (err) {
                reject("error opening file " + err)
            }
            else {
                resolve(data)
            }
        });
    })
}
function promiseWriteFileFunction(fileToWrite, result) {

    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data
        fs.writeFile(fileToWrite, result, 'utf8', function (err) {
            if (err) {
                reject("error copying " + err)
            }
            else {
                resolve("copy complete")
            }
        });
    })
}
function promiseRenameFileFunction(fileToRename, newName) {

    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data
        fs.rename(fileToRename, newName, function (err) {

            if (err) {
                reject("error renaming " + err)
            }
            else {
                resolve("rename complete")
            }
        });
    })
}


const goButton = document.getElementById('goButton');

goButton.addEventListener('click', () => {
    beginFileCopy2();
})



function beginFileCopy2() {

    // clear check area
    navigation.clearChecksArea();

    const obj = chooseProduct.getObjectClicked();
    const fn = filename.getGoodFileNameFromTraffic();
    destFolder = path.join(homedir, '/Downloads/', fn);

    const myFileH = (obj.stockFileNamePrefix + '.html');
    const sourcePathH = path.join(sourceDir, myFileH)

    const baseName = obj.stockManifestFile;
    const myFileM = (baseName + '.manifest');
    const sourcePathM = path.join(sourceDir, myFileM)

    var sourceMediaType = "_image"
    if (chooseProduct.adElevator.mediaExtension == 'mp4' || chooseProduct.adLandscape.mediaExtension == 'mp4') {
        sourceMediaType = '_video'
    }
    const mediaFileE = (chooseProduct.adElevator.mediaFilename);
    const mediaFileL = (chooseProduct.adLandscape.mediaFilename);
    const mediaFileP = (chooseProduct.adPortrait.mediaFilename);

    // what HTML file gets renamed to
    let htmlFileFullPath;
    if (obj.format == 'e') {
        htmlFileFullPath = path.join(destFolder, chooseProduct.adElevator.htmlFileName)
    }
    else {
        htmlFileFullPath = path.join(destFolder, chooseProduct.adLandscape.htmlFileName)
    }

    // what manifest file gets renamed to
    let manifestFileFullPath
    if (obj.format == 'e') {
        manifestFileFullPath = path.join(destFolder, chooseProduct.adElevator.manifestFileName);
    }
    else {
        manifestFileFullPath = path.join(destFolder, chooseProduct.adLandscape.manifestFileName);
    }

    // start the whole thing
    promiseMakeFolderFunction(destFolder)

        .then((response) => {
            navigation.createCheck(false, "folder created", false)
            // copy HTML file
            //return promiseCopyFileFunction(sourcePathH, destPathH);
            return promiseCopyFileFunction(sourcePathH, htmlFileFullPath);
            
        })

        .then((response) => {
            // HTML file copied successfully
            navigation.createCheck(false, "HTML file copied and renamed", false)

            // Open HTML file
            return promiseOpenFileFunction(htmlFileFullPath)
        })
        .then((data) => {
            // HTML file open.  Now do search and replace

            navigation.createCheck(false, "HTML file opened", false)
            if (obj.format == 'e') {
                result = data.replace(/sourceXXX/g, chooseProduct.adElevator.lowerCaseFilename)
                    .replace(/sourceMediaExt/g, chooseProduct.adElevator.mediaExtension);
            }
            else if (obj.format == 'lp' && obj.numberMediaFiles == 1) {
                // landscape and portrait but using the same file for both
                result = data.replace(/sourceXXX/g, chooseProduct.adLandscape.lowerCaseFilename)
                    .replace(/sourceMediaExt/g, chooseProduct.adLandscape.mediaExtension);
            }
            else {
                // landscape and portrait
                result = data.replace(/sourceXXX/g, chooseProduct.adLandscape.lowerCaseFilename)
                    .replace(/sourceMediaExtL/g, chooseProduct.adLandscape.mediaExtension)
                    .replace(/sourceMediaExtP/g, chooseProduct.adPortrait.mediaExtension);
            }
            return promiseWriteFileFunction(htmlFileFullPath, result);
        })
      
        ////////////////////////////////////////////
        ////////////////////////////////////////////
        ////////////////////////////////////////////

        .then((data) => {
            navigation.createCheck(false, "HTML file written", false)
            // copy Manifest file
            return promiseCopyFileFunction(sourcePathM, manifestFileFullPath);
        })

        .then((response) => {
            // Manifest file copied successfully
            navigation.createCheck(false, "Manifest file copied and renamed", false)

            // Open Manifest file
            return promiseOpenFileFunction(manifestFileFullPath)
        })

        .then((data) => {
            // Manifest file open.  Now do search and replace
            navigation.createCheck(false, "Manifest file opened", false)

            var result;
            if (obj.format == 'e') {
                result = data.replace(/sourceXXX/g, chooseProduct.adElevator.lowerCaseFilename)
                    .replace(/sourceMediaExt/g, chooseProduct.adElevator.mediaExtension)
                    .replace(/sourceMediaType/g, sourceMediaType);

            }
            else if (obj.format == 'lp' && obj.numberMediaFiles == 1) {
                // landscape and portrait but using the same file for both
                result = data.replace(/sourceXXX/g, chooseProduct.adLandscape.lowerCaseFilename)
                    .replace(/sourceMediaExtL/g, chooseProduct.adLandscape.mediaExtension)
                    .replace(/sourceMediaType/g, sourceMediaType);

            }
            else {
                // landscape and portrait
                result = data.replace(/sourceXXX/g, chooseProduct.adLandscape.lowerCaseFilename)
                    .replace(/sourceMediaExtL/g, chooseProduct.adLandscape.mediaExtension)
                    .replace(/sourceMediaExtP/g, chooseProduct.adPortrait.mediaExtension)
                    .replace(/sourceMediaType/g, sourceMediaType);
            }
            // write Manifest file
            return promiseWriteFileFunction(manifestFileFullPath, result);
        })
        
        ////////////////////////////////////////////
        ////////////////////////////////////////////
        ////////////////////////////////////////////
        
        .then((data) => {
            // Manifest file renamed
            navigation.createCheck(false, "Manifest file written", false)

            if (mediaFileE != null) {
                // copy and rename in one step
                const sourcePathMediaE = path.join(path.dirname(chooseProduct.adElevator.fullMediaPath.path), mediaFileE)
                const newMediaFileNameE = path.join(destFolder, chooseProduct.adElevator.lowerCaseFilename + sourceMediaType + "." + chooseProduct.adElevator.mediaExtension);
    
                return promiseCopyFileFunction(sourcePathMediaE, newMediaFileNameE);
            }
        })

        .then((data) => {
            navigation.createCheck(false, "E Media file processed", false)
            if (mediaFileL != null) {
                // copy and rename in one step
                var sourceMediaTypeL = "_l_image"
                if (chooseProduct.adLandscape.mediaExtension == 'mp4') {
                    sourceMediaTypeL = '_l_video'
                }
                const sourcePathMediaL = path.join(path.dirname(chooseProduct.adLandscape.fullMediaPath.path), mediaFileL)
                const newMediaFileNameL = path.join(destFolder, chooseProduct.adLandscape.lowerCaseFilename + sourceMediaTypeL + "." + chooseProduct.adLandscape.mediaExtension);
    
                return promiseCopyFileFunction(sourcePathMediaL, newMediaFileNameL);
            }
        })
        
        .then((data) => {
            navigation.createCheck(false, "L Media file processed", false)
            if (mediaFileP != null) {
                var sourceMediaTypeP = "_p_image"
                if (chooseProduct.adLandscape.mediaExtension == 'mp4') {
                    sourceMediaTypeP = '_p_video'
                }
                const sourcePathMediaP = path.join(path.dirname(chooseProduct.adPortrait.fullMediaPath.path), mediaFileP)
                const newMediaFileNameP = path.join(destFolder, chooseProduct.adPortrait.lowerCaseFilename + sourceMediaTypeP + "." + chooseProduct.adPortrait.mediaExtension);
               
                return promiseCopyFileFunction(sourcePathMediaP, newMediaFileNameP);
            }
        })
        .then((data) => {
            navigation.createCheck(false, "P Media file processed", false)
        })

        // If promise gets rejected 
        .catch(err => {
            navigation.createCheck(true, "error caught" + err, false)
            console.log(`Error occurs,  
        Error code -> ${err.code}, 
        Error No -> ${err.errno}`)
        })
}

exports.goButton = goButton;