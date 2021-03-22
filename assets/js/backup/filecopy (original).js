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

/*
fs.readdir(sourceDir, (err, files) => {
    files.forEach(file => {
      console.log(file);
    });
  });
 
const makeDir2 = util.promisify(fs.mkdir)
const aaa = path.join('./stockFiles/', 'E_CBINT.html')
const bbb = path.join(homedir, '/Downloads/aaa');
const ccc = path.join(bbb, 'E_CBINT.html');
makeDir2(bbb)
    
 .then(() => {
    fs.copyFile(aaa, ccc, (err) => {
        console.log("error " + err)
    })
})
*/

const goButton = document.getElementById('goButton');

goButton.addEventListener('click', () => {
    beginFileCopy2();
})

// the basic promise


/*
// the promise when resolve works
const promiseResolve = new Promise((resolve, reject) => {
    resolve("i did it");
   
})

// .then will be fired when resolve is true
promiseResolve.then((msg) => {
    console.log('this was a success! ' + msg)
})


// here's what happens when it rejects
const promiseReject = new Promise((resolve, reject) => {
    reject(new Error('error message'))
})

promiseReject.then(msg => {
    console.log('it worked')
}).catch(err => {
    // catch is fired when reject is true
    console.log(err.message)
})

*/


function beginFileCopy2() {

    // clear check area
    navigation.clearChecksArea();


    const obj = chooseProduct.getObjectClicked();
    const makeDir = util.promisify(fs.mkdir)
    //const readDir = util.promisify(fs.readdir) 
    const fn = filename.getGoodFileNameFromTraffic();
    //console.log('fn = ' + fn)
    destFolder = path.join(homedir, '/Downloads/', fn);

    makeDir(destFolder)

        .then(() => {
            navigation.createCheck(false, "folder created", false)
            // HTML file
            const myFileH = (obj.stockFileNamePrefix + '.html');
            const sourcePathH = path.join(sourceDir, myFileH)
            //const sourcePathH = path.join('./', myFileH)
            const destPathH = path.join(destFolder, myFileH)

            fs.copyFile(sourcePathH, destPathH, (err) => {
                if (err) {
                    console.log("copy error H " + err)
                    navigation.createCheck(true, "HTML file copy error", false)
                }
                else {
                    navigation.createCheck(false, "HTML file copied", false)
                    fs.readFile(destPathH, 'utf8', function (err, data) {
                        if (err) {
                            navigation.createCheck(true, "HTML file open error", false)
                            return console.log(err);

                        }
                        else {
                            navigation.createCheck(false, "HTML opened", false)
                            var result = data.replace(/sourceXXX/g, chooseProduct.adElevator.lowerCaseFilename)
                                .replace(/sourceMediaExt/g, chooseProduct.adElevator.mediaExtension);

                            fs.writeFile(destPathH, result, 'utf8', function (err) {
                                if (err) {
                                    return console.log("write H file error " + err);
                                    navigation.createCheck(true, "HTML file write error", false)
                                }
                                else {
                                    navigation.createCheck(false, "HTML file modified", false)
                                    // rename
                                    const htmlFileFullPath = path.join(destFolder, chooseProduct.adElevator.htmlFileName)
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
                            if (chooseProduct.adElevator.mediaExtension == 'mp4') {
                                sourceMediaType = '_video'
                            }

                            var result = data.replace(/sourceXXX/g, chooseProduct.adElevator.lowerCaseFilename)
                                .replace(/sourceMediaExt/g, chooseProduct.adElevator.mediaExtension)
                                .replace(/sourceMediaType/g, sourceMediaType);

                            // write
                            fs.writeFile(destPathM, result, 'utf8', function (err) {
                                if (err) {
                                    navigation.createCheck(true, "Manifest file write error", false)
                                    return console.log("write M file error " + err);
                                }
                                else {
                                    navigation.createCheck(false, "Manifest file modified", false)
                                    // rename
                                    const manifestFileFullPath = path.join(destFolder, chooseProduct.adElevator.manifestFileName);
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
            console.log("then without media file")
            
            // copy media file 
            const myFileMedia = (chooseProduct.adElevator.mediaFilename);
            const sourcePathMedia = path.join(path.dirname(chooseProduct.adElevator.fullMediaPath.path), myFileMedia)
            const destPathMedia = path.join(destFolder, myFileMedia)

            fs.copyFile(sourcePathMedia, destPathMedia, (err) => {
                if (err) {
                    navigation.createCheck(true, "Media file copy error", false)
                    console.log("copy error Media")
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


                    console.log("to " + sourcePathMedia)
                    fs.rename(destPathMedia, newMediaFileName, function (err) {
                        if (err) {
                            navigation.createCheck(true, "Media file rename error", false)
                            return console.log("rename Media file error " + err);
                        }
                        else {
                            navigation.createCheck(false, "Media file rename OK", false)
                        }
                    })
                }

            })

        })

        // what to do on monday
        /*
            currently this only works for elevator, FSTO
            Test all other elevator buttons

            And this only works for elevator because it always looks for the elevator ad instance.  Need to handle lobby
            map out path, filename, extension, ...  You seem to have a lot of references to the same thing.

        */




        // If promise gets rejected 
        .catch(err => {
            navigation.createCheck(true, "error " + err, false)
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