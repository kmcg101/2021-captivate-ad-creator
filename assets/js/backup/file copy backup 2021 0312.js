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

function myPromiseFunction(dirName) {
    return new Promise((resolve, reject) => {
        // do some stuff here!  like go get data
        destFolder = path.join(homedir, '/Downloads/', dirName);
        fs.mkdir(destFolder, (err) => {
            // here you evaluate what just happened above and determine
            // if it failed or succeeded
            if (err) {
                reject("error!")
            }
            else {
                resolve("complete!")
            }
        });
    })
}

myPromiseFunction("_newFolder").then((response) => {
    // the resolve goes here
    console.log(response)
    // to chain, you put return first??!!!
    return myPromiseFunction('_newFolder2');
})
    .then((response) => {
        console.log(response)
    })
    .catch(err => {
        // all rejects go here
        console.log("failure from function" + err)
    })







function beginFileCopy2() {

    // clear check area
    navigation.clearChecksArea();

    const obj = chooseProduct.getObjectClicked();
    const makeDir = util.promisify(fs.mkdir)
    //const readDir = util.promisify(fs.readdir) 
    const fn = filename.getGoodFileNameFromTraffic();
    destFolder = path.join(homedir, '/Downloads/', fn);

    makeDir(destFolder)

        .then(() => {
            navigation.createCheck(false, "folder created", false)
            // HTML file
            const myFileH = (obj.stockFileNamePrefix + '.html');
            const sourcePathH = path.join(sourceDir, myFileH)
            const destPathH = path.join(destFolder, myFileH)
            // copy file
            fs.copyFile(sourcePathH, destPathH, (err) => {
                if (err) {
                    console.log("copy error H " + err)
                    navigation.createCheck(true, "HTML file copy error", false)
                }
                // read file
                else {
                    navigation.createCheck(false, "HTML file copied", false)
                    fs.readFile(destPathH, 'utf8', function (err, data) {
                        if (err) {
                            navigation.createCheck(true, "HTML file open error", false)
                            return console.log(err);
                        }
                        // search and replace
                        else {
                            var result;
                            navigation.createCheck(false, "HTML opened", false)
                            if (obj.format == 'e') {
                                console.log("choosing elevator")
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


                            // write file
                            fs.writeFile(destPathH, result, 'utf8', function (err) {
                                if (err) {
                                    return console.log("write H file error " + err);
                                    navigation.createCheck(true, "HTML file write error", false)
                                }
                                // rename file
                                else {
                                    navigation.createCheck(false, "HTML file modified", false)
                                    // rename
                                    let htmlFileFullPath;
                                    if (obj.format == 'e') {
                                        htmlFileFullPath = path.join(destFolder, chooseProduct.adElevator.htmlFileName)
                                    }
                                    else {
                                        htmlFileFullPath = path.join(destFolder, chooseProduct.adLandscape.htmlFileName)
                                    }
                                    fs.rename(destPathH, htmlFileFullPath, function (err) {
                                        if (err) {
                                            navigation.createCheck(true, "HTML file rename error", false)
                                            return console.log("rename H file error " + err);
                                        }
                                        else {
                                            navigation.createCheck(false, "HTML file renamed", false)
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            })
        })

        .then(() => {
            // manifest file
            const myObj = chooseProduct.getObjectClicked();
            const baseName = myObj.stockManifestFile;
            const myFileM = (baseName + '.manifest');
            const sourcePathM = path.join(sourceDir, myFileM)
            const destPathM = path.join(destFolder, myFileM)

            // copy
            fs.copyFile(sourcePathM, destPathM, (err) => {
                if (err) {
                    navigation.createCheck(true, "Manifest file copy error", false)
                    console.log("copy error M" + err)
                }
                else {
                    navigation.createCheck(false, "Manifest file copied", false)
                    // read, search, replace
                    fs.readFile(destPathM, 'utf8', function (err, data) {
                        if (err) {
                            navigation.createCheck(true, "Manifest file read error", false)
                            return console.log("read file error: " + err);
                        }
                        else {
                            navigation.createCheck(false, "Manifest file opened", false)
                            var sourceMediaType = "_image"
                            if (chooseProduct.adElevator.mediaExtension == 'mp4' || chooseProduct.adLandscape.mediaExtension == 'mp4') {
                                sourceMediaType = '_video'
                            }

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
                            // write
                            fs.writeFile(destPathM, result, 'utf8', function (err) {
                                if (err) {
                                    navigation.createCheck(true, "Manifest file write error", false)
                                    return console.log("write M file error " + err);
                                }
                                else {
                                    navigation.createCheck(false, "Manifest file modified", false)
                                    // rename
                                    let manifestFileFullPath
                                    if (obj.format == 'e') {
                                        manifestFileFullPath = path.join(destFolder, chooseProduct.adElevator.manifestFileName);
                                    }
                                    else {
                                        manifestFileFullPath = path.join(destFolder, chooseProduct.adLandscape.manifestFileName);
                                    }

                                    fs.rename(destPathM, manifestFileFullPath, function (err) {

                                        if (err) {
                                            navigation.createCheck(true, "Manifest file rename error", false)
                                            return console.log("rename M file error " + err);
                                        }
                                        else {
                                            navigation.createCheck(false, "Manifest file renamed", false)
                                        }
                                    })
                                }
                            });
                        }
                    });
                }
            })
        })

        .then(() => {
            // copy Elevator media file 
            const mediaFileE = (chooseProduct.adElevator.mediaFilename);

            // copy file E
            if (mediaFileE != null) {
                console.log('media copy E')
                const sourcePathMediaE = path.join(path.dirname(chooseProduct.adElevator.fullMediaPath.path), mediaFileE)
                const destPathMediaE = path.join(destFolder, mediaFileE)

                fs.copyFile(sourcePathMediaE, destPathMediaE, (err) => {

                    if (err) {
                        navigation.createCheck(true, "MediaE file copy error", false)
                        console.log("copy error MediaE")
                    }
                    else {
                        navigation.createCheck(false, "Media file copy OK", false)
                        // rename filename lower + media part + exension
                        var sourceMediaType = "_image"
                        if (chooseProduct.adElevator.mediaExtension == 'mp4') {
                            sourceMediaType = '_video'
                        }
                        const newMediaFileName = path.join(destFolder,
                            chooseProduct.adElevator.lowerCaseFilename +
                            sourceMediaType +
                            "." +
                            chooseProduct.adElevator.mediaExtension);


                        console.log("to " + sourcePathMediaE)
                        // rename
                        fs.rename(destPathMediaE, newMediaFileName, function (err) {
                            if (err) {
                                navigation.createCheck(true, "MediaE file rename error", false)
                                return console.log("rename MediaE file error " + err);
                            }
                            else {
                                navigation.createCheck(false, "MediaE file rename OK", false)
                            }
                        })
                    }


                })
            }

        })
        .then(() => {
            // copy Landscape media file 
            const mediaFileL = (chooseProduct.adLandscape.mediaFilename);

            if (mediaFileL != null) {
                const sourcePathMediaL = path.join(path.dirname(chooseProduct.adLandscape.fullMediaPath.path), mediaFileL)
                const destPathMediaL = path.join(destFolder, mediaFileL)
                console.log('media copy L')
                // copy file L
                fs.copyFile(sourcePathMediaL, destPathMediaL, (err) => {

                    if (err) {
                        navigation.createCheck(true, "MediaL file copy error", false)
                        console.log("copy error MediaL")
                    }
                    else {
                        navigation.createCheck(false, "MediaL file copy OK", false)
                        // rename filename lower + media part + exension
                        var sourceMediaType = "_l_image"
                        if (chooseProduct.adLandscape.mediaExtension == 'mp4') {
                            sourceMediaType = '_l_video'
                        }
                        const newMediaFileName = path.join(destFolder,
                            chooseProduct.adLandscape.lowerCaseFilename +
                            sourceMediaType +
                            "." +
                            chooseProduct.adLandscape.mediaExtension);


                        console.log("to " + sourcePathMediaL)
                        // rename
                        fs.rename(destPathMediaL, newMediaFileName, function (err) {
                            if (err) {
                                navigation.createCheck(true, "MediaL file rename error", false)
                                return console.log("rename MediaL file error " + err);
                            }
                            else {
                                navigation.createCheck(false, "MediaLfile rename OK", false)
                            }
                        })
                    }

                })
            }
        })
        .then(() => {
            // copy Portrait media file 
            const mediaFileP = (chooseProduct.adPortrait.mediaFilename);

            if (mediaFileP != null) {
                const sourcePathMediaP = path.join(path.dirname(chooseProduct.adPortrait.fullMediaPath.path), mediaFileP)
                const destPathMediaP = path.join(destFolder, mediaFileP)
                console.log('media copy P')

                // copy file P
                fs.copyFile(sourcePathMediaP, destPathMediaP, (err) => {

                    if (err) {
                        navigation.createCheck(true, "MediaP file copy error", false)
                        console.log("copy error MediaP")
                    }
                    else {
                        navigation.createCheck(false, "MediaP file copy OK", false)
                        // rename filename lower + media part + exension
                        var sourceMediaType = "_p_image"
                        if (chooseProduct.adPortrait.mediaExtension == 'mp4') {
                            sourceMediaType = '_p_video'
                        }
                        const newMediaFileName = path.join(destFolder,
                            chooseProduct.adPortrait.lowerCaseFilename +
                            sourceMediaType +
                            "." +
                            chooseProduct.adPortrait.mediaExtension);


                        console.log("to " + sourcePathMediaP)
                        // rename
                        fs.rename(destPathMediaP, newMediaFileName, function (err) {
                            if (err) {
                                navigation.createCheck(true, "MediaP file rename error", false)
                                return console.log("rename MediaP file error " + err);
                            }
                            else {
                                navigation.createCheck(false, "MediaP file rename OK", false)
                            }
                        })
                    }

                })
            }
        })

        // If promise gets rejected 
        .catch(err => {
            navigation.createCheck(true, "error caught" + err, false)
            console.log(`Error occurs,  
        Error code -> ${err.code}, 
        Error No -> ${err.errno}`)
        })
}


/*
function beginFileCopy() {
    const makeDir = util.promisify(fs.mkdir)
    destFolder = path.join(homedir, '/Downloads/', navigation.goodFileNameFromTraffic);
    // Create new directory 
    makeDir(dir = destFolder)
        .then(() => {
            console.log(`Directory '${dir}' is created`)
        })

        // If promise gets rejected 
        .catch(err => {
            console.log(`Error occurs,  
                Error code -> ${err.code}, 
                Error No -> ${err.errno}`);
        })

}
*/



exports.goButton = goButton;